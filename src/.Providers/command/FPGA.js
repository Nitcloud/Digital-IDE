"use strict";
exports.__esModule = true;

var exec         = require('child_process').exec;
var vscode       = require("vscode");
var fspath       = require("path");

var file         = require("../file_IO/file_IO");
var module       = require("../file_IO/moduleExplorer");
var xilinxFileIO = require("../file_IO/xilinxFileExplorer");

var common       = require("../utils/common");
var terminal_ope = require("../utils/terminal");

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

    let simulate = vscode.commands.registerCommand('FPGA.Simulate', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        file.mkdir(`${workspace_path}prj/simulation/iVerilog`);

        let vvpPath = "vvp";
        let gtkwavePath = "gtkwave";
        let iVerilogPath = "iverilog";
        let gtkwaveInstallPath = vscode.workspace.getConfiguration().get('PRJ.gtkwave.install.path');
        let iVerilogInstallPath = vscode.workspace.getConfiguration().get('PRJ.iVerilog.install.path');
        if (iVerilogInstallPath != "") {
            vvpPath = iVerilogInstallPath + "vvp.exe";
            gtkwavePath = gtkwaveInstallPath + "gtkwave.exe";
            iVerilogPath = iVerilogInstallPath + "iverilog.exe";
        }

        let simLibRootPath = "";
        let GlblPath = "";
        let LibPath  = "";
        let propertyPath = file.getPropertypath(workspace_path);
        if (propertyPath != '') {            
            if (file.getFpgaVersion(propertyPath) == "xilinx") {					
                simLibRootPath = vscode.workspace.getConfiguration().get('PRJ.xilinx.install.path');
                if (simLibRootPath != "") {                
                    simLibRootPath = simLibRootPath + "/Vivado/2018.3/data/verilog/src";
                    GlblPath = simLibRootPath + "/glbl.v ";
                    LibPath  = "-y " + simLibRootPath + "/xeclib ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unisims ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unimacro ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unifast ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/retarget ";
                } else {
                    vscode.window.showInformationMessage("PRJ.xilinx.install.path is empty");
                }
            }
        }

        let verilogModuleInfoList = module.getAllModuleInfo(`${workspace_path}user`,".v");

        let content = file.readFile(editor.document.fileName);
        let moduleNameList = module.getModuleName(content);
        if (moduleNameList.length != 0) {
            if (moduleNameList.length >= 2) {
                vscode.window.showInformationMessage("There are multiple modules, please select one of them");
                vscode.window.showQuickPick(moduleNameList).then(selection => {
                    if (!selection) {
                        return;
                    }
                    let iverilogPath = workspace_path + "prj/simulation/iVerilog/" + selection;
                    let rtlFilePath = "";
                    let instanceModuleNameList = module.getInstanceModuleName(
                        module.getModuleContent(content,selection));
                    if (instanceModuleNameList != null) {                        
                        let moduleFilePathList = [];
                        instanceModuleNameList.forEach(element => {
                            let moduleFilePath = module.searchModuleFilePath(
                                element,verilogModuleInfoList);
                            moduleFilePath.forEach(element => {
                                moduleFilePathList.push(element);
                            });
                        });
                        moduleFilePathList = common.removeDuplicates(moduleFilePathList);
                        moduleFilePathList.forEach(element => {
                            rtlFilePath = rtlFilePath + element + " ";
                        });
                    }
                    let command = `${iVerilogPath} -g2012 -o ${iverilogPath} ${editor.document.fileName} ${rtlFilePath} ${GlblPath} ${LibPath}`;
                    // terminal_ope.runCmd(command);
                    exec(command,function (error, stdout, stderr) {
                        vscode.window.showInformationMessage(stdout);
                        if (error !== null) {
                            vscode.window.showErrorMessage(stderr);
                        } else {
                            vscode.window.showInformationMessage("iVerilog simulates successfully!!!");
                            let waveImagePath = module.getWaveImagePath(content);
                            if (waveImagePath != '') {
                                let waveImageExtname = waveImagePath.split('.');
                                let Simulate = vscode.window.createTerminal({ name: 'Simulate' });
                                Simulate.show(true);
                                Simulate.sendText(`${vvpPath} ${iverilogPath} -${waveImageExtname[waveImageExtname.length-1]}`);
                                let gtkwave = vscode.window.createTerminal({ name: 'gtkwave' });
                                gtkwave.show(true);
                                gtkwave.sendText(`${gtkwavePath} ${waveImagePath}`);
                            } else {
                                vscode.window.showWarningMessage("There is no wave image path in this testbench");
                            }
                        }
                    });
                });
            }
            else {
                let iverilogPath = workspace_path + "prj/simulation/iVerilog/" + moduleNameList[0];
                let rtlFilePath = "";
                let instanceModuleNameList = module.getInstanceModuleName(
                    module.getModuleContent(content,moduleNameList[0]));
                if (instanceModuleNameList != '') {                        
                    let moduleFilePathList = [];
                    instanceModuleNameList.forEach(element => {
                        let moduleFilePath = module.searchModuleFilePath(
                            element,verilogModuleInfoList);
                        moduleFilePath.forEach(element => {
                            moduleFilePathList.push(element);
                        });
                    });
                    moduleFilePathList = common.removeDuplicates(moduleFilePathList);
                    moduleFilePathList.forEach(element => {
                        rtlFilePath = rtlFilePath + element + " ";
                    });
                }
                let command = `${iVerilogPath} -g2012 -o ${iverilogPath} ${editor.document.fileName} ${rtlFilePath} ${GlblPath} ${LibPath}`;
                // terminal_ope.runCmd(command);
                exec(command,function (error, stdout, stderr) {
                    vscode.window.showInformationMessage(stdout);
                    if (error !== null) {
                        vscode.window.showErrorMessage(stderr);
                    } else {
                        vscode.window.showInformationMessage("iVerilog simulates successfully!!!");
                        let waveImagePath = module.getWaveImagePath(content);
                        if (waveImagePath != '') {
                            let waveImageExtname = waveImagePath.split('.');
                            let Simulate = vscode.window.createTerminal({ name: 'Simulate' });
                            Simulate.show(true);
                            Simulate.sendText(`${vvpPath} ${iverilogPath} -${waveImageExtname[waveImageExtname.length-1]}`);
                            let gtkwave = vscode.window.createTerminal({ name: 'gtkwave' });
                            gtkwave.show(true);
                            gtkwave.sendText(`${gtkwavePath} ${waveImagePath}`);

                        } else {
                            vscode.window.showWarningMessage("There is no wave image path in this testbench");
                        }
                    }
                });
            }         
        }
        else {
            vscode.window.showWarningMessage("There is no module in this file")
        }
    });
	context.subscriptions.push(simulate);
	let vInstance_Gen = vscode.commands.registerCommand('FPGA.instance', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		// if (terminal_ope.ensureTerminalExists("Instance")) {
		// 	Instance.sendText(`python ${tool_path}/.Script/vInstance_Gen.py ${editor.document.fileName}`);
		// 	vscode.window.showInformationMessage('Generate instance successfully!');
		// }
		// else {
		// 	Instance = vscode.window.createTerminal({ name: 'Instance' });
		// 	Instance.show(true);
		// 	Instance.sendText(`python ${tool_path}/.Script/vInstance_Gen.py ${editor.document.fileName}`);
		// 	vscode.window.showInformationMessage('Generate instance successfully!');
        // }

        let moduleName;
        let moduleNameList  = [];
        let verilogFileList = [];
        verilogFileList = file.pick_Allfile(`${workspace_path}user`,".v");
        verilogFileList.forEach(element => {
            let content;
            let verilogFilePath = element;
            content = file.readFile(verilogFilePath);
            moduleName = module.getModuleName(content);
            if (moduleName.length != 0) {
                moduleName.forEach(element => {                    
                    element = element + "    ." + verilogFilePath;
                    element = element.replace(`${workspace_path}`,"");
                    moduleNameList.push(element);
                });
            }
        });
        vscode.window.showQuickPick(moduleNameList).then(selection => {
            if (!selection) {
                return;
            }
            let modulePathList = selection.split("    .");
            let modulePath = `${workspace_path}` + modulePathList[1];
            let content = file.readFile(modulePath);
            content = module.delComment(content);
            module.instanceVerilogModule(content,modulePathList[0])
            //  editor.edit((editBuilder) => {
            //      editBuilder.replace(editor.selection, v);
            //  });
        });
    });
    context.subscriptions.push(vInstance_Gen);
    let testbench = vscode.commands.registerCommand('FPGA.testbench', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
		}
		let command = `python ${tool_path}/.Script/vTbgenerator.py ${workspace_path} ${editor.document.fileName}`;
		terminal_ope.runCmd(command);
		vscode.window.showInformationMessage(command);
    });
	context.subscriptions.push(testbench);

	let Init = vscode.commands.registerCommand('FPGA.Init', () => {
        let propertypath = file.getPropertypath(workspace_path);
        if (propertypath == ""){
            vscode.window.showInformationMessage("There is no Property.json here, where you want to generate?",'.vscode','root')
			.then(function(select){
				if (select == ".vscode") {
                    file.pushJsonInfo(`${workspace_path}.vscode/Property.json`,file.prjInitparam);
                    propertypath = `${workspace_path}.vscode/Property.json`;
				} else if (select == "root") {
                    file.pushJsonInfo(`${workspace_path}Property.json`,file.prjInitparam);
                    propertypath = `${workspace_path}Property.json`;
                }
                if (propertypath != "") {            
                    file.updatePrjInfo(root_path, propertypath);
                    file.updateFolder(root_path, workspace_path, propertypath);
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
                }
			});
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
        } else {
            file.updatePrjInfo(root_path,file.getPropertypath(workspace_path));
            file.updateFolder(root_path, workspace_path, file.getPropertypath(workspace_path));
            if (!terminal_ope.ensureTerminalExists("StartFPGA")) {
                StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
            }	
            StartFPGA.show(true);
            StartFPGA_flag = false;
            if (file.getFpgaVersion(file.getPropertypath(workspace_path)) == "xilinx") {					
                StartFPGA.sendText(`vivado -mode gui -s ${tool_path}/Xilinx/Script/Xilinx_TCL/Vivado/Run.tcl -notrace -nolog -nojournal`);
            }
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
        let bd_folder = vscode.workspace.getConfiguration().get('PRJ.xilinx.BD.repo.path')
        if ( bd_folder == "") {
            bd_folder = `${tool_path}/Xilinx/IP/Example_bd/`;
        }
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
