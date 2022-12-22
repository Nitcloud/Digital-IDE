"use strict";

const vscode = require("vscode");
const parser = require("HDLparser");
const utils  = require("../utils/utils");

class vhdlCompletion {

    constructor() {
        
    }

    provideCompletionItems(document, position) {
        return new Promise((resolve, reject) => {
            
        });
    }
}
exports.vhdlCompletion = vhdlCompletion;


class vlogCompletion {
    constructor(indexer){
        this.indexer = indexer;
        this.parse = new parser.vlogParser();
    }

    provideCompletionItems(document, position) {
        return new Promise((resolve, reject) => {
            // 初试化
            let text = document.getText(); 
            let path = document.uri.fsPath.replace(/\\/g, "\/"); // 标识字符所在文件的路径
            let guide_index = utils.position_to_index(text, position) - 1;
            let guide = text[guide_index];
            let guideRange = {
                "start" : position,
                "end"  : position,
            };

            utils.HDLParam = this.indexer.HDLParam;

            // 合法性
            // 获取注释所对应的范围，并检测标识字符是否在该范围内
            // let illegalRange = this.parse.get_comment_index(text);
            // for (let index = 0; index < illegalRange.length; index++) {
            //     const range = illegalRange[index];
            //     if (utils.ensureInclude(range, guideRange)) {
            //         resolve([]);
            //     }
            // }

            switch (guide) {
                case '.' :
                    let item = this.getInstance(text, guideRange);
                    let defines = utils.getInstDefine(guideRange, item);
                    resolve(this.symbols_to_items(defines, item.instModPath));
                break;

                case '`' :
                    resolve(this.getDefine(text, path));
                break;

                case '$' :
                    resolve(this.getFunction());
                break;
            
                default: reject(); break;
            }
        });
    }

    getFunction() {
        let items = []
        this.funcs.forEach((element) => {
            let item = new vscode.CompletionItem(
                element.key,
                vscode.CompletionItemKind.Function,
            );
            item.detail = element.description;
            items.push(item);
        });

        return items;
    }

    getDefine(text, path) {
        let defines = new Map();
        this.parse.get_define(text, path, defines);

        let items = []
        defines.forEach((value, key) => {
            let item = new vscode.CompletionItem(
                key,
                vscode.CompletionItemKind.Field,
            );
            item.detail = value;
            items.push(item);
        });

        return items;
    }

    /**
     * @descriptionCn 获取需要提示的地方在该文件下的哪个例化模块中
     * @param {String} path 当前文件的路径
     * @param {Object} wordRange 需要提示的标识所对应的范围
     * @returns {Object} 返回需要提示的地方所在的例化模块的全部属性
     */
    getInstance(text, wordRange) {
        let instances = this.parse.get_instances(text);

        for (let index = 0; index < instances.length; index++) {
            const instance = instances[index];
            const instRange = utils.index_to_range(text, instance);
            if (!utils.ensureInclude(instRange, wordRange)) {
                continue;
            }
            instance.instports = utils.index_to_range(text, instance.instports);
            instance.instparams = utils.index_to_range(text, instance.instparams);
            return instance;
        }
    }

    /**
     * @descriptionCn 将被定义部分的属性内容转换成CompletionItem
     * @param {*} defines 被定义部分的属性
     * @param {*} detail  定义描述的细节
     * @returns {Array} 返回转换成的CompletionItem项
     */
    symbols_to_items(defines, detail){
        let items = [];
        for (let index = 0; index < defines.length; index++) {
            const define = defines[index];
            let item = new vscode.CompletionItem(
                define.name,
                vscode.CompletionItemKind.Interface,
            );
            // item.tags = module.moduleName;
            item.detail = detail;
            items.push(item);
        }
        return items;
    }
}
exports.vlogCompletion = vlogCompletion;

class sdcCompletion {
    constructor () {
        
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            let suggestions = [];
            return resolve(suggestions);
        });
    }
}
exports.sdcCompletion = sdcCompletion;