"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var vscode = require("vscode");
var treeview_data_provider_1 = require("./treeview-data-provider");
function activate(context) {
    var _this = this;
    var dataProvider = new treeview_data_provider_1.DataProvider();
    var initView = vscode.commands.registerCommand('day13-dataprovider.registerDataProvider', function () {
        vscode.window.registerTreeDataProvider('treeview', dataProvider);
        vscode.window.showInformationMessage('Create day13-treeview!');
    });
    var addItem = vscode.commands.registerCommand('day13-dataprovider.01_add', function () { return __awaiter(_this, void 0, void 0, function () {
        var itemId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({
                        placeHolder: 'Your New TreeItem Id'
                    })];
                case 1:
                    itemId = (_a.sent()) || '';
                    if (itemId !== '') {
                        dataProvider.addItem(new treeview_data_provider_1.TreeViewItem(itemId));
                    }
                    vscode.window.showInformationMessage('Add Day-13 TreeViewItem!');
                    return [2 /*return*/];
            }
        });
    }); });
    var editItem = vscode.commands.registerCommand('day13-dataprovider.02_edit', function (item) { return __awaiter(_this, void 0, void 0, function () {
        var itemName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({
                        placeHolder: 'Your New TreeItem Name'
                    })];
                case 1:
                    itemName = (_a.sent()) || '';
                    if (itemName !== '') {
                        dataProvider.editItem(item, itemName);
                    }
                    vscode.window.showInformationMessage('Edit Day-13 TreeViewItem!');
                    return [2 /*return*/];
            }
        });
    }); });
    var deleteItem = vscode.commands.registerCommand('day13-dataprovider.03_delete', function (item) { return __awaiter(_this, void 0, void 0, function () {
        var confirm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showQuickPick(['delete', 'canel'], {
                        placeHolder: 'Do you want to delete item?'
                    })];
                case 1:
                    confirm = _a.sent();
                    if (confirm === 'delete') {
                        dataProvider.deleteItem(item);
                    }
                    vscode.window.showInformationMessage('Delete Day-13 TreeViewItem!');
                    return [2 /*return*/];
            }
        });
    }); });
    context.subscriptions.push(initView, addItem, editItem, deleteItem);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
