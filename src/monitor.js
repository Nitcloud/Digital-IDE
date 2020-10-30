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

const vscode = require("vscode");
const parse  = require("./parse");

function isHDLDocument(document) {
    if (!document) {
        return false;
    }
    if (document.languageId === "systemverilog" || document.languageId === "verilog") {
        return true;
    }
    return false;
}

class HDLMonitor {
    constructor(statusbar, parser, channel) {
        this.building = false;
        this.symbolsCount = 0;
        this.NUM_FILES = 250;
        this.HDLFileExtensions = ["sv", "v", "svh", "vh"];
        this.globPattern = "**/*.{" + this.HDLFileExtensions.join(",") + "}";
        this.exclude = undefined;
        this.forceFastIndexing = false;
        this.statusbar = statusbar;
        this.parser = parser;
        this.outputChannel = channel;
        this.symbols = new Map();
        const settings = vscode.workspace.getConfiguration();
        if (!settings.get('HDL.Indexing')) {
            this.statusbar.text = "HDL: Indexing disabled on boot";
        }
        else {
            this.build_index().then(() => {
                this.updateMostRecentSymbols(undefined);
            });
        }
    };
    /**
        Processes one file and updates this.symbols with an entry if symbols exist in the file.

        @param uri uri to the document
        @param total_files total number of files to determine parse-precision
    */
    processFile(uri, total_files = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                resolve(vscode.workspace.openTextDocument(uri).then(doc => {
                    if (total_files >= 1000 * this.parallelProcessing || this.forceFastIndexing) {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                    else if (total_files >= 100 * this.parallelProcessing) {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                    else {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                }));
            })).then((output) => {
                if (output.length > 0) {
                    if (this.symbols.has(uri.fsPath)) {
                        this.symbolsCount += output.length - this.symbols.get(uri.fsPath).length;
                    }
                    else {
                        this.symbolsCount += output.length;
                    }
                    this.symbols.set(uri.fsPath, output);
                    if (total_files == 0) { // If total files is 0, it is being used onChange
                        this.statusbar.text = 'HDL: ' + this.symbolsCount + ' indexed objects';
                    }
                }
            }).catch((error) => {
                this.outputChannel.appendLine("HDL: Indexing: Unable to process file: " + uri.toString());
                this.outputChannel.appendLine(error);
                if (this.symbols.has(uri.fsPath)) {
                    this.symbolsCount -= this.symbols.get(uri.fsPath).length;
                    this.symbols.delete(uri.fsPath);
                }
                return undefined;
            });
        });
    }
    /**
        Scans the `workspace` for HDL,
        Looks up all the `symbols` that it exist on the queried files,
        and saves the symbols as `HDLSymbol` objects to `this.symbols`.

        @return status message when indexing is successful or failed with an error.
    */
    build_index() {
        return __awaiter(this, void 0, void 0, function* () {
            var cancelled = false;
            this.building = true;
            this.symbolsCount = 0;
            this.statusbar.text = "HDL: Indexing..";
            const settings = vscode.workspace.getConfiguration();
            this.forceFastIndexing  = settings.get('HDL.forceFastIndexing');
            this.parallelProcessing = settings.get('HDL.parallelProcessing');
            let exclude = settings.get('HDL.excludeIndexing');
            if (exclude == "insert globPattern here") {
                exclude = undefined;
            }
            return yield vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "HDL Indexing...",
                cancellable: true
            }, (_progress, token) => __awaiter(this, void 0, void 0, function* () {
                this.symbols = new Map();
                let uris = yield Promise.resolve(vscode.workspace.findFiles(this.globPattern, exclude, undefined, token));
                console.time('build_index');
                for (var filenr = 0; filenr < uris.length; filenr += this.parallelProcessing) {
                    let subset = uris.slice(filenr, filenr + this.parallelProcessing);
                    if (token.isCancellationRequested) {
                        cancelled = true;
                        break;
                    }
                    yield Promise.all(subset.map(uri => {
                        return this.processFile(uri, uris.length);
                    }));
                }
            })).then(() => {
                this.building = false;
                console.timeEnd('build_index');
                if (cancelled) {
                    this.statusbar.text = "HDL: Indexing cancelled";
                }
                else {
                    this.statusbar.text = 'HDL: ' + this.symbolsCount + ' indexed objects';
                }
            });
        });
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
                    return this.processFile(document.uri);
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
    /**
        Updates `mostRecentSymbols` with the most recently used symbols
        When `mostRecentSymbols` is undefined, add the top `this.NUM_FILES` symbol from `this.symbols`
        When `mostRecentSymbols` is defined, add the symbols in `recentSymbols` one by one to the top of the array

        @param recentSymbols the recent symbols
    */
    updateMostRecentSymbols(recentSymbols) {
        if (this.mostRecentSymbols) {
            if (!recentSymbols) {
                return;
            }
            while (recentSymbols.length > 0) {
                let currentSymbol = recentSymbols.pop();
                //if symbol already exists, remove it
                for (let i = 0; i < this.mostRecentSymbols.length; i++) {
                    let symbol = this.mostRecentSymbols[i];
                    if (symbol == currentSymbol) {
                        this.mostRecentSymbols.splice(i, 1);
                        break;
                    }
                }
                //if the array has reached maximum capacity, remove the last element
                if (this.mostRecentSymbols.length >= this.NUM_FILES) {
                    this.mostRecentSymbols.pop();
                }
                //add the symbol to the top of the array
                this.mostRecentSymbols.unshift(currentSymbol);
            }
        }
        else {
            let maxSymbols = new Array();
            //collect the top symbols in `this.symbols`
            for (var list of this.symbols.values()) {
                if (maxSymbols.length + list.length >= this.NUM_FILES) {
                    let limit = this.NUM_FILES - maxSymbols.length;
                    maxSymbols = maxSymbols.concat(list.slice(-1 * limit));
                    break;
                }
                else {
                    maxSymbols = maxSymbols.concat(list);
                }
            }
            this.mostRecentSymbols = maxSymbols;
        }
    }
}
exports.HDLMonitor = HDLMonitor;

class prjMonitor {

}
exports.prjMonitor = prjMonitor;