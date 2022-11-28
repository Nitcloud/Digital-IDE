"use strict";

const vscode = require("vscode");
const fs = require("../../HDLfilesys");

var opeParam = require("../../param");
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
     * @descriptionCn 重写prpoerty.json文件
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
        opeParam.rootPath = opeParam.rootPath.replace(/\\/g, "\/");

        // 获取初始配置文件的路径
        opeParam.prjInitParam = `${opeParam.rootPath}/prjInitParam.json`;
        
        // 初始化工程参数与信息
        this.getPropertyInfo();

        return true;
    }

    /**
     * @state finish-test
     * @descriptionCn 获取工程配置参数 (不对参数内容做深度处理)
     * @returns {Boolean} (false: 不存在工程配置文件 | true: 成功获取工程的配置参数)
     */
    getPropertyInfo(opeParam) {
        // 初始化基本参数
        opeParam.prjInfo = null;
        opeParam.propertyPath = `${opeParam.workspacePath}/.vscode/property.json`;

        if (!fs.files.isExist(opeParam.propertyPath)) {
            return false;
        }

        // 拉取工程的配置参数
        opeParam.prjInfo = fs.files.pullJsonInfo(opeParam.propertyPath);

        // 获取用户自定义的工程结构
        if (files.isHasValue(opeParam.prjInfo, "PRJ_STRUCTURE", "customer")) {
            for (const key in opeParam.prjStructure) {
                let element = opeParam.prjStructure[key];
                element = fs.paths.replace('${workspace}', element);
                // 并对用户自定义的路径进行检查
                if (fs.dirs.isillegal(element)) {
                    this.err(`${element} is illegal(dont exist or not dir)`)
                    return false
                }
            }
            return true;
        }

        // 根据片上系统的类型获取标准工程结构
        opeParam.prjStructure.prjPath = `${opeParam.workspacePath}/prj`;

        // 先默认无soc
        let srcPath = `${opeParam.workspacePath}/user`;
        if(fs.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.soc")) {
            if (opeParam.prjInfo.SOC_MODE.soc !== "none") {
                srcPath = `${opeParam.workspacePath}/user/Hardware`;
                opeParam.prjStructure.SoftwareSrc  = `${opeParam.workspacePath}/user/Software/src`;
                opeParam.prjStructure.SoftwareData = `${opeParam.workspacePath}/user/Software/data`;
            }
        }

        // 如果不存在或者为none的时候就是无soc的情况
        opeParam.prjStructure.HardwareSrc  = `${srcPath}/src`;
        opeParam.prjStructure.HardwareSim  = `${srcPath}/sim`;
        opeParam.prjStructure.HardwareData = `${srcPath}/data`;

        return true;
    }

    /**
     * @descriptionCn 根据工程配置信息刷新工程文件结构
     * @returns null 用于退出无工程配置信息时以及用户自定义工程结构时的情况
     */
    async refreshPrjFolder(opeParam) {
        // 无工程配置文件则直接退出
        if (!opeParam.prjInfo) {
            return null;
        }

        // 如果是用户配置文件结构？
        if (fs.files.isHasValue(opeParam.prjInfo, "PRJ_STRUCTURE", "customer")) {
            return null;
        }

        // 先直接创建工程文件夹
        fs.dirs.mkdir(`${opeParam.workspacePath}/prj`);

        // 再对源文件结构进行创建
        if (!fs.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.soc")) {
            return null;
        }
        
        // 初试化文件结构的路径
        let userPath = `${opeParam.workspacePath}/user`;
        let softwarePath = `${opeParam.workspacePath}/user/Software`;
        let hardwarePath = `${opeParam.workspacePath}/user/Hardware`;

        // 如果不是在soc模式下开发
        if (opeParam.prjInfo.SOC_MODE.soc == "none") {
            // 如果存在 software path 则将整个文件夹删除
            if (fs.files.isExist(softwarePath)) {
                if (this.setting.get("PRJ.file.structure.notice")) {
                    // 删除时进行提醒，yes : 删除，no : 保留
                    let select = await this.warn("Software will be deleted.", 'Yes', 'No');
                    if (select == "Yes") {
                        fs.dirs.rmdir(softwarePath);
                    }
                } else {
                    fs.dirs.rmdir(softwarePath);
                }
            }

            // 如果存在 software path 则对该文件夹下一级的所有子目录进行遍历
            // 遍历之后将每个子目录全部移动到 user path 文件夹下
            // 最后再将 hardware path 父级文件夹进行删除
            if (fs.files.isExist(hardwarePath)) {
                let elements = fs.readdirSync(hardwarePath);
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    fs.dirs.mvdir(`${hardwarePath}/${element}`, userPath);
                }
                fs.dirs.rmdir(hardwarePath);
                return null;
            } 
            
            // 如果 software path 和 hardware path 都不存在
            // 则直接在 user path 文件夹下构建 {src & sim & data}这三个子项 
            fs.dirs.mkdir(`${userPath}/src`);
            fs.dirs.mkdir(`${userPath}/sim`);
            fs.dirs.mkdir(`${userPath}/data`);
            return null;
        }

        // 如果是soc模式下开发
        // 首先构建 software path 文件夹下的 {src & data} 等子项
        dirs.mkdir(`${softwarePath}/data`);
        dirs.mkdir(`${softwarePath}/src`);

        // 在将原 user path 文件夹下的 {src & sim & data} 子项移动到 hardware path 
        dirs.mvdir(`${userPath}/src`, `${hardwarePath}/src`);
        dirs.mvdir(`${userPath}/sim`, `${hardwarePath}/sim`);
        dirs.mvdir(`${userPath}/data`, `${hardwarePath}/data`);
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

        // let hdlignores = files.readFile(opeParam.workspacePath + '/.hdlignore');
        // if (hdlignores) {
        //     let list = hdlignores.split('\n');
        //     for (let i = 0; i < list.length; i++) {
        //         const element = list[i];
        //     }
        // }

        // 获取src下的全部HDL文件
        let srcPath = opeParam.prjStructure.HardwareSrc;
        this.getHDLFiles(srcPath, HDLFileList, ignores);
    }

    addFilesInPrj(filePaths) {
        if (!this.terminal) {
            return null;
        }
        if (files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            if (opeParam.prjInfo.TOOL_CHAIN == "xilinx") {
                this.processFileInPrj(filePaths, "add_file");
            }				
        }
    }

    delFilesInPrj(filePaths) {
        if (!this.terminal) {
            return null;
        }
        if (!files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            if (opeParam.prjInfo.TOOL_CHAIN == "xilinx") {
                this.processFileInPrj(filePaths, "remove_files");
            }				
        }
    }

    processFileInPrj(filePaths, command) {
        for (let i = 0; i < filePaths.length; i++) {
            const libFileElement = filePaths[i];
            this.terminal.sendText(`${command} ${libFileElement}`);
        }
    }
}
exports.PrjManage = PrjManage;

/**
 * @descriptionCn PL端工程管理程序
 * @note 一次实例，一直使用
 */
class plMarage extends baseManage {
    getConfig() {
        this.config = {};
        if (fs.files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            this.config["tool"] = opeParam.prjInfo.TOOL_CHAIN;
        } else {
            this.config["tool"] = "default";
        }
    }
}

class baseManage {

    /**
     * @descriptionCn 创建终端，并返回对应的属性
     * @param {String} name 终端名
     * @returns 终端属性
     */
    creatTerminal(name) {
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