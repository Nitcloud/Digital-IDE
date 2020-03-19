"use strict";
exports.__esModule = true;
// import * as vscode from 'vscode';
var vscode_1 = require("vscode");
var ctags_1 = require("../ctags");
var Logger_1 = require("../Logger");
var VerilogHoverProvider = /** @class */ (function () {
    function VerilogHoverProvider(logger) {
        this.logger = logger;
    }
    VerilogHoverProvider.prototype.provideHover = function (document, position, token) {
        this.logger.log("Hover requested");
        // get word start and end
        var textRange = document.getWordRangeAtPosition(position);
        if (textRange.isEmpty)
            return;
        // hover word
        var targetText = document.getText(textRange);
        var ctags = ctags_1.CtagsManager.ctags;
        if (ctags.doc === undefined || ctags.doc.uri !== document.uri) { // systemverilog keywords
            return;
        }
        else {
            // find symbol
            for (var _i = 0, _a = ctags.symbols; _i < _a.length; _i++) {
                var i = _a[_i];
                // returns the first found tag. Disregards others
                // TODO: very basic hover implementation. Can be extended
                if (i.name === targetText) {
                    var codeRange = new vscode_1.Range(i.startPosition, new vscode_1.Position(i.startPosition.line, Number.MAX_VALUE));
                    var code = document.getText(codeRange).trim();
                    var hoverText = new vscode_1.MarkdownString();
                    hoverText.appendCodeblock(code, document.languageId);
                    this.logger.log("Hover object returned");
                    return new vscode_1.Hover(hoverText);
                }
            }
            this.logger.log("Hover object not found", Logger_1.Log_Severity.Warn);
            return;
        }
    };
    return VerilogHoverProvider;
}());
exports["default"] = VerilogHoverProvider;
