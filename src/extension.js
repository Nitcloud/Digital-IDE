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
const linter   = require("HDLlinter/linter");
const parser   = require("HDLparser");
const filesys  = require("HDLfilesys");

function activate(context) {
    let HDLparam = [];
    let opeParam = {
        "os"             : "",
        "rootPath"       : "",
        "workspacePath"  : "",
        "currentSrcPath" : "",
        "prjInitParam"   : "",
        "propertyPath"   : ""
    }
    filesys.prjs.getOpeParam(`${__dirname}`,opeParam);

    // linter Server
    linter.registerLinterServer(context);

	// Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");

    // Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);

    const indexer = new parser.indexer(statusBar, HDLparam);
    indexer.build_index().then(() => {
        indexer.updateMostRecentSymbols(undefined);
        console.log(HDLparam);
        // project Server
        filesys.registerPrjsServer(context, opeParam, HDLparam);
        // tool Server
        tool.registerTreeServer(opeParam, HDLparam);
        tool.registerSimServer(context, HDLparam);
        tool.registerBuildServer(context, HDLparam);
        tool.registerLspServer(context, indexer, HDLparam);
    });

    // new serve.fpgaRegister(context);
    // new serve.socRegister(context);
    // new serve.toolRegister(context);
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;