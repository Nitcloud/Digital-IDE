"use strict";

const fs = require("../../HDLfilesys");

const child  = require("child_process");
const vscode = require("vscode");
const opeParam = require("../../param");
const instance = require("./instance");
const HDLParam = require('../../HDLparser').HDLParam;

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

        this.err = vscode.window.showErrorMessage;
        this.warn = vscode.window.showWarningMessage;
        this.info = vscode.window.showInformationMessage;

        this.terminal = vscode.window.createTerminal;

        this.outputCH = vscode.window.createOutputChannel("simulate");
        this.setting  = vscode.workspace.getConfiguration();
    }

    /**
     * @descriptionCn 获取仿真的配置
     * @param {String} path 代码路径
     * @param {String} tool 仿真工具名
     * @returns {{
     *      mod : String,   // 设置的顶层模块              
     *      clk : String,   // 设置的主频信号
     *      rst : String,   // 设置的复位信号
     *      end : String,   // 
     *      wave : String,  // wave存放的路径     
     *      runPath : String, // sim运行的路径
     *      gtkwavePath : String, // gtkwave安装路径
     *      installPath : String  // 第三方仿真工具的安装路径
     * }} 仿真的配置
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
            simConfig[element] = simConfig[element] ? simConfig[element].groups[element] : null;
        }

        simConfig["runPath"] = this.setting.get('TOOL.simulate.runPath');
        simConfig["gtkwavePath"] = this.setting.get('TOOL.gtkwave.install.path');
        if (simConfig.gtkwavePath !== '' && fs.dirs.isillegal(simConfig.gtkwavePath)) {
            simConfig.gtkwavePath = 'gtkwave'; // 如果不存在则认为是加入了环境变量
        } else {
            if (this.os === 'win32') {
                simConfig.gtkwavePath += '/gtkwave.exe';
            } else {
                simConfig.gtkwavePath += '/gtkwave';
            }
        }

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

/**
 * @descriptionCn icarus 仿真类
 * 
 */
class icarus extends simulate { 
    constructor() {
        super();
        this.os = opeParam.os;
        this.prjPath = opeParam.prjInfo.ARCH.PRJ_Path;
        this.toolchain = opeParam.prjInfo.TOOL_CHAIN;
    }

    /**
     * @descriptionCn 根据要求生成 icarus 的仿真命令
     * @param {{
     *      name : String,
     *      path : String,
     *      dependences : Array<string>
     * }}
     * @returns 
     */
    getCommand(param) {
        this.simConfig = this.getConfig(param.path, 'iverilog');
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
        param.dependences.forEach(element => {
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

        return `${icarusPath} ${argu} -o ${this.simConfig.runPath}/out.vvp -s ${param.name} ${param.path} ${dependencePath} ${thirdLibPath}`
    }

    exec(command) {
        var _this = this;
        child.exec(command, { cwd: this.simConfig.runPath }, function (error, stdout, stderr) {
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
                    vvp = _this.terminal({ name: 'vvp' });
                }
                
                let cmd = `${vvpPath} ${_this.simConfig.runPath}/out.vvp`;
                if (_this.simConfig.wave != '') {
                    let waveExtname = _this.simConfig.wave.split('.');
                    cmd = `${vvpPath} ${_this.simConfig.runPath}/out.vvp -${waveExtname[_this.simConfig.wave.length-1]}`;
                }

                vvp.show(true);
                vvp.sendText(cmd);
                if (_this.simConfig.wave != '') {
                    vvp.sendText(`${_this.simConfig.gtkwavePath} ${_this.simConfig.wave}`);
                } else {
                    _this.warn("There is no wave image path in this testbench");
                }
            }
        });
    }

    simulate(uri) {
        const param = {
            path : fs.paths.toSlash(uri.fsPath)
        };
        if (uri.name) {
            param.name = uri.name;
            param.dependences = HDLParam.getAllDependences(
                param.path,
                param.name
            ).others;
            this.exec(this.getCommand(param));
        } else {
            const items = instance.getSelectItem(HDLParam.findModuleByPath(param.path));
            if (items.length) {
                if (items.length == 1) {
                    param.name = items[0].module.name;
                    param.dependences = HDLParam.getAllDependences(
                        param.path,
                        param.name
                    ).others    ;
                    this.exec(this.getCommand(param));
                } else {
                    vscode.window.showQuickPick(items, option).then((select) => {
                        param.name = select.module.name;
                        param.dependences = HDLParam.getAllDependences(
                            param.path,
                            param.name
                        ).others;
                        this.exec(this.getCommand(param));
                    }); 
                }
            } else {
                this.err('There is no module in this file');
            }
        }
    }
}
exports.icarus = icarus;


