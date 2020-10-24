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

var vscode     = require("vscode");
var Logger     = require("./Logger");
var child      = require("child_process");
var isWindows  = process.platform === "win32";

var BaseLinter = /** @class */ (function () {
    class BaseLinter {
        constructor(name, logger) {
            this.diagnostic_collection = vscode.languages.createDiagnosticCollection();
            this.name = name;
            this.logger = logger;
        }
        startLint(doc) {
            this.lint(doc);
        }
        removeFileDiagnostics(doc) {
            this.diagnostic_collection["delete"](doc.uri);
        }
    }
    return BaseLinter;
}());
exports["default"] = BaseLinter;

var IcarusLinter = /** @class */ (function (_super) {
    __extends(IcarusLinter, _super);
    class IcarusLinter {
        constructor(logger) {
            var _this = _super.call(this, "iverilog", logger) || this;
            vscode.workspace.onDidChangeConfiguration(function () {
                _this.getConfig();
            });
            _this.getConfig();
            return _this;
        }
        getConfig() {
            this.iverilogArgs = vscode.workspace.getConfiguration().get('HDL.linting.iverilog.arguments');
            this.runAtFileLocation = vscode.workspace.getConfiguration().get('HDL.linting.iverilog.runAtFileLocation');
        }
        lint(doc) {
            var _this = this;
            this.logger.log('iverilog lint requested');
            var docUri = doc.uri.fsPath; //path of current doc
            var lastIndex = (isWindows == true) ? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
            var docFolder = docUri.substr(0, lastIndex); //folder of current doc
            var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode.workspace.rootPath; //choose correct location to run
            var svArgs = (doc.languageId == "systemverilog") ? "-g2012" : ""; //SystemVerilog args
            var command = 'iverilog ' + svArgs + ' -t null ' + this.iverilogArgs + ' \"' + doc.fileName + '\"'; //command to execute
            this.logger.log(command, Logger.Log_Severity.Command);
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
                        if (terms.length == 3) {
                            diagnostics.push({
                                severity: vscode.DiagnosticSeverity.Error,
                                range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                                message: terms[2].trim(),
                                code: 'iverilog',
                                source: 'iverilog'
                            });
                        }
                        else if (terms.length >= 4) {
                            var sev = void 0;
                            if (terms[2].trim() == 'error')
                                sev = vscode.DiagnosticSeverity.Error;
                            else if (terms[2].trim() == 'warning')
                                sev = vscode.DiagnosticSeverity.Warning;
                            else
                                sev = vscode.DiagnosticSeverity.Information;
                            diagnostics.push({
                                severity: sev,
                                range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                                message: terms[3].trim(),
                                code: 'iverilog',
                                source: 'iverilog'
                            });
                        }
                    }
                });
                _this.logger.log(diagnostics.length + ' errors/warnings returned');
                _this.diagnostic_collection.set(doc.uri, diagnostics);
            });
        }
    }
    return IcarusLinter;
}(BaseLinter["default"]));
exports["default"] = IcarusLinter;

var ModelsimLinter = /** @class */ (function (_super) {
    __extends(ModelsimLinter, _super);
    class ModelsimLinter {
        constructor(logger) {
            var _this = _super.call(this, "modelsim", logger) || this;
            vscode.workspace.onDidChangeConfiguration(function () {
                _this.getConfig();
            });
            _this.getConfig();
            return _this;
        }
        getConfig() {
            //get custom arguments
            this.modelsimArgs = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.arguments');
            this.modelsimWork = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.work');
            this.runAtFileLocation = vscode.workspace.getConfiguration().get('HDL.linting.modelsim.runAtFileLocation');
        }
        lint(doc) {
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
        }
    }
    return ModelsimLinter;
}(BaseLinter["default"]));
exports["default"] = ModelsimLinter;

var VerilatorLinter = /** @class */ (function (_super) {
    __extends(VerilatorLinter, _super);
    class VerilatorLinter {
        constructor(logger) {
            var _this = _super.call(this, "verilator", logger) || this;
            vscode.workspace.onDidChangeConfiguration(function () {
                _this.getConfig();
            });
            _this.getConfig();
            return _this;
        }
        getConfig() {
            this.verilatorArgs = vscode.workspace.getConfiguration().get('HDL.linting.verilator.arguments', '');
            this.runAtFileLocation = vscode.workspace.getConfiguration().get('HDL.linting.verilator.runAtFileLocation');
        }
        splitTerms(line) {
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
        }
        getSeverity(severityString) {
            var result = vscode.DiagnosticSeverity.Information;
            if (severityString.startsWith('Error')) {
                result = vscode.DiagnosticSeverity.Error;
            }
            else if (severityString.startsWith('Warning')) {
                result = vscode.DiagnosticSeverity.Warning;
            }
            return result;
        }
        lint(doc) {
            var _this = this;
            this.logger.log('verilator lint requested');
            var docUri = doc.uri.fsPath; //path of current doc
            var lastIndex = (isWindows == true) ? docUri.lastIndexOf("\\") : docUri.lastIndexOf("/");
            var docFolder = docUri.substr(0, lastIndex); //folder of current doc
            var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode.workspace.rootPath; //choose correct location to run
            var svArgs = (doc.languageId == "systemverilog") ? "-sv" : ""; //Systemverilog args
            var command = 'verilator ' + svArgs + ' --lint-only -I' + docFolder + ' ' + this.verilatorArgs + ' \"' + doc.fileName + '\"'; //command to execute
            this.logger.log(command, Logger.Log_Severity.Command);
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
                                    range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
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
        }
    }
    return VerilatorLinter;
}(BaseLinter["default"]));
exports["default"] = VerilatorLinter;

