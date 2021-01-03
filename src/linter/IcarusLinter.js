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
var child = require("child_process");
var BaseLinter_1 = require("./BaseLinter");
var isWindows = process.platform === "win32";
var IcarusLinter = /** @class */ (function (_super) {
    __extends(IcarusLinter, _super);
    function IcarusLinter() {
        var _this = _super.call(this, "iverilog") || this;
        vscode_1.workspace.onDidChangeConfiguration(function () {
            _this.getConfig();
        });
        _this.getConfig();
        return _this;
    }
    IcarusLinter.prototype.getConfig = function () {
        this.iverilogArgs = vscode_1.workspace.getConfiguration().get('HDL.linting.iverilog.arguments');
        this.runAtFileLocation = vscode_1.workspace.getConfiguration().get('HDL.linting.iverilog.runAtFileLocation');
    };
    IcarusLinter.prototype.lint = function (doc) {
        var _this = this;
        var docUri = doc.uri.fsPath; //path of current doc
        var lastIndex = (isWindows == true) ? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
        var docFolder = docUri.substr(0, lastIndex); //folder of current doc
        var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode_1.workspace.rootPath; //choose correct location to run
        var svArgs = (doc.languageId == "systemverilog") ? "-g2012" : ""; //SystemVerilog args
        var command = 'iverilog ' + svArgs + ' -t null ' + this.iverilogArgs + ' \"' + doc.fileName + '\"'; //command to execute
        var foo = child.exec(command, { cwd: runLocation }, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stderr.split(/\r?\n/g);
            // Parse output lines
            lines.forEach(function (line, i) {
                if (line.startsWith(doc.fileName)) {
                    line = line.replace(doc.fileName, '');
                    var terms = line.split(':');
                    console.log(terms[1] + ' ' + terms[2]);
                    var lineNum = parseInt(terms[1].trim()) - 1;
                    if (terms.length == 3)
                        diagnostics.push({
                            severity: vscode_1.DiagnosticSeverity.Error,
                            range: new vscode_1.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[2].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    else if (terms.length >= 4) {
                        var sev = void 0;
                        if (terms[2].trim() == 'error')
                            sev = vscode_1.DiagnosticSeverity.Error;
                        else if (terms[2].trim() == 'warning')
                            sev = vscode_1.DiagnosticSeverity.Warning;
                        else
                            sev = vscode_1.DiagnosticSeverity.Information;
                        diagnostics.push({
                            severity: sev,
                            range: new vscode_1.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[3].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                }
            });
            _this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    };
    return IcarusLinter;
}(BaseLinter_1["default"]));
exports["default"] = IcarusLinter;
