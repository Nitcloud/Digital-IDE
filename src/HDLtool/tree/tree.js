"use strict";

const vscode = require("vscode");

const fs = require('../../HDLfilesys');
const HDLparser = require('../../HDLparser');
const opeParam = require('../../param');
const cells = require("./cells");

const HDLParam = HDLparser.HdlParam;


function getIconPath(type, iconName) {
    return `${opeParam.rootPath}/images/svg/${type}/` + iconName + ".svg";
}

function getIconConfig(iconName) {
    return {
        light: getIconPath('light', iconName),
        dark: getIconPath('dark', iconName)
    };
}

class ArchDataItem {
    /**
     * @param {string} icon 图标
     *          - folder: [src, sim] 
     *          - top: top/current(Src/Sim)Top 
     *          - child: [cells, local, remote, verilog, systemverilog, vhdl]
     * @param {string} name 模块名，顶层或者非文件类型时为空 
     * @param {string} type 特殊
     * @param {string} fsPath 模块所在的文件的路径
     */
    constructor(icon, type, name, fsPath) {
        this.icon = icon;
        this.type = type;
        this.name = name;
        this.fsPath = fsPath;
    }
};

class ArchTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        // this.onDidChangeTreeData  = this._onDidChangeTreeData.event;

        vscode.commands.registerCommand("FILE.refresh", () => {
            this.refresh();
        });

        vscode.commands.registerCommand('FILE.openFile', (uri) => {
            if (fs.files.isExist(uri)) {
                vscode.window.showTextDocument(vscode.Uri.file(uri));
            }
        });
    }

    refresh(element) {
        if (element) {
            this._onDidChangeTreeData.fire(element);
        } else {
            this._onDidChangeTreeData.fire();
        }
    }

    /**
     * @param {ArchDataItem} element 
     * @returns {Array<ArchDataItem>}
     */
    getChildren(element) {
        if (element) {          // 如果不是根节点         
            const name = element.name;
            if (name == 'src' || name == 'sim') {
                return this.getTopModuleItemList(name);
            } else {
                return this.getInstanceItemList(element);
            }
        } else {                // 如果是根节点
            return [
                new ArchDataItem('src', 'src', 'src', ''),
                new ArchDataItem('sim', 'sim', 'sim', '')
            ];
        }
    }

    /**
     * 获取元素的项目信息
     * @param {ArchDataItem} element 
     * @returns {vscode.TreeItem}
     */
    getTreeItem(element) {
        let itemName = element.name;
        let itemChildMode = new Set(["vhdl", "systemverilog", "verilog", "remote", "cells"]);
        if (itemChildMode.has(element.icon)) {
            itemName = `${element.type}(${itemName})`;
        }

        let childArchDataItemList = this.getChildren(element);

        const treeItem = new vscode.TreeItem(
            itemName,
            childArchDataItemList.length == 0 ?
            vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Collapsed
        );

        // set children
        const childTreeItemList = [];
        for (const dataItem of childArchDataItemList) {
            const childTreeItem = this.getTreeItem(dataItem);
            childTreeItemList.push(childTreeItem);
        }
        treeItem.children = childTreeItemList;

        // set contextValue file -> simulate / netlist
        let otherMode = ["src", "sim", "File Error", "cells"];
        if (otherMode.includes(element.icon)) {
            treeItem.contextValue = 'other';
        } else {
            treeItem.contextValue = 'file';
        }

        // set tooltip
        treeItem.tooltip = element.fsPath;

        // set iconPath
        treeItem.iconPath = getIconConfig(element.icon);

        // set command
        treeItem.command = {
            title: "Open this HDL File",
            command: 'FILE.openFile',
            arguments: [element.fsPath],
        };
        return treeItem;
    }

    /**
     * @param {string} type 
     * @returns {Array<ArchDataItem>}
     */
    getTopModuleItemList(type) {

        // TODO : 在整合lib后修改这里
        const folder = opeParam.prjInfo.ARCH.Hardware[type];
        const allTopModules = HDLParam.getAllTopModules();
        const topModuleItemList = [];
        for (const mod of allTopModules) {
            if (mod.path.includes(folder)) {
                const topMuduleItem = new ArchDataItem('top',
                                                       type,
                                                       mod.name,
                                                       mod.path);
                topModuleItemList.push(topMuduleItem);
            }
        }

        // TODO : 修改默认的顶层模块的选择
        if (topModuleItemList.length > 0) {
            const defaultTopModule = topModuleItemList[0];
            const activateIcon = 'current' + type[0].toUpperCase() + type.substring(1) + 'Top';
            defaultTopModule.icon = activateIcon;
        }

        return topModuleItemList;
    }

    /**
     * 获取当前模块下的子模块
     * @param {ArchDataItem} element   父级元素
     * @returns 该父级模块下所包含的所有例化模块信息
     */
    getInstanceItemList(element) {
        let dataItemList = [];
        let localPath = opeParam.workspacePath;

        const targetModule = HDLParam.findModule(element.fsPath, element.name);
        for (const inst of targetModule.getInstances()) {
            let dataItem = new ArchDataItem('file', inst.name, inst.module.name, inst.module.path);

            if (dataItem.type == element.type &&            // 防止递归
                dataItem.name == element.name &&
                dataItem.fsPath == element.fsPath) {
                continue;
            }
            
            if (fs.files.isExist(dataItem.fsPath)) {
                if (!dataItem.fsPath.includes(localPath)) {
                    dataItem.icon = "remote";
                } else {
                    let langID = fs.files.getLanguageId(dataItem.fsPath);
                    dataItem.icon = langID;
                }
            } else {
                if (cells.xilinx.has(inst.module.name)) {
                    dataItem.icon = "cells";
                } else {
                    dataItem.icon = "File Error";
                }
            }
            dataItemList.push(dataItem);
        }
        return dataItemList;
    }
}

