"use strict";
exports.__esModule = true;

var vscode       = require("vscode");
var fspath       = require("path");
var file         = require("../file_IO/file_IO");
var module       = require("../file_IO/moduleExplorer");
var xilinxFileIO = require("../file_IO/xilinxFileExplorer");
var terminal_ope = require("../command/terminal");

let StartFPGA;
let StartFPGA_flag = false;

let Instance;

function addDevice(root_path) {
	let Property_param   = file.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
	let xilinxDevicelist = Property_param.properties.Device.enum;
	vscode.window.showInputBox({
		password:false, 
		ignoreFocusOut:true,
		placeHolder:'Please input the name of device', }).then(function(Device) {

		if (xilinxDevicelist.find(function(value) {
			if(value === Device) {
				return false;
			}
			else{
				return true;
			}
		})) {		
			xilinxDevicelist.push(Device);
			file.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
			vscode.window.showInformationMessage(`Add the ${Device} successfully!!!`)
		}
		else {
			vscode.window.showWarningMessage("The device already exists")
		}
	});
}

function deleteDevice(root_path) {
	let Property_param   = file.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
	let xilinxDevicelist = Property_param.properties.Device.enum;
	vscode.window.showQuickPick(xilinxDevicelist).then(selection => {
		if (!selection) {
			return;
		}
		for(var index = 0; index < xilinxDevicelist.length; index++){
            if(selection == xilinxDevicelist[index]){
				xilinxDevicelist.splice(index,1);
            }
		}
		file.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
		vscode.window.showInformationMessage(`Delete the ${Device} successfully!!!`)
	});
}

