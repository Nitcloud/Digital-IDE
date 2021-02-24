var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const tree   = require("./tree");
const utils  = require("./utils");
const parse  = require("./parse");
// const SerialPort = require('serialport');
const vscode = require("vscode");
const child  = require("child_process");

let gtkwaveInstallPath = vscode.workspace.getConfiguration().get('TOOL.gtkwave.install.path');



/* 前端开发辅助功能 */


/* 仿真功能 */
class iverilogOperation {
    constructor() {
        vscode.workspace.onDidChangeConfiguration(function () {
            this.getConfig();
        });
        this.parse    = new parse.HDLParser();
        this.file     = new utils.fileOperation();
        this.array    = new utils.arrayOperation();
        this.folder   = new utils.folderOperation();
        this.property = new utils.refreshProperty();
    }
    getConfig() {
        this.installPath  = vscode.workspace.getConfiguration().get('TOOL.iVerilog.install.path');
        this.runFilePath  = vscode.workspace.getConfiguration().get('HDL.linting.runFilePath');
        this.iverilogArgs = vscode.workspace.getConfiguration().get('HDL.linting.iverilog.arguments');
    }
    lint(doc) {
        var lastIndex = doc.uri.fsPath.replace(/\\/g,"\/");
        var docFolder = doc.uri.fsPath.substr(0, lastIndex); 
        var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode.workspace.opeParam.rootPath; //choose correct location to run
        var svArgs = (doc.languageId == "systemverilog") ? "-g2012" : ""; //SystemVerilog args
        var command = 'iverilog ' + svArgs + ' -t null ' + this.iverilogArgs + ' \"' + doc.fileName + '\"'; //command to execute
        // this.logger.log(command, Logger.Log_Severity.Command);
        child.exec(command, { cwd: runLocation }, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stderr.split(/\r?\n/g);
            // Parse output lines
            lines.forEach(function (line, i) {
                if (line.startsWith(doc.fileName)) {
                    line = line.replace(doc.fileName, '');
                    var terms = line.split(':');
                    var lineNum = parseInt(terms[1].trim()) - 1;
                    if (terms.length == 3) {
                        diagnostics.push({
                            severity: vscode.DiagnosticSeverity.Error,
                            range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[2].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                    else if (terms.length >= 4) {
                        var sev = void 0;
                        if (terms[2].trim() == 'error')
                            sev = vscode.DiagnosticSeverity.Error;
                        else if (terms[2].trim() == 'warning')
                            sev = vscode.DiagnosticSeverity.Warning;
                        else
                            sev = vscode.DiagnosticSeverity.Information;
                        diagnostics.push({
                            severity: sev,
                            range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[3].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                }
            });
            this.logger.log(diagnostics.length + ' errors/warnings returned');
            this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    }
    simulate() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // 获取运行时的路径
        if (this.runFilePath == "") {
            this.runFilePath = `${opeParam.workspacePath}prj/simulation/iVerilog`
            this.folder.mkdir(this.runFilePath);
        }

        // 获取运行工具的路径
        let vvpPath      = "vvp";
        let gtkwavePath  = "gtkwave";
        let iVerilogPath = "iverilog";
        if (this.installPath != "") {
            vvpPath = iVerilogInstallPath + "vvp.exe";
            iVerilogPath = iVerilogInstallPath + "iverilog.exe";
        }
        if (gtkwaveInstallPath != "") {
            gtkwavePath = gtkwaveInstallPath + "gtkwave.exe";
        }

        // 获取对应厂商的仿真库路径
        let LibPath = "";
        let GlblPath = "";
        let simLibRootPath = "";
        if (opeParam.propertyPath != '') {
            if (this.property.getFpgaVersion(opeParam.propertyPath) == "xilinx") {					
                simLibRootPath = vscode.workspace.getConfiguration().get('TOOL.xilinx.install.path');
                if (simLibRootPath != "") {                
                    simLibRootPath = simLibRootPath + "/Vivado/2018.3/data/verilog/src";
                    GlblPath = simLibRootPath + "/glbl.v ";
                    LibPath  = "-y " + simLibRootPath + "/xeclib ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unisims ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unimacro ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unifast ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/retarget ";
                } else {
                    vscode.window.showInformationMessage("TOOL.xilinx.install.path is empty");
                }
            }
        }

        // 获取当前文件的模块名和模块数
        let moduleNameList = [];
        HDLparam.forEach(element => {
            if (element.modulePath == editor.document.fileName) {
                moduleNameList.push(element.moduleName);
            }
        });
        if (moduleNameList.length != 0) {
            // 选择要仿真的模块
            let simModuleName = '';
            if (moduleNameList.length >= 2) {
                vscode.window.showInformationMessage("There are multiple modules, please select one of them");
                simModuleName = __awaiter(this, void 0, void 0, function* () {
                    vscode.window.showQuickPick(moduleNameList).then(selection => {
                        if (!selection) {
                            return null;
                        } else {
                            return selection;
                        }
                    });
                });
            }
            else {
                simModuleName = moduleNameList[0];
            }
            let rtlFilePath  = "";
            let iverilogPath = "";
            iverilogPath = opeParam.workspacePath + "prj/simulation/iVerilog/" + simModuleName;
            iverilogPath = editor.document.fileName;                    

            // 获取所有例化模块所在文件的路径
            let instmoduleFilePathList = [];
            HDLparam.forEach(unitModule => {     
                if (unitModule.moduleName == simModuleName) {
                    unitModule.instmodule.forEach(instanceModule => {
                        instmoduleFilePathList.push(instanceModule.instModPath);
                    });
                }          
            });
            instmoduleFilePathList = this.array.removeDuplicates(instmoduleFilePathList);
            instmoduleFilePathList.forEach(element => {
                rtlFilePath = rtlFilePath + element + " ";
            });
        
            let command = `${iVerilogPath} -g2012 -o ${iverilogPath} ${editor.document.fileName} ${rtlFilePath} ${GlblPath} ${LibPath}`;

            let waveImagePath = this.parse.getWaveImagePath(editor.document.text);
            child.exec(command, { cwd: this.runFilePath }, function (error, stdout, stderr) {
                vscode.window.showInformationMessage(stdout);
                if (error !== null) {
                    vscode.window.showErrorMessage(stderr);
                } else {
                    vscode.window.showInformationMessage("iVerilog simulates successfully!!!");
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
        else {
            vscode.window.showWarningMessage("There is no module in this file")
        }
    }
}
exports.iverilogOperation = iverilogOperation;

/* 后端开发辅助功能 */

class fpgaRegister {
    constructor (context) {
        this.StartFPGA = null;
        this.StartFPGA_flag = false;

        this.context = context;

        this.json      = new utils.jsonOperation();
        this.file      = new utils.fileOperation();
        this.array     = new utils.arrayOperation();
        this.folder    = new utils.folderOperation();
        this.property  = new utils.refreshProperty();
        this.terminal  = new utils.terminalOperation();
        this.xilinxOpe = new utils.xilinxFileExplorer();

        // this.rootPath      = opeParam.rootPath;
        // this.propertyPath  = opeParam.propertyPath;
        // this.workspacePath = opeParam.workspacePath;
        var _this = this;
        vscode.window.onDidCloseTerminal(function (terminal) {
            if (terminal.name == "StartFPGA") {
                _this.StartFPGA_flag = false;
                _this.xilinxOpe.xclean(opeParam.workspacePath,"none");
                _this.xilinxOpe.move_xbd_xIP(opeParam.workspacePath,opeParam.propertyPath);
                vscode.window.showInformationMessage("Terminal Closed, name: " + terminal.name);
            }
        });

        this.Register(this.context);
    }
    Init() {
        if (opeParam.propertyPath != "") {
            this.property.updatePrjInfo(opeParam.rootPath, opeParam.propertyPath);
            this.property.updateFolder(opeParam.rootPath, opeParam.workspacePath, opeParam.propertyPath);
            if (!this.terminal.ensureTerminalExists("StartFPGA")) {
                this.StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
            }
            if (!this.StartFPGA_flag) {			
                this.StartFPGA.show(true);
                if (this.property.getFpgaVersion(opeParam.propertyPath) == "xilinx") {					
                    this.StartFPGA.sendText(`vivado -mode tcl -s ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/Vivado/Run.tcl -notrace -nolog -nojournal`);
                }
                this.StartFPGA_flag = true;
            }
        }
    }
    Update() {
        if (this.StartFPGA_flag == true) {			
			this.property.updateFolder(opeParam.rootPath,opeParam.workspacePath,opeParam.propertyPath);
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`update`);
		}
    }
    Top() {
        if (this.StartFPGA_flag == true) {			
			if (this.property.getFpgaVersion(opeParam.propertyPath) == "xilinx") {	
				let editor = vscode.window.activeTextEditor;
				if (!editor) {
					return;
				}
                parse.HDLparam.forEach(element => {
                    if ( element.modulePath == editor.document.fileName ) {
                        moduleNameList.push(element.moduleName);
                    }
                });
				if (moduleNameList == null) {
					vscode.window.showWarningMessage("there is no module here")
				} else {
					if (moduleNameList.length > 1) {
						vscode.window.showQuickPick(moduleNameList).then(selection => {
							if (!selection) {
								return;
							}
							this.StartFPGA.sendText(`set_property top ${selection} [current_fileset]`);
						});
					} else {
						this.StartFPGA.sendText(`set_property top ${moduleNameList[0]} [current_fileset]`);
					}
				}
			}
		}
    }
    Build() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`build`);
		}
    }
    Synth() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`synth`);
		}
    }
    Impl() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`impl`);
		}
    }
    Gen_Bit() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`bits`);
		}
    }
    Program() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA.show(true);
			this.StartFPGA.sendText(`program`);
		}
    }
    GUI() {
        if (this.StartFPGA_flag == true){
			this.StartFPGA_flag = false;
			this.StartFPGA.sendText(`gui`);
			this.StartFPGA.hide();
        } else {
            this.property.updatePrjInfo(opeParam.rootPath,opeParam.propertyPath);
            this.property.updateFolder(opeParam.rootPath, opeParam.workspacePath, opeParam.propertyPath);
            if (!this.terminal.ensureTerminalExists("StartFPGA")) {
                this.StartFPGA = vscode.window.createTerminal({ name: 'StartFPGA' });
            }	
            this.StartFPGA.show(true);
            this.StartFPGA_flag = false;
            if (this.property.getFpgaVersion(opeParam.propertyPath) == "xilinx") {					
                this.StartFPGA.sendText(`vivado -mode gui -s ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/Vivado/Run.tcl -notrace -nolog -nojournal`);
            }
        }
    }
    Exit() {
        this.StartFPGA_flag = false;
		this.StartFPGA.show(true);
		this.StartFPGA.sendText(`exit`);
		this.xilinxOpe.xclean(opeParam.workspacePath,"none");
		this.xilinxOpe.move_xbd_xIP(opeParam.workspacePath,opeParam.propertyPath);
    }
    Register(context) {
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Init', () => {
            this.Init();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Update', () => {
            this.Update();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Top', () => {
            this.Top();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Build', () => {
            this.Build();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Synth', () => {
            this.Synth();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Impl', () => {
            this.Impl();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Gen_Bit', () => {
            this.Gen_Bit();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Program', () => {
            this.Program();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.GUI', () => {
            this.GUI();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.exit', () => {
            this.Exit();
        }));
        
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Overwrite_bd', () => {
            this.Overwrite_bd();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Add_bd', () => {
            this.Add_bd();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('FPGA.Delete_bd', () => {
            this.Delete_bd();
        }));
    }
}
exports.fpgaRegister = fpgaRegister;

