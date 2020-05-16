"use strict";
exports.__esModule = true;

const vscode       = require("vscode");
const file         = require("../file_IO/file_IO");
const xilinxFileIO = require("../file_IO/xilinxFileExplorer");

function register(context,root_path) {
	//My SDK Command
	let workspace_path = file.getCurrentWorkspaceFolder();
	let Gen_BOOT = vscode.commands.registerCommand('TOOL.Gen_BOOT', () => {
		xilinxFileIO.xbootgenerate(workspace_path,root_path);	
	});
	context.subscriptions.push(Gen_BOOT);
	let clean = vscode.commands.registerCommand('TOOL.clean', () => {
		xilinxFileIO.move_xbd_xIP(workspace_path,file.getPropertypath(workspace_path));
		xilinxFileIO.xclean(workspace_path,"all");
	});
	context.subscriptions.push(clean);
	let property = vscode.commands.registerCommand('TOOL.Gen_Property', () => {
		file.generatePropertypath(workspace_path);
	});
	context.subscriptions.push(property);
}
exports.register = register;