class CommandDataItem {
    /**
     * @param {string} name item的名字 
     * @param {string} cmd 点击item触发的操作，必须是注册进入vscode的命令 
     * @param {string} icon icon的名字，与images/dark或者images/light下的svg文件同名 
     * @param {string} tip 光标移动上去现实的提示字符 
     * @param {Array} children 子指令
     */
    constructor(name, cmd, icon, tip, children) {
        this.name = name;
        this.cmd = cmd;
        this.icon = icon;
        this.tip = tip;
        this.children = [];
        if (children) {
            this.children = children;
        }
    }
}

class BaseCommandTreeProvoder {
    constructor(config, contextValue) {
        this.config = config;
        this.contextValue = contextValue;
    }


    /**
     * 根据对象遍历属性，返回CommandDataItem数组
     * @param {*} object 
     * @returns {Array<CommandDataItem>}
     */
    makeCommandDataItem(object) {
        const childDataItemList = [];
        for (const key of Object.keys(object)) {
            const el = object[key];
            const dataItem = new CommandDataItem(key, el.cmd, el.icon, el.tip, el.children);
            childDataItemList.push(dataItem);
        }
        return childDataItemList;
    }

    /**
     * @param {CommandDataItem} element 
     * @returns {Array<CommandDataItem>}
     */
    getChildren(element) {
        if (element) {
            if (element.children) {
                return this.makeCommandDataItem(element.children);
            } else {
                return [];
            }
        } else {            // 第一层
            return this.makeCommandDataItem(this.config);
        }
    }


    /**
     * 根据输入的CommandDataItem转化为vscode.TreeItem
     * @param {CommandDataItem} element 
     * @returns {vscode.TreeItem}
     */
    getTreeItem(element) {
        const childCommandDataItemList = this.getChildren(element);
        const treeItem = new vscode.TreeItem(
            element.name,
            childCommandDataItemList.length == 0 ?
            vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Collapsed
        );
        treeItem.contextValue = this.contextValue;
        treeItem.command = element.cmd
        treeItem.tooltip = element.tip;

        if (childCommandDataItemList.length == 0) {
            treeItem.iconPath = getIconConfig(element.icon);
        } else {
            treeItem.iconPath = getIconConfig('toolBox');
        }

        let childTreeItemList = [];
        for (const dataItem of childCommandDataItemList) {
            const childTreeItem = this.getTreeItem(dataItem);
            childTreeItemList.push(childTreeItem);
        }

        treeItem.children = childTreeItemList;
        return treeItem;
    }
};

class HardwareTreeProvider extends BaseCommandTreeProvoder {
    constructor() {
        const config = {
            Launch: {
                cmd: 'HARD.Launch',
                icon: 'cmd',
                tip: 'Launch FPGA development assist function'
            },
            Simulate: {
                cmd: 'HARD.Simulate',
                icon: 'cmd',
                tip: 'Launch the manufacturer Simulation',
                children: {
                    CLI: {
                        cmd: 'HARD.simCLI',
                        icon: 'cmd',
                        tip: 'Launch the manufacturer Simulation in CLI'
                    },
                    GUI: {
                        cmd: 'HARD.simGUI',
                        icon: 'cmd',
                        tip: 'Launch the manufacturer Simulation in GUI'
                    },
                }
            },
            Refresh: {
                cmd: 'HARD.Refresh',
                icon: 'cmd',
                tip: 'Refresh the current project file'
            },
            Build: {
                cmd: 'HARD.Build',
                icon: 'cmd',
                tip: 'Build the current fpga project',
                children: {
                    Synth: {
                        cmd: 'HARD.Synth',
                        icon: 'cmd',
                        tip: 'Synth the current project'
                    },
                    Impl: {
                        cmd: 'HARD.Impl',
                        icon: 'cmd',
                        tip: 'Impl  the current project'
                    },
                    BitStream: {
                        cmd: 'HARD.Bit',
                        icon: 'cmd',
                        tip: 'Generate the BIT File'
                    },
                }
            },
            Program: {
                cmd: 'HARD.Program',
                icon: 'cmd',
                tip: 'Download the bit file into the device'
            },
            GUI: {
                cmd: 'HARD.GUI',
                icon: 'cmd',
                tip: 'Open the GUI'
            },
            Exit: {
                cmd: 'HARD.Exit',
                icon: 'cmd',
                tip: 'Exit the current project'
            }
        }
        super(config, 'HARD');
    }
};

class SoftwareTreeProvider extends BaseCommandTreeProvoder {
    constructor() {
        const config = {
            Launch: {
                cmd: 'SOFT.Launch',
                icon: 'cmd',
                tip: 'Launch SDK development assist function'
            },
            Build: {
                cmd: 'SOFT.Launch',
                icon: 'cmd',
                tip: 'Build the current SDK project'
            },
            Download: {
                cmd: 'SOFT.Launch',
                icon: 'cmd',
                tip: 'Download the boot file into the device'
            },
        }

        super(config, 'SOFT');
    }
}

class ToolTreeProvider extends BaseCommandTreeProvoder {
    constructor() {
        const config = {
            "Clean": {
                "command": 'TOOL.Clean',
                "icon": 'clean',
                "tooltip": 'Clean the current project'
            }
        }
        super(config, 'TOOL');
    }
}


module.exports = {
    ArchTreeProvider,
    HardwareTreeProvider,
    SoftwareTreeProvider,
    ToolTreeProvider
};