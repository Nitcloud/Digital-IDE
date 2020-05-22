"use strict";
exports.__esModule = true;

const exec         = require('child_process').exec;
const vscode       = require("vscode");

const file         = require("../file_IO/file_IO");
const xilinxFileIO = require("../file_IO/xilinxFileExplorer");

function runSerialPort(command,root_path) {
	exec(command,function (error, stdout, stderr) {
		let content = stdout.replace(/\s*/g,'');
		let SerialPortList = content.split("-");
		if (SerialPortList[0] == "none") {
			vscode.window.showWarningMessage("Not found any serial port !");
		}
		if (SerialPortList[0] == "one") {
			let porteries = vscode.workspace.getConfiguration().get('TOOL.serialport.porteries');
			porteries = SerialPortList[1] + " " + porteries.replace(/-/g," ");
			let command = `python ${root_path}/.TOOL/.Script/Serial_Port.py runthread ${porteries}`;
			exec(command);
		}
		if (SerialPortList[0] == "multiple") {
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
		runSerialPort(command,root_path);
	});
	context.subscriptions.push(SerialPort);
}
exports.register = register;
