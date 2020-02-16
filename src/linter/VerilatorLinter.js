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
var Logger_1 = require("../Logger");
var isWindows = process.platform === "win32";
var VerilatorLinter = /** @class */ (function (_super) {
    __extends(VerilatorLinter, _super);
    function VerilatorLinter(logger) {
        var _this = _super.call(this, "verilator", logger) || this;
        vscode_1.workspace.onDidChangeConfiguration(function () {
            _this.getConfig();
        });
        _this.getConfig();
        return _this;
    }
    VerilatorLinter.prototype.getConfig = function () {
        this.verilatorArgs = vscode_1.workspace.getConfiguration().get('verilog.linting.verilator.arguments', '');
        this.runAtFileLocation = vscode_1.workspace.getConfiguration().get('verilog.linting.verilator.runAtFileLocation');
    };
    VerilatorLinter.prototype.splitTerms = function (line) {
        var terms = line.split(':');
        for (var i = 0; i < terms.length; i++) {
            if (terms[i] == ' ') {
                terms.splice(i, 1);
                i--;
            }
            else {
                terms[i] = terms[i].trim();
            }
        }
        return terms;
    };
    VerilatorLinter.prototype.getSeverity = function (severityString) {
        var result = vscode_1.DiagnosticSeverity.Information;
        if (severityString.startsWith('Error')) {
            result = vscode_1.DiagnosticSeverity.Error;
        }
        else if (severityString.startsWith('Warning')) {
            result = vscode_1.DiagnosticSeverity.Warning;
        }
        return result;
    };
    VerilatorLinter.prototype.lint = function (doc) {
        var _this = this;
        this.logger.log('verilator lint requested');
        var docUri = doc.uri.fsPath; //path of current doc
        var lastIndex = (isWindows == true) ? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
        var docFolder = docUri.substr(0, lastIndex); //folder of current doc
        var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode_1.workspace.rootPath; //choose correct location to run
        var svArgs = (doc.languageId == "systemverilog") ? "-sv" : ""; //Systemverilog args
        var command = 'verilator ' + svArgs + ' --lint-only -I' + docFolder + ' ' + this.verilatorArgs + ' \"' + doc.fileName + '\"'; //command to execute
        this.logger.log(command, Logger_1.Log_Severity.Command);
        var foo = child.exec(command, { cwd: runLocation }, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stderr.split(/\r?\n/g);
            // Parse output lines
            lines.forEach(function (line, i) {
                if (line.startsWith('%')) {
                    // remove the %
                    line = line.substr(1);
                    // was it for a submodule
                    if (line.search(doc.fileName) > 0) {
                        // remove the filename
                        line = line.replace(doc.fileName, '');
                        line = line.replace(/\s+/g, ' ').trim();
                        var terms = _this.splitTerms(line);
                        var severity = _this.getSeverity(terms[0]);
                        var message = terms.slice(2).join(' ');
                        var lineNum = parseInt(terms[1].trim()) - 1;
                        if (lineNum != NaN) {
                            console.log(terms[1].trim() + ' ' + message);
                            diagnostics.push({
                                severity: severity,
                                range: new vscode_1.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                                message: message,
                                code: 'verilator',
                                source: 'verilator'
                            });
                        }
                    }
                }
            });
            _this.logger.log(diagnostics.length + ' errors/warnings returned');
            _this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    };
    return VerilatorLinter;
}(BaseLinter_1["default"]));
exports["default"] = VerilatorLinter;
