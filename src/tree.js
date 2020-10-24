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

const utils  = require("utils");
const vscode = require("vscode");

var fileProvider = /** @class */ (function () {
    function Provider() {
        let workspace_path = utils.getCurrentWorkspaceFolder();
        let verilogModuleInfoList = utils.getAllModuleInfo(`${workspace_path}user`,".v");
        let map =[];
        vscode.commands.registerCommand('fileExplorer.openFile', (resource) => this.openResource(resource));
        verilogModuleInfoList.forEach(element => {
            let moduleInfoList = element.split(" ");
            map.push(new Item(
                moduleInfoList[0],
                'fileExplorer.openFile',
                'branch',
                moduleInfoList[1]));
        });
        this.data = map;
    }
    Provider.prototype.openResource = function (resource) {
        vscode.window.showTextDocument(resource);
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
exports.fileProvider = fileProvider;

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
                new Item('Init',    'SDK.Init',    'cmd', 'SDK_Init',   'Init'),
                new Item('Build',   'SDK.Build',   'cmd', 'SDK_Update', 'Build current project'),
                new Item('Download','SDK.Download','cmd', 'SDK_Sim',    'Download')
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
		_this.iconPath = `${__dirname}/../../../images/svg/` + iconPath + ".svg"
        return _this;
    }
    return Item;
}(vscode.TreeItem));
