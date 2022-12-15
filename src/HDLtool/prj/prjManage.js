"use strict";

const vscode = require("vscode");
const fs = require("../../HDLfilesys");
const plXilinx = require("./PL/xilinx");
const psXilinx = require("./PS/xilinx");

var opeParam = require("../../param");

function register() {
    // pl manage register
    const pl = new plMarage();
    const plFuncs = [
        'Launch', 'GUI', 'Exit',
        'Synth', 'Impl', 'Bit', 'Build', 
        'Program', 'Refresh', 'Simulate', 
    ]
    for (let i = 0; i < plFuncs.length; i++) {
        const fun = plFuncs[i];
        vscode.commands.registerCommand(`HARD.${fun}`, () => {
            pl[fun.toLowerCase()]();
        });
    }

    // ps manage register
    const ps = new psMarage();
    const psFuncs = [
        'Launch', 'Build', 'Program'
    ]
    for (let i = 0; i < psFuncs.length; i++) {
        const fun = psFuncs[i];
        vscode.commands.registerCommand(`SOFT.${fun}`, () => {
            ps[fun.toLowerCase()]();
        });
    }
}

/**
 * the class of HDL file process
 * 
 */
class PrjManage {
    constructor() {
        
        this.setting = vscode.workspace.getConfiguration();
        
        this.log  = vscode.window.showInformationMessage;
        this.err  = vscode.window.showErrorMessage;
        this.warn = vscode.window.showWarningMessage;

        // All are represented in the form of library paths and no workspace paths
        // 路径形式全为扩展硬件库所在的路径
        this.oldLibFileList = [];
        this.newLibFileList = []; 

        vscode.commands.registerCommand('TOOL.Gen_Property', () => {
            this.generatePropertyFile();
        });
        vscode.commands.registerCommand('TOOL.Overwrite_InitProperty', () => {
            this.overwriteInitProperty();
        });
    }

    /**
     * @state finish-test
     * @descriptionCn 重写默认的prpoerty.json文件
     */
    overwrite(opeParam) {
        const options = {
            preview: false,
            viewColumn: vscode.ViewColumn.Active
        };
        const uri = vscode.Uri.file(opeParam.prjInitParam)
        vscode.window.showTextDocument(uri, options);
    }

    /**
     * @state finish-test
     * @descriptionCn 生成prpoerty.json文件
     * @returns true : success | false : failed
     */
    generatePropertyFile(opeParam) {
        if (fs.files.isExist(opeParam.propertyPath)) {
            this.warn("property file already exists !!!");
            return false;
        }

        const temp = fs.files.pullJsonInfo(opeParam.prjInitParam);
        fs.files.pushJsonInfo(opeParam.propertyPath, temp);
        return true;
    }

    /**
     * @state finish-test
     * @descriptionCn 预处理部分，获取扩展的全局运行参数
     * @descriptionEn preprocess get global run parameters of this extension
     * @param {Object} opeParam 全局操作参数
     * @returns {Boolean} (true : 获取成功 | false : 获取失败)
     * note: 失败说明没有打开工作区 且所有路径都是斜杠，且最后不带斜杠
     * TODO: 处理在其他工作区下只打开一个HDL文件的情况
     */
    getOpeParam(opeParam) {
        // 获取当前工作区路径
        if (vscode.workspace.workspaceFolders != undefined &&
            vscode.workspace.workspaceFolders.length != 0) {
            opeParam.workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
            opeParam.workspacePath = '';
            return false; 
        }
        opeParam.workspacePath = opeParam.workspacePath.replace(/\\/g, "\/");

        // 获取当前平台运行的系统
        opeParam.os = process.platform;

        // 获取当前根路径
        let rootPath = fs.paths.resolve(__dirname, '..', '..', '..');
        opeParam.rootPath = rootPath.replace(/\\/g, "\/");

        // 获取初始配置文件的路径
        opeParam.prjInitParam = `${opeParam.rootPath}/prjInitParam.json`;
        
        // 初始化工程参数与信息
        this.getPropertyInfo(opeParam);

        return true;
    }

