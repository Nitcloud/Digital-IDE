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

Object.defineProperty(exports, "__esModule", { value: true });

var vscode = require("vscode");
var exec   = require('child_process').exec;
var path   = require("path");
//the var of the lint
var ctags_1  = require("./.Linter/ctags");
var Logger_1 = require("./.Linter/Logger");
var logger   = new Logger_1.Logger();
var LintManager_1 = require("./.Linter/linter/LintManager");
var lintManager;
exports.ctagsManager = new ctags_1.CtagsManager(logger);

//the var of the providers
const parser_1 					= require("./.Providers/parser");
const indexer_1 				= require("./.Providers/indexer");
const HoverProvider_1 			= require("./.Providers/providers/HoverProvider");
const DefintionProvider_1 		= require("./.Providers/providers/DefintionProvider");
const ModuleInstantiator_1 		= require("./.Providers/providers/ModuleInstantiator");
const DocumentSymbolProvider_1 	= require("./.Providers/providers/DocumentSymbolProvider");
const WorkspaceSymbolProvider_1 = require("./.Providers/providers/WorkspaceSymbolProvider");

const vhdlMode    = require('./.Providers/vhdl/vhdlMode');
const VhdlSuggest = require('./.Providers/vhdl/VhdlSuggest');

const FPGA        = require("./.Providers/command/FPGA");
const FPGA_option = require("./.Providers/treedata/fpga_option");

function activate(context) {
    // Configure lint manager
    exports.ctagsManager.configure();
    lintManager = new LintManager_1["default"](logger);
	vscode.commands.registerCommand("verilog.lint", lintManager.RunLintTool);
	
	// Configure Provider manager
    const selector = [{ scheme: 'file', language: 'systemverilog' }, { scheme: 'file', language: 'verilog' }];
    //Output Channel
    var outputChannel = vscode.window.createOutputChannel("SystemVerilog");
	// Status Bar
	
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    statusBar.text = 'SystemVerilog: Active';
    statusBar.show();
    statusBar.command = 'systemverilog.build_index';
    // Back-end classes
    const parser = new parser_1.SystemVerilogParser();
    const indexer = new indexer_1.SystemVerilogIndexer(statusBar, parser, outputChannel);
    // Providers
    const docProvider   = new DocumentSymbolProvider_1.SystemVerilogDocumentSymbolProvider(parser);
    const symProvider   = new WorkspaceSymbolProvider_1.SystemVerilogWorkspaceSymbolProvider(indexer);
    const defProvider   = new DefintionProvider_1.SystemVerilogDefinitionProvider(symProvider);
    const hoverProvider = new HoverProvider_1.SystemVerilogHoverProvider();
    context.subscriptions.push(statusBar);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, defProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hoverProvider));
    context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(symProvider));
    // Background processes
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { indexer.onChange(doc); }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => { indexer.onChange(editor.document); }));
    let watcher = vscode.workspace.createFileSystemWatcher(indexer.globPattern, false, false, false);
    context.subscriptions.push(watcher.onDidCreate((uri) => { indexer.onCreate(uri); }));
    context.subscriptions.push(watcher.onDidDelete((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher.onDidChange((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher);

	//VHDL Language sever
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(vhdlMode.VHDL_MODE, new VhdlSuggest.VhdlCompletionItemProvider(), '.', '\"'));
    vscode.languages.setLanguageConfiguration(vhdlMode.VHDL_MODE.language, {
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^end\s+\w*$/,
            // ^.*\{[^}'']*$
            increaseIndentPattern: /^.*(begin|then|loop|is)$/
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
            lineComment: '--',
        },
        brackets: [
            ['(', ')'],
        ],
        __electricCharacterSupport: {
            brackets: [
                { tokenType: 'delimiter.curly.ts',  open: '{', close: '}', isElectric: true },
                { tokenType: 'delimiter.square.ts', open: '[', close: ']', isElectric: true },
                { tokenType: 'delimiter.paren.ts',  open: '(', close: ')', isElectric: true }
            ]
        },
        __characterPairSupport: {
            autoClosingPairs: [
                { open: '(', close: ')' },
                { open: '`', close: '`', notIn: ['string'] },
                { open: '"', close: '"', notIn: ['string'] },
            ]
        }
    });
    if (vscode.window.activeTextEditor) {}
	
	//My Command
	let current_path = `${__dirname}`;
	FPGA.register(context,current_path);
	
	vscode.window.registerTreeDataProvider('TOOL.fpga_options', new FPGA_option.Provider());

	let StartSDK = vscode.commands.registerCommand('SDK.StartSDK', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'StartSDK' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}/.TOOL/.Script/start.py sdk`);
	});
	context.subscriptions.push(StartSDK);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map