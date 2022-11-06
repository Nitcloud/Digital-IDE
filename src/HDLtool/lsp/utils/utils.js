"use strict";

const vscode = require("vscode");
const parser = require("HDLparser");
const filesys = require("HDLfilesys");

/* Symbol */
var symbol = {

    symbols : [],

    curdoc : null,

    /**
     * @state finish - untest
     * @descriptionEn set a symbol information object.
     * @param  symbol { name & type & parent & startIndex & lastIndex }
     * @return The object of the SymbolInformation.
     */
    setSymbolInfo : function (symbol){
        let location = new vscode.Location(
            this.curdoc.uri, 
            new vscode.Range(symbol.start, symbol.end)
        );

        let symbolInfo = vscode.SymbolInformation(
            symbol.name,
            this.getSymbolKind(symbol.type),
            symbol.parent,
            location
        );

        // 增加冗余部分用于定义识别
        symbolInfo.item = symbol;
        symbolInfo.languageId = this.curdoc.languageId;
        this.symbols.push(symbolInfo);
    },

    /**
     * @state finish - untest
     * @descriptionEn get a symbol Kind.
     * @param name The name of the symbol.
     * @return     The SymbolKind of the symbol's name.
     */
    getSymbolKind : function (name) {
        if (name.indexOf('[') != -1) {
            return vscode.SymbolKind.Array;
        }
        switch (name) {
            case 'module':      return vscode.SymbolKind.Module;
            case 'program':     return vscode.SymbolKind.Module;
            case 'package':     return vscode.SymbolKind.Package;
            case 'import':      return vscode.SymbolKind.Package;
            case 'always':      return vscode.SymbolKind.Operator;
            case 'processe':    return vscode.SymbolKind.Operator;
    
            case 'task':        return vscode.SymbolKind.Method;
            case 'function':    return vscode.SymbolKind.Function;
    
            case 'assert':      return vscode.SymbolKind.Boolean;
            case 'event':       return vscode.SymbolKind.Event;
            case 'instance':    return vscode.SymbolKind.Event;
    
            case 'time':        return vscode.SymbolKind.TypeParameter;
            case 'define':      return vscode.SymbolKind.TypeParameter;
            case 'typedef':     return vscode.SymbolKind.TypeParameter;
            case 'generate':    return vscode.SymbolKind.Operator;
            case 'enum':        return vscode.SymbolKind.Enum;
            case 'modport':     return vscode.SymbolKind.Boolean;
            case 'property':    return vscode.SymbolKind.Property;

            // port 
            case 'interface':   return vscode.SymbolKind.Interface;
            case 'buffer':      return vscode.SymbolKind.Interface;
            case 'output':      return vscode.SymbolKind.Interface;
            case 'input':       return vscode.SymbolKind.Interface;
            case 'inout':       return vscode.SymbolKind.Interface;

            // synth param    
            case 'localparam':  return vscode.SymbolKind.Constant;
            case 'parameter':   return vscode.SymbolKind.Constant;
            case 'integer':     return vscode.SymbolKind.Number;
            case 'char':        return vscode.SymbolKind.Number;
            case 'float':       return vscode.SymbolKind.Number;
            case 'int':         return vscode.SymbolKind.Number;

            // unsynth param
            case 'string':      return vscode.SymbolKind.String;
            case 'struct':      return vscode.SymbolKind.Struct;
            case 'class':       return vscode.SymbolKind.Class;
            
            case 'logic':       return vscode.SymbolKind.Constant;
            case 'wire':        return vscode.SymbolKind.Constant;
            case 'reg':         return vscode.SymbolKind.Constant;
            case 'net':         return vscode.SymbolKind.Constant;
            case 'bit':         return vscode.SymbolKind.Boolean;
            default:            return vscode.SymbolKind.Field;
        }
        /* Unused/Free SymbolKind icons
            return SymbolKind.Number;
            return SymbolKind.Enum;
            return SymbolKind.EnumMember;
            return SymbolKind.Operator;
            return SymbolKind.Array;
        */
    },
}

