"use strict";
exports.__esModule = true;

var vscode   = require("vscode");
var file     = require("../File_IO/File_IO")
var terminal = require("../command/terminal");

let prjInitparam = {
	"FPGA_VERSION": "xilinx",
	"PRJ_NAME": {
		"FPGA": "template"
	},
	"SOC_MODE": {
		"soc": "none"
	},
	"enableShowlog": false,
	"Device": "xc7z020clg400-2"
}


function pick_elf_file(boot_path) {
	let elf_list = file.pick_file(boot_path,".elf");
		elf_list = elf_list.filter(function (elf_file) {
		return elf_file !== 'fsbl.elf';
	});
	return elf_list
}

function xbootgenerate(workspace_path,root_path) {
	let BOOT_folder = `${workspace_path}user/BOOT`;
	let output_path = `${root_path}/.TOOL/Xilinx/BOOT`;

	let elf_path  = '';
	let bit_path  = '';
	let fsbl_path = '';

	let elf_list = [""];
	let bit_list = [""];

	let output_context =  "//arch = zynq; split = false; format = BIN\n";
		output_context += "the_ROM_image:\n";
		output_context += "{\n";

	if (file.ensureExists(BOOT_folder)) {
		if (file.ensureExists(BOOT_folder+"/fsbl.elf")) {
			fsbl_path = `\t[bootloader]${BOOT_folder}/fsbl.elf\n`;
		}
		else {
			fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
		}
		elf_list = pick_elf_file(BOOT_folder);
		if (elf_list.length == 1) {
			elf_path = "\t" + BOOT_folder + "/" + elf_list[0] + "\n";
			bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length == 1) {
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
					});
				}
				output_context += fsbl_path + bit_path + elf_path + "}";
				file.writeFile(`${output_path}/output.bif`,output_context);
				let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
				terminal.runCmd(cmd);	
		}
		else {
			vscode.window.showQuickPick(elf_list).then(selection => {
				if (!selection) {
					return;
				}
				elf_path = "\t" + BOOT_folder + "/" + selection + "\n";
				bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length == 1) {
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
					});
				}
				output_context += fsbl_path + bit_path + elf_path + "}";
				file.writeFile(`${output_path}/output.bif`,output_context);
				let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
				terminal.runCmd(cmd);		
			});
		}
	}
	else {
		fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
		elf_list = pick_elf_file(output_path);
		if (elf_list.length == 1) {
			elf_path = "\t" + output_path + "/" + elf_list[0] + "\n";
			bit_list = file.pick_file(workspace_path,".bit");
			if (bit_list.length == 1) {
				bit_path = "\t" + workspace_path + bit_list[0] + "\n";
			}
			else{
				vscode.window.showQuickPick(bit_list).then(selection => {
					if (!selection) {
						return;
					}
					bit_path = "\t" + workspace_path + selection + "\n";
				});
			}
			output_context += fsbl_path + bit_path + elf_path + "}";
			file.writeFile(`${output_path}/output.bif`,output_context);
			let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
			terminal.runCmd(cmd);	
		} else {
			vscode.window.showQuickPick(elf_list).then(selection => {
				if (!selection) {
					return;
				}
				elf_path = "\t" + output_path + "/" + selection + "\n";
				bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length == 1) {
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
					});
				}
				output_context += fsbl_path + bit_path + elf_path + "}";
				file.writeFile(`${output_path}/output.bif`,output_context);
				let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
				terminal.runCmd(cmd);		
			});
		}
	}
}

function xclean(workspace_path) {
	file.deleteDir(`${workspace_path}.Xil`);
	file.deleteDir(`${workspace_path}prj`);
	let file_list = file.pick_file(workspace_path,".jou");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
	file_list = file.pick_file(workspace_path,".log");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
	file_list = file.pick_file(workspace_path,".str");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
}

function generatePropertypath(workspace_path) {
	let Property_path = `${workspace_path}.vscode/Property.json`;
	if (!file.ensureExists(Property_path)) {
		if (!file.ensureExists(`${workspace_path}Property.json`)) {
			vscode.window.showInformationMessage("There is no Property.json here, where you want to generate?",'.vscode','root')
			.then(function(select){
				if (select == ".vscode") {
					file.pushJsonInfo(`${workspace_path}.vscode/Property.json`,prjInitparam);
				} else if (select == "root") {
					file.pushJsonInfo(`${workspace_path}Property.json`,prjInitparam);
				}
			});
		}
	}
}

function register(context,root_path) {
	//My SDK Command
	let workspace_path = file.getCurrentWorkspaceFolder();
	let Gen_BOOT = vscode.commands.registerCommand('TOOL.Gen_BOOT', () => {
		xbootgenerate(workspace_path,root_path);	
	});
	context.subscriptions.push(Gen_BOOT);
	let clean = vscode.commands.registerCommand('TOOL.clean', () => {
		xclean(workspace_path);
	});
	context.subscriptions.push(clean);
	let property = vscode.commands.registerCommand('TOOL.Gen_Property', () => {
		generatePropertypath(workspace_path);
	});
	context.subscriptions.push(property);
}
exports.register = register;
