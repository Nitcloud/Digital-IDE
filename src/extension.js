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
const tree     = require("./tree");
const serve    = require("./serve");
const parse    = require("./parse");
const linter   = require("HDLlinter");
const tool     = require("HDLtool");
function activate(context) {
    // lint
    var lintManager = new linter["default"]();
    vscode.commands.registerCommand("HDL.lint", lintManager.RunLintTool);

    let HDLparam = [];
    // Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);
	// Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");
    // Back-end classes
    const parser     = new parse.HDLParser();
    const preProcess = new serve.preProcess(statusBar, parser, outputChannel, HDLparam);

    new serve.fpgaRegister(context);
    new serve.socRegister(context);
    new serve.toolRegister(context);
    
    // Tree View
    vscode.window.registerTreeDataProvider('TOOL.sdk_tree' , new tree.sdkProvider());
    vscode.window.registerTreeDataProvider('TOOL.fpga_tree', new tree.fpgaProvider());
    vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new tree.toolProvider());
    
    tool.registerLspServer(context, parser, preProcess);
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;