"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.__esModule = true;

const fs     = require("fs");
const fspath = require("path");
const vscode = require("vscode");
const serve  = require("./serve");
const utils  = require("./utils");

let fsWait = false;

class FileSystemProvider {
    constructor(parser, globPattern, HDLparam) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData  = this._onDidChangeTreeData.event;
        this.parser = parser;
        this.HDLparam = HDLparam;
        this.refreshProperty = new utils.refreshProperty();
        fs.watch(serve.opeParam.workspacePath, { recursive : true }, function (event, fileName) {
            if (fileName) {
                if (fsWait) return;
                fsWait = setTimeout(() => {
                  fsWait = false;
                }, 50);
                console.log(`${event}`);
                console.log(`${fileName}`);
                // this.onChange(fileName);
            }
        });
        this.FileSystemWatcher(globPattern);
    }
    getHDLDocumentType(document) {
        if (!document) {
            return false;
        }
        if (document.languageId === "systemverilog" || 
            document.languageId === "verilog") {
            return 1;
        } else if (document.languageId === "vhdl") {
            return -1;
        }
        return false;
    }
    /**
        Removes the given `document`'s symbols from `this.symbols`,
        Gets the current symbols which exist on the document to add to `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param document the document that's been changed
        @return status message when indexing is successful or failed with an error.
    */
    onChange(document) {
        if (fspath.basename(document.uri.fsPath) == "property.json") {		
            this.refreshProperty.updateFolder(serve.opeParam.rootPath,serve.opeParam.workspacePath,document.uri.fsPath);
            this.refreshProperty.updatePrjInfo(serve.opeParam.rootPath,document.uri.fsPath);
            return;
        }
        if (!this.getHDLDocumentType(document)) {
            return;
        }
        else if (this.getHDLDocumentType(document) == 1 ) {
            this.HDLparam = this.parser.removeCurrentFileParam(document, this.HDLparam);
            this.parser.get_HDLfileparam(document, null, 0, null, this.HDLparam);
            this.parser.get_instModulePath(this.HDLparam);
            this.refresh();
        }
    }
    /**
        Adds the given `document`'s symbols to `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param uri the document's Uri
        @return status message when indexing is successful or failed with an error.
    */
    onCreate(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                return vscode.workspace.openTextDocument(uri).then((document) => {
                    return this.onChange(document);
                });
            });
        });
    }
    /**
        Removes the given `document`'s symbols from `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param uri the document's Uri
        @return status message when indexing is successful or failed with an error.
    */
    onDelete(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                return vscode.workspace.openTextDocument(uri).then((document) => {
                    return this.onChange(document);
                });
            });
        });
    }
    FileSystemWatcher(globPattern) {
        vscode.workspace.onDidChangeWorkspaceFolders((uri) => { 
            this.onCreate(uri);
        });
        let watcher = vscode.workspace.createFileSystemWatcher(globPattern, false, false, false);
        watcher.onDidCreate((uri) => { this.onCreate(uri); });
        watcher.onDidDelete((uri) => { this.onDelete(uri); });
        watcher.onDidChange((uri) => { this.onDelete(uri); });
    }
    refresh(element) {
        if (element) {
            this._onDidChangeTreeData.fire(element);
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }
    getTopElement(param){
        let TopElementList = [];
        let isTopElement = true;
        for (let index = 0; index < param.length; index++) {
            const currentModule = param[index];
            for (let index = 0; index < param.length; index++) {
                const unitModule = param[index];
                for (let index = 0; index < unitModule.instmodule.length; index++) {
                    const unitInstModule = unitModule.instmodule[index];
                    if (unitInstModule.instModule == currentModule.moduleName) {
                        isTopElement = false;
                        break;
                    }
                }
                if (!isTopElement) {
                    break;
                }
            }
            if (isTopElement) {
                let TopElement = {
                    "name"   : "",
                    "type"   : "",
                    "fspath" : ""
                };
                TopElement.name   = "";
                TopElement.type   = currentModule.moduleName;
                TopElement.fspath = currentModule.modulePath;
                TopElementList.push(TopElement);
            } else {
                isTopElement = true;
            }
        }
        return TopElementList;
    }
    getChildElement(element, param){
        let childElementList = [];
        param.forEach(unitModule => {
            if (unitModule.moduleName == element) {
                unitModule.instmodule.forEach(unitInstModule => {
                    let childElement = {
                        "name"   : "",
                        "type"   : "",
                        "fspath" : ""
                    };
                    childElement.name   = unitInstModule.instName;
                    childElement.type   = unitInstModule.instModule;
                    childElement.fspath = unitInstModule.instModPath;
                    childElementList.push(childElement);
                });
            }
        });
        return childElementList;
    }
    getSrcTopElement() {
        return this.TopElementList;
    }
    getTbTopElement() {
        return [];
    }
    // 用于获取某个节点下属的节点数组，根节点记为 null；
    // 返回一个树节点的所有子节点的数据。
    /**
     * 1. 先创建根节点
     * 2. 再根据根节点创建子节点
     */
    getChildren(element) {
        // 如果不是根节点
        if (element) {
            switch (element.type) {
                case "src"       : return this.getTopElement(this.HDLparam)//getSrcTopElement();
                // case "Data"      : return this.getDataTopElement();
                // case "testbench" : return this.getTbTopElement();
                default          : return this.getChildElement(element.type, this.HDLparam);
            }
        }

        // 根节点
        return [
            { "type" : "src" },
            // { "type" : "Data" },
            // { "type" : "testbench" }
        ];
    }
    // 用于获取实际渲染的 TreeItem 实例。
    /* 
    TreeItem 有两种创建方式： 
        1. 第一种，就是提供 label，也就是一个字符串，VS Code 会把这个字符串渲染在树形结构中； 
        2. 第二种就是提供 resourceUri，也就是一个资源地址，
        VS Code 则会像资源管理器里渲染文件和文件夹一样渲染这个节点的。 
    iconPath         属性，是用于控制树节点前的图标的。 
                        如果说自己通过 TreeView API 来实现一个资源管理器的话，
                        就可以使用 iconPath 来为不同的文件类型指定不同的图标。
    tooltip          属性，当把鼠标移动到某个节点上等待片刻，VS Code 就会显示出这个节点对应的 tooltip 文字。
    collapsibleState 属性，是用于控制这个树节点是应该展开还是折叠。 
                        当然，如果这个节点没有子节点的话，这个属性就用不着了。
    command          属性，如果有这个属性的话，当点击这个树节点时，这个属性所指定的命令就会被执行了。
    */
    getTreeItem(element) {
        let childrenList = this.getChildren(element);
        let elementName = "";
        if (element.name == "" || element.name == undefined) {
            elementName = element.type;
        } else {
            elementName = element.name + ' \(' + element.type + '\)';
        }
        const treeItem = new vscode.TreeItem(
            elementName,
            childrenList.length === 0 ? 
            vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Collapsed 
        );
        let TreeItemList = [];
        for (let index = 0; index < childrenList.length; index++) {
            const element = childrenList[index];
            TreeItemList.push(this.getTreeItem(element));
        }
        treeItem.contextValue = 'file';
        treeItem.children = TreeItemList;
        treeItem.command = { 
            title:     "Open this HDL File", 
            command:   'FILE.openFile', 
            arguments: [element.fspath], 
        };
        return treeItem;
    }
}
exports.FileSystemProvider = FileSystemProvider;
class FileExplorer {
    constructor(parser, globPattern, HDLparam) {
        const treeDataProvider = new FileSystemProvider(parser, globPattern, HDLparam);
        this.fileExplorer = vscode.window.registerTreeDataProvider('TOOL.file_tree', treeDataProvider);
        vscode.commands.registerCommand("FILE.refresh", () => treeDataProvider.refresh());
        vscode.commands.registerCommand('FILE.openFile', (resource) => this.openResource(resource));
    }
    openResource(resource) {
        vscode.window.showTextDocument(vscode.Uri.file(resource));
    }
}
exports.FileExplorer = FileExplorer;

