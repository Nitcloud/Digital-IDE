"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const DocumentCompiler_1 = require("./DocumentCompiler");
const DiagnosticData_1 = require("./DiagnosticData");
/**
 * CannotFindModule states: Handles the states of parsing `Cannot find` errors.
 */
var CannotFindModuleState;
(function (CannotFindModuleState) {
    CannotFindModuleState[CannotFindModuleState["CannotFindModule"] = 1] = "CannotFindModule";
    CannotFindModuleState[CannotFindModuleState["SearchPathNotFound"] = 2] = "SearchPathNotFound";
    CannotFindModuleState[CannotFindModuleState["LookedIn"] = 3] = "LookedIn";
    CannotFindModuleState[CannotFindModuleState["FilesSearched"] = 4] = "FilesSearched";
    CannotFindModuleState[CannotFindModuleState["End"] = 5] = "End";
})(CannotFindModuleState || (CannotFindModuleState = {}));
;
/**
 * Verilator Compiler class contains functionality for compiling SystemVerilog/Verilog files using Verilator simulator.
 * Generates and takes in predefined runtime arguments,
 * and eventually parses the errors/warnings in `stderr` into `Diagnostic` array mapped to each unique document's uri.
*/
class VerilatorCompiler extends DocumentCompiler_1.DocumentCompiler {
    constructor() {
        super(...arguments);
        //Regex expressions
        this.regexError = new RegExp("%Error: (.*):([0-9]+):(.*)");
        this.regexErrorWarning = new RegExp("%Error-(.*): (.*):([0-9]+):(.*)");
        this.regexWarning = new RegExp("%Warning-(.*): (.*):([0-9]+):(.*)");
        this.regexWarningSuggest = new RegExp("%Warning-(.*): (.*)");
        this.regexCannotFindModule = new RegExp("%Error: (.*):([0-9]+): Cannot find(.*): (.*)");
        this.regexSearchPathNotFound = new RegExp("%Error: (.*):([0-9]+): This may be because there's no search path specified with -I<dir>.");
        this.regexLookedIn = new RegExp("%Error: (.*):([0-9]+): Looked in:");
        this.regexFilesSearchedSource = "%Error: (.*):([0-9]+):       (.*)notFoundModulePlaceHolder(.v|.sv|.vh|.svh|)$";
    }
    /**
        Parses `stderr` into `Diagnostics` that are added to `collection` by adding each `Diagnostic` to an array
        The array is mapped in `collection` to the referred document's uri.

        @param error the process's error
        @param stdout the process's stdout
        @param stderr the process's stderr
        @param compiledDocument the document been compiled
        @param documentFilePath the `document`'s file path
        @param collection the collection to add the Diagnostics to
        @returns a message if an error occurred.
    */
    parseDiagnostics(error, stdout, stderr, compiledDocument, documentFilePath, collection) {
        if (stderr === undefined || stderr === null || !compiledDocument) {
            return;
        }
        //remove multiple new lines characters
        stderr = stderr.replace(/\r\n|\n|\r/g, '\n').trim();
        let errors = stderr.split(/\r|\n/g);
        let visitedDocuments = new Map();
        let previousLine = undefined;
        for (let i = 0; i < errors.length; i++) {
            let error = errors[i].trim();
            let diagnosticData = new DiagnosticData_1.DiagnosticData();
            let matches = undefined;
            if (matches = this.regexError.exec(error)) {
                if (matches && matches.length > 3) {
                    diagnosticData.filePath = matches[1];
                    diagnosticData.line = parseInt(matches[2]) - 1;
                    diagnosticData.problem = matches[3].trim();
                    diagnosticData.diagnosticSeverity = vscode_languageserver_1.DiagnosticSeverity.Error;
                }
            }
            else if (matches = this.regexErrorWarning.exec(error.trim())) {
                if (matches && matches.length > 4) {
                    diagnosticData.filePath = matches[2];
                    diagnosticData.line = parseInt(matches[3]) - 1;
                    diagnosticData.problem = matches[1] + ": " + matches[3];
                    diagnosticData.problem = diagnosticData.problem.trim();
                    diagnosticData.diagnosticSeverity = vscode_languageserver_1.DiagnosticSeverity.Error;
                }
            }
            else if (matches = this.regexWarningSuggest.exec(error.trim())) {
                if (matches = this.regexWarning.exec(error.trim())) {
                    if (matches && matches.length > 4) {
                        diagnosticData.filePath = matches[2];
                        diagnosticData.line = parseInt(matches[3]) - 1;
                        diagnosticData.problem = matches[1] + ": " + matches[4];
                        diagnosticData.problem = diagnosticData.problem.trim();
                        diagnosticData.diagnosticSeverity = vscode_languageserver_1.DiagnosticSeverity.Warning;
                    }
                }
                else if (previousLine !== undefined) {
                    matches = this.regexWarningSuggest.exec(error.trim());
                    if (matches && matches.length > 2) {
                        diagnosticData.filePath = documentFilePath;
                        diagnosticData.problem = matches[1] + ": " + matches[2];
                        diagnosticData.diagnosticSeverity = vscode_languageserver_1.DiagnosticSeverity.Information;
                    }
                }
            }
            if (matches = this.regexCannotFindModule.exec(error)) {
                if (matches && matches.length > 4) {
                    i = this.skipCannotFindModuleTrailingErrors(errors, i, matches[4]);
                }
            }
            if (diagnosticData.line !== undefined) {
                previousLine = diagnosticData.line;
            }
            else {
                diagnosticData.line = previousLine;
            }
            //push Diagnostic
            if (!DiagnosticData_1.isDiagnosticDataUndefined(diagnosticData)) {
                if (visitedDocuments.has(diagnosticData.filePath)) {
                    this.publishDiagnosticForDocument(compiledDocument, false, diagnosticData, collection);
                }
                else {
                    this.publishDiagnosticForDocument(compiledDocument, true, diagnosticData, collection);
                    visitedDocuments.set(diagnosticData.filePath, true);
                }
            }
        }
    }
    /**
        Skips trailing errors following `Cannot find` errors.

        @param errors the array containing the errors
        @param i the index where the error is located
        @param notFoundModule the module not found
        @returns the index where the trailing errors end
    */
    skipCannotFindModuleTrailingErrors(errors, i, notFoundModule) {
        let state = CannotFindModuleState.CannotFindModule;
        let regexFilesSearched = new RegExp(this.regexFilesSearchedSource.replace("notFoundModulePlaceHolder", notFoundModule));
        while (i < errors.length && state != CannotFindModuleState.End) {
            i++;
            let error = errors[i].trim();
            let matches = undefined;
            switch (state) {
                case CannotFindModuleState.CannotFindModule:
                    if (matches = this.regexSearchPathNotFound.exec(error)) {
                        state = CannotFindModuleState.SearchPathNotFound;
                    }
                    else if (matches = this.regexLookedIn.exec(error)) {
                        state = CannotFindModuleState.LookedIn;
                    }
                    else {
                        state = CannotFindModuleState.End;
                    }
                    break;
                case CannotFindModuleState.SearchPathNotFound:
                    if (matches = this.regexLookedIn.exec(error)) {
                        state = CannotFindModuleState.LookedIn;
                    }
                    else if (matches = regexFilesSearched.exec(error)) {
                        state = CannotFindModuleState.FilesSearched;
                    }
                    else {
                        state = CannotFindModuleState.End;
                    }
                    break;
                case (CannotFindModuleState.LookedIn):
                    if (matches = regexFilesSearched.exec(error)) {
                        state = CannotFindModuleState.FilesSearched;
                    }
                    else {
                        state = CannotFindModuleState.End;
                    }
                    break;
                case (CannotFindModuleState.FilesSearched):
                    if (!(matches = regexFilesSearched.exec(error))) {
                        state = CannotFindModuleState.End;
                    }
                    break;
                default:
                    state = CannotFindModuleState.End;
            }
        }
        if (state == CannotFindModuleState.End) {
            i--;
        }
        return i;
    }
}
exports.VerilatorCompiler = VerilatorCompiler;
//# sourceMappingURL=VerilatorCompiler.js.map