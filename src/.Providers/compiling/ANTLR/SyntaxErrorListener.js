"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Stores errors in ANTLR parsing in a list for later access
 */
class SyntaxErrorListener {
    constructor() {
        this.error_list = [];
    }
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
        line = line - 1;
        this.error_list.push({ offendingSymbol, line, charPositionInLine, msg });
    }
}
exports.SyntaxErrorListener = SyntaxErrorListener;
//# sourceMappingURL=SyntaxErrorListener.js.map