/**
 * @descriptionCn : 用于定义标识的识别
 * @process : 初始化 -> 合法性 -> 文本内查找(port, constants, methods) -> 跨文件查找(instance, define)
 */
var utils = {
    HDLparam : null,

    nonblank : /\S+/g,

    b_comment : /\/\*[\s\S]*?\*\//g,

    b_comment_begin : /(?<!(\s*\w+\s*))(\/\/.*)/g,

    b_comment_end : /(\*\/)/g,

    /**
     * @state finish-untest
     * @descriptionCn 获取所有标识符的全部信息
     * @param {Object} document 当前文本对象
     * @returns {Array} 所有的标识的全部信息symbol.symbols
     */
    getSymbols : function (document) {
        symbol.curdoc  = document;
        symbol.symbols = [];
        let path = document.uri.fsPath.replace(/\\/g, "\/");
        let option = {
            text : document.getText() + '\n',
            path : path,
            isFast : false,
            isPreProcess : false, // 冗余检测全匹配
            symbol : symbol,
        }
        
        let vlogParser = new parser.vlogParser();
        let vhdlParser = new parser.vhdlParser();
        switch (document.languageId) {
            case "verilog":
            case "systemverilog":
                vlogParser.getFileParam(option); // 获取所有的标识的全部信息
            break;
            case "vhdl":
                vhdlParser.getFileParam(option); // 获取所有的标识的全部信息
            break;
            default: return[];
        }
        return symbol.symbols;
    },

    /**
     * @state finish-untest
     * @descriptionCn 获取标识符的定义信息
     * @param {Object} document 当前文本对象
     * @param {Object} position 标识符的位置范围
     * @returns {Array} 标识符被定义的结果results = { uri : uri, range : range, }
     */
    getSymbolDefine : function (document, position) {
        // 初始化
        let wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return [];
        }

        let results = [];
        let word = document.getText(wordRange);  // 获取到标识字符
        let text = document.getText(); 
        let path = document.uri.fsPath.replace(/\\/g, "\/");

        let parse = null;
        switch (document.languageId) {
            case "verilog":
            case "systemverilog":
                parse = new parser.vlogParser();
                let lineWord = document.lineAt(position).text;
                let incs = parse.get_include(lineWord);
                for (let i = 0; i < incs.length; i++) {
                    const inc = incs[i];
                    if (!inc.includes(word)) {
                        continue;
                    }
                    let incPath = filesys.paths.rel2abs(path, inc);
                    let result = {
                        type : 'path',
                        uri : vscode.Uri.file(incPath),
                        range : new vscode.Range(
                            {"line":0, "character":0}, 
                            {"line":0, "character":0}
                        ),
                    }
                    results.push(result); 
                    return results;
                }
            break;
            case "vhdl":
                parse = new parser.vhdlParser();
            break;
            default: return[];
        }

        let guide = '';
        let guideIndex = document.offsetAt(wordRange.start);
        if (guideIndex != 0) {
            guide = text[guideIndex - 1];
        }

        // 合法性
        // 获取注释所对应的范围，并检测标识字符是否在该范围内
        // let illegalRange = parse.get_comment_index(text);
        // for (let i = 0; i < illegalRange.length; i++) {
        //     const index = illegalRange[i];
        //     if (this.ensureInclude(index, wordRange)) {
        //         return [];
        //     }
        // }

        // 已测试在大纲的标识显示是实时的，可以直接拿来使用, 但换文件却不能换回来
        let option = {
            text : text + '\n',
            path : path,
            isFast : false,
            isPreProcess : false, // 冗余检测全匹配
            symbol : symbol,
        }
        symbol.symbols = [];
        symbol.curdoc  = document;
        parse.getFileParam(option);
        switch (guide) {
            // 1. instance's port/param : 哪个instance -> 对应的module -> 定义的位置
            case '.': 
                let item = this.getItemInfo(wordRange, symbol.symbols, "instance");
                if (item) {
                    let instProperty = this.getInstDefine(wordRange, item);
                    for (let index = 0; index < instProperty.length; index++) {
                        const element = instProperty[index];
                        if (element.name != word) {
                            continue;
                        }
                        
                        let result = {
                            uri : vscode.Uri.file(element.path),
                            range : new vscode.Range(element.start, element.end),
                        }
                        results.push(result);   
                    }
                }
            break;

            case '`': 
                if (document.languageId == 'vhdl') {
                    break;
                }
                let defines = new Map();
                parse.get_define(text, path, defines);
                let define = defines.get(word);
                if (!define) {
                    break;
                }
                let result = {
                    uri : vscode.Uri.file(define.path),
                    range : new vscode.Range(define.start, define.end),
                }
                results.push(result);  
            break;
        
            // 其他标识
            default:
                this.getWordInfo(word, wordRange, symbol.symbols, results);
            break;
        }

        return results;
    },

    /**
     * @state finish-untest
     * @descriptionCn 根据例化的模块找到其被定义的地方，并根据标识符所在的位置找到被定义内容(port | param)
     * @param {*} wordRange 标识符所在的位置 range 表示形式
     * @param {*} item 被例化的模块的详细属性
     * @returns 返回标识符所在的位置找到被定义内容(port | param)
     */
    getInstDefine : function (wordRange, item){
        let modules = parser.utils.findModuleFromName(this.HDLparam, item.instModule);
        let module = modules[0];

        // 确认所需定位的标识是否为例化的端口
        let results = null;
        if (item.instports) {
            if (this.ensureInclude(item.instports, wordRange)) {
                results = module.ports;
            }
        }
        
        // 确认所需定位的标识是否为例化的参数
        if (item.instparams) {
            if (this.ensureInclude(item.instparams, wordRange)) {
                results = module.params;
            }
        }

        if (!results) {
            return [];
        }

        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            element.path  = module.modulePath;
        }
        return results;
    },

    /**
     * @state finish-test
     * @descriptionCn 获取标识符被定义的信息(除特殊情况外)
     * @param {String} word      标识符字符
     * @param {Object} wordRange 标识符所在的范围 range 表示方式
     * @param {Array}  symbols   该文件下的所有的标识符信息组
     * @param {Array}  results   标识符被定义的结果results = { uri : uri, range : range, }
     */
    getWordInfo : function (word, wordRange, symbols, results) {
        // 优先检测是否是指定例化模块名module
        let item = this.getItemInfo(wordRange, symbols, "instance");
        if (item.instModule == word) {
            for (let index = 0; index < this.HDLparam.length; index++) {
                const element = this.HDLparam[index];
                if (element.moduleName != word) {
                    continue;
                }
    
                // 如果是则直接转换地址范围并导出
                let result = {
                    uri : vscode.Uri.file(element.modulePath),
                    range : new vscode.Range(element.start, element.end),
                }
                results.push(result);        
            }
            return null;
        }

        for (let index = 0; index < symbols.length; index++) {
            // 被定义的标识符
            const symbolElement = symbols[index];

            // 判断该word是否被定义过
            if (symbolElement.name != word) {
                continue;
            }

            if (symbolElement.languageId != 'vhdl') {
                let itemInfo = this.getItemInfo(wordRange, symbols, "module");
                // 判断这个定义是否在同一个module下
                if (!this.ensureInclude(itemInfo, symbolElement.item)) {
                    continue;
                }
            }
            
            let result = {
                uri : symbolElement.location.uri,
                range : symbolElement.location.range,
            }
            results.push(result);
        }
        return null;
    },

    /**
     * @state finish-test
     * @descriptionCn 确认标识符是否在指定项的范围内，e.g.标识符是否在instance的模块内
     * @param {Object} wordRange 标识符所在的范围 range 表示方式
     * @param {Array}  symbols   该文件下的所有的标识符信息组
     * @param {String} itemName  指定项的名字(item.type)
     * @returns {Object} 标识符所在指定项的全部属性信息
     */
    getItemInfo : function (wordRange, symbols, itemName) {
        for (let index = 0; index < symbols.length; index++) {
            const symbolElement = symbols[index];
            if (symbolElement.item.type != itemName) {
                continue;
            }

            if (this.ensureInclude(symbolElement.item, wordRange)) {
                return symbolElement.item;
            }
        }
        return {};
    },

    /**
     * @state finish-untest
     * @descriptionCn  根据定义点获取对应的注释提示
     * @param {Object} define  { uri : uri, range : range, }
     * @returns {Object} 定义点所对应的注释提示内容
     */
    getSymbolComment : function (define) {
        let path = define.uri.fsPath.replace(/\\/g, "\/");
        let text = filesys.files.readFile(path);
        let line = define.range.start.line+1; 
        let lines = text.split('\n');
        let index = this.range_to_index(text, define.range);

        let content = '';
        let comment = '';
        let comments = [];
        let is_b_comment = false;
        let l_comment_symbol = null;
        let l_comment_regExp = null;
        let languageId = parser.utils.getLanguageId(path);

        if (define.type) {
            return new vscode.Hover( { 
                language: languageId, 
                value: path,
            } );
        }

        switch (languageId) {
            case "verilog":
            case "systemverilog":
                l_comment_symbol = '//';
                l_comment_regExp = /\/\/.*/g;
            break;
            case "vhdl":
                l_comment_symbol = '--';
                l_comment_regExp = /--.*/g;
            break;
            default: return[];
        }

        comments.push(text.slice(index.startIndex, index.lastIndex));
        while (line) {
            line--;
            content = lines[line];
            // 首先判断该行是否是空白
            let isblank = content.match(this.nonblank);
            if (!isblank) {
                continue; 
            }

            if (is_b_comment) {
                let b_comment_begin_index = content.indexOf('/*');
                if (b_comment_begin_index == -1) {
                    comments.push(content + '\n');
                    continue;
                }
                comments.push(content.slice(b_comment_begin_index, content.length) + '\n');
                is_b_comment = false;
                content = content.slice(0, b_comment_begin_index);
                if (content.match(this.nonblank)) {
                    break;
                }
                continue;
            }

            // 判断该行是否存在行注释
            let l_comment_index = content.indexOf(l_comment_symbol);
            if (l_comment_index >= 0) {
                let before_l_comment = content.slice(0, l_comment_index);
                before_l_comment = this.del_comments(before_l_comment, this.b_comment);
                if (before_l_comment.match(this.nonblank)) {
                    // 如果去除块注释之后还有字符则认为该注释不属于所要的
                    if (line == define.range.start.line) {
                        // let b_comment_last_index = content.lastIndexOf('*/');
                        // b_comment_last_index = (b_comment_last_index == -1) ? 0 : (b_comment_last_index + 2);
                        // comments.push(content.slice(b_comment_last_index, l_comment_index) + '\n');
                        comments.push(content.slice(l_comment_index, content.length) + '\n');
                        continue;
                    }
                    break; 
                }

                // 否则该行全为该定义的注释
                comments.push(content + '\n');
                continue;
            }

            // 判断该行是否存在块注释
            let b_comment_end_index = content.indexOf('*/');
            if (b_comment_end_index >= 0) {
                b_comment_end_index += 2; 
                let behind_b_comment = content.slice(b_comment_end_index, content.length);
                behind_b_comment = this.del_comments(behind_b_comment, l_comment_regExp);
                if (behind_b_comment.match(this.nonblank)) {
                    // 如果去除块注释之后还有字符则认为该注释不属于所要的
                    if (line == define.range.start.line) {
                        comments.push(content.slice(0, b_comment_end_index) + '\n');
                        is_b_comment = true;
                        continue;
                    }
                    break; 
                }

                comments.push(content + '\n');
                is_b_comment = true;
                continue;
            }

            // 说明既不是块注释又不是行注释所以就是到了代码块
            if (line != define.range.start.line) {
                break;
            }
        }

        for (let i = (comments.length - 1); i >= 0; i--) {
            comment = comment + comments[i];
        }

        return new vscode.Hover( { language: languageId, value: comment } );
    },

    getNumHover : function (document, position) {
        let path = document.uri.fsPath.replace(/\\/g, "\/");
        let languageId = parser.utils.getLanguageId(path);

        switch (languageId) {
            case "verilog":
            case "systemverilog":
                return this.verilog_num_hover(document, position);
            case "vhdl":
                return this.vhdl_num_hover(document, position);
            default: return null;
        }
    },

    vhdl_num_hover : function (document, position) {
        let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\"]*/g);
        if (wordRange !== undefined) {
            let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
            if (/x"[0-9a-fA-F_]+"/g.test(leadingText)) {
                const regex = /x"([0-9a-fA-F_]+)"/g;
                let number = regex.exec(leadingText.replace('_', ''));
                if (number === null || number[1] === null) {
                    return;
                }
                let x = parseInt(number[1], 16);
                let x1 = this.eval_signed_hex(number[1], x);
                if (x === x1) {
                    return new vscode.Hover(leadingText + ' = ' + x);
                }
                else {
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)  || ' + x1 + ' (signed)');
                }
            }
            else if (/[0-1_]+"/g.test(leadingText)) {
                const regex = /([0-1_]+)"/g;
                let number = regex.exec(leadingText.replace('_', ''));
                if (number === null || number[1] === null) {
                    return;
                }
                let x = parseInt(number[0], 2);
                let x1 = this.eval_signed_bin(number[0], x);
                if (x === x1) {
                    return new vscode.Hover('"' + leadingText + ' = ' + x);
                }
                else {
                    return new vscode.Hover('"' + leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
                }
            }
        }
    },
    
    verilog_num_hover : function (document, position) {
        let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\']*/g);
        if (wordRange !== undefined) {
            let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
            if (/[0-9]+?'h[0-9a-fA-F_]+/g.test(leadingText)) {
                const regex = /[0-9]+?'h([0-9a-fA-F_]+)/g;
                let number = regex.exec(leadingText.replace('_', ''));
                if (number === null || number[1] === null) {
                    return;
                }
                let x = parseInt(number[1], 16);
                let x1 = this.eval_signed_hex(number[1], x);
                if (x === x1) {
                    return new vscode.Hover(leadingText + ' = ' + x);
                }
                else {
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
                }
            }
            else if (/[0-9]+?'b[0-1_]+/g.test(leadingText)) {
                const regex = /[0-9]+?'b([0-1_]+)/g;
                let number = regex.exec(leadingText.replace('_', ''));
                if (number === null || number[1] === null) {
                    return;
                }
                let x = parseInt(number[1], 2);
                let x1 = this.eval_signed_bin(number[1], x);
                if (x === x1) {
                    return new vscode.Hover(leadingText + ' = ' + x);
                }
                else {
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
                }
            }
            else if (/[0-9]+?'o[0-8_]+/g.test(leadingText)) {
                const regex = /[0-9]+?'o([0-7_]+)/g;
                let number = regex.exec(leadingText.replace('_', ''));
                if (number === null || number[1] === null) {
                    return;
                }
                let x = parseInt(number[1], 8);
                let x1 = this.eval_signed_oct(number[1], x);
                if (x === x1) {
                    return new vscode.Hover(leadingText + ' = ' + x);
                }
                else {
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned) || ' + x1 + ' (signed)');
                }
            }
        }
    },

    /**
     * @state finish - tested
     * @descriptionCn 仅将文本中的块注释全部去掉
     * @descriptionEn delete all comment form verilog code
     * @param {String} text Verilog code input
     * @returns Verilog code output after deleting all comment content
     */
    del_comments : function (text, regExp) {
        let match = text.match(regExp);
        if (match != null) {
            for (let i = 0; i < match.length; i++) {
                const element = match[i];
                const newElement = ' '.repeat(element.length);
                text = text.replace(element,newElement);
            }
        }
        return text;
    },

    /**
     * @descriptionCn 将大于spacingNum的空格进行缩减删除
     * @param {*} content    待处理的文本   
     * @param {*} spacingNum 无需缩减的最大空格数
     * @returns 缩减删除之后的内容
     */
    del_spacing : function (content, spacingNum) {
        let newContent = '';
        let i = 0;
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            if (element == ' ') {
                i++;
            }
            if (((element != ' ') && (element != '\t')) || (i <= spacingNum)) {
                newContent = newContent + element;
                if (i > spacingNum) {
                    i = 0;
                }
            }
        }
        return newContent;
    },

    /**
     * @state finish-test
     * @descriptionCn 确认是否是被包含的关系
     * @param {Object} parent 父级index范围
     * @param {Object} child  子级index范围
     * @returns (true:被包含 | false:不被包含)
     */
    ensureInclude : function (parent, child) {
        if (parent.start.line < child.start.line) {
            if (parent.end.line > child.end.line) {
                return true;
            }
            if (parent.end.line == child.end.line) {
                if (parent.end.character >= child.end.character) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        if (parent.start.line == child.start.line) {
            if (parent.start.character <= child.start.character) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    /**
     * @state finish-test
     * @descriptionCn 将range格式下的范围转化为index范围格式
     * @param {String} text  文本内容
     * @param {Object} range range格式的范围 {start:{line, character}, end:{line, character}}
     * @returns {Object} index = {
            "startIndex" : startIndex,
            "lastIndex"  : lastIndex,
        }
     */
    range_to_index : function (text, range) {
        let startIndex = 0;
        let lastIndex  = 0;
        let lines = text.split('\n');
        for (let i = 0; i < range.start.line; ++i) {
            startIndex = startIndex + lines[i].length + 1;
        }
        startIndex = startIndex + range.start.character;
        for (let i = 0; i < range.end.line; ++i) {
            lastIndex = lastIndex + lines[i].length + 1;
        }
        lastIndex = lastIndex + range.end.character;
        return {
            "startIndex" : startIndex,
            "lastIndex"  : lastIndex,
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 将index格式下的范围转化为range范围格式
     * @param {String} text  文本内容
     * @param {Object} index index格式的范围{
            "startIndex" : startIndex,
            "lastIndex"  : lastIndex,
        }
     * @returns {Object} range = {
            "start" : {"line":line, "character":character},
            "end"   : {"line":line, "character":character},
        }
     */
    index_to_range : function (text, index) {
        let lines = text.split('\n');
        let line = 0;
        let offset = 0;
        let range = {
            "start" : {line:0, character:0},
            "end"  : {line:0, character:0},
        };
        while (1) {
            offset += lines[line].length + 1; 
            if (offset > index.startIndex) {
                break;
            }
            line++;
        }
        range.start.line = line;
        range.start.character = index.startIndex + lines[line].length - offset + 1;

        while (1) {
            if (offset > index.lastIndex) {
                break;
            }
            line++;
            offset += lines[line].length + 1; 
        }
        range.end.line = line;
        range.end.character = index.lastIndex + lines[line].length - offset + 1;

        return range;
    },

    position_to_index(text, position) {
        let text_splice = text.split('\n');
        let character_index = 0;
        for (let i = 0; i < position.line; ++i) {
            character_index += text_splice[i].length + 1;
        }
        character_index += position.character;
        return character_index;
    },

    /**
     * 将数字字符转成十六进制
     * @param {*} number_s 
     * @param {*} int_number 
     * @returns 
     */
    eval_signed_hex : function (number_s, int_number) {
        let pow_hex = Math.pow(16, number_s.length);
        let x1 = int_number;
        if (int_number >= pow_hex >> 1) {
            x1 = int_number - pow_hex;
        }
        return x1;
    },

    eval_signed_bin : function (number_s, int_number) {
        let pow_bin = 1 << number_s.length - 1;
        let x1 = int_number;
        if (int_number >= pow_bin >> 1) {
            x1 = int_number - pow_bin;
        }
        return x1;
    },

    eval_signed_oct : function (number_s, int_number) {
        let pow_oct = Math.pow(8, number_s.length);
        let x1 = int_number;
        if (int_number >= pow_oct >> 1) {
            x1 = int_number - pow_oct;
        }
        return x1;
    },
}
module.exports = utils;