"use strict";

const vscode = require("vscode");
const { vlogParser, vhdlParser } = require("../../../HDLparser");

class vhdlCompletion {
    constructor() {
        
    }

    provideCompletionItems(document, position) {
        return new Promise((resolve, reject) => {
            
        });
    }
}


class vlogCompletion {
    constructor(){
        this.parse = new parser.vlogParser();
    }


    /**
     * @description completion provider of vlog
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position 
     * @returns {Array<vscode.CompletionItem>}
     */
    provideCompletionItems(document, position) {
        const prefixString = document.lineAt(position).text.substring(0, position.character);
        const words = prefixString.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        
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

}

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