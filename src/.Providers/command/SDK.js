"use strict";
exports.__esModule = true;
var vscode = require("vscode");

let StartSDK;

function register(context,current_path) {
	//My SDK Command
	let SDK_Init = vscode.commands.registerCommand('SDK.Init', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
        StartSDK.show(true);
        StartSDK.sendText(`python ${current_path}/.TOOL/.Script/start.py sdk`);
	});
	context.subscriptions.push(SDK_Init);
	let SDK_Build = vscode.commands.registerCommand('SDK.Build', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        StartSDK.show(true);
        StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
	});
	context.subscriptions.push(SDK_Build);
	let SDK_Download = vscode.commands.registerCommand('SDK.Download', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        StartSDK.show(true);
        StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
	});
	context.subscriptions.push(SDK_Download);
}
exports.register = register;
