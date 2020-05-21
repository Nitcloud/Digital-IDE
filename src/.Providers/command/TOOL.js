"use strict";
exports.__esModule = true;

const exec         = require('child_process').exec;
const vscode       = require("vscode");

const file         = require("../file_IO/file_IO");
const xilinxFileIO = require("../file_IO/xilinxFileExplorer");

function readSerialPortNum(command) {
	exec(command,function (error, stdout, stderr) {
		let mode = stdout.replace(/\s*/g,'');
		if (mode == "none") {
			vscode.window.showWarningMessage("Not found any serial port !");
		}
		if (error !== null) {
			console.log('stderr: ' + stderr);
			vscode.window.showErrorMessage(error);
		}
	});
}


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
	let SerialPort = vscode.commands.registerCommand('TOOL.SerialPort', () => {
		let command = `python ${root_path}/.TOOL/.Script/Serial_Port.py getCurrentPort`;
		readSerialPortNum(command);
	});
	context.subscriptions.push(SerialPort);
}
exports.register = register;
