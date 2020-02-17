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

const vscode = require("vscode");

var vscode_1 = require("vscode");
var LintManager_1 = require("./linter/LintManager");
var ctags_1 = require("./ctags");
var DocumentSymbolProvider_1 = require("./providers/DocumentSymbolProvider");
var HoverProvider_1 = require("./providers/HoverProvider");
var DefinitionProvider_1 = require("./providers/DefinitionProvider");
var CompletionItemProvider_1 = require("./providers/CompletionItemProvider");
var Logger_1 = require("./Logger");
var lintManager;
var logger = new Logger_1.Logger();
exports.ctagsManager = new ctags_1.CtagsManager(logger);

function activate(context) {
    console.log('Congratulations, your extension "verilog-testbench-instance" is now active!');

    var systemverilogSelector = { scheme: 'file', language: 'systemverilog' };
    var verilogSelector = { scheme: 'file', language: 'verilog' };
    exports.ctagsManager.configure();
    // Configure lint manager
    lintManager = new LintManager_1["default"](logger);
    // Configure Document Symbol Provider
    var docProvider = new DocumentSymbolProvider_1["default"](logger);
    context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(systemverilogSelector, docProvider));
    context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(verilogSelector, docProvider));
    // Configure Completion Item Provider
    // Trigger on ".", "(", "="
    var compItemProvider = new CompletionItemProvider_1["default"](logger);
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(verilogSelector, compItemProvider, ".", "(", "="));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(systemverilogSelector, compItemProvider, ".", "(", "="));
    // Configure Hover Providers
    var hoverProvider = new HoverProvider_1["default"](logger);
    context.subscriptions.push(vscode_1.languages.registerHoverProvider(systemverilogSelector, hoverProvider));
    context.subscriptions.push(vscode_1.languages.registerHoverProvider(verilogSelector, hoverProvider));
    // Configure Definition Providers
    var defProvider = new DefinitionProvider_1["default"](logger);
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(systemverilogSelector, defProvider));
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(verilogSelector, defProvider));
    vscode_1.commands.registerCommand("verilog.lint", lintManager.RunLintTool);

    let disposable = vscode.commands.registerCommand('extension.instance', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'instance' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vInstance_Gen.py ${editor.document.fileName}`);
        vscode.window.showInformationMessage('Generate instance successfully!');
    });
    context.subscriptions.push(disposable);
    let testbench = vscode.commands.registerCommand('extension.testbench', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'testbench' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vTbgenerator.py ${editor.document.fileName}`);
        vscode.window.showInformationMessage('Generate testbench successfully!');
    });
    context.subscriptions.push(testbench);
    let startfpga = vscode.commands.registerCommand('extension.startfpga', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'startfpga' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\start.py`);
    });
    context.subscriptions.push(startfpga);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map