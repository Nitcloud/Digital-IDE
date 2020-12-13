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

function activate(context) {
    // // lint
    // var lintManager = new LintManager["default"](logger);
    // vscode.commands.registerCommand("verilog.lint", lintManager.RunLintTool);
    
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
    
	// Configure Provider manager
    const selector = [
        { scheme: 'file', language: 'systemverilog' }, 
        { scheme: 'file', language: 'verilog' },
        { scheme: 'file', language: 'vhdl' }
    ];
    // Providers
    const hovProvider = new serve.HoverProvider();
    const docProvider = new serve.DocumentSymbolProvider(parser);
    const symProvider = new serve.WorkspaceSymbolProvider(preProcess);
    const defProvider = new serve.DefinitionProvider(symProvider);
	context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(symProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hovProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, defProvider));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docProvider));
	
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;