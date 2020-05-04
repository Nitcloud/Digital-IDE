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
                new Item('Init',   'FPGA_Init',   'FPGA.Init',   'Init'),
                new Item('Update', 'FPGA_Update', 'FPGA.Update', 'Update designed file'),
                new Item('Sim',    'FPGA_Sim',    'FPGA.Sim',    'Run the Simulation'),
				new Item('Build',  'FPGA_Build',  'FPGA.Build',  'Build the current fpga project'),
                new Item('Progarm','FPGA_Progarm','FPGA.Progarm','Download the bit file into the device'),
                new Item('GUI',    'FPGA_GUI',    'FPGA.GUI',    'Open the GUI')
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
        _this.tooltip = tooltip;
        return _this;
    }
    return Item;
}(vscode_i.TreeItem));