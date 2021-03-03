// @ts-nocheck
/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 15:44:35
 * #lastTime     : 2020-02-15 17:26:23
 * #FilePath     : \src\extension.js
 * #Description  : 
 */
'use strict';

const vscode   = require("vscode");

const tool     = require("HDLtool");
const linter   = require("HDLlinter");
const parser   = require("HDLparser");
const filesys  = require("HDLfilesys");

function activate(context) {
    let HDLparam = [];
    let HDLFileList = [];
    let opeParam = {
        "os"             : "",
        "rootPath"       : "",
        "workspacePath"  : "",
        "currentSrcPath" : "",
        "prjInitParam"   : "",
        "propertyPath"   : ""
    }
    filesys.prjs.getOpeParam(`${__dirname}`,opeParam);
    filesys.prjs.refreshPrjFiles(opeParam.workspacePath, HDLFileList);
    // linter Server
    linter.registerLinterServer(context);

	// Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");

    // Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);

    const indexer = new parser.indexer(statusBar, HDLparam);
    indexer.build_index(HDLFileList).then(() => {
        console.log(HDLparam);
        indexer.updateMostRecentSymbols(undefined);
        var fileExplorer = new tool.tree.FileExplorer(HDLparam);
        filesys.monitor.momitor(opeParam.workspacePath, opeParam, indexer, () => {
            HDLparam = indexer.HDLparam;
            fileExplorer.treeDataProvider.HDLparam = indexer.HDLparam;
            fileExplorer.treeDataProvider.refresh();
        });
        // project Server
        filesys.registerPrjsServer(context, opeParam, indexer);
        // tool Server
        tool.registerTreeServer(opeParam);
        tool.registerSimServer(context, HDLparam);
        tool.registerBuildServer(context, HDLparam, opeParam);
        tool.registerLspServer(context, indexer, HDLparam);
    });
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;