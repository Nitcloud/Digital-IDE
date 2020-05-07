"use strict";
exports.__esModule = true;
var vscode = require("vscode");

function genboot(params) {
	
}

function register(context,current_path) {
	//My SDK Command
	let Gen_BOOT = vscode.commands.registerCommand('TOOL.Gen_BOOT', () => {

	});
	context.subscriptions.push(Gen_BOOT);
	let clean = vscode.commands.registerCommand('TOOL.clean', () => {

	});
	context.subscriptions.push(clean);
}
exports.register = register;
