"use strict";
exports.__esModule = true;
var vscode = require("vscode");

let StartSDK;

function register(context,current_path) {
	//My SDK Command
	let SDK_Init = vscode.commands.registerCommand('SDK.StartSDK', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
        StartSDK.show(true);
        StartSDK.sendText(`python ${current_path}/.TOOL/.Script/start.py sdk`);
	});
	context.subscriptions.push(SDK_Init);
}
exports.register = register;
