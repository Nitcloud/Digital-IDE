"use strict";
const vscode = require("vscode");
const parser = require("../../../HDLparser");
const fs = require("../../../HDLfilesys");

function registerProvider() {
    const lsp = [
        { scheme: 'file', language: 'systemverilog' },
        { scheme: 'file', language: 'verilog' },
        { scheme: 'file', language: 'vhdl' }
    ];

    vscode.languages.registerHoverProvider(lsp, new hoverProvider());
    vscode.languages.registerDefinitionProvider(lsp, new defineProvider());
    vscode.languages.registerDocumentSymbolProvider(lsp, new docSymbolProvider());
}
module.exports = registerProvider;

/**
 * @state finish-untest
 * @descriptionCn 悬停提示 实现方案：获取定义位置 -> 
 */
class hoverProvider {
    constructor() {};

    /**
     * @descriptionCn 悬停提供注释提示
     * @param {Object} document 所在的文件属性
     * @param {Object} position 悬停所在的标识的地址
     * @returns {String} 注释提示
     */
    provideHover(document, position) {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
}

/**
 * @state finish-untest
 * @descriptionCn 实现定义跳转
 * @param {Class} indexer 全局检索类，用于调用全局检索结果HDLparam
 */
class defineProvider {
    constructor() {};

    /**
     * @state finish-untest
     * @descriptionCn 获取标识符的定义信息
     * @param {Object} document 当前文本对象
     * @param {Object} position 标识符的位置范围
     * @returns {Array} 标识符被定义的结果results = { uri : uri, range : range, }
     */
    provideDefinition(document, position) {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
}

/**
 * @state finish-untest
 * @descriptionCn 给大纲提供标识
 */
class docSymbolProvider {
    constructor() { }

    /**
     * @state finish-untest
     * @descriptionCn 给大纲提供标识
     * @param {Object} document 当前文本对象
     * @returns {Array} symbols 所有的标识的全部信息symbol.symbols
     * symbol = (name kind parent location item) item为冗余部分用于定义识别
     */
    provideDocumentSymbols(document) {
        return new Promise((resolve) => {
            resolve(new symbolGenerate().getSymbols(document));
        });
    }
}

/**
 * @state unfinish-clear-untest
 * @descriptionCn 工作区标志
 */
class WorkspaceSymbolProvider {
    constructor() { };
    
    provideWorkspaceSymbols(query, token, exactMatch) {
        return new Promise((resolve, reject) => {
            
        });
    }
    
    provideWorkspaceModule(query) {}
}
exports.wspSymbolProvider = WorkspaceSymbolProvider;

class symbolDefine {
    constructor(HDLParam) {
        this.HDLParam = HDLParam;
        this.nonblank = /\S+/g;
        this.b_comment = /\/\*[\s\S]*?\*\//g;
        this.b_comment_begin = /(?<!(\s*\w+\s*))(\/\/.*)/g;
        this.b_comment_end = /(\*\/)/g;
    }

    getConfig(document, position) {
        this.config = {
            'text' : document.getText(),
            'path' : fs.paths.toSlash(document.uri.fsPath),
            'word' : '',
            'range': document.getWordRangeAtPosition(position),
            'index': 0,
        }

        this.config.word  = document.getText(this.config.range);
        this.config.index = document.offsetAt(this.config.range.start);
    }

    /**
     * @state finish-untest
     * @descriptionCn 获取标识符的定义信息
     * @param {Object} document 当前文本对象
     * @param {Object} position 标识符的位置范围
     * @returns {Array} 标识符被定义的结果results = { uri : uri, range : range, }
     */
    getSymbolDefine(document, position) {
        let results = [];
        this.config(document, position);
        const info = parser.HDLParam;
        const symbols = parser.utils.getSymbols({
            languageId : document.languageId,
            code : fs.files.readFile(this.config.path),
        });

        // 先判断是否是include
        parser.utils.getSymbolsFromType('include', symbols, (symbol) => {
            if (fs.files.ensureInclude(symbol, this.config.range)) {
                results.push({
                    type : 'path',
                    uri : vscode.Uri.file(fs.paths.rel2abs(this.config.path, symbol.name)),
                    range : new vscode.Range(
                        {"line":0, "character":0}, 
                        {"line":0, "character":0}
                    ),
                });
                return false;
            } else {
                return true;
            }
        });

        if (results.length) {
            return results;
        }

        // 获得引导词
        let guide = '';
        do {
            guide = this.config.text[this.config.index--];
            if (this.config.index <= 0) {
                guide = '';
                break;
            }
        } while (/\s/.test(guide));

        switch (guide) {
            case '`':
                return this.findDefine(info, this.config.word, this.config.path);
            case '.':
                return this.findInstance(info, this.config.word, this.config.range);
            default: 
                return this.findWordInfo(info, this.config.word, symbols);
        }
    }

    findDefine(param, word, path) {
        const defines  = param[path].marco.defines;
        const includes = param[path].marco.includes;
        if (defines[word]) {
            return [{
                uri : vscode.Uri.file(path),
                range : new vscode.Range(
                    defines[word].range.start, 
                    defines[word].range.end
                ),
            }]
        } else {
            for (let i = 0; i < includes.length; i++) {
                let element = includes[i];
                element = fs.paths.rel2abs(path, element);
                this.findDefine(param, word, element);
            }
        }
    }

    findInstance(param, word, range) {
        const modules  = param[path].marco.modules;
        for (const key in modules) {
            const instances = modules[key].instances;
            for (let i = 0; i < instances.length; i++) {
                const instance = instances[i];
                let list = instance.instModInfo.params;
                if (fs.files.ensureInclude(instance.instparams, range)) {
                    list = instance.instModInfo.ports;
                }
                else if (!fs.files.ensureInclude(instance.instports, range)) {
                    continue;
                }

                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    if (element.name !== word) {
                        continue;
                    }
                    return [{
                        uri : vscode.Uri.file(instance.instModPath),
                        range : new vscode.Range(
                            element.start, 
                            element.end
                        ),
                    }];
                }
            }
        }
    }

