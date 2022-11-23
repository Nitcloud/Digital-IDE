"use strict";

const fs = require("../../HDLfilesys");

const child   = require("child_process");
const vscode  = require("vscode");

class simulate {
    constructor() {
        this.regExp = {
            "mod"  : /\/\/ @ sim.module : (?<mod>\w+)/,
            "clk"  : /\/\/ @ sim.clk : (?<clk>\w+)/,
            "rst"  : /\/\/ @ sim.rst : (?<rst>\w+)/,
            "end"  : /#(?<end>[0-9+])\s+\$(finish|stop)/,
            "wave" : /\$dumpfile\s*\(\s*\"(?<wave>.+)\"\s*\);/,
        }

        this.xilinxLib = [
            "xeclib", "unisims" ,"unimacro" ,"unifast" ,"retarget"
        ]

        this.err = vscode.showErrorMessage;
        this.warn = vscode.showWarningMessage;
        this.info = vscode.showInformationMessage;

        this.terminal = vscode.window.createTerminal;

        this.outputCH = vscode.window.createOutputChannel("simulate");
        this.setting  = vscode.workspace.getConfiguration();
    }

    /**
     * @descriptionCn 获取仿真的配置
     * @param {String} path 代码路径
     * @param {String} tool 仿真工具名
     * @returns 仿真的配置
     */
    getConfig(path, tool) {
        let simConfig = {};
        let code = fs.files.readFile(path);
        if (!code) {
            this.err(`${path} read faile`);
            return null;
        }

        for (const element in this.regExp) {
            simConfig[element] = code.match(this.regExp[element]);
            simConfig[element] = simConfig[element].groups[element];
        }

        simConfig["runPath"] = this.setting.get('HDL.linting.runPath');

        // 确保安装路径有效
        simConfig["installPath"] = this.setting.get(`TOOL.${tool}.install.path`);
        if (simConfig.installPath !== '' && fs.dirs.isillegal(simConfig.installPath)) {
            this.err(`${tool} install path is illegal`);
            return null;
        }

        return simConfig
    }

    /**
     * @descriptionCn 获取自带仿真库的路径
     * @param {String} toolchain 
     * @returns {Array} 所有第三方仿真库的路径数组
     */
    getLibArr(toolchain) {
        let libPath = [];

        // 获取xilinx的自带仿真库的路径
        if (toolchain === "xilinx") {
            let rootPaths = this.setting.get('SIM.Xilinx.LIB.path');

            if (rootPaths != "") {
                return [];
            }
            libPath.push(`${rootPaths}/glbl.v`);
            for (let i = 0; i < this.xilinxLib.length; i++) {
                const element = this.xilinxLib[i];
                libPath.push(`${rootPaths}/${element}`);
            }

            return libPath;
        }
    }
}

class icarus extends simulate {
    
    /**
     * @descriptionCn icarus 仿真类
     * @param {Object} param 
     * {
     *      "name" : "moduleName", // 顶层模块名
     *      "path" : "modulePath", // 顶层仿真文件所在的绝对路径(斜杠分割)
     *      "dependence" : [],           // 顶层文件仿真时所需要的依赖
     *      "opeParam" : null      // 全局操作参数
     *  }
     */
    constructor(param) {
        this.os = param.opeParam.os;
        this.prjPath = param.opeParam.prjStructure.prjPath;
        this.toolchain = param.opeParam.prjInfo.TOOL_CHAIN;
    }

    /**
     * @descriptionCn 根据要求生成 icarus 的仿真命令
     * @returns 
     */
    getCommand() {
        this.simConfig = this.getConfig(this.param.path, 'iverilog');
        if (!this.simConfig) {
            return null;
        }

        // 获取并保证工具执行路径的有效
        let icarusPath = 'iverilog';
        let vvpPath = 'vvp';
        if (this.os === 'win32') {
            vvpPath += '.exe'
            icarusPath += '.exe';
        }
        
        if (this.simConfig.installPath !== '') {
            vvpPath = `${this.simConfig.installPath}/${vvpPath}`;
            icarusPath = `${this.simConfig.installPath}/${icarusPath}`;
        }

        // 获取并保证运行路径的有效
        if (fs.dirs.isillegal(this.simConfig.runPath)) {
            if (this.simConfig.runPath === '') {
                this.simConfig.runPath =  `${this.prjPath}/simulation/icarus`;
            }
            if (!fs.dirs.mkdir(this.simConfig.runPath)) {
                this.err(`icarus runPath mkdir faile`);
                return null;
            }
        }

        // 获取 dependence path 
        let dependencePath = ' ';
        this.param.dependence.forEach(element => {
            this.outputCH.appendLine(`${element} \n`);
            dependencePath += element + " ";
        });

        // 获取 third lib path
        let thirdLibPath = ' ';
        this.getLibArr(this.toolchain).forEach(element => {
            if(fs.dirs.isillegal(element)) {
                thirdLibPath += element + " ";
            } else {
                thirdLibPath += `-y ${element}`;
            }
        })

        let argu = '-g2012'

        return `${icarusPath} ${argu} -o ${this.simConfig.runPath}/out.vvp -s ${this.param.name} ${this.param.path} ${dependencePath} ${thirdLibPath}`
    }

    exec() {
        var _this = this;
        child.exec(this.getCommand, { cwd: this.simConfig.runPath }, function (error, stdout, stderr) {
            _this.info(stdout);
            if (error !== null) {
                stderr = "ERROR From iverilog : \n\n" + stderr;
                _this.outputCH.appendLine(`${stderr}`);
                _this.outputCH.appendLine("//********** iverilog log **********//\n");
                _this.outputCH.show(true);
                _this.err(stderr);
            } else {
                _this.outputCH.appendLine("iVerilog simulates successfully!!!\n");
                _this.outputCH.appendLine("//********** iverilog log **********//\n\n");
                _this.info("iVerilog simulates successfully!!!");

                let Exists_flag = false;
                var vvp = null;

                vscode.window.terminals.forEach(element => {
                    if (element.name == "vvp") {
                        vvp = element;
                        Exists_flag = true;
                        return;
                    }
                });

                if (!Exists_flag) {
                    vvp = vscode.window.createTerminal({ name: 'vvp' });
                }
                
                if (waveImagePath != '') {
                    let waveImageExtname = waveImagePath.split('.');
                    cmd = `${vvpPath} ${currentOutFilePath}/out.vvp -${waveImageExtname[waveImageExtname.length-1]}`;
                } else {
                    cmd = `${vvpPath} ${currentOutFilePath}/out.vvp`;
                }
                vvp.show(true);
                vvp.sendText(cmd);
                if (waveImagePath != '') {
                    vvp.sendText(`${gtkwavePath} ${waveImagePath}`);
                } else {
                    vscode.window.showWarningMessage("There is no wave image path in this testbench");
                }
            }
        });
    }
}
exports.icarus = icarus;


