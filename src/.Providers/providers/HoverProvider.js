"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                    return doc.lineAt(loc[0].range.start.line).text;
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