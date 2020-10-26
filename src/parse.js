"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const utils  = require("./utils");

let HDLparam = [];
exports.HDLparam = HDLparam;

class HDLParser {
    constructor() {
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
            /\b(?<type>[:\w]+)\s*/,
            /(?<params>#\s*\(\s*\.[\w\W]*?\))?\s*/,
            /(\b\w+\s*,\s*)*?/,
            ")",
            /\b(?<name>\w+)\s*/,
            /(?:(\(\s*\.[\w\W]*?\)))\s*/,
            /\s*(?<end>;)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_assert = new RegExp([
            /(?<=^\s*(?<name>\w+)\s*:\s*)/,
            /(?<type>assert\b)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.r_Variable = new RegExp([
            /(?<!(input\s|output\s|inout\s))/,
            /(?<type>parameter|localparam|reg|wire|bit|int|char|float|integer)\s+/,
            /(signed\s|unsigned\s)?\s*/,
            /(?<width>\[.+?\]\s)?\s*/,
            /(?<name>\w+)/,
            /(?<depth>\[.+?\]\s)?\s*/,
            /(=\s)?\s*(?<init>.+)?\s*/,
            /(,|\)|;)?/
        ].map(x => x.source).join(''), 'mgi');
        this.r_ports = new RegExp([
            /(?<type>input|output|inout)\s+/,
            /(wire\s|reg\s)?\s*(signed\s|unsigned\s)?\s*/,
            /(?<width>\[.+?\]\s)?\s*/,
            /(?<name>\w+)/,
            /(=([0-9]+'(b|d|x))?[0-9]+)?\s*/,
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
    get_HDLfileparam(document, type, offset = 0, parent) {
        let symbols = [];
        let text = document.getText();
        let IllegalRange = this.getCommentRange(text,offset);
        // Find blocks
        while (1) {
            let match = this.r_decl_block.exec(text);
            if (match == null) {
                break;
            }
            else if ( (match.index == 0 && parent != undefined) ||
                    this.isIllegalRange(match,IllegalRange,offset) ) {
                continue;
            }
            let symbolInfo = this.HDLSymbol.setSymbolInformation(
                match, parent, document, offset);
            symbols.push(symbolInfo);
            IllegalRange = IllegalRange.concat(
                this.get_method(
                    match[0], 
                    document, 
                    match.groups.name, 
                    IllegalRange, 
                    symbols, 
                    (match.index + offset)));
            if (match.groups.type == "module") {
                let HDLfileparam = {
                    "moduleName" : "",
                    "modulePath" : "",
                    "instmodule" : [],
                    "param"      : [],
                    "port"       : {
                        "inout"  : [],
                        "input"  : [],
                        "output" : []
                    }  
                }
                if ( type == "symbol" ) {            
                    HDLfileparam = null            
                }
                this.get_ports(match[0], match.groups.name, HDLfileparam, IllegalRange, (match.index + offset));
                this.get_variable(
                    match[0], 
                    document, 
                    match.groups.name, 
                    HDLfileparam, 
                    IllegalRange, 
                    symbols, 
                    (match.index + offset));
                this.get_instantiation(
                    match[0], 
                    document, 
                    match.groups.name, 
                    HDLfileparam, 
                    IllegalRange, 
                    symbols, 
                    (match.index + offset));
                if (type!="symbol") {
                    HDLfileparam.moduleName = match.groups.name;
                    HDLfileparam.modulePath = document.uri._fsPath.replace(/\\/g,"\/");            
                    HDLparam.push(HDLfileparam);    
                }
            }
        }
        return symbols;
    };
    get_ports(text, parent, HDLfileparam, IllegalRange, offset) {
        while (1) {
            let match = this.r_ports.exec(text);
            if (match == null) {
                break;
            }
            else if ((match.index == 0 && parent != undefined) || 
                    this.isIllegalRange(match,IllegalRange,offset)) {
                continue;
            }
            if ( HDLfileparam != null ) {                
                let portProperty = {
                    "portName"  : "",
                    "portWidth" : ""
                }
                portProperty.portName = match.groups.name;
                portProperty.portWidth = match.groups.width;
                switch (match.groups.type) {
                    case "inout":
                        HDLfileparam.port.inout.push(portProperty);
                        break;
                    case "input":
                        HDLfileparam.port.input.push(portProperty);
                        break;
                    case "output":
                        HDLfileparam.port.output.push(portProperty);
                        break;
                    default: break;
                }
            }
        }
    }
    get_variable(text, document, parent, HDLfileparam, IllegalRange, symbols, offset) {
        if (!text) {
            text = document.getText();
        }
        while (1) {
            let match = this.r_Variable.exec(text);
            if (match == null) {
                break;
            }
            else if ((match.index == 0 && parent != undefined) || 
                    this.isIllegalRange(match,IllegalRange,offset)) {
                continue;
            }
            if ( match.groups.type == "parameter" && HDLfileparam != null ) {                
                let parmProperty = {
                    "paramName"  : "",
                    "paramWidth" : "",
                    "paramInit"  : ""
                }
                parmProperty.paramName  = match.groups.name;
                parmProperty.paramWidth = match.groups.width;
                parmProperty.paramInit  = match.groups.init;
                HDLfileparam.param.push(parmProperty);
            }
            let symbolInfo = this.HDLSymbol.setSymbolInformation(
                match, parent, document, offset);
            symbols.push(symbolInfo);
        }
    }
    get_method(text, document, parent, IllegalRange, symbols, offset) {
        let methodRange = [];
        if (!text) {
            text = document.getText();
        }
        while (1) {
            let match = this.r_decl_method.exec(text);
            if (match == null) {
                break;
            }
            else if ((match.index == 0 && parent == undefined) || 
                    this.isIllegalRange(match,IllegalRange,offset)) {
                continue;
            }
            let Range = {
                "start"   : 0,
                "end"     : 0
            }
            Range.start = match.index + offset;
            Range.end   = match.index + match[0].length + offset;
            methodRange.push(Range);
            let symbolInfo = this.HDLSymbol.setSymbolInformation(
                match, parent, document, offset);
            symbols.push(symbolInfo);
            let portOffset = match.index + offset;
            let methodName = match.groups.name;
            while (1) {
                match = this.r_ports.exec(match[0]);
                if (match == null) {
                    break;
                }
                else if (this.isIllegalRange(match,IllegalRange,portOffset)) {
                    continue;
                }
                symbolInfo = this.HDLSymbol.setSymbolInformation(
                    match, methodName, document, portOffset);
                symbols.push(symbolInfo);
            }
        }
        return methodRange;
    }
    get_instantiation(text, document, parent, HDLfileparam, IllegalRange, symbols, offset) {
        if (!text) {
            text = document.getText();
        }
        while (1) {
            let match = this.r_instantiation.exec(text);
            if (match == null) {
                break;
            }
            else if ((match.index == 0 && parent != undefined) || 
                    this.isIllegalRange(match,IllegalRange,offset)) {
                continue;
            }
            if ( HDLfileparam != null ) {                
                let instProperty = {
                    "instModule"  : "",
                    "instModPath" : "",
                    "instName"    : ""
                }
                instProperty.instModule = match.groups.type;
                instProperty.instName   = match.groups.name;
                HDLfileparam.instmodule.push(instProperty);
            }
            let symbolInfo = this.HDLSymbol.setSymbolInformation(
                match, parent, document, offset);
            symbols.push(symbolInfo);
        }
    }
    get_instModulePath() {
        HDLparam.forEach(unitMoudule => {
            unitMoudule.instmodule.forEach(unitInstanceModule => {
                HDLparam.forEach(element => {
                    if (element.moduleName == unitInstanceModule.instModule) {
                        unitInstanceModule.instModPath = element.modulePath;
                    }
                }); 
            });
        });
    }
    getWaveImagePath(text) {
        let waveImagePath = text.match(/\$dumpfile\s+\(\s*\"(.+){1}\"\s*\);/gi);
        waveImagePath = RegExp.$1;
        return waveImagePath;
    }
    getCommentRange(text, offset) {
        let commentRange = [];
        let regexes = this.comment;
        for (let i = 0; i < regexes.length; i++) {
            while (1) {
                let match = regexes[i].exec(text);
                if (match == null) {
                    break;
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
    isIllegalRange(match, range, offset) {
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
}
exports.HDLParser = HDLParser;
