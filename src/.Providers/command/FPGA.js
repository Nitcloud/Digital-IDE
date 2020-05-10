"use strict";
exports.__esModule = true;

var vscode       = require("vscode");
var terminal_ope = require("../command/terminal");
var getFolder    = require("../File_IO/File_IO");

let StartFPGA;
let StartFPGA_flag = false;

let Instance;

let fpgaparam = {
	"FPGA_VERSION": "xilinx",
	"PRJ_NAME": {
		"FPGA": "template"
	},
	"SOC_MODE": {
		"soc": "none"
	},
	"enableShowlog": false,
	"Device": ""
}

function findDevice(root_path,workspace_path) {
	let FPGA_param   = getFolder.pullJsonInfo(`${workspace_path}.vscode/Property.json`);
	if (FPGA_param.Device == "") {
		let Device_param = getFolder.pullJsonInfo(`${root_path}/.TOOL/Device.json`);
		let Device_list  = Device_param.Xilinx;	
		vscode.window.showQuickPick(Device_list).then(selection => {
			// the user canceled the selection
			if (!selection) {
				return;
			}
			FPGA_param.Device = selection;
			getFolder.pushJsonInfo(`${workspace_path}.vscode/Property.json`,FPGA_param);
		});
	}
}

function addDevice(root_path) {
	let Device_param   = getFolder.pullJsonInfo(`${root_path}/.TOOL/Device.json`);
	let Property_param = getFolder.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
	vscode.window.showInputBox({
		password:false, 
		ignoreFocusOut:true,
		placeHolder:'Please input the name of device', }).then(function(Device) {

		if (Device_param.Xilinx.find(function(value) {
			if(value === Device) {
				return false;
			}
		})) {		
			Device_param.Xilinx.push(Device);
			Property_param.properties.Device.enum.push(Device);
			getFolder.pushJsonInfo(`${root_path}/.TOOL/Device.json`,Device_param);
			getFolder.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
			vscode.window.showInformationMessage(`Add the ${Device} successfully!!!`)
		}
		else {
			vscode.window.showWarningMessage("The device already exists")
		}
	});
}

function deleteDevice(root_path) {
	let Device_param   = getFolder.pullJsonInfo(`${root_path}/.TOOL/Device.json`);
	let Property_param = getFolder.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
	let Device_list    = Device_param.Xilinx
	vscode.window.showQuickPick(Device_list).then(selection => {
		// the user canceled the selection
		if (!selection) {
			return;
		}
		var index = 0;
		for(index = 0; index < Device_param.Xilinx.length;index++){
            if(selection == Device_param.Xilinx[index]){
                Device_param.Xilinx.splice(index,1);
            }
		}
		for(index = 0; index < Property_param.properties.Device.enum.length;index++){
            if(selection == Property_param.properties.Device.enum[index]){
				Property_param.properties.Device.enum.splice(index,1);
            }
		}
		getFolder.pushJsonInfo(`${root_path}/.TOOL/Device.json`,Device_param);
		getFolder.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
	});
}

function register(context,root_path) {
	//My FPGA Command
	let workspace_path = getFolder.getCurrentWorkspaceFolder();
	let tool_path = `${root_path}/.TOOL`;
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
		let command = `python ${tool_path}/.Script/vTbgenerator.py ${workspace_path} ${editor.document.fileName}`;
		terminal_ope.runCmd(command)
		// vscode.window.showInformationMessage('Generate Testbench successfully!');
    });
	context.subscriptions.push(testbench);

	let Init = vscode.commands.registerCommand('FPGA.Init', () => {
		// if (!terminal_ope.ensureTerminalExists("StartFPGA")) {
		// 	if (!StartFPGA_flag) {			
		// 		StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
		// 		StartFPGA.show(true);
		// 		StartFPGA.sendText(`python ${tool_path}/.Script/start.py fpga`);
		// 		StartFPGA_flag = true;
		// 	}
		// }
		if (!getFolder.ensureExists(`${workspace_path}.vscode/Property.json`)) {
			getFolder.pushJsonInfo(`${workspace_path}.vscode/Property.json`,fpgaparam);
		}
		findDevice(root_path,workspace_path);
		getFolder.updateFolder(root_path,workspace_path);
	});
	context.subscriptions.push(Init);
    let Update = vscode.commands.registerCommand('FPGA.Update', () => {
		getFolder.updateFolder(root_path,workspace_path);
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

	let additionDevice = vscode.commands.registerCommand('FPGA.addDevice', () => {
		addDevice(root_path);
    });
	context.subscriptions.push(additionDevice);
	let delDevice = vscode.commands.registerCommand('FPGA.delDevice', () => {
		deleteDevice(root_path);
    });
	context.subscriptions.push(delDevice);

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
	let Add_bd = vscode.commands.registerCommand('FPGA.Add bd_file', () => {
		let Property_param = getFolder.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
		let bd_folder = `${tool_path}/Xilinx/IP/Example_bd/`;
		vscode.window.showInputBox({
			password:false, 
			ignoreFocusOut:true,
			placeHolder:'Please input the name of bd_file', }).then(function(bd_file) {
			let bd_list = Property_param.properties.SOC_MODE.properties.bd_file.enum;
			if (bd_list.find(function(value) {
				if(value === bd_file) {
					return false;
				}
				else{
					return true;
				}
			})) {		
				bd_list.push(bd_file);
				getFolder.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
				const bd_path = bd_folder + bd_file + '.bd';
				getFolder.writeFile(bd_path,"\n\n");
				vscode.window.showInformationMessage(`generate the ${bd_file} successfully!!!`);
				const options = {
					preview: false,
					viewColumn: vscode.ViewColumn.Active
				};
				vscode.window.showTextDocument(vscode.Uri.file(bd_path), options);
			}
			else {
				vscode.window.showWarningMessage(`The ${bd_file} already exists`)
			}
		});
    });
	context.subscriptions.push(Add_bd);
	let Delete_bd = vscode.commands.registerCommand('FPGA.Delete bd_file', () => {
		vscode.window.showQuickPick(getFolder.pick_file(`${tool_path}/Xilinx/IP/Example_bd`,".bd")).then(selection => {
		  	// the user canceled the selection
			if (!selection) {
				return;
			}
			// the user selected some item. You could use `selection.name` too
			const bd_path = `${tool_path}/Xilinx/IP/Example_bd/` + selection;
			getFolder.deleteFile(bd_path);
			vscode.window.showInformationMessage(`delete the ${selection} successfully!!!`);
		});
    });
    context.subscriptions.push(Delete_bd);
}
exports.register = register;
