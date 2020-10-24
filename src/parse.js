"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const vscode = require("vscode");
const utils  = require("./utils");

let HDLparam     = {};
exports.HDLparam = HDLparam;

class HDLParser {
    constructor() {
        this.illegalMatches = /(?!return|begin|end|else|join|fork|for|if|virtual|static|automatic|generate|assign|initial|assert|disable)/;
        this.l_comment = new RegExp([
            /\/\/.*/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.b_comment = new RegExp([
            /\/\*[\s\S]*?\*\//
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_decl_block = new RegExp([
            "(?<=^\\s*",
            /(?<type>module|program|interface|package|primitive|config|property)\s+/,
            /(?:automatic\s+)?/,
            ")",
            /(?<name>\w+)/,
            /(?<params>\s*#\s*\([\w\W]*?\))?/,
            /(?<ports>\s*\([\W\w]*?\))?/,
            /\s*;/,
            /(?<body>[\W\w]*?)/,
            /(?<end>end\1)/,
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_decl_class = new RegExp([
            "(?<=^\\s*(virtual\\s+)?",
            /(?<type>class)\s+/,
            ")",
            /(?<name>\w+)/,
            /(\s+(extends|implements)\s+[\w\W]+?|\s*#\s*\([\w\W]+?\))*?/,
            /\s*;/,
            /(?<body>[\w\W]*?)/,
            /(?<end>endclass)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_decl_method = new RegExp([
            "(?<=^\\s*(virtual|local|extern|pure\\s+virtual)?\\s*",
            /(?<type>(function|task))\s+/,
            /((?<return>\[.+?\])\s+)?/,
            ")",
            /\b(?<name>[\w\.]+)\b\s*/,
            /(?<ports>\([\W\w]*?\))?/,
            /\s*;/,
            /(?<body>[\w\W]*?)/,
            /(?<end>end(function|task))/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_instantiation = new RegExp([
            "(?<=^\\s*",
            /(?:(?<modifier>virtual|static|automatic|rand|randc|pure virtual)\s+)?/,
            // Symbol type, ignore packed array
            this.illegalMatches,
            /\b(?<type>[:\w]+(?:\s*\[[^\]]*?\])*?)\s*/,
            /(?<params>#\s*\([\w\W]*?\))?\s*/,
            // Allow multiple declaration
            /(\b\w+\s*,\s*)*?/,
            ")",
            this.illegalMatches,
            // Symbol name
            /\b(?<name>\w+)\s*/,
            // Unpacked array | Ports
            /(?:(\[[^\]]*?\]\s*)*?|(\([\w\W]*?\))?)\s*/,
            /\s*(?<end>;|,|=)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_assert = new RegExp([
            /(?<=^\s*(?<name>\w+)\s*:\s*)/,
            /(?<type>assert\b)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_ports = new RegExp([
            /(?<type>input|output|inout)\s+/,
            /(wire|reg\s+)?(signed|unsigned\s+)?/,
            /((?<range>\[.+?\])\s+)?/,
            /(?<name>\w+)/,
            /(=([0-9]+'(b|d|x))?[0-9]+)?/,
            /(,|\)|;)?/
        ].map(x => x.source).join(''), 'mgi');
        this.r_label = new RegExp([
            /\b(?<type>begin)\b/,
            /\s*:\s*/,
            /(?<name>\w+)\s*(?:\/\/.*)?$/,
            // Matches up to 5 nested begin/ends
            // This is the only way to do it with RegExp without balancing groups
            /(?<body>(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b[\w\W]+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?)/,
            /\bend\b(\s*:\s*\1)?/
        ].map(x => x.source).join(''), 'mg');
        this.r_typedef = new RegExp([
            /(?<=^\s*)/,
            /(?<type>typedef)\s+/,
            /(?<body>[^;]*)/,
            /(?<name>\b\w+)/,
            /\s*(\[[^;]*?\])*?/,
            /\s*(?<end>;)/
        ].map(x => x.source).join(''), 'mg');
        this.r_define = new RegExp([
            /(?<=^\s*)/,
            /`(?<type>define)\s+/,
            /(?<name>\w+)\b/,
            /((?<ports>\([^\n]*\))|\s*?)/,
            /(?<body>([^\n]*\\\n)*([^\n]*))/,
            /(?<!\\)(?=\n)/
        ].map(x => x.source).join(''), 'mg');
        this.parse = [
            this.r_decl_block,
            this.r_decl_class,
            this.r_decl_method,
            this.r_typedef,
            this.r_define,
            this.r_label,
            this.r_instantiation,
            this.r_assert,
            this.r_ports
        ];
        this.declaration_parse = [
            this.r_decl_block,
            this.r_decl_class,
            this.r_decl_method,
            this.r_typedef,
            this.r_define
        ];
        this.comment = [
            this.l_comment,
            this.b_comment
        ];
        this.HDLSymbol = new utils.HDLSymbol();
    }
    /**
        Matches the regex pattern with the document's text. If a match is found, it creates a `HDLSymbol` object.
        Add the objects to an empty list and return it.

        @param document The document in which the command was invoked.
        @param precision How much the parser will look for, must be "full", "declaration" or "fast"
        @param maxDepth How many deep it will traverse the hierarchy
        @return A list of `HDLSymbol` objects or a thenable that resolves to such. The lack of a result can be
        signaled by returning `undefined`, `null`, or an empty list.
    */
    get_all_recursive(document, precision = "full", maxDepth = -1, text, offset = 0, parent, depth = 0) {
        let symbols = [];
        let sub_blocks = [];
        let HDLfileparam = {
            "moduleName" : "",
            "modulePath" : ""
        }
        if (!text) {
            text = document.getText();
        }
        let commentRange = this.getCommentRange(text,offset,parent);
        let regexes = this.parse;
        // Find blocks
        for (let i = 0; i < regexes.length; i++) {
            while (1) {
                let match = regexes[i].exec(text);
                if (match == null) {
                    break;
                }
                else if (match.index == 0 && parent != undefined) {
                    continue;
                }
                else if (sub_blocks.some((b) => { 
                    return (match.index >= b.index && match.index < b.index + b[0].length); 
                })) {
                    continue;
                }
                if (match.groups.type == "module") {
                    HDLfileparam.moduleName = match.groups.name;
                    HDLfileparam.modulePath = document.uri._fsPath.replace(/\\/g,"\/");
                    HDLparam[`${match.groups.name}`] = HDLfileparam;
                }
                if (regexes[i] == this.r_decl_method) {
                    let method = match;
                }
                if (regexes[i] == this.r_instantiation) {
                    let instantiation = match;
                }
                if (!this.isComment(match,commentRange,offset)) {
                    let symbolInfo = this.HDLSymbol.setSymbolInformation(
                        match, parent, document, offset);
                    symbols.push(symbolInfo);
                    if (match.groups.body) {
                        sub_blocks.push(match);
                    }
                }
            }
        }
        // Recursively expand the sub-blocks
        if (depth != maxDepth) {
            for (const i in sub_blocks) {
                const match = sub_blocks[i];
                let sub = this.get_all_recursive(document, 
                    precision, maxDepth, 
                    match.groups.body, 
                    match.index + offset + match[0].indexOf(match.groups.body), 
                    match.groups.name, 
                    depth + 1);
                symbols = symbols.concat(sub);
            }
        }
        return symbols;
    };
    get_ports(document, text, offset, parent) {
        return new Promise((resolve) => {
            let symbols = [];
            while (1) {
                let match_ports = this.r_ports.exec(text);
                if (match_ports == null) {
                    break;
                }
                let symbolInfo = this.HDLSymbol.setSymbolInformation(
                    match, parent, document, offset);
                symbols.push(symbolInfo);
            }
            resolve(symbols);
        });
    }
    getCommentRange(text, offset, parent) {
        let sub_blocks   = [];
        let commentRange = [];
        let regexes = this.comment;
        for (let i = 0; i < regexes.length; i++) {
            while (1) {
                let match = regexes[i].exec(text);
                if (match == null) {
                    break;
                }
                else if (match.index == 0 && parent != undefined) {
                    continue;
                }
                else if (sub_blocks.some((b) => { 
                    return (match.index >= b.index && match.index < b.index + b[0].length); 
                })) {
                    continue;
                }
                let Range = {
                    "start"   : 0,
                    "end"     : 0
                }
                Range.start = match.index + offset;
                Range.end = match.index + match[0].length + offset;
                commentRange.push(Range);
            }
        }
        return commentRange;
    }
    isComment(match, range, offset) {
        let isComment;
        for (let index = 0; index < range.length; index++) {
            const element = range[index];
            if  ( (match.index + offset <= element.end) && 
                  (match.index + offset >= element.start)) {
                isComment = true;
                break;
            } else {
                isComment = false;
            }
        }
        return isComment;
    }
    translate_precision(precision) {
        switch (precision) {
            case "full":
                return this.full_parse;
            case "declaration":
                return this.declaration_parse;
            case "fast":
                return this.fast_parse;
            default:
                throw "Illegal precision";
        }
    }
}
exports.HDLParser = HDLParser;
