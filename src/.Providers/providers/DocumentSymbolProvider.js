"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class SystemVerilogDocumentSymbolProvider {
    constructor(parser) {
        this.depth = -1;
        this.parser = parser;
        const settings = vscode.workspace.getConfiguration();
        this.precision = settings.get("HDL.documentSymbolsPrecision");
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
    return new Array(new vscode.SymbolInformation("File", vscode.SymbolKind.File, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Module", vscode.SymbolKind.Module, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Namespace", vscode.SymbolKind.Namespace, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Package", vscode.SymbolKind.Package, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Class", vscode.SymbolKind.Class, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Method", vscode.SymbolKind.Method, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Property", vscode.SymbolKind.Property, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Field", vscode.SymbolKind.Field, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Constructor", vscode.SymbolKind.Constructor, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Enum", vscode.SymbolKind.Enum, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Interface", vscode.SymbolKind.Interface, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Function", vscode.SymbolKind.Function, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Variable", vscode.SymbolKind.Variable, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Constant", vscode.SymbolKind.Constant, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("String", vscode.SymbolKind.String, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Number", vscode.SymbolKind.Number, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Boolean", vscode.SymbolKind.Boolean, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Array", vscode.SymbolKind.Array, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Object", vscode.SymbolKind.Object, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Key", vscode.SymbolKind.Key, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Null", vscode.SymbolKind.Null, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("EnumMember", vscode.SymbolKind.EnumMember, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Struct", vscode.SymbolKind.Struct, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Event", vscode.SymbolKind.Event, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("Operator", vscode.SymbolKind.Operator, "", new vscode.Location(uri, new vscode.Position(0, 0))), new vscode.SymbolInformation("TypeParameter", vscode.SymbolKind.TypeParameter, "", new vscode.Location(uri, new vscode.Position(0, 0))));
}
//# sourceMappingURL=DocumentSymbolProvider.js.map