    findWordInfo(param, word, symbols) {
        let results = [];
        const res = parser.utils.getSymbolsFromName(word, symbols);
        for (let i = 0; i < res.length; i++) {
            const element = res[i];
            results.push({
                uri : vscode.Uri.file(this.config.path),
                range : new vscode.Range(
                    element.start, 
                    element.end
                ),
            });
        }

        if (results.length) {
            return results
        }

        for (const path in param) {
            const modules = param[path].marco.modules;
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                if (module.name !== word) {
                    continue;
                }
                results.push({
                    uri : vscode.Uri.file(path),
                    range : new vscode.Range(
                        module.start, 
                        module.end
                    ),
                });
            }
        }

        return results;
    }

    /**
     * @state finish-untest
     * @descriptionCn  根据定义点获取对应的注释提示
     * @param {Object} define  { uri : uri, range : range, }
     * @returns {Object} 定义点所对应的注释提示内容
     */
    getSymbolComment(define) {
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
    }

    /**
     * @state finish - tested
     * @descriptionCn 仅将文本中的块注释全部去掉
     * @descriptionEn delete all comment form verilog code
     * @param {String} text Verilog code input
     * @returns Verilog code output after deleting all comment content
     */
    del_comments(text, regExp) {
        let match = text.match(regExp);
        if (match != null) {
            for (let i = 0; i < match.length; i++) {
                const element = match[i];
                const newElement = ' '.repeat(element.length);
                text = text.replace(element,newElement);
            }
        }
        return text;
    }

    /**
     * @descriptionCn 将大于spacingNum的空格进行缩减删除
     * @param {String} content    待处理的文本   
     * @param {Number} spacingNum 无需缩减的最大空格数
     * @returns 缩减删除之后的内容
     */
    del_spacing(content, spacingNum) {
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
    }
}

class numHover {
    
    constructor() {
        this.vhdl = {
            'hex' : /x"([0-9a-fA-F_]+)"/g,
            'bin' : /([0-1_]+)"/g,
        };

        this.vlog = {
            'hex' : /[0-9]+?'h([0-9a-fA-F_]+)/g,
            'bin' : /[0-9]+?'b([0-1_]+)/g,
            'oct' : /[0-9]+?'o([0-7_]+)/g,
        }
    }

    numHover(content, languageId) {
        this.numStr = content.replace('_', '');
        let regExp = this.vlog;
        if (languageId == 'vhdl') {
            regExp = this.vhdl;
        }

        for (const key in regExp) {
            const match = regExp[key].exec(this.numStr);
            if (match === null || match[1] === null) {
                return;
            }

            const num = this.str_num(match[1], key);
            return `${this.numStr} = '${num.unsigned}(unsigned)' || '${num.signed} (signed)'`
        }
    }

    /**
     * @descriptionCn 将数字字符串转数字(包括有符号与无符号)
     * @param {String} str 数字字符串
     * @param {String} opt 需要转换的进制 hex | bin | oct
     * @returns {Object} {
     *      'unsigned' : unsigned, // 有符号数
     *      'signed' : signed,     // 无符号数
     *  }
     */
    str_num(str, opt) {
        switch (opt) {
            case 'hex':
                opt = 16;
            break;
            case 'bin':
                opt = 2;
            break;
            case 'oct':
                opt = 8;
            break;
            default: break;
        }

        let unsigned = parseInt(str, opt);
        let pow = Math.pow(opt, str.length);
        let signed = unsigned;
        if (unsigned >= pow >> 1) {
            signed = unsigned - pow;
        }

        return {
            'unsigned' : unsigned,
            'signed' : signed,
        };
    }

    /**
     * @descriptionCn 将二进制字符串转浮点数
     * @param {String} bin 
     * @param {Number} exp 
     * @param {Number} fra 
     * @returns {Number}
     */
    bin2float(bin, exp, fra) {
        if (bin.length < exp + fra +1) {
            return null;
        } else {
            const bais = Math.pow(2, (exp-1))-1;
            exp = exp - bais;
            
        }
    }
}

class symbolGenerate {
    constructor() {
        this.doc = null;
    }

    /**
     * @state finish-untest
     * @descriptionCn 获取所有标识符的全部信息
     * @param {Object} document 当前文本对象
     * @returns {Array} 所有的标识的全部信息symbol.symbols
     */
     getSymbols(document) {
        this.doc = document;
        const path = fs.paths.toSlash(document.uri.fsPath);
        const code = fs.files.readFile(path);
        this.getSymbolInfo(parser.utils.getSymbols({
            languageId : document.languageId,
            code : code
        }));
    }

    /**
     * @state finish - untest
     * @descriptionEn set a symbol information object.
     * @param  symbols { name & type & start & end }
     * @return The object of the SymbolInformation.
     */
     getSymbolInfo(symbols) {
        let results = [];
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const location = new vscode.Location(
                this.doc.uri, 
                new vscode.Range(symbol.start, symbol.end)
            );
    
            const symbolInfo = vscode.SymbolInformation(
                symbol.name,
                this.getSymbolKind(symbol.type),
                null,
                location
            );
            results.push(symbolInfo);
        }

        return results;
    }

    /**
     * @state finish - untest
     * @descriptionEn get a symbol Kind.
     * @param {String} name The name of the symbol.
     * @return     The SymbolKind of the symbol's name.
     */
    getSymbolKind(name) {
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
    }
}