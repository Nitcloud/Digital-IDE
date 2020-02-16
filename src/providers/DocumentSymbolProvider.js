"use strict";
exports.__esModule = true;
var vscode_1 = require("vscode");
var ctags_1 = require("../ctags");
var Logger_1 = require("../Logger");
var VerilogDocumentSymbolProvider = /** @class */ (function () {
    function VerilogDocumentSymbolProvider(logger) {
        this.docSymbols = [];
        this.logger = logger;
    }
    VerilogDocumentSymbolProvider.prototype.provideDocumentSymbols = function (document, token) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.logger.log("Symbols Requested: " + document.uri);
            var symbols = [];
            console.log("symbol provider");
            var activeDoc = vscode_1.window.activeTextEditor.document;
            if (ctags_1.CtagsManager.ctags.doc === undefined || ctags_1.CtagsManager.ctags.doc.uri.fsPath !== activeDoc.uri.fsPath)
                ctags_1.CtagsManager.ctags.setDocument(activeDoc);
            var ctags = ctags_1.CtagsManager.ctags;
            // If dirty, re index and then build symbols
            if (ctags.isDirty) {
                ctags.index()
                    .then(function () {
                    symbols = ctags.symbols;
                    console.log(symbols);
                    _this.docSymbols = _this.buildDocumentSymbolList(symbols);
                    _this.logger.log(_this.docSymbols.length + " top-level symbols returned", (_this.docSymbols.length > 0) ? Logger_1.Log_Severity.Info : Logger_1.Log_Severity.Warn);
                    resolve(_this.docSymbols);
                });
            }
            else {
                _this.logger.log(_this.docSymbols.length + " top-level symbols returned");
                resolve(_this.docSymbols);
            }
        });
    };
    VerilogDocumentSymbolProvider.prototype.isContainer = function (type) {
        switch (type) {
            case vscode_1.SymbolKind.Array:
            case vscode_1.SymbolKind.Boolean:
            case vscode_1.SymbolKind.Constant:
            case vscode_1.SymbolKind.EnumMember:
            case vscode_1.SymbolKind.Event:
            case vscode_1.SymbolKind.Field:
            case vscode_1.SymbolKind.Key:
            case vscode_1.SymbolKind.Null:
            case vscode_1.SymbolKind.Number:
            case vscode_1.SymbolKind.Object:
            case vscode_1.SymbolKind.Property:
            case vscode_1.SymbolKind.String:
            case vscode_1.SymbolKind.TypeParameter:
            case vscode_1.SymbolKind.Variable:
                return false;
            case vscode_1.SymbolKind.Class:
            case vscode_1.SymbolKind.Constructor:
            case vscode_1.SymbolKind.Enum:
            case vscode_1.SymbolKind.File:
            case vscode_1.SymbolKind.Function:
            case vscode_1.SymbolKind.Interface:
            case vscode_1.SymbolKind.Method:
            case vscode_1.SymbolKind.Module:
            case vscode_1.SymbolKind.Namespace:
            case vscode_1.SymbolKind.Package:
            case vscode_1.SymbolKind.Struct:
                return true;
        }
    };
    // find the appropriate container RECURSIVELY and add to its childrem
    // return true: if done
    // return false: if container not found
    VerilogDocumentSymbolProvider.prototype.findContainer = function (con, sym) {
        var res = false;
        for (var _i = 0, _a = con.children; _i < _a.length; _i++) {
            var i = _a[_i];
            if (this.isContainer(i.kind) && i.range.contains(sym.range)) {
                res = this.findContainer(i, sym);
                if (res)
                    return true;
            }
        }
        if (!res) {
            con.children.push(sym);
            return true;
        }
    };
    // Build heiarchial DocumentSymbol[] from linear symbolsList[] using start and end position
    // TODO: Use parentscope/parenttype of symbol to construct heirarchial DocumentSymbol []
    VerilogDocumentSymbolProvider.prototype.buildDocumentSymbolList = function (symbolsList) {
        var list = [];
        symbolsList = symbolsList.sort(function (a, b) {
            if (a.startPosition.isBefore(b.startPosition))
                return -1;
            if (a.startPosition.isAfter(b.startPosition))
                return 1;
            return 0;
        });
        // Add each of the symbols in order
        for (var _i = 0, symbolsList_1 = symbolsList; _i < symbolsList_1.length; _i++) {
            var i = symbolsList_1[_i];
            var sym = i.getDocumentSymbol();
            // if no top level elements present
            if (list.length === 0) {
                list.push(sym);
                continue;
            }
            else {
                // find a parent among the top level element
                var done = void 0;
                for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
                    var j = list_1[_a];
                    if (this.isContainer(j.kind) && j.range.contains(sym.range)) {
                        this.findContainer(j, sym);
                        done = true;
                        break;
                    }
                }
                // add a new top level element
                if (!done)
                    list.push(sym);
            }
        }
        return list;
    };
    return VerilogDocumentSymbolProvider;
}());
exports["default"] = VerilogDocumentSymbolProvider;
