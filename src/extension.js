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

var vscode   = require("vscode");
var ctags_1  = require("./.Linter/ctags");
var Logger_1 = require("./.Linter/Logger");

var LintManager_1 = require("./.Linter/linter/LintManager");


var lintManager;
var logger = new Logger_1.Logger();
exports.ctagsManager = new ctags_1.CtagsManager(logger);

function activate(context) {
    console.log('Congratulations, your extension "FPGA-Support" is now active!');

    exports.ctagsManager.configure();
    // Configure lint manager
    lintManager = new LintManager_1["default"](logger);
    vscode.commands.registerCommand("verilog.lint", lintManager.RunLintTool);

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