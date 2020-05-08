'use strict';
exports.__esModule = true;

var vscode = require("vscode");
var exec   = require('child_process').exec;

function runCmd(cmdline) {
	exec(cmdline,function (error, stdout, stderr) {
		vscode.window.showInformationMessage(stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			vscode.window.showErrorMessage(error);
		}
		else{
			vscode.window.showInformationMessage("successfully!!!");
		}
	});
}
exports.runCmd = runCmd;

function colorText(text,colorIndex) {
    var output = '';
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        if (char === ' ' || char === '\r' || char === '\n') {
            output += char;
        }
        else {
            output += "\u001B[3" + colorIndex++ + "m" + text.charAt(i) + "\u001B[0m";
            if (colorIndex > 6) {
                colorIndex = 1;
            }
        }
    }
    return output;
}
exports.colorText = colorText;

function selectTerminal() {
    var terminals = vscode.window.terminals;
    var items = terminals.map(function (t) {
        return {
            label: "name: " + t.name,
            terminal: t
        };
    });
    return vscode.window.showQuickPick(items).then(function (item) {
        return item ? item.terminal : undefined;
    });
}
exports.selectTerminal = selectTerminal;

function ensureTerminalExists(name) {
	let Exists_flag = false
	vscode.window.terminals.forEach(element => {
		if (element.name == name) {
			Exists_flag = true
		}
	});
	return Exists_flag
}
exports.ensureTerminalExists = ensureTerminalExists;

