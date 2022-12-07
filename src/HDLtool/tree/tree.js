"use strict";

const fs      = require("fs");
const vscode  = require("vscode");
const parser  = require("HDLparser");
const cells = require("./cells");

/**
 * 树状结构服务注册函数
 */
 function registerTreeServer() {
    // // Tree View
    vscode.window.registerTreeDataProvider('TOOL.soft_tree', new softwareTreeProvider());
    vscode.window.registerTreeDataProvider('TOOL.hard_tree', new hardwareTreeProvider());
    vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new toolTreeProvider());
}
exports.registerTreeServer = registerTreeServer;

class FileExplorer {
    constructor(indexer, process) {
        this.treeDataProvider = new FileSystemProvider(indexer, process);
        this.fileExplorer = vscode.window.createTreeView('TOOL.file_tree', {
            treeDataProvider: this.treeDataProvider,
            canSelectMany: true
        });
        
        vscode.commands.registerCommand("FILE.expand",   () => this.expand());
        vscode.commands.registerCommand('FILE.collapse', () => this.collapse());
        vscode.commands.registerCommand("FILE.refresh",  () => this.treeDataProvider.refresh());
        vscode.commands.registerCommand('FILE.openFile', (uri) => this.openResource(uri));
    }
    collapse() {
        this.treeDataProvider.childCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        this.treeDataProvider.refresh();
    }
    expand() {
        this.treeDataProvider.childCollapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        this.treeDataProvider.refresh();
    }
    openResource(resource) {
        if (fs.existsSync(resource)) {
            vscode.window.showTextDocument(vscode.Uri.file(resource));
        }
    }
}
exports.FileExplorer = FileExplorer;

class FileSystemProvider {
    constructor(indexer, process) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData  = this._onDidChangeTreeData.event;
        this.indexer = indexer;
        this.process = process;
        this.childCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