var XvlogLinter = /** @class */ (function (_super) {
    __extends(XvlogLinter, _super);
    class XvlogLinter {
        constructor(logger) {
            return _super.call(this, "xvlog", logger) || this;
        }
        lint(doc) {
            var _this = this;
            this.logger.log('xvlog lint requested');
            if (doc.languageId == "vhdl") {
                var command = "xvhdl " + " -nolog " + doc.fileName;
            } else {
                var svArgs = (doc.languageId == "systemverilog") ? "-sv" : ""; //Systemverilog args
                var command = "xvlog " + svArgs + " -nolog " + doc.fileName;
            }
            this.logger.log(command, Logger.Log_Severity.Command);
            var process = child_process.exec(command, function (error, stdout, stderr) {
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
                        severity: vscode.DiagnosticSeverity.Error,
                        code: tokens[1],
                        message: "[" + tokens[1] + "] " + tokens[2],
                        range: new vscode.Range(lineno, 0, lineno, Number.MAX_VALUE),
                        source: "xvlog"
                    };
                    diagnostics.push(diagnostic);
                });
                _this.logger.log(diagnostics.length + ' errors/warnings returned');
                _this.diagnostic_collection.set(doc.uri, diagnostics);
            });
        }
    }
    return XvlogLinter;
}(BaseLinter["default"]));
exports["default"] = XvlogLinter;

class LintManager {
    constructor(logger) {
        this.logger = logger;
        vscode.workspace.onDidOpenTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidCloseTextDocument(this.removeFileDiagnostics, this, this.subscriptions);
        vscode.workspace.onDidChangeConfiguration(this.configLinter, this, this.subscriptions);
        this.configLinter();
    }
    configLinter() {
        var linter_name;
        linter_name = vscode.workspace.getConfiguration("HDL.linting").get("linter");
        if (this.linter == null || this.linter.name != linter_name) {
            switch (linter_name) {
                case "iverilog":
                    this.linter = new IcarusLinter["default"](this.logger);
                    break;
                case "xvlog":
                    this.linter = new XvlogLinter["default"](this.logger);
                    break;
                case "modelsim":
                    this.linter = new ModelsimLinter["default"](this.logger);
                    break;
                case "verilator":
                    this.linter = new VerilatorLinter["default"](this.logger);
                    break;
                default:
                    console.log("Invalid linter name.");
                    this.linter = null;
                    break;
            }
        }
        if (this.linter != null) {
            console.log("Using linter " + this.linter.name);
        }
    }
    lint(doc) {
        // Check for language id
        var lang = doc.languageId;
        var linter_name = vscode.workspace.getConfiguration("HDL.linting").get("linter");
        if (linter_name == "xvlog") {
            if (this.linter != null && (lang === "verilog" || lang === "systemverilog" || lang === "vhdl"))
                this.linter.startLint(doc);
        } else {
            if (this.linter != null && (lang === "verilog" || lang === "systemverilog"))
                this.linter.startLint(doc);
        }
    }
    removeFileDiagnostics(doc) {
        if (this.linter != null)
            this.linter.removeFileDiagnostics(doc);
    }
    RunLintTool() {
        return __awaiter(this, void 0, void 0, function () {
            var lang, linterStr, tempLinter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lang = vscode.window.activeTextEditor.document.languageId;
                        if (!(vscode.window.activeTextEditor === undefined || (lang !== "verilog" && lang !== "systemverilog" && lang !== "vhdl")))
                            return [3 /*break*/, 1];
                        vscode.window.showErrorMessage("Verilog HDL: No document opened");
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, vscode.window.showQuickPick([
                        {
                            label: "iverilog",
                            description: "Icarus Verilog"
                        },
                        {
                            label: "xvlog",
                            description: "Vivado Logical Simulator"
                        },
                        {
                            label: "modelsim",
                            description: "Modelsim"
                        },
                        {
                            label: "verilator",
                            description: "Verilator"
                        }
                    ], {
                        matchOnDescription: true,
                        placeHolder: "Choose a linter to run"
                    })];
                    case 2:
                        linterStr = _a.sent();
                        if (linterStr === undefined)
                            return [2 /*return*/];
                        switch (linterStr.label) {
                            case "iverilog":
                                tempLinter = new IcarusLinter["default"](this.logger);
                                break;
                            case "xvlog":
                                tempLinter = new XvlogLinter["default"](this.logger);
                                break;
                            case "modelsim":
                                tempLinter = new ModelsimLinter["default"](this.logger);
                                break;
                            case "verilator":
                                tempLinter = new VerilatorLinter["default"](this.logger);
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        return [4 /*yield*/, vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Verilog HDL: Running lint tool..."
                        }, function (progress, token) {
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    tempLinter.removeFileDiagnostics(vscode.window.activeTextEditor.document);
                                    tempLinter.startLint(vscode.window.activeTextEditor.document);
                                    return [2 /*return*/];
                                });
                            });
                        })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
}
exports.LintManager = LintManager;