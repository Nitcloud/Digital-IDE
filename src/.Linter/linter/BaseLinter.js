"use strict";
exports.__esModule = true;
var vscode = require("vscode");
var BaseLinter = /** @class */ (function () {
    function BaseLinter(name, logger) {
        this.diagnostic_collection = vscode.languages.createDiagnosticCollection();
        this.name = name;
        this.logger = logger;
    }
    BaseLinter.prototype.startLint = function (doc) {
        this.lint(doc);
    };
    BaseLinter.prototype.removeFileDiagnostics = function (doc) {
        this.diagnostic_collection["delete"](doc.uri);
    };
    return BaseLinter;
}());
exports["default"] = BaseLinter;
