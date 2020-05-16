"use strict";
exports.__esModule = true;
const vscode       = require("vscode");
const file       = require("../file_IO/file_IO");
const terminal_ope = require("../command/terminal");

let StartSDK;

function register(context,root_path) {
	//My SDK Command
	let workspace_path = file.getCurrentWorkspaceFolder();
	let SDK_Init = vscode.commands.registerCommand('SDK.Init', () => {
		if (file.getSocMode(file.getPropertypath(workspace_path))) {			
			if (terminal_ope.ensureTerminalExists("StartSDK")) {
				StartSDK.show(true);		
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
			}
			else {
				StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
				StartSDK.show(true);
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
			}
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}
	});
	context.subscriptions.push(SDK_Init);
	let SDK_Build = vscode.commands.registerCommand('SDK.Build', () => {
		if (file.getSocMode(file.getPropertypath(workspace_path))) {
			if (terminal_ope.ensureTerminalExists("StartSDK")) {
				StartSDK.show(true);		
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
			}
			else {
				StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
				StartSDK.show(true);
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
			}
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}	
	});
	context.subscriptions.push(SDK_Build);
	let SDK_Download = vscode.commands.registerCommand('SDK.Download', () => {
		if (file.getSocMode(file.getPropertypath(workspace_path))){
			if (terminal_ope.ensureTerminalExists("StartSDK")) {		
				StartSDK.show(true);
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
			}
			else {
				StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
				StartSDK.show(true);
				StartSDK.sendText(`xsct ${root_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
			}
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}
	});
	context.subscriptions.push(SDK_Download);
}
exports.register = register;
