"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const utils  = require("./utils");

/*
HDLfileparam = 
{
    "moduleName" : "",
    "modulePath" : "",
    "instmodule" : [
        {
            "instModule"  : "",
            "instModPath" : "",
            "instName"    : ""
        }
    ],
    "param"      : [
        {
            "paramName"  : "",
            "paramWidth" : "",
            "paramInit"  : ""
        }
    ],
    "port"       : {
        "inout"  : [
            {
                "portName"  : "",
                "portWidth" : ""
            }
        ],
        "input"  : [
            {
                "portName"  : "",
                "portWidth" : ""
            }
        ],
        "output" : [
            {
                "portName"  : "",
                "portWidth" : ""
            }
        ]
    }  
}
*/
let HDLparam = [];
exports.HDLparam = HDLparam;

class HDLParser {
    constructor() {
        // comment
        this.l_comment = new RegExp([
            /\/\/.*/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.b_comment = new RegExp([
            /\/\*[\s\S]*?\*\//
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');

        // block
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
        this.r_label = new RegExp([
            /\b(?<type>begin)\b/,
            /\s*:\s*/,
            /(?<name>\w+)\s*(?:\/\/.*)?$/,
            // Matches up to 5 nested begin/ends
            // This is the only way to do it with RegExp without balancing groups
            /(?<body>(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b[\w\W]+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?)/,
            /\bend\b(\s*:\s*\1)?/
        ].map(x => x.source).join(''), 'mg');
        
        // element
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

        // others
        this.comment = [
            this.l_comment,
            this.b_comment
        ];
        this.block = [
            this.r_decl_block,
            this.r_decl_class,
            this.r_decl_method,
            this.r_label
        ];
        this.element = [
            this.r_ports,
            this.r_Variable,
            this.r_instantiation,
            this.r_assert,
            this.r_typedef,
            this.r_define
        ]
        this.HDLSymbol = new utils.HDLSymbol();
    }
    /**
        Matches the regex pattern with the document's text. If a match is found, it creates a `HDLSymbol` object.
        Add the objects to an empty list and return it.

        @param document The document in which the command was invoked.
        @param type     How much the parser will look for, must be "full", "declaration" or "fast"
        @param offset   How many deep it will traverse the hierarchy
        @param parent   How many deep it will traverse the hierarchy
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
                this.get_element(
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
    get_block(text, document, parent, IllegalRange, symbols, offset) {
        let blockRange = [];
        if (!text) {
            text = document.getText();
        }
        for (let index = 0; index < this.block.length; index++) {
            const unitBlock = this.block[index];
            while (1) {
                let match = unitBlock.exec(text);
                if (match == null) {
                    break;
                }
                else if ((match.index == 0 && parent == undefined) || 
                        this.isIllegalRange(match,IllegalRange,offset)) {
                    continue;
                }
                let symbolInfo = this.HDLSymbol.setSymbolInformation(
                    match, parent, document, offset);
                symbols.push(symbolInfo);

                let Range = {
                    "start"   : 0,
                    "end"     : 0
                }
                Range.start = match.index + offset;
                Range.end   = match.index + match[0].length + offset;
                blockRange.push(Range);
                get_element(text, document, match.groups.name, null, IllegalRange, symbols, Range.start);
            }
        }
        return blockRange;
    }
    get_element(text, document, parent, HDLfileparam, IllegalRange, symbols, offset) {
        if (!text) {
            text = document.getText();
        }
        for (let index = 0; index < this.element.length; index++) {
            const unitElement = this.element[index];
            while (1) {
                // 匹配每个元素
                let match = unitElement.exec(text);

                // 判断元素是否有效--是否为空 或者 是否在非法范围内
                if (match == null) {
                    break;      // 即跳出此类型的匹配，执行下一类型
                }
                else if ((match.index == 0 && parent != undefined) || 
                        this.isIllegalRange(match,IllegalRange,offset)) {
                    continue;   // 跳过匹配组中的一个
                }

                // 注册元素标志
                let symbolInfo = this.HDLSymbol.setSymbolInformation(
                    match, parent, document, offset);
                symbols.push(symbolInfo);
                
                // 获取端口参数信息（用于仿真，生成结构，生成仿真文件）
                if ( HDLfileparam != null ) {
                    switch (unitElement) {
                        case this.r_ports:
                            let portProperty = {
                                "portName"  : "",
                                "portWidth" : ""
                            };
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
                            break;
                        case this.r_Variable:
                            if ( match.groups.type == "parameter" ) {
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
                            break;
                        case this.r_instantiation:
                            let instProperty = {
                                "instModule"  : "",
                                "instModPath" : "",
                                "instName"    : ""
                            };
                            instProperty.instModule = match.groups.type;
                            instProperty.instName   = match.groups.name;
                            HDLfileparam.instmodule.push(instProperty);
                            break;
                        default: break;
                    }
                }
            }
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
    removeCurrentFileParam(document) {
        let currentFilePath = document.uri._fsPath.replace(/\\/g,"\/");
        let newHDLparam = [];
        HDLparam.forEach(element => {
            if (element.modulePath != currentFilePath) {
                newHDLparam.push(element);
            }
        });
        HDLparam = newHDLparam;
    }
}
exports.HDLParser = HDLParser;