function register(context,root_path) {
	//My FPGA Command
	let workspace_path = file.getCurrentWorkspaceFolder();
	let tool_path = `${root_path}/.TOOL`;

	let jsonWatcher = vscode.workspace.createFileSystemWatcher("**/*.json", false, false, false);
    context.subscriptions.push(jsonWatcher.onDidChange((uri) => {
		// vscode.window.showInformationMessage("changed");
		if (fspath.basename(uri.fsPath) == "Property.json") {		
			file.updateFolder(root_path,workspace_path,uri.fsPath);
			file.updatePrjInfo(root_path,uri.fsPath);
		}
	}));
	context.subscriptions.push(jsonWatcher);

	vscode.window.onDidCloseTerminal(function (terminal) {
		if (terminal.name == "StartFPGA") {
			StartFPGA_flag = false;
			xilinxFileIO.xclean(workspace_path,"none");
			xilinxFileIO.move_xbd_xIP(workspace_path,file.getPropertypath(workspace_path));
			vscode.window.showInformationMessage("Terminal Closed, name: " + terminal.name);
		}
    });

	let vInstance_Gen = vscode.commands.registerCommand('FPGA.instance', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		if (terminal_ope.ensureTerminalExists("Instance")) {
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
		terminal_ope.runCmd(command);
		vscode.window.showInformationMessage('Generate Testbench successfully!');
    });
	context.subscriptions.push(testbench);

	let Init = vscode.commands.registerCommand('FPGA.Init', () => {
		file.updatePrjInfo(root_path,file.getPropertypath(workspace_path));
		file.updateFolder(root_path, workspace_path, file.getPropertypath(workspace_path));
		if (!terminal_ope.ensureTerminalExists("StartFPGA")) {
			StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
		}
		if (!StartFPGA_flag) {			
			StartFPGA.show(true);
			if (file.getFpgaVersion(file.getPropertypath(workspace_path)) == "xilinx") {					
				StartFPGA.sendText(`vivado -mode tcl -s ${tool_path}/Xilinx/Script/Xilinx_TCL/Vivado/Run.tcl -notrace -nolog -nojournal`);
			}
			StartFPGA_flag = true;
		}
	});
	context.subscriptions.push(Init);
    let Update = vscode.commands.registerCommand('FPGA.Update', () => {
		if (StartFPGA_flag == true) {			
			file.updateFolder(root_path,workspace_path,file.getPropertypath(workspace_path));
			StartFPGA.show(true);
			StartFPGA.sendText(`update`);
		}
    });
	context.subscriptions.push(Update);
	let TOP = vscode.commands.registerCommand('FPGA.top', () => {
		if (StartFPGA_flag == true) {			
			if (file.getFpgaVersion(file.getPropertypath(workspace_path)) == "xilinx") {	
				let editor = vscode.window.activeTextEditor;
				if (!editor) {
					return;
				}
				let content = file.readFile(editor.document.fileName);
				let moduleNameList = module.getModuleName(content);
				if (moduleNameList == null) {
					vscode.window.showWarningMessage("there is no module here")
				} else {
					if (moduleNameList.length > 1) {
						vscode.window.showQuickPick(moduleNameList).then(selection => {
							if (!selection) {
								return;
							}
							StartFPGA.sendText(`set_property top ${selection} [current_fileset]`);
						});
					} else {
						StartFPGA.sendText(`set_property top ${moduleNameList[0]} [current_fileset]`);
					}
				}
			}
		}
    });
	context.subscriptions.push(TOP);
    let Sim = vscode.commands.registerCommand('FPGA.Sim', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`sim`);
		}
    });
	context.subscriptions.push(Sim);
    let Build = vscode.commands.registerCommand('FPGA.Build', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`build`);
		}
    });
	context.subscriptions.push(Build);
	let Synth = vscode.commands.registerCommand('FPGA.Synth', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`synth`);
		}
    });
	context.subscriptions.push(Synth);
	let Impl = vscode.commands.registerCommand('FPGA.Impl', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`impl`);
		}
    });
	context.subscriptions.push(Impl);
	let Gen_Bit = vscode.commands.registerCommand('FPGA.Gen_Bit', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`bits`);
		}
    });
	context.subscriptions.push(Gen_Bit);
	let Program = vscode.commands.registerCommand('FPGA.Program', () => {
		if (StartFPGA_flag == true){
			StartFPGA.show(true);
			StartFPGA.sendText(`program`);
		}
    });
	context.subscriptions.push(Program);
	let GUI = vscode.commands.registerCommand('FPGA.GUI', () => {
		if (StartFPGA_flag == true){
			StartFPGA_flag = false;
			StartFPGA.sendText(`gui`);
			StartFPGA.hide();
		}
    });
	context.subscriptions.push(GUI);
	let Exit = vscode.commands.registerCommand('FPGA.exit', () => {
		StartFPGA_flag = false;
		StartFPGA.show(true);
		StartFPGA.sendText(`exit`);
		xilinxFileIO.xclean(workspace_path,"none");
		xilinxFileIO.move_xbd_xIP(workspace_path,file.getPropertypath(workspace_path));
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
		vscode.window.showQuickPick(file.pick_file(`${tool_path}/Xilinx/IP/Example_bd`,".bd")).then(selection => {
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
		let Property_param = file.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
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
				file.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
				const bd_path = bd_folder + bd_file + '.bd';
				file.writeFile(bd_path,"\n\n");
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
		let Property_param = file.pullJsonInfo(`${root_path}/.TOOL/Property.json`);
		vscode.window.showQuickPick(file.pick_file(`${tool_path}/Xilinx/IP/Example_bd`,".bd")).then(selection => {
		  	// the user canceled the selection
			if (!selection) {
				return;
			}
			// the user selected some item. You could use `selection.name` too
			let bd_list = Property_param.properties.SOC_MODE.properties.bd_file.enum;
			for(var index = 0; index < bd_list.length;index++){
				if(selection == (bd_list[index] + '.bd')){
					bd_list.splice(index,1);
				}
			}
			file.pushJsonInfo(`${root_path}/.TOOL/Property.json`,Property_param);
			const bd_path = `${tool_path}/Xilinx/IP/Example_bd/` + selection;
			file.deleteFile(bd_path);
			vscode.window.showInformationMessage(`delete the ${selection} successfully!!!`);
		});
    });
    context.subscriptions.push(Delete_bd);
}
exports.register = register;
