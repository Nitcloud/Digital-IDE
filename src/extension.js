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
    let opeParam = {
        "os"            : "",
        "rootPath"      : "",
        "workspacePath" : "",
        "prjInitParam"  : "",
        "propertyPath"  : ""
    }
    filesys.prjs.getOpeParam(`${__dirname}`,opeParam);

    // project Server
    filesys.registerPrjsServer(context,opeParam,HDLparam);

    // linter Server
    linter.registerLinterServer(context);

	// Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");

    // Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);

    // Back-end classes
    const index = new parser.index(statusBar, HDLparam);
    index.build_index().then(() => {
        index.updateMostRecentSymbols(undefined);
        console.log(HDLparam);
        tool.registerSimServer(context, HDLparam);
        // new tree.FileExplorer(preProcess.parser, preProcess.globPattern, HDLparam);
    });

    // tool Server
    tool.registerLspServer(context, index);
    
    // new serve.fpgaRegister(context);
    // new serve.socRegister(context);
    // new serve.toolRegister(context);
    
    // // Tree View
    // vscode.window.registerTreeDataProvider('TOOL.sdk_tree' , new tree.sdkProvider());
    // vscode.window.registerTreeDataProvider('TOOL.fpga_tree', new tree.fpgaProvider());
    // vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new tree.toolProvider());
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;