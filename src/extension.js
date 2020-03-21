/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 15:44:35
 * #lastTime     : 2020-02-15 17:26:23
 * #FilePath     : \src\extension.js
 * #Description  : 
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

var vscode   = require("vscode");

//the var of the lint
var ctags_1  = require("./.Linter/ctags");
var Logger_1 = require("./.Linter/Logger");
var logger   = new Logger_1.Logger();
var LintManager_1 = require("./.Linter/linter/LintManager");
var lintManager;
exports.ctagsManager = new ctags_1.CtagsManager(logger);

//the var of the providers
let client;
let closeWindowProgress = true;

const vscode_languageclient_1 	= require("vscode-languageclient");
const path 						= require("path");
const parser_1 					= require("./.Providers/parser");
const indexer_1 				= require("./.Providers/indexer");
const HoverProvider_1 			= require("./.Providers/providers/HoverProvider");
const DefintionProvider_1 		= require("./.Providers/providers/DefintionProvider");
const ModuleInstantiator_1 		= require("./.Providers/providers/ModuleInstantiator");
const DocumentSymbolProvider_1 	= require("./.Providers/providers/DocumentSymbolProvider");
const WorkspaceSymbolProvider_1 = require("./.Providers/providers/WorkspaceSymbolProvider");


function activate(context) {
    console.log('Congratulations, your extension "FPGA-Support" is now active!');

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
    const docProvider = new DocumentSymbolProvider_1.SystemVerilogDocumentSymbolProvider(parser);
    const symProvider = new WorkspaceSymbolProvider_1.SystemVerilogWorkspaceSymbolProvider(indexer);
    const defProvider = new DefintionProvider_1.SystemVerilogDefinitionProvider(symProvider);
    const hoverProvider = new HoverProvider_1.SystemVerilogHoverProvider();
    const moduleInstantiator = new ModuleInstantiator_1.SystemVerilogModuleInstantiator();
    context.subscriptions.push(statusBar);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, docProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, defProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, hoverProvider));
    context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(symProvider));
    const build_handler = () => { indexer.build_index(); };
    const instantiate_handler = () => { moduleInstantiator.instantiateModule(); };
    context.subscriptions.push(vscode.commands.registerCommand('systemverilog.build_index', build_handler));
    context.subscriptions.push(vscode.commands.registerCommand('systemverilog.auto_instantiate', instantiate_handler));
    context.subscriptions.push(vscode.commands.registerCommand('systemverilog.compile', compileOpenedDocument));
    // Background processes
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { indexer.onChange(doc); }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => { indexer.onChange(editor.document); }));
    let watcher = vscode.workspace.createFileSystemWatcher(indexer.globPattern, false, false, false);
    context.subscriptions.push(watcher.onDidCreate((uri) => { indexer.onCreate(uri); }));
    context.subscriptions.push(watcher.onDidDelete((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher.onDidChange((uri) => { indexer.onDelete(uri); }));
    context.subscriptions.push(watcher);
    /**
      Sends a notification to the LSP to compile the opened document.
      Keeps the `Progress` window opened until `extensionLanguageClient.closeWindowProgress` is set to true or
      the interval iterations count reaches the maximum value.
      `closeWindowProgress` is updated to true when a notification is sent to the client from LSP.
    */
    function compileOpenedDocument() {
        let document = vscode.window.activeTextEditor.document;
        if (!document) {
            vscode.window.showErrorMessage("There is no open document!");
            return;
        }
        closeWindowProgress = false;
        Promise.resolve(vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "SystemVerilog Document compiling...",
            cancellable: true
        }, (_progress, token) => __awaiter(this, void 0, void 0, function* () {
            client.sendNotification("compileOpenedDocument", document.uri.toString());
            var intervalCount = 0;
            var interval = setInterval(function () {
                if (closeWindowProgress || intervalCount > 5) {
                    clearInterval(interval);
                }
                intervalCount++;
            }, 500);
        }))).catch((error) => {
            outputChannel.appendLine(error);
            vscode.window.showErrorMessage(error);
        });
    }
    /** Starts the `LanguageClient` */
    // point to the path of the server's module
    let serverModule = context.asAbsolutePath(path.join('src/.Providers', 'server.js'));
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let serverOptions = {
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6009'] }
        }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for selected documents
        documentSelector: selector
        /*
        synchronize: {
          // Notify the server about file changes to SystemVerilog/Verilog files contained in the workspace
          fileEvents: workspace.createFileSystemWatcher(indexer.globPattern)
        }*/
    };
    // Create the language client and start the client.
    client = new vscode_languageclient_1.LanguageClient('systemverilog', 'System Verilog Language Server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
    client.onReady().then(() => {
        client.sendNotification("workspaceRootPath", vscode.workspace.workspaceFolders[0].uri.fsPath);
        /* Update `closeWindowProgress` to true when the client is notified by the server. */
        client.onNotification("closeWindowProgress", function () {
            closeWindowProgress = true;
        });
        /* Notify the server that the workspace configuration has been changed */
        vscode.workspace.onDidChangeConfiguration(() => {
            client.sendNotification("onDidChangeConfiguration");
        });
    });

	//My Cmd
    let instance = vscode.commands.registerCommand('extension.instance', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'instance' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}/.TOOL/.Script/vInstance_Gen.py ${editor.document.fileName}`);
        vscode.window.showInformationMessage('Generate instance successfully!');
    });
    context.subscriptions.push(instance);
    let testbench = vscode.commands.registerCommand('extension.testbench', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'testbench' });
        //ter1.show(true);
        ter1.hide
        ter1.dispose
        ter1.sendText(`python ${__dirname}/.TOOL/.Script/vTbgenerator.py ${editor.document.fileName}`);
        vscode.window.showInformationMessage('Generate testbench successfully!');
    });
    context.subscriptions.push(testbench);
    let startfpga = vscode.commands.registerCommand('extension.StartFPGA', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'StartFPGA' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}/.TOOL/.Script/start.py`);
    });
    context.subscriptions.push(startfpga);
    let OpenGUI = vscode.commands.registerCommand('extension.OpenGUI', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'OpenGUI' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}/.TOOL/.Script/start.py`);
    });
    context.subscriptions.push(OpenGUI);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map