"use strict";
exports.__esModule = true;
var vscode_1 = require("vscode");
var ctags_1 = require("../ctags");
var VerilogDefinitionProvider = /** @class */ (function () {
    function VerilogDefinitionProvider(logger) {
        this.logger = logger;
    }
    VerilogDefinitionProvider.prototype.provideDefinition = function (document, position, token) {
        var _this = this;
        this.logger.log("Definitions Requested: " + document.uri);
        return new Promise(function (resolve, reject) {
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
                var matchingSymbols = [];
                var definitions = [];
                // find all matching symbols
                for (var _i = 0, _a = ctags.symbols; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (i.name === targetText) {
                        matchingSymbols.push(i);
                    }
                }
                for (var _b = 0, matchingSymbols_1 = matchingSymbols; _b < matchingSymbols_1.length; _b++) {
                    var i = matchingSymbols_1[_b];
                    definitions.push({
                        targetUri: document.uri,
                        targetRange: new vscode_1.Range(i.startPosition, new vscode_1.Position(i.startPosition.line, Number.MAX_VALUE)),
                        targetSelectionRange: new vscode_1.Range(i.startPosition, i.endPosition)
                    });
                }
                _this.logger.log(definitions.length + " definitions returned");
                resolve(definitions);
            }
        });
    };
    return VerilogDefinitionProvider;
}());
exports["default"] = VerilogDefinitionProvider;
