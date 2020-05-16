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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SystemVerilogDefinitionProvider {
    constructor(workspaceSymProvider) {
        // Strings used in regex'es
        // private regex_module = '$\\s*word\\s*(';
        this.regex_port = '\\.word\\s*\\(';
        this.regex_package = '\\b(\\w+)\\s*::\\s*(word)';
        this.workspaceSymProvider = workspaceSymProvider;
    };
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let range = document.getWordRangeAtPosition(position);
            let line = document.lineAt(position.line).text;
            let word = document.getText(range);
            // Check for port
            let match_port = line.match(this.regex_port.replace('word', word));
            let match_package = line.match(this.regex_package.replace('word', word));
            if (!range) {
                reject();
            }
            // Port
            else if (match_port && match_port.index === range.start.character - 1) {
                let container = moduleFromPort(document, range);
                resolve(Promise.resolve(this.workspaceSymProvider.provideWorkspaceSymbols(container, token, true).then(res => {
                    return Promise.all(res.map(x => findPortLocation(x, word)));
                }).then(arrWithUndefined => {
                    return clean(arrWithUndefined, undefined);
                })));
                reject();
            }
            // Parameter
            else if (match_package && line.indexOf(word, match_package.index) == range.start.character) {
                yield this.workspaceSymProvider.provideWorkspaceSymbols(match_package[1], token, true)
                    .then((ws_symbols) => {
                    if (ws_symbols.length && ws_symbols[0].location) {
                        return ws_symbols[0].location.uri;
                    }
                }).then(uri => {
                    if (uri) {
                        vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri, word).then((symbols) => {
                            let results = [];
                            getDocumentSymbols(results, symbols, word, uri, match_package[1]);
                            resolve(results);
                        });
                    }
                });
                reject();
            }
            else {
                // Lookup all symbols in the current document
                yield vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri, word)
                    .then((symbols) => {
                    let results = [];
                    getDocumentSymbols(results, symbols, word, document.uri);
                    if (results.length !== 0) {
                        resolve(results);
                    }
                });
                yield this.workspaceSymProvider.provideWorkspaceSymbols(word, token, true)
                    .then(res => {
                    if (res.length !== 0) {
                        resolve(res.map(x => x.location));
                    }
                });
                reject();
            }
        }));
    }
}
exports.SystemVerilogDefinitionProvider = SystemVerilogDefinitionProvider;
// Retrieves locations from the hierarchical DocumentSymbols
function getDocumentSymbols(results, entries, word, uri, containerName) {
    for (let entry of entries) {
        if (entry.name === word) {
            if (containerName) {
                if (entry.containerName === containerName) {
                    results.push({
                        uri: uri,
                        range: entry.range,
                    });
                }
            }
            else {
                results.push({
                    uri: uri,
                    range: entry.range,
                });
            }
        }
        if (entry.children) {
            getDocumentSymbols(results, entry.children, word, uri);
        }
    }
}
function moduleFromPort(document, range) {
    let text = document.getText(new vscode.Range(new vscode.Position(0, 0), range.end));
    let depthParathesis = 0;
    let i = 0;
    for (i = text.length; i > 0; i--) {
        if (text[i] == ')')
            depthParathesis++;
        else if (text[i] == '(')
            depthParathesis--;
        if (depthParathesis == -1) {
            let match_param = text.slice(0, i).match(/(\w+)\s*#\s*$/);
            let match_simple = text.slice(0, i).match(/(\w+)\s+(\w+)\s*$/);
            if (match_param)
                return match_param[1];
            else if (match_simple)
                return match_simple[1];
        }
    }
}
exports.moduleFromPort = moduleFromPort;
function findPortLocation(symbol, port) {
    return vscode.workspace.openTextDocument(symbol.location.uri).then(doc => {
        for (let i = symbol.location.range.start.line; i < doc.lineCount; i++) {
            let line = doc.lineAt(i).text;
            if (line.match("\\bword\\b".replace('word', port))) {
                return new vscode.Location(symbol.location.uri, new vscode.Position(i, line.indexOf(port)));
            }
        }
    });
}
function clean(arr, deleteValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}
//# sourceMappingURL=DefintionProvider.js.map