        this.process.treeView = this;
    }
    
    refresh(element) {
        if (element) {
            this._onDidChangeTreeData.fire(element);
        } else {
            this._onDidChangeTreeData.fire();
        }
    }

    getChildren(element) {
        // 如果不是根节点
        if (element) {
            switch (element.name) {
                case "src"  : return this.getTreeTopElement("src");
                case "sim"  : return this.getTreeTopElement("sim");
                default     : return this.getChildElement(element);
            }
        }

        // 根节点
        return [
            {"mode": "src", "name": "src", "type" : "src", "fsPath" : ""},
            {"mode": "sim", "name": "sim", "type" : "sim", "fsPath" : ""},
            // {"mode": "folder", "name": "Data", "type" : "Data", "fsPath" : "" },
        ];
    }

    /**
     * 获取元素的项目信息
     * @param {obj} element 
     *      mode: 所归属的类型 
     *          - folder: [src, sim] 
     *          - TOP: top/current(Src/Sim)Top 
     *          - child: [cells, local, remote, verilog, systemverilog, vhdl]
     *      name: 模块名，顶层或者非文件类型时为空 
     *      type: 例化名，
     *      fsPath: 模块所在的文件的路径
     * @returns 
     */
    getTreeItem(element) {
        let itemName = element.name;
        let itemChildMode = ["vhdl", "systemverilog", "verilog", "remote", "cells"];
        if (itemChildMode.includes(element.mode)) {
            itemName = `${element.type}(${element.name})`;
        }
        
        let children = this.getChildren(element);

        const treeItem = new vscode.TreeItem(
            itemName,
            children.length === 0 ? 
            vscode.TreeItemCollapsibleState.None :
            this.childCollapsibleState 
        );
        
        // set children
        treeItem.children = [];
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            treeItem.children.push(this.getTreeItem(child));
        }

        // set contextValue file -> simulate / netlist
        let otherMode = ["src", "sim", "File Error", "cells"]
        if (otherMode.includes(element.mode)) {
            treeItem.contextValue = 'other';
        } else {
            treeItem.contextValue = 'file';
        }
        
        // set tooltip
        treeItem.tooltip = element.fsPath;

        // set iconPath
        treeItem.iconPath = {
            light : `${this.process.opeParam.rootPath}/images/svg/light/` + element.mode + ".svg",
            dark  : `${this.process.opeParam.rootPath}/images/svg/dark/`  + element.mode + ".svg"
        };

        // set command
        treeItem.command = { 
            title:     "Open this HDL File", 
            command:   'FILE.openFile', 
            arguments: [element.fsPath], 
        };
        return treeItem;
    }

    getTreeTopElement(type) {
        let topHDLparam    = [];
        let topElementList = [];
        let HDLparam = this.process.indexer.HDLparam;
        let topModule = this.process.opeParam.srcTopModule;
        let topPathType = this.process.opeParam.prjStructure.HardwareSrc;
        let libPathType = `${this.process.opeParam.rootPath}/lib`;
        let currentTopMode = "currentSrcTop";
    
        if (type == "sim") {
            currentTopMode = "currentSimTop";
            topModule = this.process.opeParam.simTopModule;
            topPathType = this.process.opeParam.prjStructure.HardwareSim;
        }
    
        // 从 HDLparam 找到 topPathType 下的所有HDL文件
        for (let i = 0; i < HDLparam.length; i++) {
            const element = HDLparam[i];
            if (element.modulePath.includes(topPathType) ||
                element.modulePath.includes(libPathType)) {
                topHDLparam.push(element);
            }
        }
    
        // 从所有 topPathType 下的HDL文件中找到其中的顶层文件
        topElementList = parser.utils.getTopElement(topHDLparam, type);
        
        // 如果没有src文件则直接退出
        if (!topElementList.length) {
            return topElementList;
        }
    
        // 如果当前顶层被设置则 先HDLparam合法性检查 -> 不合法: 重置 / 合法: 存在性检查
        let isIllegal = true;
        for (let index = 0; index < HDLparam.length; index++) {
            const element = HDLparam[index];
            if (topModule.name == element.moduleName &&
                topModule.path == element.modulePath) {
                isIllegal = false;
                break;
            }
        }
    
        if (isIllegal) {
            // 如果没有就将第一个设置为当前顶层
            topElementList[0].mode = currentTopMode
            topModule.name = topElementList[0].name;
            topModule.path = topElementList[0].fsPath;
            return topElementList;
        }
    
        let isExsit = false;
        for (let index = 0; index < topElementList.length; index++) {
            const element = topElementList[index];
            if (topModule.name == element.name &&
                topModule.path == element.fsPath) {
                isExsit = true;
                // 将其移动到顶层数组的第一个
                let topElement = topElementList.splice(index, 1);
                topElement[0].mode = currentTopMode;
                topElementList.splice(0, 0, topElement[0]);
                return topElementList;
            }
        }
    
        // 如果合法但不存在则将当前顶层移动到顶层数组的第一个
        if (!isExsit) {
            // 将其移动到顶层数组的第一个
            let topElement = {
                "mode"   : currentTopMode,
                "type"   : type,
                "name"   : topModule.name,
                "fsPath" : topModule.path
            }
            topElementList.splice(0, 0, topElement);
        }
        return topElementList;
    }

    /**
     * 获取当前模块下的子模块
     * @param {*} element   父级元素
     * @returns 该父级模块下所包含的所有例化模块信息
     */
    getChildElement(element){
        let childElementList = [];
        let HDLparam = this.process.indexer.HDLparam;
        let localPath = this.process.opeParam.workspacePath;
        let len = HDLparam.length;
        for (let i = 0; i < len; i++) {
            const unitModule = HDLparam[i];
            // 先从全局HDL文件参数中找到该父级模块
            if (unitModule.moduleName == element.name && 
                unitModule.modulePath == element.fsPath) {
                // 进行该模块下的例化模块的遍历
                for (let index = 0; index < unitModule.instances.length; index++) {
                    const unitInstModule = unitModule.instances[index];
                    let childElement = {
                        "mode"   : "file",
                        "name"   : "",
                        "type"   : "",
                        "fsPath" : ""
                    };
                    childElement.type   = unitInstModule.instName;
                    childElement.name   = unitInstModule.instModule;
                    childElement.fsPath = unitInstModule.instModPath;
                    if (childElement.type == element.type &&
                        childElement.name == element.name &&
                        childElement.fsPath == element.fsPath) {
                        continue;
                    }
                    if (fs.existsSync(childElement.fsPath)) {
                        if (!childElement.fsPath.includes(localPath)) {
                            childElement.mode = "remote";
                        } else {
                            let languageId = parser.utils.getLanguageId(childElement.fsPath);
                            childElement.mode = languageId;
                        }
                    } else {
                        if (cells.xilinx_component.includes(unitInstModule.instModule)) {
                            childElement.mode = "cells";
                        } else {
                            childElement.mode = "File Error";
                        }
                    }
                    childElementList.push(childElement);
                }
            }
        }
        return childElementList;
    }
}
exports.FileSystemProvider = FileSystemProvider;

