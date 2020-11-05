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

exports.__esModule = true;

const vscode = require("vscode");
const parse  = require("./parse");

class FileSystemProvider {
    constructor() {
        this.eventEmitter  = new vscode.EventEmitter();
    }
    get onDidChangeTreeData() {
        return this.eventEmitter.event;
    }
    update() {
        this.eventEmitter.fire();
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
                case "src"       : return this.getTopElement(parse.HDLparam)//getSrcTopElement();
                // case "Data"      : return this.getDataTopElement();
                // case "testbench" : return this.getTbTopElement();
                default          : return this.getChildElement(element.type, parse.HDLparam);
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
    constructor(context) {
        const treeDataProvider = new FileSystemProvider();
        this.fileExplorer = vscode.window.createTreeView('TOOL.file_tree', { treeDataProvider });
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
