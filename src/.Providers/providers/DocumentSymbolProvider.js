"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class SystemVerilogDocumentSymbolProvider {
    constructor(parser) {
        this.depth = -1;
        this.parser = parser;
        const settings = vscode_1.workspace.getConfiguration();
        this.precision = settings.get("systemverilog.documentSymbolsPrecision");
        if (this.precision != "full") {
            this.depth = 1;
        }
    }
    /**
        Matches the regex pattern with the document's text. If a match is found, it creates a `SystemVerilogSymbol` object.
        If `documentSymbols` is not `undefined`, than the object is added to it,
        otherwise add the objects to an empty list and return it.
        
        @param document The document in which the command was invoked.
        @param token A cancellation token.
        @return A list of `SystemVerilogSymbol` objects or a thenable that resolves to such. The lack of a result can be
        signaled by returning `undefined`, `null`, or an empty list.
    */
    provideDocumentSymbols(document, token) {
        console.debug("provideDocumentSymbols!", document.uri.path);
        return new Promise((resolve) => {
            /*
            Matches the regex and uses the index from the regex to find the position
            TODO: Look through the symbols to check if it either is defined in the current file or in the workspace.
                  Use that information to figure out if an instanciated 'unknown' object is of a known type.
            */
            resolve(this.parser.get_all_recursive(document, this.precision, this.depth));
            // resolve(show_SymbolKinds(document.uri));
        });
    }
}
exports.SystemVerilogDocumentSymbolProvider = SystemVerilogDocumentSymbolProvider;
// Function to easily show all the SymbolKind icons
function show_SymbolKinds(uri) {
    return new Array(new vscode_1.SymbolInformation("File", vscode_1.SymbolKind.File, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Module", vscode_1.SymbolKind.Module, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Namespace", vscode_1.SymbolKind.Namespace, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Package", vscode_1.SymbolKind.Package, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Class", vscode_1.SymbolKind.Class, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Method", vscode_1.SymbolKind.Method, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Property", vscode_1.SymbolKind.Property, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Field", vscode_1.SymbolKind.Field, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Constructor", vscode_1.SymbolKind.Constructor, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Enum", vscode_1.SymbolKind.Enum, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Interface", vscode_1.SymbolKind.Interface, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Function", vscode_1.SymbolKind.Function, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Variable", vscode_1.SymbolKind.Variable, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Constant", vscode_1.SymbolKind.Constant, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("String", vscode_1.SymbolKind.String, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Number", vscode_1.SymbolKind.Number, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Boolean", vscode_1.SymbolKind.Boolean, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Array", vscode_1.SymbolKind.Array, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Object", vscode_1.SymbolKind.Object, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Key", vscode_1.SymbolKind.Key, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Null", vscode_1.SymbolKind.Null, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("EnumMember", vscode_1.SymbolKind.EnumMember, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Struct", vscode_1.SymbolKind.Struct, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Event", vscode_1.SymbolKind.Event, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("Operator", vscode_1.SymbolKind.Operator, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))), new vscode_1.SymbolInformation("TypeParameter", vscode_1.SymbolKind.TypeParameter, "", new vscode_1.Location(uri, new vscode_1.Position(0, 0))));
}
//# sourceMappingURL=DocumentSymbolProvider.js.map