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
var vscode = require("vscode");
var file   = require("../file_IO/file_IO");
var module = require("../file_IO/moduleExplorer");
var Provider = /** @class */ (function () {
    function Provider() {
        let workspace_path = file.getCurrentWorkspaceFolder();
        let verilogModuleInfoList = module.getAllModuleInfo(`${workspace_path}user`,".v");
        let map =[];
        verilogModuleInfoList.forEach(element => {
            let moduleInfoList = element.split(" ");
            map.push(new Item(moduleInfoList[0],moduleInfoList[1]));
        });
        this.data = map;
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
exports.Provider = Provider;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(label, tooltip, iconPath, children, command) {
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