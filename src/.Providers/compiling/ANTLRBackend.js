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
const vscode_languageserver_1 = require("vscode-languageserver");
const antlr4ts_1 = require("antlr4ts");
const SystemVerilogLexer_1 = require("./ANTLR/grammar/build/SystemVerilogLexer");
const SystemVerilogParser_1 = require("./ANTLR/grammar/build/SystemVerilogParser");
const SyntaxErrorListener_1 = require("./ANTLR/SyntaxErrorListener");
const server_1 = require("../utils/server");
class ANTLRBackend {
    /**
     * Parse a document with the ANTLR parser and return any diagnostic errors
     *
     * @param document the document to parse
     * @returns a dictionary of arrays of errors with uri as keys
     */
    getDiagnostics(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!document) {
                    reject("SystemVerilog: Invalid document.");
                    return;
                }
                if (!server_1.isSystemVerilogDocument(document) && !server_1.isVerilogDocument(document)) {
                    reject("The document is not a SystemVerilog/Verilog file.");
                    return;
                }
                let visitedDocuments = new Map();
                let diagnosticCollection = new Map();
                // Get document text
                let text = document.getText();
                // Perform macro replacements
                let new_text = this.macroReplace(text);
                // Create the lexer and parser
                let inputStream = new antlr4ts_1.ANTLRInputStream(new_text);
                let lexer = new SystemVerilogLexer_1.SystemVerilogLexer(inputStream);
                let tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
                let parser = new SystemVerilogParser_1.SystemVerilogParser(tokenStream);
                //Use syntaxError to collect a list of errors found by the parser
                let syntaxError = new SyntaxErrorListener_1.SyntaxErrorListener();
                parser.addErrorListener(syntaxError);
                // Parse the input
                let tree = parser.system_verilog_text();
                //place errors in the diagnostic list
                let diagnosticList = new Array();
                for (let i = 0; i < syntaxError.error_list.length; i++) {
                    let range = server_1.getLineRange(syntaxError.error_list[i].line, syntaxError.error_list[i].offendingSymbol.text, syntaxError.error_list[i].charPositionInLine);
                    let diagnostic = {
                        severity: vscode_languageserver_1.DiagnosticSeverity.Error,
                        range: range,
                        message: this.getImprovedMessage(syntaxError.error_list[i], document.uri, syntaxError.error_list.length),
                        source: 'systemverilog'
                    };
                    if (diagnostic.message != "") //If message is blank, ignore it
                        diagnosticList.push(diagnostic);
                }
                diagnosticCollection.set(document.uri, diagnosticList);
                resolve(diagnosticCollection);
            });
        });
    }
    /**
        Function for getting a more helpful error message than the one included
        in the parser error msg property.

        @param parser_error The error object given by the parser
        @param uri The document the error is in
        @param error_count The number of errors found in the file, used to filter out some messages
        @returns The appropriate user facing error message
    */
    getImprovedMessage(parser_error, uri, error_count) {
        let out = parser_error.msg;
        if (parser_error.msg.startsWith("extraneous input")) {
            out = 'extraneous input "' + parser_error.offendingSymbol.text + '"';
        }
        if (parser_error.msg.startsWith("mismatched input")) {
            if (error_count > 1)
                out = ""; //filter out all errors for mismatched input
            else
                out = 'mismatched input "' + parser_error.offendingSymbol.text + '"';
        }
        return out;
    }
    /**
        Function for replacing macro uses with their appropriate text
        @param text The text to identify macro definitions and replace macro uses within
        @returns The text with macro definitions removed and their uses replaced with the text they represent
    */
    macroReplace(text) {
        let defines_with_text = this.extract_defines(text.replace(/\r\n/g, '\n'));
        let defines = defines_with_text[0];
        let new_text = defines_with_text[1];
        let newer_text = this.remove_ifdef_ifndef(new_text);
        return this.replace_defines(newer_text, defines);
    }
    /**
     * Function for removing all ifdef and ifndef blocks from text
     * @param text The text to remove all ifdef and ifndef blocks from
     * @returns The text with all ifdef and ifndef blocks removed
     */
    remove_ifdef_ifndef(text) {
        return text.replace(/(`ifdef|`ifndef)[\s\S]*?`endif/gm, '');
    }
    /**
        Function for identifying macro definitions and removing them from the text
        @param text The text to identify macro definitions and replace macro uses within
        @returns The array of macro labels and the text they represent, and the full text with the macro definitions removed
    */
    extract_defines(text) {
        let current_index = text.indexOf('`define');
        let defines = [];
        let new_text;
        if (current_index == -1) {
            new_text = text;
        }
        else {
            new_text = text.slice(0, current_index);
        }
        while (current_index != -1) {
            let label = text.slice(current_index).split(" ", 2)[1];
            let temp_index = text.indexOf('\n', current_index);
            while (temp_index != -1 && text.charAt(temp_index - 1) == '\\') {
                temp_index = text.indexOf('\n', temp_index + 1);
            }
            let value = text.slice(text.indexOf(label, current_index) + label.length + 1, temp_index);
            value = value.replace('\\\n', '\n');
            defines.push([label, value]);
            current_index = text.indexOf('`define', current_index + 1);
            if (current_index == -1) {
                new_text = new_text.concat(text.slice(temp_index + 1));
            }
            else {
                new_text = new_text.concat(text.slice(temp_index + 1, current_index));
            }
        }
        return [defines, new_text];
    }
    /**
        Function for replacing the appearances of defined macros with their appropriate text within the full text
        @param text The text to replace the macro uses within
        @param defines The array of macro labels and the text they represent
        @returns The full text, with macro uses replaced with the text they represent
    */
    replace_defines(text, defines) {
        let new_text = text;
        defines.forEach(function (define) {
            while (new_text.indexOf('`' + define[0]) != -1) {
                new_text = new_text.replace('`' + define[0], define[1]);
            }
        });
        return new_text;
    }
}
exports.ANTLRBackend = ANTLRBackend;
;
//# sourceMappingURL=ANTLRBackend.js.map