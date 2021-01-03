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
var vscode_1 = require("vscode");
var child_process_1 = require("child_process");
var BaseLinter_1 = require("./BaseLinter");
var XvlogLinter = /** @class */ (function (_super) {
    __extends(XvlogLinter, _super);
    function XvlogLinter() {
        return _super.call(this, "xvlog") || this;
    }
    XvlogLinter.prototype.lint = function (doc) {
        var _this = this;
        var svArgs = (doc.languageId == "systemverilog") ? "-sv" : ""; //Systemverilog args
        var command = "xvlog " + svArgs + " -nolog " + doc.fileName;
        var process = child_process_1.exec(command, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stdout.split(/\r?\n/g);
            lines.forEach(function (line) {
                var tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
                if (tokens.length < 4
                    || tokens[0] != "ERROR"
                    || !tokens[1].startsWith("VRFC")) {
                    return;
                }
                // Get filename and line number
                var _a = tokens[3].split(/:(\d+)/), filename = _a[0], lineno_str = _a[1];
                var lineno = parseInt(lineno_str) - 1;
                // if (filename != doc.fileName) // Check that filename matches
                //     return;
                var diagnostic = {
                    severity: vscode_1.DiagnosticSeverity.Error,
                    code: tokens[1],
                    message: "[" + tokens[1] + "] " + tokens[2],
                    range: new vscode_1.Range(lineno, 0, lineno, Number.MAX_VALUE),
                    source: "xvlog"
                };
                diagnostics.push(diagnostic);
            });
            _this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    };
    return XvlogLinter;
}(BaseLinter_1["default"]));
exports["default"] = XvlogLinter;
