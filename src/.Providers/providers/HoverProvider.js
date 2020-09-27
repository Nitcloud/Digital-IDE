"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SystemVerilogHoverProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            var lookupRange = document.getWordRangeAtPosition(position);
            if (!lookupRange) {
                return resolve(undefined);
            }
            resolve(vscode.commands.executeCommand("vscode.executeDefinitionProvider", document.uri, position, token)
                .then((loc) => {
                return vscode.workspace.openTextDocument(loc[0].uri).then(doc => {
					let content = doc.lineAt(loc[0].range.start.line).text;
					if(String.prototype.trim) {
						content = content.trim();
					} else {
						content = content.replace(/^\s+(.*?)\s+$/g, "$1");
					}
					return content.replace(/\/\//g, "\n//");
                });
            }).then((str) => {
                return new vscode.Hover([{
                        language: 'systemverilog',
                        value: str
                    }
                ]);
            }));
        });
    }
}
exports.SystemVerilogHoverProvider = SystemVerilogHoverProvider;
//# sourceMappingURL=HoverProvider.js.map