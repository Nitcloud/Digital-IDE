const fs = require('fs');
const parser = require('./kernel');

const PathModuleSplit = ' @ ';


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
     * @returns {object}
     */
    symbol(code) {
        return this._parser.symbol(code);
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


module.exports = {
    getSymbols,
    getSymbolsFromType,
    getSymbolsFromName,
    readJSON,
    makeModuleID,
    VlogParser,
    VhdlParser,
    parser
}