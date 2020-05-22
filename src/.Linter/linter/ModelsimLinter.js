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
var child  = require("child_process");
var BaseLinter = require("./BaseLinter");
var isWindows  = process.platform === "win32";
var ModelsimLinter = /** @class */ (function (_super) {
    __extends(ModelsimLinter, _super);
    function ModelsimLinter(logger) {
        var _this = _super.call(this, "modelsim", logger) || this;
        vscode.workspace.onDidChangeConfiguration(function () {
            _this.getConfig();
        });
        _this.getConfig();
        return _this;
    }
    ModelsimLinter.prototype.getConfig = function () {
        //get custom arguments
        this.modelsimArgs = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.arguments');
        this.modelsimWork = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.work');
        this.runAtFileLocation = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.runAtFileLocation');
    };
    ModelsimLinter.prototype.lint = function (doc) {
        var _this = this;
        this.logger.log('modelsim lint requested');
        var docUri = doc.uri.fsPath; //path of current doc
        var lastIndex = (isWindows == true) ? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
        var docFolder = docUri.substr(0, lastIndex); //folder of current doc
        var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode.workspace.rootPath; //choose correct location to run
        // no change needed for systemverilog
        var command = 'vlog -nologo -work ' + this.modelsimWork + ' \"' + doc.fileName + '\" ' + this.modelsimArgs; //command to execute
        var process = child.exec(command, { cwd: runLocation }, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stdout.split(/\r?\n/g);
            // ^\*\* (((Error)|(Warning))( \(suppressible\))?: )(\([a-z]+-[0-9]+\) )?([^\(]*\(([0-9]+)\): )(\([a-z]+-[0-9]+\) )?((((near|Unknown identifier|Undefined variable):? )?["']([\w:;\.]+)["'][ :.]*)?.*)
            // From https://github.com/dave2pi/SublimeLinter-contrib-vlog/blob/master/linter.py
            var regexExp = "^\\*\\* (((Error)|(Warning))( \\(suppressible\\))?: )(\\([a-z]+-[0-9]+\\) )?([^\\(]*)\\(([0-9]+)\\): (\\([a-z]+-[0-9]+\\) )?((((near|Unknown identifier|Undefined variable):? )?[\"\']([\\w:;\\.]+)[\"\'][ :.]*)?.*)";
            // Parse output lines
            lines.forEach(function (line, i) {
                var sev;
                if (line.startsWith('**')) {
                    var m = line.match(regexExp);
                    try {
                        if (m[7] != doc.fileName)
                            return;
                        switch (m[2]) {
                            case "Error":
                                sev = vscode.DiagnosticSeverity.Error;
                                break;
                            case "Warning":
                                sev = vscode.DiagnosticSeverity.Warning;
                                break;
                            default:
                                sev = vscode.DiagnosticSeverity.Information;
                                break;
                        }
                        var lineNum = parseInt(m[8]) - 1;
                        var msg = m[10];
                        diagnostics.push({
                            severity: sev,
                            range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: msg,
                            code: 'modelsim',
                            source: 'modelsim'
                        });
                    }
                    catch (e) {
                        diagnostics.push({
                            severity: sev,
                            range: new vscode.Range(0, 0, 0, Number.MAX_VALUE),
                            message: line,
                            code: 'modelsim',
                            source: 'modelsim'
                        });
                    }
                }
            });
            _this.logger.log(diagnostics.length + ' errors/warnings returned');
            _this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    };
    return ModelsimLinter;
}(BaseLinter["default"]));
exports["default"] = ModelsimLinter;
