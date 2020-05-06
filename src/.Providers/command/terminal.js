'use strict';
exports.__esModule = true;
var vscode = require("vscode");

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

function activate(context) {
    var NEXT_TERM_ID = 1;
    console.log("Terminals: " + vscode.window.terminals.length);
    // vscode.window.onDidOpenTerminal
    vscode.window.onDidOpenTerminal(function (terminal) {
        console.log("Terminal opened. Total count: " + vscode.window.terminals.length);
    });
    vscode.window.onDidOpenTerminal(function (terminal) {
        vscode.window.showInformationMessage("onDidOpenTerminal, name: " + terminal.name);
    });
    // vscode.window.onDidChangeActiveTerminal
    vscode.window.onDidChangeActiveTerminal(function (e) {
        console.log("Active terminal changed, name=" + (e ? e.name : 'undefined'));
    });
    // vscode.window.createTerminal
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.createTerminal', function () {
        vscode.window.createTerminal("Ext Terminal #" + NEXT_TERM_ID++);
        vscode.window.showInformationMessage('Hello World 2!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.createTerminalHideFromUser', function () {
        vscode.window.createTerminal({
            name: "Ext Terminal #" + NEXT_TERM_ID++,
            hideFromUser: true
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.createAndSend', function () {
        var terminal = vscode.window.createTerminal("Ext Terminal #" + NEXT_TERM_ID++);
        terminal.sendText("echo 'Sent text immediately after creating'");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.createZshLoginShell', function () {
        vscode.window.createTerminal("Ext Terminal #" + NEXT_TERM_ID++, '/bin/zsh', ['-l']);
    }));
    // Terminal.hide
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.hide', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.hide();
                }
            });
        }
    }));
    // Terminal.show
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.show', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.show();
                }
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.showPreserveFocus', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.show(true);
                }
            });
        }
    }));
    // Terminal.sendText
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.sendText', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.sendText("echo 'Hello world!'");
                }
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.sendTextNoNewLine', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.sendText("echo 'Hello world!'", false);
                }
            });
        }
    }));
    // Terminal.dispose
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.dispose', function () {
        if (ensureTerminalExists()) {
            selectTerminal().then(function (terminal) {
                if (terminal) {
                    terminal.dispose();
                }
            });
        }
    }));
    // Terminal.processId
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.processId', function () {
        selectTerminal().then(function (terminal) {
            if (!terminal) {
                return;
            }
            terminal.processId.then(function (processId) {
                if (processId) {
                    vscode.window.showInformationMessage("Terminal.processId: " + processId);
                }
                else {
                    vscode.window.showInformationMessage('Terminal does not have a process ID');
                }
            });
        });
    }));
    // vscode.window.onDidCloseTerminal
    vscode.window.onDidCloseTerminal(function (terminal) {
        vscode.window.showInformationMessage("onDidCloseTerminal, name: " + terminal.name);
    });
    // vscode.window.terminals
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.terminals', function () {
        selectTerminal();
    }));
    // vvv Proposed APIs below vvv
    // vscode.window.onDidWriteTerminalData
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.onDidWriteTerminalData', function () {
        vscode.window.onDidWriteTerminalData(function (e) {
            vscode.window.showInformationMessage("onDidWriteTerminalData listener attached, check the devtools console to see events");
            console.log('onDidWriteData', e);
        });
    }));
    // vscode.window.onDidChangeTerminalDimensions
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.onDidChangeTerminalDimensions', function () {
        vscode.window.showInformationMessage("Listening to onDidChangeTerminalDimensions, check the devtools console to see events");
        vscode.window.onDidChangeTerminalDimensions(function (event) {
            console.log("onDidChangeTerminalDimensions: terminal:" + event.terminal.name + ", columns=" + event.dimensions.columns + ", rows=" + event.dimensions.rows);
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.updateEnvironment', function () {
        var collection = context.environmentVariableCollection;
        collection.replace('FOO', 'BAR');
        collection.append('PATH', '/test/path');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('terminalTest.clearEnvironment', function () {
        var collection = context.environmentVariableCollection;
        collection.clear();
    }));
}