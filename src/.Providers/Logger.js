exports.__esModule = true;
var vscode = require("vscode");
var logChannel = vscode.window.createOutputChannel("Verilog");
var Log_Severity;
(function (Log_Severity) {
    Log_Severity[Log_Severity["Info"] = 0] = "Info";
    Log_Severity[Log_Severity["Warn"] = 1] = "Warn";
    Log_Severity[Log_Severity["Error"] = 2] = "Error";
    Log_Severity[Log_Severity["Command"] = 3] = "Command";
})(Log_Severity = exports.Log_Severity || (exports.Log_Severity = {}));
class Logger {
    constructor() {
        var _this = this;
        // Register for any changes to logging
        vscode.workspace.onDidChangeConfiguration(function () {
            _this.CheckIfEnabled();
        });
        this.CheckIfEnabled();
    }
    CheckIfEnabled() {
        this.isEnabled = vscode.workspace.getConfiguration().get('HDL.logging.enabled');
    }
    log(msg, severity) {
        if (severity === void 0) { severity = Log_Severity.Info; }
        if (this.isEnabled) {
            if (severity == Log_Severity.Command)
                logChannel.appendLine("> " + msg);
            else
                logChannel.appendLine("[" + Log_Severity[severity] + "] " + msg);
        }
    }
}
exports.Logger = Logger;