    /**
     * @state finish-test
     * @descriptionCn 获取工程配置参数 (不对参数内容做深度处理)
     * @returns {Boolean} (false: 不存在工程配置文件 | true: 成功获取工程的配置参数)
     */
    getPropertyInfo(opeParam) {
        // 初始化基本参数
        opeParam.propertyPath = `${opeParam.workspacePath}/.vscode/property.json`;

        if (!fs.files.isExist(opeParam.propertyPath)) {
            opeParam.prjInfo.ARCH = {
                "PRJ_Path": opeParam.workspacePath,
                "Hardware" : {
                    "src"  : opeParam.workspacePath, 
                    "sim"  : opeParam.workspacePath,
                    "data" : opeParam.workspacePath
                },
                "Software" : {
                    "src"  : opeParam.workspacePath,
                    "data" : opeParam.workspacePath
                }
            }
            return;
        }

        // 拉取工程的配置参数
        opeParam.prjInfo = fs.files.pullJsonInfo(opeParam.propertyPath);
        if (!fs.files.isHasAttr(opeParam.prjInfo, "ARCH")) {
            let hardwarePath = `${opeParam.workspacePath}/user`;
            if (fs.files.isHasAttr(opeParam.prjInfo, "SOC.core") && 
                opeParam.prjInfo.SOC.core != 'none') {
                hardwarePath += '/Hardware';
            }
            opeParam.prjInfo.ARCH = {
                "PRJ_Path": `${opeParam.workspacePath}/prj`,
                "Hardware" : {
                    "src"  : `${hardwarePath}/src`, 
                    "sim"  : `${hardwarePath}/sim`,
                    "data" : `${hardwarePath}/data`
                },
                "Software" : {
                    "src"  : `${opeParam.workspacePath}/user/Software/src`,
                    "data" : `${opeParam.workspacePath}/user/Software/src`
                }
            }
        }

        return;
    }

    /**
     * @descriptionCn 根据工程配置信息刷新工程文件结构
     * @returns null 用于退出无工程配置信息时以及用户自定义工程结构时的情况
     */
    async refreshPrjFolder(arch) {
        
    }

    /**
     * 获取本地的src(和sim、bd)路径下的HDL文件，lib被包含在src下
     * @param {*} HDLFileList 
     */
    getPrjFiles(HDLFileList) {
        let ignores = null;
        // 当含有工程配置信息时 (才有sim和src之分)
        if (opeParam.prjInfo) {
            ignores = opeParam.prjInfo.ignores;
            // 首先获取sim路径下的HDL源文件
            this.getHDLFiles(opeParam.prjStructure.HardwareSim, HDLFileList);

            // 获取src路径下的HDL源文件 (针对 IP和bd文件下的HDL进行选择性的获取，获取后直接退出) 
            if (files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
                // 获取xilinx下bd数据
                if (opeParam.prjInfo.TOOL_CHAIN == "xilinx") {
                   this.getXilinxFiles(HDLFileList);
                }
            }
        }

        if (ignores) {
            for (let i = 0; i < ignores.length; i++) {
                ignores[i] = opeParam.workspacePath + '/' + ignores[i];
            }
        }

        // 获取src下的全部HDL文件
        let srcPath = opeParam.prjStructure.HardwareSrc;
        this.getHDLFiles(srcPath, HDLFileList, ignores);
    }
}

/**
 * @state finish-untest
 * @descriptionCn 工程管理基础类
 */
class baseManage {
    // constructor() {
        // vscode.window.onDidCloseTerminal((terminal) => {
        //     if (terminal.name == "HardWare") {
        //         _this.process.terminal = null;
        //         let prjInfo = _this.process.opeParam.prjInfo;
        //         if (!filesys.files.isHasAttr(prjInfo, "TOOL_CHAIN")) {
        //             return null;
        //         }
        //         switch (prjInfo.TOOL_CHAIN) {
        //             case "xilinx":
        //                 _this.xilinxOpe.move_bd_ip();
        //             break;
                
        //             default: break;
        //         }
        //     }
        // });

        // vscode.window.registerTerminalLinkProvider({
        //     provideTerminalLinks: (context, token)=> {
        //         if (context.line.indexOf("Exiting Vivado") != -1) {
        //             vscode.window.showInformationMessage(context.line);
        //         }
        //     },
        //     handleTerminalLink: (link)=> {
        //       vscode.window.showInformationMessage(`Link activated (data=${link.data})`);
        //     }
        // });
    // }
    /**
     * @descriptionCn 创建终端，并返回对应的属性
     * @param {String} name 终端名
     * @returns 终端属性
     */
    createTerminal(name) {
        const terminal = this.getTerminal(name);
        if (terminal) {
            return terminal;
        }

        return vscode.window.createTerminal({ 
            name: 'name' 
        });
    }