var fpgaProvider = /** @class */ (function () {
    function Provider() {
		this.data = [
			new Item('Init',   'FPGA.Init',   'cmd', 'Init'),
			new Item('Update', 'FPGA.Update', 'cmd', 'Update designed file'),
			new Item('Sim',    'FPGA.Sim',    'cmd', 'Run the Simulation'),
			new Item('Build',  
					 'FPGA.Build',
					 'cmd',  
					 'Build the current fpga project',
                    [
                        new Item('Synth'  ,'FPGA.Synth'   ,'branch','Synth the current fpga project'), 
                        new Item('Impl'   ,'FPGA.Impl'    ,'branch','Impl  the current fpga project'),
                        new Item('Gen_Bit','FPGA.Gen_Bit' ,'branch','generate the bit file')
                    ]
					),
			new Item('Program','FPGA.Program','cmd', 'Download the bit file into the device'),
			new Item('GUI',    'FPGA.GUI',    'cmd', 'Open the GUI'),
			new Item('exit',   'FPGA.exit',   'cmd', 'Exit the current project')
        ];
	}
    Provider.prototype.getTreeItem = function (element) {
        return element;
    };
    Provider.prototype.getChildren = function (element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    };
    return Provider;
}());
exports.fpgaProvider = fpgaProvider;

var sdkProvider = /** @class */ (function () {
    function Provider() {
    }
    Provider.prototype.getTreeItem = function (element) {
        return element;
    };
    Provider.prototype.getChildren = function (element) {
        if (!element) {
            return [
                new Item('Init',    'SDK.Init',    'cmd', 'Init'),
                new Item('Build',   'SDK.Build',   'cmd', 'Build current project'),
                new Item('Download','SDK.Download','cmd', 'Download')
            ];
        }
        return undefined;
    };
    return Provider;
}());
exports.sdkProvider = sdkProvider;

var toolProvider = /** @class */ (function () {
    function Provider() {
    }
    Provider.prototype.getTreeItem = function (element) {
        return element;
    };
    Provider.prototype.getChildren = function (element) {
        if (!element) {
            return [
                new Item('BOOT',       'TOOL.Gen_BOOT',   'BOOT',       'Gen_BOOT'),
                new Item('Clean',      'TOOL.clean',      'clean',      'Clean current project'),
				new Item('SerialPort', 'TOOL.SerialPort', 'SerialPort', 'Serial monitor')
            ];
        }
        return undefined;
    };
    return Provider;
}());
exports.toolProvider = toolProvider;

var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(label, command, iconPath, tooltip, children) {
        var _this = _super.call(this, label, children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed) || this;
		_this.contextValue = "FPGA";
		_this.children = children;
        _this.command = {
            title: label,
            command: command
        };
		_this.tooltip = tooltip;
		_this.iconPath = `${__dirname}`.replace(/\\/g,"\/") + '/../images/svg/' + iconPath + ".svg"
        return _this;
    }
    return Item;
}(vscode.TreeItem));
