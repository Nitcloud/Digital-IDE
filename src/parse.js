"use strict";

const utils  = require("./utils");

class HDLParser {
    constructor() {
        // comment
        this.l_comment = new RegExp([
            /\/\/.*/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.b_comment = new RegExp([
            /\/\*[\s\S]*?\*\//
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');

        /* vlog parse */
        // block
        this.vlog_block = new RegExp([
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
        this.vlog_class = new RegExp([
            "(?<=^\\s*(virtual\\s+)?",
            /(?<type>class)\s+/,
            ")",
            /(?<name>\w+)/,
            /(\s+(extends|implements)\s+[\w\W]+?|\s*#\s*\([\w\W]+?\))*?/,
            /\s*;/,
            /(?<body>[\w\W]*?)/,
            /(?<end>endclass)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.vlog_method = new RegExp([
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
        this.vlog_label = new RegExp([
            /\b(?<type>begin)\b/,
            /\s*:\s*/,
            /(?<name>\w+)\s*(?:\/\/.*)?$/,
            // Matches up to 5 nested begin/ends
            // This is the only way to do it with RegExp without balancing groups
            /(?<body>(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b(?:\bbegin\b[\w\W]+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?\bend\b|[\w\W])+?)/,
            /\bend\b(\s*:\s*\1)?/
        ].map(x => x.source).join(''), 'mg');
        
        // element
        this.vlog_assert = new RegExp([
            /(?<=^\s*(?<name>\w+)\s*:\s*)/,
            /(?<type>assert\b)/
        ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
        this.vlog_instantiation = new RegExp([
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
        this.vlog_variable = new RegExp([
            /(?<!(input\s|output\s|inout\s))/,
            /(?<type>parameter|localparam|reg|wire|bit|int|char|float|integer)\s+/,
            /(signed\s|unsigned\s)?\s*/,
            /(?<width>\[.+?\]\s)?\s*/,
            /(?<name>\w+)/,
            /(?<depth>\[.+?\]\s)?\s*/,
            /(=\s)?\s*(?<init>.+)?\s*/,
            /(,|\)|;)?/
        ].map(x => x.source).join(''), 'mgi');
        this.vlog_ports = new RegExp([
            /(?<type>input|output|inout)\s+/,
            /(wire\s|reg\s)?\s*(signed\s|unsigned\s)?\s*/,
            /(?<width>\[.+?\]\s)?\s*/,
            /(?<name>\w+)/,
            /(=([0-9]+'(b|d|x))?[0-9]+)?\s*/,
            /(,|\)|;)?/
        ].map(x => x.source).join(''), 'mgi');
        this.vlog_typedef = new RegExp([
            /(?<=^\s*)/,
            /(?<type>typedef)\s+/,
            /(?<body>[^;]*)/,
            /(?<name>\b\w+)/,
            /\s*(\[[^;]*?\])*?/,
            /\s*(?<end>;)/
        ].map(x => x.source).join(''), 'mg');
        this.vlog_define = new RegExp([
            /(?<=^\s*)/,
            /`(?<type>define)\s+/,
            /(?<name>\w+)\b/,
            /((?<ports>\([^\n]*\))|\s*?)/,
            /(?<body>([^\n]*\\\n)*([^\n]*))/,
            /(?<!\\)(?=\n)/
        ].map(x => x.source).join(''), 'mg');

        /* vhdl parse */

        // others
        this.comment = [
            this.l_comment,
            this.b_comment
        ];
        this.vlog_decl_block = [
            this.vlog_class,
            this.vlog_method,
            this.vlog_label
        ];
        this.vlog_decl_element = [
            this.vlog_ports,
            this.vlog_variable,
            this.vlog_instantiation,
            this.vlog_assert,
            this.vlog_typedef,
            this.vlog_define
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
    get_HDLfileparam(document, type, offset = 0, parent, HDLparam) {
        // this.removeCurrentFileParam(document)
        let symbols = [];
        let text = document.getText();
        let IllegalRange = this.getCommentRange(text,offset);
        // Find blocks
        while (1) {
            let match = this.vlog_block.exec(text);
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
                this.get_block(
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
                    IllegalRange, 
                    symbols, 
                    HDLfileparam, 
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
    get_block(text, document, parent, IllegalRange, symbols, offset) {
        let blockRange = [];
        if (!text) {
            text = document.getText();
        }
        for (let index = 0; index < this.vlog_decl_block.length; index++) {
            const unitBlock = this.vlog_decl_block[index];
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
                this.get_element(match[0], document, match.groups.name, IllegalRange, symbols, null, Range.start);
            }
        }
        return blockRange;
    }
    /**
     * Matches a single element in a file
     * 
     * @param  text         匹配的文本
     * @param  document     匹配文本所在的文档属性
     * @param  parent       根属性
     * @param  symbols      符号数组，存放符号
     * @param  HDLfileparam HDL文件属性
     * @param  IllegalRange 非法区域，该区域内不匹配
     * @param  offset       匹配地址偏移(即匹配的文本在文件中的地址位置)
     */
    get_element(text, document, parent, IllegalRange, symbols, HDLfileparam, offset) {
        if (!text) {
            text = document.getText();
        }
        for (let index = 0; index < this.vlog_decl_element.length; index++) {
            const unitElement = this.vlog_decl_element[index];
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
                        case this.vlog_ports:
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
                        case this.vlog_variable:
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
                        case this.vlog_instantiation:
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
    get_instModulePath(HDLparam) {
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
    removeCurrentFileParam(document, HDLparam) {
        let currentFilePath = document.uri._fsPath.replace(/\\/g,"\/");
        let newHDLparam = [];
        HDLparam.forEach(element => {
            if (element.modulePath != currentFilePath) {
                newHDLparam.push(element);
            }
        });
        return newHDLparam;
    }
}
exports.HDLParser = HDLParser;
