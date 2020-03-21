"use strict";
/* Defines tools that require `vscode` module */
Object.defineProperty(exports, "__esModule", { value: true });
/**
    Check if a given `document` is a SystemVerilog file.

    @param document the document to check
    @return true if the document is a SystemVerilog file
*/
function isSystemVerilogDocument(document) {
    if (!document) {
        return false;
    }
    if (document.languageId === "systemverilog") {
        return true;
    }
    return false;
}
exports.isSystemVerilogDocument = isSystemVerilogDocument;
/**
    Check if a given `document` is a Verilog file.

    @param document the document to check
    @return true if the document is a Verilog file
*/
function isVerilogDocument(document) {
    if (!document) {
        return false;
    }
    if (document.languageId === "verilog") {
        return true;
    }
    return false;
}
exports.isVerilogDocument = isVerilogDocument;
//# sourceMappingURL=client.js.map