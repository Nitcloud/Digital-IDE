"use strict";
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
exports.__esModule = true;
var vscode_1 = require("vscode");
var IcarusLinter_1 = require("./IcarusLinter");
var VerilatorLinter_1 = require("./VerilatorLinter");
var XvlogLinter_1 = require("./XvlogLinter");
var ModelsimLinter_1 = require("./ModelsimLinter");
var LintManager = /** @class */ (function () {
    function LintManager() {
        vscode_1.workspace.onDidOpenTextDocument(this.lint, this, this.subscriptions);
        vscode_1.workspace.onDidSaveTextDocument(this.lint, this, this.subscriptions);
        vscode_1.workspace.onDidCloseTextDocument(this.removeFileDiagnostics, this, this.subscriptions);
        vscode_1.workspace.onDidChangeConfiguration(this.configLinter, this, this.subscriptions);
        this.configLinter();
    }
    LintManager.prototype.configLinter = function () {
        var linter_name;
        linter_name = vscode_1.workspace.getConfiguration("HDL.linting").get("linter");
        if (this.linter == null || this.linter.name != linter_name) {
            switch (linter_name) {
                case "iverilog":
                    this.linter = new IcarusLinter_1["default"]();
                    break;
                case "xvlog":
                    this.linter = new XvlogLinter_1["default"]();
                    break;
                case "modelsim":
                    this.linter = new ModelsimLinter_1["default"]();
                    break;
                case "verilator":
                    this.linter = new VerilatorLinter_1["default"]();
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
    };
    LintManager.prototype.lint = function (doc) {
        // Check for language id
        var lang = doc.languageId;
        if (this.linter != null && (lang === "verilog" || lang === "systemverilog"))
            this.linter.startLint(doc);
    };
    LintManager.prototype.removeFileDiagnostics = function (doc) {
        if (this.linter != null)
            this.linter.removeFileDiagnostics(doc);
    };
    LintManager.prototype.RunLintTool = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lang, linterStr, tempLinter_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lang = vscode_1.window.activeTextEditor.document.languageId;
                        if (!(vscode_1.window.activeTextEditor === undefined || (lang !== "verilog" && lang !== "systemverilog"))) return [3 /*break*/, 1];
                        vscode_1.window.showErrorMessage("Verilog HDL: No document opened");
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, vscode_1.window.showQuickPick([
                            { label: "iverilog",
                                description: "Icarus Verilog"
                            },
                            { label: "xvlog",
                                description: "Vivado Logical Simulator"
                            },
                            { label: "modelsim",
                                description: "Modelsim"
                            },
                            { label: "verilator",
                                description: "Verilator"
                            }
                        ], { matchOnDescription: true,
                            placeHolder: "Choose a linter to run"
                        })];
                    case 2:
                        linterStr = _a.sent();
                        if (linterStr === undefined)
                            return [2 /*return*/];
                        switch (linterStr.label) {
                            case "iverilog":
                                tempLinter_1 = new IcarusLinter_1["default"]();
                                break;
                            case "xvlog":
                                tempLinter_1 = new XvlogLinter_1["default"]();
                                break;
                            case "modelsim":
                                tempLinter_1 = new ModelsimLinter_1["default"]();
                                break;
                            case "verilator":
                                tempLinter_1 = new VerilatorLinter_1["default"]();
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        return [4 /*yield*/, vscode_1.window.withProgress({
                                location: vscode_1.ProgressLocation.Notification,
                                title: "Verilog HDL: Running lint tool..."
                            }, function (progress, token) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    tempLinter_1.removeFileDiagnostics(vscode_1.window.activeTextEditor.document);
                                    tempLinter_1.startLint(vscode_1.window.activeTextEditor.document);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LintManager;
}());
exports["default"] = LintManager;
