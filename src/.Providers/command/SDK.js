"use strict";
exports.__esModule = true;
var vscode       = require("vscode");
var terminal_ope = require("../command/terminal");

let StartSDK;

function register(context,current_path) {
	//My SDK Command
	let SDK_Init = vscode.commands.registerCommand('SDK.Init', () => {
		if (terminal_ope.ensureTerminalExists("StartSDK")) {
			StartSDK.show(true);		
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
		}
		else {
			StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
			StartSDK.show(true);
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
		}
	});
	context.subscriptions.push(SDK_Init);
	let SDK_Build = vscode.commands.registerCommand('SDK.Build', () => {
		if (terminal_ope.ensureTerminalExists("StartSDK")) {
			StartSDK.show(true);		
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
		}
		else {
			StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
			StartSDK.show(true);
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
		}
	});
	context.subscriptions.push(SDK_Build);
	let SDK_Download = vscode.commands.registerCommand('SDK.Download', () => {
		if (terminal_ope.ensureTerminalExists("StartSDK")) {		
			StartSDK.show(true);
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
		}
		else {
			StartSDK = vscode.window.createTerminal({ name: 'StartSDK' });
			StartSDK.show(true);
			StartSDK.sendText(`xsct ${current_path}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
		}
	});
	context.subscriptions.push(SDK_Download);
}
exports.register = register;
