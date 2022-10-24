"use strict";

const utils = require("../utils/utils");

/* 语言服务功能 */

/**
 * @state finish-untest
 * @descriptionCn 悬停提示 实现方案：获取定义位置 -> 
 */
class HoverProvider {
    constructor(indexer) {
        this.indexer = indexer;
    };

    /**
     * @descriptionCn 悬停提供注释提示
     * @param {Object} document 所在的文件属性
     * @param {Object} position 悬停所在的标识的地址
     * @returns {String} 注释提示
     */
    provideHover(document, position) {
        return new Promise((resolve, reject) => {
            utils.HDLparam = this.indexer.HDLparam;
            let results = utils.getSymbolDefine(document, position);
            
            if (!results.length) {
                // 可能是数字
                resolve(utils.getNumHover(document, position));
            } else {
                resolve(utils.getSymbolComment(results[0]));
            }
        });
    }
}
exports.HoverProvider = HoverProvider;

/**
 * @state finish-untest
 * @descriptionCn 实现定义跳转
 * @param {Class} indexer 全局检索类，用于调用全局检索结果HDLparam
 */
class DefinitionProvider {
    constructor(indexer) {
        this.indexer = indexer;
    };

    /**
     * @state finish-untest
     * @descriptionCn 获取标识符的定义信息
     * @param {Object} document 当前文本对象
     * @param {Object} position 标识符的位置范围
     * @returns {Array} 标识符被定义的结果results = { uri : uri, range : range, }
     */
    provideDefinition(document, position) {
        return new Promise((resolve, reject) => {
            utils.HDLparam = this.indexer.HDLparam;
            let results = utils.getSymbolDefine(document, position);
            resolve(results);
        });
    }
}
exports.DefinitionProvider = DefinitionProvider;

/**
 * @state finish-untest
 * @descriptionCn 给大纲提供标识
 */
class DocumentSymbolProvider {
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
            let symbols = utils.getSymbols(document);
            resolve(symbols);
        });
    }
}
exports.DocumentSymbolProvider = DocumentSymbolProvider;

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
    

    provideWorkspaceModule(query) {
        
    }
}
exports.WorkspaceSymbolProvider = WorkspaceSymbolProvider;
