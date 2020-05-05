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
var vscode_i = require("vscode");
var Provider = /** @class */ (function () {
    function Provider() {
    }
    Provider.prototype.getTreeItem = function (element) {
        return element;
    };
    Provider.prototype.getChildren = function (element) {
        if (!element) {
            return [
                new Item('Init',    'SDK_Init',   'SDK.Init',    'Init'),
                new Item('Build',   'SDK_Update', 'SDK.Build',   'Build current project'),
                new Item('Download','SDK_Sim',    'SDK.Download','Download')
            ];
        }
        return undefined;
    };
    return Provider;
}());
exports.Provider = Provider;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(label, contextValue, command, tooltip) {
        var _this = _super.call(this, label) || this;
        _this.contextValue = contextValue;
        _this.command = {
            title: label,
            command: command
        };
		_this.tooltip  = tooltip;
		_this.iconPath = `${__dirname}/../../../images/svg/cmd.svg`
        return _this;
    }
    return Item;
}(vscode_i.TreeItem));
