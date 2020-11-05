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

const fspath = require("path");
const vscode = require("vscode");
const parse  = require("./parse");
const serve  = require("./serve");
const utils  = require("./utils");

function isHDLDocument(document) {
    if (!document) {
        return false;
    }
    if (document.languageId === "systemverilog" || 
        document.languageId === "verilog") {
        return true;
    }
    return false;
}

class HDLMonitor {
    constructor (parser,preProcess) {
        this.parser = parser;
        this.preProcess = preProcess;
    }
    /**
        Removes the given `document`'s symbols from `this.symbols`,
        Gets the current symbols which exist on the document to add to `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param document the document that's been changed
        @return status message when indexing is successful or failed with an error.
    */
    onChange(document) {
        this.parser.get_instModulePath();
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                this.parser.removeCurrentFileParam(document);
                console.log(parse.HDLparam);
                if (!isHDLDocument(document)) {
                    return;
                }
                else {
                    return this.preProcess.processFile(document.uri);
                }
            });
        });
    }
    /**
        Adds the given `document`'s symbols to `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param uri the document's Uri
        @return status message when indexing is successful or failed with an error.
    */
    onCreate(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                return vscode.workspace.openTextDocument(uri).then((document) => {
                    return this.onChange(document);
                });
            });
        });
    }
    /**
        Removes the given `document`'s symbols from `this.symbols`.
        Updates the status bar with the current symbols count in the workspace.

        @param uri the document's Uri
        @return status message when indexing is successful or failed with an error.
    */
    onDelete(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise(() => {
                return vscode.workspace.openTextDocument(uri).then((document) => {
                    return this.onChange(document);
                });
            });
        });
    }
}
exports.HDLMonitor = HDLMonitor;

class prjMonitor {
    constructor (context) {
        this.context = context;
        this.refreshProperty = new utils.refreshProperty();
        this.monitorProperty(this.context);
    }
    monitorProperty(context) {
        let jsonWatcher = vscode.workspace.createFileSystemWatcher("**/*.json", false, false, false);
        context.subscriptions.push(jsonWatcher.onDidChange((uri) => {
            // vscode.window.showInformationMessage("changed");
            if (fspath.basename(uri.fsPath) == "property.json") {		
                this.refreshProperty.updateFolder(serve.opeParam.rootPath,serve.opeParam.workspacePath,uri.fsPath);
                this.refreshProperty.updatePrjInfo(serve.opeParam.rootPath,uri.fsPath);
            }
        }));
        context.subscriptions.push(jsonWatcher);
    }
}
exports.prjMonitor = prjMonitor;