"use strict";

const vscode   = require("vscode");
const instance = require("./instance");
const opeParam = require('../../param');
const fs = require("../../HDLfilesys");
const HDLparser = require('../../HDLparser');
const HDLParam = HDLparser.HdlParam;

const testbench = {
    overwrite : function() {
        const options = {
            preview: false,
            viewColumn: vscode.ViewColumn.Active
        };
        const tbSrcPath = `${opeParam.rootPath}/lib/testbench.v`;
        const uri = vscode.Uri.file(tbSrcPath)
        vscode.window.showTextDocument(uri, options);
    },

    puts : function(module) {
        const tbSrcPath = `${opeParam.rootPath}/lib/testbench.v`;
        const tbDisPath = `${opeParam.ARCH.Hardware.sim}/testbench.v`;
        const temp = fs.files.readFile(tbSrcPath);
        if (!temp) {
            return null;
        }

        let content = '';
        const lines = temp.split('\n');
        const len = lines.length;
        for (let index = 0; index < len; index++) {
            const line = lines[index];
            content += line + '\n';
            if (line.indexOf("//Instance ") != -1) {
                content += instance.instanceVlogCode(module) + '\n';
            }
        }

        if (!fs.files.writeFile(tbDisPath, content)) {
            return null;
        }
    },

    generate : function (uri) {
        const option = {
            placeHolder: 'Select a Module'
        };
        const path = fs.paths.toSlash(uri.fsPath);
        const items = instance.getSelectItem(HDLParam.findModuleByPath(path));
        if (items.length) {
            vscode.window.showErrorMessage('There is no module in this file');
        } else {
            if (items.length == 1) {
                this.puts(items[0].mod);
            } else {
                vscode.window.showQuickPick(items, option).then((select) => {
                    this.puts(select.mod);
                });
            }
        }
    }
}
module.exports = testbench;