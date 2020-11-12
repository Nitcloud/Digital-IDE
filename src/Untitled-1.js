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
var TreeViewItem = /** @class */ (function (_super) {
    __extends(TreeViewItem, _super);
    function TreeViewItem(label, collapsibleState) {
        var _this = _super.call(this, label, collapsibleState) || this;
        _this.contextValue = 'treeviewitem';
        return _this;
    }
    return TreeViewItem;
}(vscode.TreeItem));
exports.TreeViewItem = TreeViewItem;
var DataProvider = /** @class */ (function () {
    class DataProvider {
        constructor() {
            this.dataStorage = [
                new TreeViewItem('TreeItem-01'),
                new TreeViewItem('TreeItem-02'),
                new TreeViewItem('TreeItem-03'),
            ];
            this.eventEmitter = new vscode.EventEmitter();
        }
        getTreeItem(element) {
            return element;
        }
        getChildren(element) {
            return Promise.resolve(this.dataStorage);
        }
        addItem(newItem) {
            this.dataStorage.push(newItem);
            this.updateView();
        }
        editItem(item, name) {
            var editItem = this.dataStorage.find(function (i) { return i.label === item.label; });
            if (editItem) {
                editItem.label = name;
                this.updateView();
            }
        }
        deleteItem(item) {
            this.dataStorage = this.dataStorage.filter(function (i) { return i.label !== item.label; });
            this.updateView();
        }
        updateView() {
            this.eventEmitter.fire();
        }
    }
    Object.defineProperty(DataProvider.prototype, "onDidChangeTreeData", {
        get: function () {
            return this.eventEmitter.event;
        },
        enumerable: true,
        configurable: true
    });
    return DataProvider;
}());
exports.DataProvider = DataProvider;
