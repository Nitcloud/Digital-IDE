"use strict";
exports.__esModule = true;
var vscode = require("vscode");

let StartFPGA;

function register(context) {
	//My FPGA Command
	let StartFPGA_init = vscode.commands.registerCommand('FPGA.Init', () => {
		StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		// StartFPGA.hide
		StartFPGA.show(true);
		StartFPGA.sendText(`python ${__dirname}/.TOOL/.Script/start.py fpga`);
	});
	context.subscriptions.push(StartFPGA_init);
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
	let Overwrite_tb = vscode.commands.registerCommand('FPGA.Overwrite testbench', () => {
		const path = `${__dirname}/.TOOL/.Data/testbench.v`;
		const options = {
			preview: false,
			viewColumn: vscode.ViewColumn.Active
		};
		vscode.window.showTextDocument(vscode.Uri.file(path), options);
    });
	context.subscriptions.push(Overwrite_tb);
	let Overwrite_bd = vscode.commands.registerCommand('FPGA.Overwrite bd_file', () => {
		vscode.window.showQuickPick(['m3_xIP_default.bd','MicroBlaze_default.bd','zynq_default.bd']).then(selection => {
		  // the user canceled the selection
		  if (!selection) {
			return;
		  }
		  // the user selected some item. You could use `selection.name` too
		  switch (selection) {
			case "m3_xIP_default.bd": 
				const m3_xIP_default_path = `${__dirname}/.TOOL/Xilinx/IP/Example_bd/m3_xIP_default.bd`;
				const m3_xIP_default_options = {
					preview: false,
					viewColumn: vscode.ViewColumn.Active
				};
				vscode.window.showTextDocument(vscode.Uri.file(m3_xIP_default_path), m3_xIP_default_options);
			break;
			case "MicroBlaze_default.bd": 
				const MicroBlaze_default_path = `${__dirname}/.TOOL/Xilinx/IP/Example_bd/MicroBlaze_default.bd`;
				const MicroBlaze_default_options = {
					preview: false,
					viewColumn: vscode.ViewColumn.Active
				};
				vscode.window.showTextDocument(vscode.Uri.file(MicroBlaze_default_path), MicroBlaze_default_options);
			break;
			case "zynq_default.bd": 
				const zynq_default_path = `${__dirname}/.TOOL/Xilinx/IP/Example_bd/zynq_default.bd`;
				const zynq_default_options = {
					preview: false,
					viewColumn: vscode.ViewColumn.Active
				};
				vscode.window.showTextDocument(vscode.Uri.file(zynq_default_path), zynq_default_options);
			break;
			default: break;
		  }
		});
    });
    context.subscriptions.push(Overwrite_bd);
}
exports.register = register;