/* soc开发辅助 */

class socRegister {
    constructor (context) {
        this.StartSDK = null;

        this.context = context;

        this.json      = new utils.jsonOperation();
        this.file      = new utils.fileOperation();
        this.array     = new utils.arrayOperation();
        this.folder    = new utils.folderOperation();
        this.property  = new utils.refreshProperty();
        this.terminal  = new utils.terminalOperation();
        this.xilinxOpe = new utils.xilinxFileExplorer();

        // this.rootPath      = opeParam.rootPath;
        // this.propertyPath  = opeParam.propertyPath;
        // this.workspacePath = opeParam.workspacePath;

        this.Register(this.context);
    }
    SDK_Init() {
        if (this.property.getSocMode(opeParam.propertyPath)) {
			if (this.terminal.ensureTerminalExists("this.StartSDK")) {
				this.StartSDK.show(true);		
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
			}
			else {
				this.StartSDK = vscode.window.createTerminal({ name: 'this.StartSDK' });
				this.StartSDK.show(true);
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_create_prj.tcl`);
			}
			this.xilinxOpe.xclean(opeParam.workspacePath,"none");
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}
    }
    SDK_Build() {
        if (this.property.getSocMode(opeParam.propertyPath)) {
			if (this.terminal.ensureTerminalExists("this.StartSDK")) {
				this.StartSDK.show(true);		
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
			}
			else {
				this.StartSDK = vscode.window.createTerminal({ name: 'this.StartSDK' });
				this.StartSDK.show(true);
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Build.tcl`);
			}
			this.xilinxOpe.xclean(opeParam.workspacePath,"none");
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}	
    }
    SDK_Download() {
        if (this.property.getSocMode(opeParam.propertyPath)){
			if (this.terminal.ensureTerminalExists("this.StartSDK")) {
				this.StartSDK.show(true);
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
			}
			else {
				this.StartSDK = vscode.window.createTerminal({ name: 'this.StartSDK' });
				this.StartSDK.show(true);
				this.StartSDK.sendText(`xsct ${opeParam.rootPath}/.TOOL/Xilinx/Script/Xilinx_TCL/SDK/xsct_Download.tcl`);
			}
			this.xilinxOpe.xclean(opeParam.workspacePath,"none");
		} else {
			vscode.window.showWarningMessage("Please confirm the mode of soc");
		}
    }
    Register(context) {
        context.subscriptions.push(vscode.commands.registerCommand('SDK.Init', () => {
            this.SDK_Init();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('SDK.Build', () => {
            this.SDK_Build();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('SDK.Download', () => {
            this.SDK_Download();
        }));
    }
}
exports.socRegister = socRegister;

/* 调试开发辅助功能 */

class toolRegister {
    constructor (context) {
        this.context = context;
        this.property  = new utils.refreshProperty();
        this.xilinxOpe = new utils.xilinxFileExplorer();
        this.Register(this.context);
    }
    serialPortTerminal(serialPortName,command) {
        if (this.terminal.ensureTerminalExists(`${serialPortName}`)) {
            vscode.window.showWarningMessage('This serial port number is in use!');
        }
        else {
            let serialPort = vscode.window.createTerminal({ name: `${serialPortName}` });
            serialPort.show(true);
            serialPort.sendText(command);
        }
    }
    runSerialPort(command,) {
        exec(command,function (error, stdout, stderr) {
            let content = stdout.replace(/\s*/g,'');
            let SerialPortList = content.split("-");
            let Parity    = vscode.workspace.getConfiguration().get('TOOL.SerialPortMonitor.Parity');
            let BaudRate  = vscode.workspace.getConfiguration().get('TOOL.SerialPortMonitor.BaudRate');
            let DataBits  = vscode.workspace.getConfiguration().get('TOOL.SerialPortMonitor.DataBits');
            let StopBits  = vscode.workspace.getConfiguration().get('TOOL.SerialPortMonitor.StopBits');
            let porteries = `${BaudRate} ${DataBits} ${StopBits} ${Parity}`;
            if (SerialPortList[0] == "none") {
                vscode.window.showWarningMessage("Not found any serial port !");
            }
            if (SerialPortList[0] == "one") {
                porteries = SerialPortList[1] + " " + porteries;
                let command = `python ${opeParam.rootPath}/.TOOL/.Script/Serial_Port.py runthread ${porteries}`;
                serialPortTerminal(SerialPortList[1],command);
            }
            if (SerialPortList[0] == "multiple") {
                SerialPortList.splice(0,1);
                vscode.window.showQuickPick(SerialPortList).then(selection => {
                    if (!selection) {
                        return;
                    }
                    porteries = selection + " " + porteries;
                    let command = `python ${opeParam.rootPath}/.TOOL/.Script/Serial_Port.py runthread ${porteries}`;
                    serialPortTerminal(selection,command);
                });
            }
            if (error !== null) {
                vscode.window.showErrorMessage(error);
            }
        });
    }
    genBootLoadFile() {
        this.xilinxOpe.xbootgenerate(opeParam.workspacePath,opeParam.rootPath);
    }
    clean() {
        this.xilinxOpe.move_xbd_xIP(opeParam.workspacePath,opeParam.propertyPath);
        this.xilinxOpe.xclean(opeParam.workspacePath,"all");
    }
    serialPort() {
        let command = `python ${opeParam.rootPath}/.TOOL/.Script/Serial_Port.py getCurrentPort`;
        runSerialPort(command,opeParam.rootPath);
    }
    genProperty() {
        this.property.generatePropertypath(opeParam.workspacePath);
    }
    Register(context) {
        context.subscriptions.push(vscode.commands.registerCommand('TOOL.Gen_BOOT', () => {
            this.genBootLoadFile();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('TOOL.Clean', () => {
            this.clean();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('TOOL.Gen_Property', () => {
            this.genProperty();
        }));
        context.subscriptions.push(vscode.commands.registerCommand('TOOL.SerialPort', () => {
            this.serialPort();
        }));
    }
}
exports.toolRegister = toolRegister;