"use strict";
exports.__esModule = true;
var vscode_1 = require("vscode");
var ctags_1 = require("../ctags");
var VerilogCompletionItemProvider = /** @class */ (function () {
    function VerilogCompletionItemProvider(logger) {
        this.logger = logger;
    }
    //TODO: Better context based completion items
    VerilogCompletionItemProvider.prototype.provideCompletionItems = function (document, position, token, context) {
        var _this = this;
        this.logger.log("Completion items requested");
        return new Promise(function (resolve, reject) {
            var items = [];
            var ctags = ctags_1.CtagsManager.ctags;
            if (ctags.doc === undefined || ctags.doc.uri !== document.uri) { // systemverilog keywords
                return;
            }
            else {
                ctags.symbols.forEach(function (symbol) {
                    var newItem = new vscode_1.CompletionItem(symbol.name, _this.getCompletionItemKind(symbol.type));
                    var codeRange = new vscode_1.Range(symbol.startPosition, new vscode_1.Position(symbol.startPosition.line, Number.MAX_VALUE));
                    var code = document.getText(codeRange).trim();
                    newItem.detail = symbol.type;
                    var doc = "```systemverilog\n" + code + "\n```";
                    if (symbol.parentScope !== undefined && symbol.parentScope !== "")
                        doc += "\nHeirarchial Scope: " + symbol.parentScope;
                    newItem.documentation = new vscode_1.MarkdownString(doc);
                    items.push(newItem);
                });
            }
            _this.logger.log(items.length + " items requested");
            resolve(items);
        });
    };
    VerilogCompletionItemProvider.prototype.getCompletionItemKind = function (type) {
        switch (type) {
            case 'constant': return vscode_1.CompletionItemKind.Constant;
            case 'event': return vscode_1.CompletionItemKind.Event;
            case 'function': return vscode_1.CompletionItemKind.Function;
            case 'module': return vscode_1.CompletionItemKind.Module;
            case 'net': return vscode_1.CompletionItemKind.Variable;
            case 'port': return vscode_1.CompletionItemKind.Variable;
            case 'register': return vscode_1.CompletionItemKind.Variable;
            case 'task': return vscode_1.CompletionItemKind.Function;
            case 'block': return vscode_1.CompletionItemKind.Module;
            case 'assert': return vscode_1.CompletionItemKind.Variable; // No idea what to use
            case 'class': return vscode_1.CompletionItemKind.Class;
            case 'covergroup': return vscode_1.CompletionItemKind.Class; // No idea what to use
            case 'enum': return vscode_1.CompletionItemKind.Enum;
            case 'interface': return vscode_1.CompletionItemKind.Interface;
            case 'modport': return vscode_1.CompletionItemKind.Variable; // same as ports
            case 'package': return vscode_1.CompletionItemKind.Module;
            case 'program': return vscode_1.CompletionItemKind.Module;
            case 'prototype': return vscode_1.CompletionItemKind.Function;
            case 'property': return vscode_1.CompletionItemKind.Property;
            case 'struct': return vscode_1.CompletionItemKind.Struct;
            case 'typedef': return vscode_1.CompletionItemKind.TypeParameter;
            default: return vscode_1.CompletionItemKind.Variable;
        }
    };
    return VerilogCompletionItemProvider;
}());
exports["default"] = VerilogCompletionItemProvider;
