'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "verilog-testbench-instance" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.instance', () => {
        // The code can get the document name and then it activates python code to generate instance
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'instance' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vInstance_Gen.py ${editor.document.fileName}`);
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate instance successfully!');
    });
    context.subscriptions.push(disposable);
    let testbench = vscode.commands.registerCommand('extension.testbench', () => {
        // The code can get the document name and then it activates python code to generate testbench
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'testbench' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vTbgenerator.py ${editor.document.fileName}`);
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate testbench successfully!');
    });
    context.subscriptions.push(testbench);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map