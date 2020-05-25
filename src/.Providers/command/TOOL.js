"use strict";
exports.__esModule = true;

const exec         = require('child_process').exec;
const vscode       = require("vscode");

const file         = require("../file_IO/file_IO");
const xilinxFileIO = require("../file_IO/xilinxFileExplorer");
const terminal_ope = require("../utils/terminal");

function serialPortTerminal(serialPortName,command) {
	if (terminal_ope.ensureTerminalExists(`${serialPortName}`)) {
		vscode.window.showWarningMessage('This serial port number is in use!');
	}
	else {
		Instance = vscode.window.createTerminal({ name: `${serialPortName}` });
		Instance.show(true);
		Instance.sendText(command);
	}
}

function runSerialPort(command,root_path) {
	exec(command,function (error, stdout, stderr) {
		let content = stdout.replace(/\s*/g,'');
		let SerialPortList = content.split("-");
		let Parity    = vscode.workspace.getConfiguration().get('TOOL.serialport.Parity');
		let BaudRate  = vscode.workspace.getConfiguration().get('TOOL.serialport.BaudRate');
		let DataBits  = vscode.workspace.getConfiguration().get('TOOL.serialport.DataBits');
		let StopBits  = vscode.workspace.getConfiguration().get('TOOL.serialport.StopBits');
		let porteries = `${BaudRate} ${DataBits} ${StopBits} ${Parity}`;
		if (SerialPortList[0] == "none") {
			vscode.window.showWarningMessage("Not found any serial port !");
		}
		if (SerialPortList[0] == "one") {
			porteries = SerialPortList[1] + " " + porteries;
			let command = `python ${root_path}/.TOOL/.Script/Serial_Port.py runthread ${porteries}`;
			serialPortTerminal(SerialPortList[1],command);
		}
		if (SerialPortList[0] == "multiple") {
			SerialPortList.splice(0,1);
			vscode.window.showQuickPick(SerialPortList).then(selection => {
				if (!selection) {
					return;
				}
				porteries = selection + " " + porteries;
				let command = `python ${root_path}/.TOOL/.Script/Serial_Port.py runthread ${porteries}`;
				serialPortTerminal(selection,command);
			});
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
