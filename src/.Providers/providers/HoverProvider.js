"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class SystemVerilogHoverProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            var lookupRange = document.getWordRangeAtPosition(position);
            if (!lookupRange) {
                return resolve(undefined);
            }
            resolve(vscode_1.commands.executeCommand("vscode.executeDefinitionProvider", document.uri, position, token)
                .then((loc) => {
                return vscode_1.workspace.openTextDocument(loc[0].uri).then(doc => {
                    return doc.lineAt(loc[0].range.start.line).text;
                });
            }).then((str) => {
                return new vscode_1.Hover([{
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