class hardwareTreeProvider {
    constructor(opeParam){
        this.config = {
            "Launch" : {
                "cmd"  : 'HARD.Launch',
                "icon" : 'cmd',
                "tip"  : 'Launch FPGA development assist function'
            },
            "Simulate" : {
                "cmd"  : 'HARD.Simulate',
                "icon" : 'cmd',
                "tip"  : 'Launch the manufacturer Simulation',
                "children" : {
                    "CLI" : {
                        "cmd"  : 'HARD.simCLI',
                        "icon" : 'cmd',
                        "tip"  : 'Launch the manufacturer Simulation in CLI'
                    },
                    "GUI" : {
                        "cmd"  : 'HARD.simGUI',
                        "icon" : 'cmd',
                        "tip"  : 'Launch the manufacturer Simulation in GUI'
                    },
                }
            },
            "Refresh" : {
                "cmd"  : 'HARD.Refresh',
                "icon" : 'cmd',
                "tip"  : 'Refresh the current project file'
            },
            "Build" : {
                "cmd"  : 'HARD.Build',
                "icon" : 'cmd',
                "tip"  : 'Build the current fpga project',
                "children" : {
                    "Synth" : {
                        "cmd"  : 'HARD.Synth',
                        "icon" : 'cmd',
                        "tip"  : 'Synth the current project'
                    },
                    "Impl" : {
                        "cmd"  : 'HARD.Impl',
                        "icon" : 'cmd',
                        "tip"  : 'Impl  the current project'
                    },
                    "BitStream" : {
                        "cmd"  : 'HARD.Bit',
                        "icon" : 'cmd',
                        "tip"  : 'Generate the BIT File'
                    },
                }
            },
            "Program" : {
                "cmd"  : 'HARD.Program',
                "icon" : 'cmd',
                "tip"  : 'Download the bit file into the device'
            },
            "GUI" : {
                "cmd"  : 'HARD.GUI',
                "icon" : 'cmd',
                "tip"  : 'Open the GUI'
            },
            "Exit" : {
                "cmd"  : 'HARD.Exit',
                "icon" : 'cmd',
                "tip"  : 'Exit the current project'
            }
        }
    }

    getChildren(element) {
        if (element && element.children) {
            return element.children;
        } else {
            const list = [];
            for (const key in this.config) {
                list.push(key);
            }
            return list;
        }
    }

    getTreeItem(element) {
        const list = this.getChildren(element);
        const treeItem = new vscode.TreeItem(
            element.name,
            childrenList.length === 0 ? 
            vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Collapsed 
        );
        let TreeItemList = [];
        for (let index = 0; index < childrenList.length; index++) {
            const element = childrenList[index];
            TreeItemList.push(this.getTreeItem(element));
        }
        treeItem.contextValue = 'HARD';
        treeItem.children = TreeItemList;
        treeItem.command  = this.config[name].cmd;
        treeItem.tooltip  = this.config[name].tip;
        treeItem.iconPath = this.config[name].icon;
        return treeItem;
    }
}

class softwareTreeProvider {
    constructor(opeParam){
        this.config = {
            "Launch" : {
                "command"  : 'SOFT.Launch',
                "iconPath" : {
                    light : `${opeParam.rootPath}/images/svg/light/cmd.svg`,
                    dark  : `${opeParam.rootPath}/images/svg/dark/cmd.svg`
                },
                "tooltip"  : 'Launch SDK development assist function'
            },
            "Build" : {
                "command"  : 'SOFT.Launch',
                "iconPath" : {
                    light : `${opeParam.rootPath}/images/svg/light/cmd.svg`,
                    dark  : `${opeParam.rootPath}/images/svg/dark/cmd.svg`
                },
                "tooltip"  : 'Build the current SDK project'
            },
            "Download" : {
                "command"  : 'SOFT.Launch',
                "iconPath" : {
                    light : `${opeParam.rootPath}/images/svg/light/cmd.svg`,
                    dark  : `${opeParam.rootPath}/images/svg/dark/cmd.svg`
                },
                "tooltip"  : 'Download the boot file into the device'
            },
        }
    }

    getChildren(element) {
        
    }

    getTreeItem(element) {
        
    }
}

class toolTreeProvider {
    constructor(opeParam){
        this.config = {
            "Clean" : {
                "command"  : 'TOOL.Clean',
                "iconPath" : {
                    light : `${opeParam.rootPath}/images/svg/light/clean.svg`,
                    dark  : `${opeParam.rootPath}/images/svg/dark/clean.svg`
                },
                "tooltip"  : 'Clean the current project'
            }
        }
    }
    getChildren(element) {
        // 根节点
        
    }

    getTreeItem(element) {
        
    }
}
