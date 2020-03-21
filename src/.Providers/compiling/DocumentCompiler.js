"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const path = require("path");
const child = require("child_process");
const common_1 = require("../utils/common");
const server_1 = require("../utils/server");
/*
    DocumentCompiler is an abstract class that defines the common behavior of Document compilers.
*/
class DocumentCompiler {
    constructor(connection, documents, workspaceRootPath, configurations, compilerConfigurationsKeys) {
        this.connection = connection;
        this.documents = documents;
        this.workspaceRootPath = workspaceRootPath;
        this.configurations = configurations;
        this.compilerConfigurationsKeys = compilerConfigurationsKeys;
    }
    /**
        Compiles the given `document`, builds the runtime arguments using on the pre defined settings,
        and adds each `Diagnostic` to an array mapped to the referred document's uri.

        @param document the document to compile
        @returns a `Thenable` map of entries mapping each uri to a `Diagnostic` array
    */
    getTextDocumentDiagnostics(document) {
        return new Promise((resolve, reject) => {
            if (!document) {
                reject("SystemVerilog: Invalid document.");
                return;
            }
            if (!server_1.isSystemVerilogDocument(document) && !server_1.isVerilogDocument(document)) {
                reject("The document is not a SystemVerilog/Verilog file.");
                return;
            }
            let diagnosticCollection = new Map();
            var filePath = common_1.getPathFromUri(document.uri, this.workspaceRootPath);
            var args = [];
            if (this.configurations.has(this.compilerConfigurationsKeys[2])) {
                args.push(this.configurations.get(this.compilerConfigurationsKeys[2]));
            }
            else {
                reject("'" + this.compilerConfigurationsKeys[2] + "' configuration is undefined.");
                return;
            }
            args.push(filePath);
            this.connection.console.log(args.join(" "));
            child.exec(args.join(" "), (error, stdout, stderr) => {
                this.connection.console.log(stdout);
                this.connection.console.log(stderr);
                this.parseDiagnostics(error, stdout, stderr, document, filePath, diagnosticCollection);
                resolve(diagnosticCollection);
            });
        });
    }
    /**
        Publishes a given `Diagnostic` to a document specified by a `filePath`.
        It resets the Diagnostics array for the document if `resetDiagnostics` is `true`.

        @param document the compiled document
        @param resetDiagnostics whether to reset the diagnostics or not
        @param diagnosticData the DiagnosticData
        @param collection the collection to add the Diagnostics too
        @returns a message if an error occurred.
    */
    publishDiagnosticForDocument(compiledDocument, resetDiagnostics, diagnosticData, collection) {
        let diagnostic = undefined;
        let diagnostics = undefined;
        if (diagnosticData.filePath.localeCompare(common_1.getPathFromUri(compiledDocument.uri, this.workspaceRootPath)) === 0) {
            //set `diagnostic`'s range
            let range = server_1.getLineRange(diagnosticData.line, diagnosticData.offendingSymbol, diagnosticData.charPosition);
            diagnostic = {
                severity: diagnosticData.diagnosticSeverity,
                range: range,
                message: diagnosticData.problem,
                source: 'systemverilog'
            };
            if (!resetDiagnostics && collection.has(compiledDocument.uri)) {
                diagnostics = collection.get(compiledDocument.uri).concat([diagnostic]);
            }
            else {
                diagnostics = [diagnostic];
            }
            collection.set(compiledDocument.uri, diagnostics);
        }
        else {
            let filteredUris = this.filterDocumentsUris(diagnosticData.filePath);
            if (filteredUris.length == 1) {
                let uri = filteredUris[0];
                let document = this.documents.get(uri);
                let range = server_1.getLineRange(diagnosticData.line, diagnosticData.offendingSymbol, diagnosticData.charPosition);
                diagnostic = {
                    severity: diagnosticData.diagnosticSeverity,
                    range: range,
                    message: diagnosticData.problem,
                    source: 'systemverilog'
                };
                if (!resetDiagnostics && collection.has(uri)) {
                    diagnostics = collection.get(uri).concat([diagnostic]);
                }
                else {
                    diagnostics = [diagnostic];
                }
                collection.set(uri, diagnostics);
            }
        }
    }
    /**
        Filters the keys for `documents` by comparing the basename of each key with the basename of a given `filePath`

        @param filePath the filePath to compare too
        @returns the array of filtered keys
    */
    filterDocumentsUris(filePath) {
        return this.documents.keys().filter(function (key) {
            if (path.basename(key.trim()).localeCompare(path.basename(filePath.trim())) === 0) {
                return true;
            }
            return false;
        });
    }
    /**
        Converts a given string `severity` into enum type `DiagnosticSeverity`

        @param severity the severity
        @returns the converted `DiagnosticSeverity`
    */
    getDiagnosticSeverity(severity) {
        severity = severity.trim();
        if (severity == "Error") {
            return vscode_languageserver_1.DiagnosticSeverity.Error;
        }
        else if (severity == "Warning") {
            return vscode_languageserver_1.DiagnosticSeverity.Warning;
        }
        else {
            return vscode_languageserver_1.DiagnosticSeverity.Information;
        }
    }
}
exports.DocumentCompiler = DocumentCompiler;
//# sourceMappingURL=DocumentCompiler.js.map