    /**
     * @descriptionCn 获取终端对应的属性
     * @param {String} name 终端名
     * @returns 终端属性
     */
    getTerminal(name) {
        for (let i = 0; i < vscode.window.terminals.length; i++) {
            const terminal = vscode.window.terminals[i];
            if (terminal.name == name) {
                return terminal;
            }
        }
        return null;
    }
}

/**
 * @descriptionCn PL端工程管理类
 * @note 一次实例，一直使用
 */
class plMarage extends baseManage {
    constructor() {
        super();
        this.set  = vscode.workspace.getConfiguration;
        this.config = {
            "tool" : 'default',
            "path" : '',
            "ope"  : new plXilinx(),
            "terminal" : null
        };

        vscode.commands.registerCommand("HARD.srcTop", (uri) => {
            this.setSrcTop(uri);
        });

        vscode.commands.registerCommand("HARD.simTop", (uri) => {
            this.setSimTop(uri);
        });
    }

    /**
     * @descriptionCn 获取PL工程管理中所需要的配置
     * @returns 配置信息 {
     *      "tool" : "default",
     *      "path" : "path",  // 第三方工具运行路径
     *      "termianl" : null
     *  }
     */
    getConfig() {
        if (fs.files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            this.config["tool"] = opeParam.prjInfo.TOOL_CHAIN;
        }

        switch (this.config["tool"]) {
            case "xilinx":
                this.config["path"] = this.set('TOOL.vivado.install').get('path');
                if (fs.dirs.isillegal(this.config["path"])) {
                    this.config["path"] = 'vivado';
                } else {
                    this.config["path"] = fs.paths.toSlash(this.config["path"]);
                    this.config["path"] += '/vivado';
                    if (opeParam.os == "win32") {
                        this.config["path"] += '.bat';
                    }
                }

                this.config["ope"] = new plXilinx();
            break;
        
            default: this.config["path"] = ""; break;
        }

        return this.config;
    }

    launch() {
        this.getConfig();
        this.config["terminal"] = this.createTerminal("Hardware");
        this.config.ope.launch(this.config);
    }

    refresh() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.refresh(this.config);
    }

    simulate() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.simulate(this.config);
    }

    build() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.build(this.config);
    }

    synth() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.synth(this.config);
    }

    impl() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.impl(this.config);
    }

    bit() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.generateBit(this.config);
    }

    program() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.ope.program(this.config);
    }

    gui() {
        this.config.ope.gui(this.config);
    }

    exit() {
        if (!this.config.terminal) {
            return null;
        }

        this.config.terminal.show(true);
        this.config.terminal.sendText(`exit`);
        this.config.terminal.sendText(`exit`);
        this.config.terminal = null;
    }

    setSrcTop(uri) {
        
    }

    setSimTop(uri) {
        
    }

    addFiles(files) {
        this.config.ope.addFiles(files, this.config);
    }

    delFiles(files) {
        this.config.ope.delFiles(files, this.config);
    }
}

/**
 * @state finish-untest
 * @descriptionCn PS端工程管理类
 * @note 一次实例，一直使用
 */
class psMarage extends baseManage {
    constructor() {
        super();
        this.set  = vscode.workspace.getConfiguration;
        this.config = {
            "tool" : 'default',
            "path" : '',
            "ope"  : new psXilinx(),
            "terminal" : null
        };
    }

    getConfig() {
        // get tool chain
        if (fs.files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            this.config["tool"] = opeParam.prjInfo.TOOL_CHAIN;
        }

        // get install path & operation object
        switch (this.config["tool"]) {
            case "xilinx":
                this.config["path"] = this.set('TOOL.xsdk.install').get('path');
                if (fs.dirs.isillegal(this.config["path"])) {
                    this.config["path"] = 'xsct';
                } else {
                    this.config["path"] = fs.paths.toSlash(this.config["path"]);
                    this.config["path"] += '/xsct';
                    if (opeParam.os == "win32") {
                        this.config["path"] += '.bat';
                    }
                }

                this.config["ope"] = new psXilinx();
            break;
        
            default: this.config["path"] = ""; break;
        }

        return this.config;
    }

    launch() {
        this.config.terminal = this.createTerminal('Software');
        this.config.ope.launch(this.config);
    }

    build() {
        this.config.terminal = this.createTerminal('Software');
        this.config.ope.build(this.config);
    }

    program() {
        this.config.terminal = this.createTerminal('Software');
        this.config.ope.program(this.config);
    }
}

module.exports = {
    register,
    PrjManage,
}