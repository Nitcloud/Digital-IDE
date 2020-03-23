'use strict';
const ENT_BEGIN = /\s*entity\s+(\w*)\s+is.*/;
const ARCH_BEGIN = /\s*architecture\s+(\w*)\s+of\s+(\w*)\s+is.*/;
const CONF_BEGIN = /\s*configuration\s+(\w*)\s+of\s+(\w*)\s+is.*/;
const SCOPE_END = /\s*end\s+(\w*).*/;
function guessScope(doc, cursorLineNum) {
    return new ScopeGuesser(cursorLineNum).guess(doc);
}
exports.guessScope = guessScope;
(function (VhdlScopeKind) {
    VhdlScopeKind[VhdlScopeKind["Vhdl"] = 0] = "Vhdl";
    VhdlScopeKind[VhdlScopeKind["Entity"] = 1] = "Entity";
    VhdlScopeKind[VhdlScopeKind["Architecture"] = 2] = "Architecture";
    VhdlScopeKind[VhdlScopeKind["Configuration"] = 3] = "Configuration";
})(exports.VhdlScopeKind || (exports.VhdlScopeKind = {}));
var VhdlScopeKind = exports.VhdlScopeKind;
class VhdlScope {
    constructor(kind, lineFrom) {
        this.kind = kind;
        this.children = [];
        this.lineFrom = lineFrom;
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
}
exports.VhdlScope = VhdlScope;
class ScopeGuesser {
    constructor(cursorLineNum) {
        this.cursorLineNum = cursorLineNum;
    }
    guess(doc) {
        this.enterScope(VhdlScopeKind.Vhdl, 0);
        for (var i = 0; i < doc.lineCount; i++) {
            var line = doc.lineAt(i);
            if (!line.isEmptyOrWhitespace) {
                let lineText = line.text;
                if (lineText.match(/^\s*\-\-/)) {
                    continue;
                }
                else if (lineText.match(ENT_BEGIN)) {
                    this.enterScope(VhdlScopeKind.Entity, i);
                }
                else if (lineText.match(ARCH_BEGIN)) {
                    this.enterScope(VhdlScopeKind.Architecture, i);
                }
                else if (lineText.match(CONF_BEGIN)) {
                    this.enterScope(VhdlScopeKind.Configuration, i);
                }
                else if (lineText.match(SCOPE_END)) {
                    this.exitScope(i);
                }
            }
        }
        this.exitScope(doc.lineCount);
        return this.scopeAtCursor;
    }
    enterScope(kind, lineNum) {
        let newScope = new VhdlScope(kind, lineNum);
        if (this.currentScope) {
            this.currentScope.addChild(newScope);
        }
        this.currentScope = newScope;
    }
    exitScope(lineNum) {
        this.currentScope.lineTo = lineNum;
        if (!this.scopeAtCursor) {
            if (this.currentScope.lineFrom <= this.cursorLineNum
                && this.currentScope.lineTo >= this.cursorLineNum) {
                this.scopeAtCursor = this.currentScope;
            }
        }
        if (this.currentScope.parent) {
            this.currentScope = this.currentScope.parent;
        }
    }
}
//# sourceMappingURL=vhdlScopeGuesser.js.map