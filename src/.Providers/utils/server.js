"use strict";
/* Defines tools that require `vscode-languageserver` module */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver = require("vscode-languageserver");
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
/**
        Gets the `range` of a line given the line number

        @param line the line number
        @return the line's range
    */
function getLineRange(line, offendingSymbol, startPosition) {
    let endPosition;
    if (startPosition == null && offendingSymbol == null) {
        startPosition = 0;
        endPosition = Number.MAX_VALUE;
    }
    else {
        endPosition = startPosition + offendingSymbol.length;
    }
    return vscode_languageserver.Range.create(vscode_languageserver.Position.create(line, startPosition), vscode_languageserver.Position.create(line, (endPosition)));
}
exports.getLineRange = getLineRange;
//# sourceMappingURL=server.js.map