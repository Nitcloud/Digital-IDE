"use strict";
exports.__esModule = true;
var vscode_1 = require("vscode");
var child = require("child_process");
var Logger_1 = require("./Logger");
// Internal representation of a symbol
var Symbol = /** @class */ (function () {
    function Symbol(name, type, pattern, startLine, parentScope, parentType, endLine, isValid) {
        this.name = name;
        this.type = type;
        this.pattern = pattern;
        this.startPosition = new vscode_1.Position(startLine, 0);
        this.parentScope = parentScope;
        this.parentType = parentType;
        this.isValid = isValid;
        this.endPosition = new vscode_1.Position(endLine, Number.MAX_VALUE);
    }
    Symbol.prototype.setEndPosition = function (endLine) {
        this.endPosition = new vscode_1.Position(endLine, Number.MAX_VALUE);
        this.isValid = true;
    };
    Symbol.prototype.getDocumentSymbol = function () {
        var range = new vscode_1.Range(this.startPosition, this.endPosition);
        return new vscode_1.DocumentSymbol(this.name, this.type, Symbol.getSymbolKind(this.type), range, range);
    };
    Symbol.isContainer = function (type) {
        switch (type) {
            case 'constant':
            case 'event':
            case 'net':
            case 'port':
            case 'register':
            case 'modport':
            case 'prototype':
            case 'typedef':
            case 'property':
            case 'assert':
                return false;
            case 'function':
            case 'module':
            case 'task':
            case 'block':
            case 'class':
            case 'covergroup':
            case 'enum':
            case 'interface':
            case 'package':
            case 'program':
            case 'struct':
                return true;
        }
    };
    // types used by ctags
    // taken from https://github.com/universal-ctags/ctags/blob/master/parsers/verilog.c
    Symbol.getSymbolKind = function (name) {
        switch (name) {
            case 'constant': return vscode_1.SymbolKind.Constant;
            case 'event': return vscode_1.SymbolKind.Event;
            case 'function': return vscode_1.SymbolKind.Function;
            case 'module': return vscode_1.SymbolKind.Module;
            case 'net': return vscode_1.SymbolKind.Variable;
            // Boolean uses a double headed arrow as symbol (kinda looks like a port)
            case 'port': return vscode_1.SymbolKind.Boolean;
            case 'register': return vscode_1.SymbolKind.Variable;
            case 'task': return vscode_1.SymbolKind.Function;
            case 'block': return vscode_1.SymbolKind.Module;
            case 'assert': return vscode_1.SymbolKind.Variable; // No idea what to use
            case 'class': return vscode_1.SymbolKind.Class;
            case 'covergroup': return vscode_1.SymbolKind.Class; // No idea what to use
            case 'enum': return vscode_1.SymbolKind.Enum;
            case 'interface': return vscode_1.SymbolKind.Interface;
            case 'modport': return vscode_1.SymbolKind.Boolean; // same as ports
            case 'package': return vscode_1.SymbolKind.Package;
            case 'program': return vscode_1.SymbolKind.Module;
            case 'prototype': return vscode_1.SymbolKind.Function;
            case 'property': return vscode_1.SymbolKind.Property;
            case 'struct': return vscode_1.SymbolKind.Struct;
            case 'typedef': return vscode_1.SymbolKind.TypeParameter;
            default: return vscode_1.SymbolKind.Variable;
        }
    };
    return Symbol;
}());
exports.Symbol = Symbol;
// TODO: add a user setting to enable/disable all ctags based operations
var Ctags = /** @class */ (function () {
    function Ctags(logger) {
        this.symbols = [];
        this.isDirty = true;
        this.logger = logger;
    }
    Ctags.prototype.setDocument = function (doc) {
        this.doc = doc;
        this.clearSymbols();
    };
    Ctags.prototype.clearSymbols = function () {
        this.isDirty = true;
        this.symbols = [];
    };
    Ctags.prototype.getSymbolsList = function () {
        return this.symbols;
    };
    Ctags.prototype.execCtags = function (filepath) {
        console.log("executing ctags");
        var ctags = vscode_1.workspace.getConfiguration().get('verilog.ctags.path');
        var command = ctags + ' -f - --fields=+K --sort=no --excmd=n "' + filepath + '"';
        console.log(command);
        this.logger.log(command, Logger_1.Log_Severity.Command);
        return new Promise(function (resolve, reject) {
            child.exec(command, function (error, stdout, stderr) {
                resolve(stdout);
            });
        });
    };
    Ctags.prototype.parseTagLine = function (line) {
        try {
            var name_1, type = void 0, pattern = void 0, lineNoStr = void 0, parentScope = void 0, parentType = void 0;
            var scope = void 0;
            var lineNo = void 0;
            var parts = line.split('\t');
            name_1 = parts[0];
            // pattern = parts[2];
            type = parts[3];
            if (parts.length == 5) {
                scope = parts[4].split(':');
                parentType = scope[0];
                parentScope = scope[1];
            }
            else {
                parentScope = '';
                parentType = '';
            }
            lineNoStr = parts[2];
            lineNo = Number(lineNoStr.slice(0, -2)) - 1;
            return new Symbol(name_1, type, pattern, lineNo, parentScope, parentType, lineNo, false);
        }
        catch (e) {
            console.log(e);
            this.logger.log('Ctags Line Parser: ' + e, Logger_1.Log_Severity.Error);
            this.logger.log('Line: ' + line, Logger_1.Log_Severity.Error);
        }
    };
    Ctags.prototype.buildSymbolsList = function (tags) {
        var _this = this;
        try {
            console.log("building symbols");
            if (tags === '') {
                console.log("No output from ctags");
                return;
            }
            // Parse ctags output
            var lines = tags.split(/\r?\n/);
            lines.forEach(function (line) {
                if (line !== '')
                    _this.symbols.push(_this.parseTagLine(line));
            });
            // end tags are not supported yet in ctags. So, using regex
            var match_1;
            var endPosition_1;
            var text = this.doc.getText();
            var eRegex = /^(?![\r\n])\s*end(\w*)*[\s:]?/gm;
            while (match_1 = eRegex.exec(text)) {
                if (match_1 && typeof match_1[1] !== 'undefined') {
                    endPosition_1 = this.doc.positionAt(match_1.index + match_1[0].length - 1);
                    // get the starting symbols of the same type
                    // doesn't check for begin...end blocks
                    var s = this.symbols.filter(function (i) { return i.type === match_1[1] && i.startPosition.isBefore(endPosition_1) && !i.isValid; });
                    if (s.length > 0) {
                        // get the symbol nearest to the end tag
                        var max = s[0];
                        for (var i = 0; i < s.length; i++) {
                            max = s[i].startPosition.isAfter(max.startPosition) ? s[i] : max;
                        }
                        for (var _i = 0, _a = this.symbols; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.name === max.name && i.startPosition.isEqual(max.startPosition) && i.type === max.type) {
                                i.setEndPosition(endPosition_1.line);
                                break;
                            }
                        }
                    }
                }
            }
            console.log(this.symbols);
            this.isDirty = false;
            return Promise.resolve();
        }
        catch (e) {
            console.log(e);
        }
    };
    Ctags.prototype.index = function () {
        var _this = this;
        console.log("indexing...");
        return new Promise(function (resolve, reject) {
            _this.execCtags(_this.doc.uri.fsPath)
                .then(function (output) { return _this.buildSymbolsList(output); })
                .then(function () { return resolve(); });
        });
    };
    return Ctags;
}());
exports.Ctags = Ctags;
var CtagsManager = /** @class */ (function () {
    function CtagsManager(logger) {
        this.logger = logger;
        CtagsManager.ctags = new Ctags(logger);
    }
    CtagsManager.prototype.configure = function () {
        console.log("ctags manager configure");
        vscode_1.workspace.onDidSaveTextDocument(this.onSave);
        vscode_1.window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor);
    };
    CtagsManager.prototype.onSave = function (doc) {
        console.log("on save");
        CtagsManager.ctags.clearSymbols();
        // Should automatically refresh the Document symbols show, but doesn't seem to be working
        vscode_1.commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri);
    };
    CtagsManager.prototype.onDidChangeActiveTextEditor = function (editor) {
        if (!this.isOutputPanel(editor.document.uri)) {
            console.log("on open");
            CtagsManager.ctags.setDocument(editor.document);
        }
    };
    CtagsManager.prototype.isOutputPanel = function (uri) {
        return uri.toString().startsWith('output:extension-output-');
    };
    return CtagsManager;
}());
exports.CtagsManager = CtagsManager;
