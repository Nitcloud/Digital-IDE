exports.__esModule = true;
var vscode = require("vscode");

// def showlog(path):
// 	xlog_flag = 0
// 	folder = os.path.exists(path)
// 	if folder:
// 		f_log  = open("./prj/xilinx/LOG.log", 'w')
// 		f_xlog = open(path, 'r')
// 		log_line = f_xlog.readline()
// 		while log_line:
// 			if re.match("ERROR:", log_line) :
// 				f_log.write(log_line)
// 				xlog_flag = 1
// 			if re.match("CRITICAL WARNING:", log_line) :
// 				f_log.write(log_line)
// 				if xlog_flag == 0:
// 					xlog_flag = 2
// 			log_line = f_xlog.readline()
// 		f_log.close()
// 		f_xlog.close()
// 	return xlog_flag

var Log_Severity;
(function (Log_Severity) {
    Log_Severity[Log_Severity["Info"]    = 0] = "Info";
    Log_Severity[Log_Severity["Warn"]    = 1] = "Warn";
    Log_Severity[Log_Severity["Error"]   = 2] = "Error";
    Log_Severity[Log_Severity["Command"] = 3] = "Command";
})(Log_Severity = exports.Log_Severity || (exports.Log_Severity = {}));

class Logger {
    constructor(channel) {
        var _this = this;
        this.channel = channel;
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
                this.channel.appendLine("> " + msg);
            else
                this.channel.appendLine("[" + Log_Severity[severity] + "] " + msg);
        }
    }
}
exports.Logger = Logger;
