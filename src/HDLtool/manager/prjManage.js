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
        'Simulate', 'simGUI', 'simCLI',
        'Program', 'Refresh',  
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

    // tool manage register
    const toolFuncs = [
        'Clean'
    ];
    for (let i = 0; i < toolFuncs.length; i++) {
        const fun = toolFuncs[i];
        vscode.commands.registerCommand(`TOOL.${fun}`, () => {
            toolManage[fun.toLowerCase()]();
        });
    }

    // TODO
    // vscode.window.onDidCloseTerminal((terminal) => {
    //     if (terminal.name == "HardWare") {
    //         toolManage.clean();
    //     }
    // });

    // TODO
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

        vscode.commands.registerCommand('TOOL.generate.property', () => {
            this.generate();
        });
        vscode.commands.registerCommand('TOOL.overwrite.property', () => {
            this.overwrite();
        });
    }

    /**
     * @state finish-test
     * @descriptionCn 重写默认的prpoerty.json文件
     */
    overwrite() {
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
    generate() {
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
    getOpeParam() {
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
    getPropertyInfo() {
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
        if (fs.files.isHasAttr(opeParam.prjInfo, "ARCH")) {
            
        } else {
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

    processPath(path) {
        
    }

    /**
     * @descriptionCn 根据工程配置信息刷新工程文件结构
     */
    async refreshPrjFolder() {
        // 无工程配置文件则直接退出
        if (!opeParam.prjInfo) {
            return;
        }

        // 如果是用户配置文件结构，检查并生成相关文件夹
        if (opeParam.prjInfo.ARCH) {
            fs.dirs.mkdir(opeParam.prjInfo.ARCH.PRJ_Path);

            const hardware = opeParam.prjInfo.ARCH.Hardware;
            const software = opeParam.prjInfo.ARCH.Software;

            if (hardware) {
                fs.dirs.mkdir(hardware.src);
                fs.dirs.mkdir(hardware.sim);
                fs.dirs.mkdir(hardware.data);
            }

            if (software) {
                fs.dirs.mkdir(software.src);
                fs.dirs.mkdir(software.data);
            }
            return;
        }

        // 先直接创建工程文件夹
        fs.dirs.mkdir(`${opeParam.workspacePath}/prj`);

        // 初试化文件结构的路径
        const userPath = `${opeParam.workspacePath}/user`;
        const softwarePath = `${opeParam.workspacePath}/user/Software`;
        const hardwarePath = `${opeParam.workspacePath}/user/Hardware`;

        let nextmode = "PL";
        // 再对源文件结构进行创建
        if (fs.files.isHasAttr(opeParam.prjInfo, "SOC.core")) {
            if (opeParam.prjInfo.SOC.core !== 'none') {
                nextmode = "LS";
            }
        }

        let currmode = "PL";
        if (fs.files.isExist(softwarePath)) {
            currmode = "LS";
        }
        
        if (currmode == nextmode) {
            return;
        }

        if (currmode == "PL" && nextmode == "LS") {
            fs.dirs.mkdir(hardwarePath);
            fs.dirs.readdir(userPath, true, (folder) => {
                if (folder != "Hardware") {
                    fs.dirs.mvdir(`${userPath}/${folder}`, hardwarePath);
                }
            });

            fs.dirs.mkdir(`${softwarePath}/data`);
            fs.dirs.mkdir(`${softwarePath}/src`);
        }
        else if (currmode == "LS" && nextmode == "PL") {
            if (this.setting.get("PRJ.file.structure.notice")) {
                // 删除时进行提醒，yes : 删除，no : 保留
                let select = await this.warn("Software will be deleted.", 'Yes', 'No');
                if (select == "Yes") {
                    fs.dirs.rmdir(softwarePath);
                }
            } else {
                fs.dirs.rmdir(softwarePath);
            }

            if (fs.files.isExist(hardwarePath)) {
                fs.dirs.readdir(hardwarePath, true, (folder) => {
                    fs.dirs.mvdir(`${hardwarePath}/${folder}`, userPath);
                })
                
                fs.dirs.rmdir(hardwarePath);
            } 

            fs.dirs.mkdir(`${userPath}/src`);
            fs.dirs.mkdir(`${userPath}/sim`);
            fs.dirs.mkdir(`${userPath}/data`);
        }
    }

    /**
     * @descriptionCn 获取所有工程源码文件的路径
     * @returns {Array<string>} 
     */
    getPrjFiles() {
        // 获取ignore .dideignore
        let ignores = [];
        // TODO
        // const lines = fs.files.getlines(`${opeParam.workspacePath}/.dideignore`);
        // for (const line of lines) {
        //     ignores.push(fs.paths.rel2abs(opeParam.workspacePath, line));
        // }

        // 先处理好library，再启动monitor
        let files = [];
        if (opeParam.prjInfo.library) {
            // const res = opeParam.liboperation.processLibFiles(opeParam.prjInfo.library);
            // files = res.add;
        }
        
        // 获取本地的源文件
        fs.files.getHDLFiles([
            opeParam.prjInfo.ARCH.Hardware.src,
            opeParam.prjInfo.ARCH.Hardware.sim
        ], files, ignores);

        return files;
    }
}

/**
 * @state finish-untest
 * @descriptionCn 工程管理基础类
 */
class baseManage {
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
            name: name
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
 * @state finish-untest
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
            "ope"  : null,
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
     * @returns {{
     *      "tool" : "default",                     // 工具类型
     *      "path" : "path",                        // 第三方工具运行路径
     *      "ope"  : new plXilinx.xilinxOperation() // 操作类
     *      "termianl" : vscode.Terminal            // 操作终端                       
     *  }} 配置信息
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

                this.config["ope"] = new plXilinx.xilinxOperation();
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

const toolManage = {
    clean() {
        const tool = opeParam.prjInfo.TOOL_CHAIN ? opeParam.prjInfo.TOOL_CHAIN : 'xilinx';
        switch (tool) {
            case 'xilinx': this.xclean(); break;
            default: break;
        }
    },

    /**
     * 
     */
    xclean() {
        this.xmove();
        const wkSpace = opeParam.workspacePath;
        const prjPath = opeParam.prjInfo.ARCH.PRJ_Path + '/xilinx';

        fs.dirs.rmdir(prjPath); 
        fs.dirs.rmdir(`${wkSpace}/.Xil`); 

        fs.files.pickFileFromExt(wkSpace, {
            exts : [".str", ".log"],
            type : "once",
            ignores : []
        }, (file) => {
            fs.files.removeFile(file);
        });
    },

    /**
     * 
     */
    xmove() {
        const prjName = opeParam.prjInfo.PRJ_NAME.PL;
        const srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        const target_path = fs.paths.dirname(srcPath);

        const source_ip_path = `${opeParam.workspacePath}/prj/xilinx/${prjName}.srcs/source_1/ip`;
        const source_bd_path = `${opeParam.workspacePath}/prj/xilinx/${prjName}.srcs/source_1/bd`;

        fs.dirs.mvdir(source_ip_path, target_path);
        fs.dirs.mvdir(source_bd_path, target_path);
    }
}

module.exports = {
    register,
    PrjManage,
}