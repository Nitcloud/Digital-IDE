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

const vscode = require("vscode");
const utils  = require("./utils");
const serve  = require("./serve");
const parse  = require("./parse");
const index  = require("./index");

function activate(context) {
//     // lint
//     var lintManager = new LintManager["default"](logger);
//     vscode.commands.registerCommand("verilog.lint", lintManager.RunLintTool);
    
	// Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);
	//Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");
    // Back-end classes
    const parser  = new parse.HDLParser();
	const indexer = new index.HDLIndexer(statusBar, parser, outputChannel);

	// Configure Provider manager
    const selector = [
        { scheme: 'file', language: 'systemverilog' }, 
        { scheme: 'file', language: 'verilog' }
    ];
    const VHDL_MODE = 
        { scheme: 'file', language: 'vhdl' };
    // Providers
    const docProvider = new serve.DocumentSymbolProvider(parser);
    const symProvider = new serve.WorkspaceSymbolProvider(indexer);
    const defProvider = new serve.DefinitionProvider(symProvider);
    const hovProvider = new serve.HoverProvider();
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, defProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hovProvider));
	context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(symProvider));
	
    // Background processes
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { indexer.onChange(doc); }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => { indexer.onChange(editor.document); }));
    let watcher = vscode.workspace.createFileSystemWatcher(indexer.globPattern, false, false, false);
    context.subscriptions.push(watcher.onDidCreate((uri) => { indexer.onCreate(uri); }));
    context.subscriptions.push(watcher.onDidDelete((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher.onDidChange((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher);

    // //VHDL Language sever
    // context.subscriptions.push(
    //     vscode.languages.registerCompletionItemProvider(
    //         VHDL_MODE, 
    //         new VhdlSuggest.VhdlCompletionItemProvider(), 
    //         '.', 
    //         '\"'));
    // vscode.languages.setLanguageConfiguration(VHDL_MODE.language, {
    //     indentationRules: {
    //         increaseIndentPattern: /^.*(begin|then|loop|is)$/,
    //         decreaseIndentPattern: /^end\s+\w*$/
    //     },
    //     wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    // });
    
//     //My Command
//     let root_path = `${__dirname}`.replace(/\\/g,"\/");
//     SDK.register(context,root_path);
//     TOOL.register(context,root_path);
//     FPGA.register(context,root_path);
    
//     vscode.window.registerTreeDataProvider('TOOL.file_tree', new tree.fileProvider());
//     vscode.window.registerTreeDataProvider('TOOL.sdk_tree' , new tree.sdkProvider());
//     vscode.window.registerTreeDataProvider('TOOL.fpga_tree', new tree.fpgaProvider());
//     vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new tree.toolProvider());
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;