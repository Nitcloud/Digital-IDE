const assert = require('assert');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const parser = require('./kernel');
const HDLPath = require('../../HDLfilesys/operation/path');
const HDLFile = require('../../HDLfilesys/operation/files');


const PathModuleSplit = ' @ ';

class SymbolResult {
    /**
     * @param {string} name 
     * @param {string} type 
     * @param {vscode.Position} start 
     * @param {vscode.Position} end 
     */
    constructor(name, type, start, end) {
        this.name = name;
        this.type = type;
        this.start = start;
        this.end = end;
    }
};


class CommentResult {
    /**
     * @param {{line: number}} start 
     * @param {number} length 
     */
    constructor(start, length) {
        this.start = start;
        this.length = length;
    }
};


function getSymbols(options) {
    switch (options.languageId) {
        case "verilog":
        case "systemverilog":
            const vlog = new parser.vlog();
            return vlog.symbol(options.code);
        case "vhdl":
            const vhdl = new parser.vhdl();
            return vhdl.symbol(options.code);
        default: return[];
    }
}


function getSymbolsFromType(type, symbols, callback) {
    let results = [];
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        if (symbol.type !== type) {
            continue;
        }

        if (callback) {
            if (!callback(symbol)) {
                return null;
            }
        }

        results.push(symbol);
    }
    return results;
}

function getSymbolsFromName(name, symbols, callback) {
    let results = [];
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        if (symbol.name !== name) {
            continue;
        }

        if (callback) {
            callback(symbol);
        }
        results.push(symbol);
    }
    return results;
}

let count = 0;
/**
 * @description get json represent symbol from a path
 * @param {string} path 
 * @returns {object}
 */
function getSymbolJSONFromFile(path) {
    const langID = HDLFile.getLanguageId(path);
    const parser = selectParserByLangID(langID);
    const code = fs.readFileSync(path, 'utf-8') + '\n';
    const json = parser.parse(code);
    return json;
}


/**
 * 用于区别唯一 module 的字符串，由 path 和 name 组成
 * @param {string} path 
 * @param {string} name 
 * @returns {string}
 */
function makeModuleID(path, name) {
    return name + PathModuleSplit + path;
}


/**
 * 将路径上的json文件以对象读出
 * @param {string} path 
 * @returns {object}
 */
function readJSON(path) {
    let rawText = fs.readFileSync(path);
    return JSON.parse(rawText);    
}



/**
 * @description 递归返回一个文件夹下的所有文件路径
 * @param {string} folder 
 * @returns {Array<string>}
 */
function getAllFilesFromFolder(folder) {
    const files = [];
    for (const file of fs.readdirSync(folder)) {
        const filePath = HDLPath.join(folder, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile()) {
            files.push(filePath);
        } else {
            for (const ffile of getAllFilesFromFolder(filePath)) {
                files.push(ffile);
            }
        }
    } 
    return files;
}


/**
 * @description 根据语言ID选择解析器
 * @param {string} langID 
 * @returns {BaseParser}
 */
function selectParserByLangID(langID) {
    if (langID == 'verilog') {
        return vlogParser;
    } else if (langID == 'vhdl') {
        return vhdlParser;
    } else {
        assert(false, 'Unknown langID ' + langID);
    }
}

class BaseParser {
    constructor() {
        this._parser = this.makeParser();
    }
    makeParser() {}
    /**
     * @description 解析HDL代码
     * @param {string} code 
     * @returns {object}
     */
    parse(code) {
        return this._parser.parse(code);
    }

    /**
     * @description 给出词法解析结果
     * @param {string} code 
     * @returns {{comments: Array<CommentResult>, 
     *            defines: object, 
     *            includes: object, 
     *            symbols: Array<SymbolResult>}}
     */
    symbol(code) {
        return this._parser.symbol(code);
    }

    lint(code) {
        return this._parser.lint(code);
    }
}


class VlogParser extends BaseParser {
    makeParser() {
        return new parser.vlog();
    }
}

class VhdlParser extends BaseParser {
    makeParser() {
        return new parser.vhdl();
    }
}


const vhdlParser = new VhdlParser();
const vlogParser = new VlogParser();


/**
 * @description 解析一个文件并返回数据结构
 * @param {string} path
 * @returns {object} 
 */
function parseFile(path) {

}

module.exports = {
    SymbolResult,
    CommentResult,
    getSymbols,
    getSymbolsFromType,
    getSymbolsFromName,
    readJSON,
    makeModuleID,
    getAllFilesFromFolder,
    selectParserByLangID,
    getSymbolJSONFromFile,
    vhdlParser,
    vlogParser,
    parser
}