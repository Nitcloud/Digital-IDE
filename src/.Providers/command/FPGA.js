"use strict";
exports.__esModule = true;

var vscode       = require("vscode");
var terminal_ope = require("../command/terminal");
var getFolder    = require("../File_IO/File_IO");

let StartFPGA;
let StartFPGA_flag = false;

let Instance;

function register(context,root_path) {
	//My FPGA Command
	let tool_path = `${root_path}/.TOOL`.replace(/\\/g,"\/");
	let vInstance_Gen = vscode.commands.registerCommand('FPGA.instance', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		if (terminal_ope.ensureTerminalExists("Instance")) {
			StartSDK.show(true);	
			Instance.sendText(`python ${tool_path}/.Script/vInstance_Gen.py ${editor.document.fileName}`);
			vscode.window.showInformationMessage('Generate instance successfully!');
		}
		else {
			Instance = vscode.window.createTerminal({ name: 'Instance' });
			Instance.show(true);
			Instance.sendText(`python ${tool_path}/.Script/vInstance_Gen.py ${editor.document.fileName}`);
			vscode.window.showInformationMessage('Generate instance successfully!');
		}
    });
    context.subscriptions.push(vInstance_Gen);
    let testbench = vscode.commands.registerCommand('FPGA.testbench', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		let command = `python ${tool_path}/.Script/vTbgenerator.py ${getFolder.getCurrentWorkspaceFolder()} ${editor.document.fileName}`;
		terminal_ope.runCmd(command)
		// vscode.window.showInformationMessage('Generate Testbench successfully!');
    });
	context.subscriptions.push(testbench);

	let Init = vscode.commands.registerCommand('FPGA.Init', () => {
		if (!terminal_ope.ensureTerminalExists("StartFPGA")) {
			if (!StartFPGA_flag) {			
				StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
				StartFPGA.show(true);
				StartFPGA.sendText(`python ${tool_path}/.Script/start.py fpga`);
				StartFPGA_flag = true;
			}
		}
	});
	context.subscriptions.push(Init);
    let Update = vscode.commands.registerCommand('FPGA.Update', () => {
		StartFPGA.show(true);
		StartFPGA.sendText(`update`);
    });
	context.subscriptions.push(Update);
    let Sim = vscode.commands.registerCommand('FPGA.Sim', () => {
		StartFPGA.show(true);
		StartFPGA.sendText(`sim`);
    });
	context.subscriptions.push(Sim);
    let Build = vscode.commands.registerCommand('FPGA.Build', () => {
		StartFPGA.show(true);
		StartFPGA.sendText(`build`);
    });
	context.subscriptions.push(Build);
	let Program = vscode.commands.registerCommand('FPGA.Program', () => {
		StartFPGA.show(true);
		StartFPGA.sendText(`program`);
    });
	context.subscriptions.push(Program);
	let GUI = vscode.commands.registerCommand('FPGA.GUI', () => {
		StartFPGA.show(true);
		StartFPGA.sendText(`gui`);
    });
	context.subscriptions.push(GUI);
	let Exit = vscode.commands.registerCommand('FPGA.exit', () => {
		if (StartFPGA_flag) {			
			StartFPGA_flag = false;
			StartFPGA.show(true);
			StartFPGA.sendText(`exit`);
		}
    });
	context.subscriptions.push(Exit);
	let Overwrite_tb = vscode.commands.registerCommand('FPGA.Overwrite testbench', () => {
		const path = `${tool_path}/.Data/testbench.v`;
		const options = {
			preview: false,
			viewColumn: vscode.ViewColumn.Active
		};
		vscode.window.showTextDocument(vscode.Uri.file(path), options);
    });
	context.subscriptions.push(Overwrite_tb);
	let Overwrite_bd = vscode.commands.registerCommand('FPGA.Overwrite bd_file', () => {
		vscode.window.showQuickPick(getFolder.pick_file(`${tool_path}/Xilinx/IP/Example_bd`,".bd")).then(selection => {
		  	// the user canceled the selection
			if (!selection) {
				return;
			}
			// the user selected some item. You could use `selection.name` too
			const bd_path = `${tool_path}/Xilinx/IP/Example_bd/` + selection;
			const options = {
				preview: false,
				viewColumn: vscode.ViewColumn.Active
			};
			vscode.window.showTextDocument(vscode.Uri.file(bd_path), options);
		});
    });
    context.subscriptions.push(Overwrite_bd);
}
exports.register = register;
