"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class SystemVerilogSymbol extends vscode_1.SymbolInformation {
    /**
     * Creates a new symbol information object.
     *
     * @param name The name of the symbol.
     * @param type The name of the symbol.
     * @param containerName The name of the symbol containing the symbol.
     * @param location The location of the symbol.
     */
    constructor(name, type, containerName, location) {
        super(name, getSymbolKind(type), containerName, location);
        this.type = type;
    }
}
exports.SystemVerilogSymbol = SystemVerilogSymbol;
// See docs/SymbolKind_icons.png for an overview of the available icons
// Use show_SymbolKinds to see the latest symbols
function getSymbolKind(name) {
    if (name === undefined || name === '') { // Ports may be declared without type
        return vscode_1.SymbolKind.Variable;
    }
    else if (name.indexOf('[') != -1) {
        return vscode_1.SymbolKind.Array;
    }
    switch (name) {
        case 'parameter':
        case 'localparam': return vscode_1.SymbolKind.Constant;
        case 'package':
        case 'program':
        case 'import': return vscode_1.SymbolKind.Package;
        case 'begin': // Labels
        case 'string': return vscode_1.SymbolKind.String;
        case 'class': return vscode_1.SymbolKind.Class;
        case 'task': return vscode_1.SymbolKind.Method;
        case 'function': return vscode_1.SymbolKind.Function;
        case 'interface': return vscode_1.SymbolKind.Interface;
        case 'assert':
        case 'event': return vscode_1.SymbolKind.Event;
        case 'struct': return vscode_1.SymbolKind.Struct;
        case 'typedef': return vscode_1.SymbolKind.TypeParameter;
        case 'genvar': return vscode_1.SymbolKind.Operator;
        case 'enum': return vscode_1.SymbolKind.Enum;
        case 'modport': return vscode_1.SymbolKind.Null;
        case 'define':
        case 'property': return vscode_1.SymbolKind.Property;
        case 'wire':
        case 'reg':
        case 'bit':
        case 'logic':
        case 'int':
        case 'integer':
        case 'char':
        case 'time':
        case 'float': return vscode_1.SymbolKind.Variable;
        case 'module':
        default: return vscode_1.SymbolKind.Field;
    }
    /* Unused/Free SymbolKind icons
        return SymbolKind.Number;
        return SymbolKind.Enum;
        return SymbolKind.EnumMember;
        return SymbolKind.Operator;
        return SymbolKind.Array;
    */
}
exports.getSymbolKind = getSymbolKind;
//# sourceMappingURL=symbol.js.map