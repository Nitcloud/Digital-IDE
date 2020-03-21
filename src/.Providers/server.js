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
const SystemVerilogCompiler_1 = require("./compiling/SystemVerilogCompiler");
const ANTLRBackend_1 = require("./compiling/ANTLRBackend");
// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents = new vscode_languageserver_1.TextDocuments();
let documentCompiler;
/* `configurations` is used to store the workspace's configs */
let configurations = new Map();
let compilerConfigurationsKeys = [
    "systemverilog.compilerType",
    "systemverilog.compileOnSave",
    "systemverilog.launchConfiguration",
    "systemverilog.antlrVerification",
    "systemverilog.verifyOnOpen"
];
let backend = new ANTLRBackend_1.ANTLRBackend();
connection.onInitialize((params) => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
        }
    };
});
connection.onInitialized(() => __awaiter(void 0, void 0, void 0, function* () {
    yield updateConfigurationsSettings();
}));
/**
 * This handler provides the initial list of the completion items.
 *
 * @param _textDocumentPosition Describes the location in the text document and the text document
 */
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [
    /*{
        label: 'TypeScript',
        kind: CompletionItemKind.Text,
        data: 1
    },
    {
        label: 'JavaScript',
        kind: CompletionItemKind.Text,
        data: 2
    }*/
    ];
});
/**
 * This handler resolves additional information for the item selected in
 * the completion list.
 *
 * @param item contains an item returned from onCompletion
 */
connection.onCompletionResolve((item) => {
    /*if (item.data === 1) {
        item.detail = 'TypeScript details';
        item.documentation = 'TypeScript documentation';
    } else if (item.data === 2) {
        item.detail = 'JavaScript details';
        item.documentation = 'JavaScript documentation';
    }*/
    return item;
});
connection.onNotification("workspaceRootPath", (rootPath) => {
    documentCompiler = new SystemVerilogCompiler_1.SystemVerilogCompiler(connection, documents, rootPath, configurations, compilerConfigurationsKeys);
});
connection.onNotification("onDidChangeConfiguration", () => __awaiter(void 0, void 0, void 0, function* () {
    yield updateConfigurationsSettings();
}));
/**
 * Updates `configurations` map with the most recent value of the settings
 */
function updateConfigurationsSettings() {
    return Promise.all(compilerConfigurationsKeys.map((configuration) => __awaiter(this, void 0, void 0, function* () {
        yield connection.workspace.getConfiguration({
            section: configuration
        }).then((value) => {
            configurations.set(configuration, value);
        });
    })));
}
/**
 *	If `compileOnSave` is set to true, the server will compile the document.
 *
 *  @param saveEvent An object containing information about the saved file
 */
documents.onDidSave(saveEvent => {
    if (configurations.get(compilerConfigurationsKeys[1])) {
        compile(saveEvent.document).catch((error) => {
            connection.window.showErrorMessage(error);
        });
    }
});
/**
 * Check whether a file is valid SystemVerilog based on the backend syntax parser
 *
 * @param uri The universal resource indicator for the document to verify
 */
function verifyDocument(uri) {
    if (configurations.get(compilerConfigurationsKeys[3])) { //Check for ANTLR verification being enabled
        backend.getDiagnostics(documents.get(uri)).then((diagnosticCollection) => {
            // Send the computed diagnostics to VSCode for each document
            for (const [uri, diagnostics] of diagnosticCollection.entries()) {
                connection.sendDiagnostics({ uri: uri, diagnostics });
            }
        }).catch((error) => {
            connection.window.showErrorMessage(error);
        });
    }
}
/**
 * Called when a file is open. Is called by vs code for all files in the workspace
 *
 * @param openEvent An object containing information about the opened file
 */
documents.onDidOpen((openEvent) => __awaiter(void 0, void 0, void 0, function* () {
    //Delay to allow configs to be initialized
    yield new Promise(resolve => setTimeout(resolve, 200));
    if (configurations.get(compilerConfigurationsKeys[4])) { //Check for verifyOnOpen being true
        verifyDocument(openEvent.document.uri);
    }
}));
/**
 * called on edit
 *
 * @param changeEvent An object containing information about the changed file
 */
documents.onDidChangeContent((changeEvent) => __awaiter(void 0, void 0, void 0, function* () {
    verifyDocument(changeEvent.document.uri);
}));
connection.onNotification("compileOpenedDocument", (uri) => {
    compile(documents.get(uri)).then(() => {
        //when finished compiling the document, send a notification to the client to close the `Progress` window
        connection.sendNotification("closeWindowProgress");
    }).catch((error) => {
        connection.window.showErrorMessage(error);
    });
});
/**
    Compiles a given `document`, gets the `Diagnostics` maped to each refrenced `uri`,
    sends the `Diagnosics` to the client to publish.

    @param document the document to compile
 */
function compile(document) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!documentCompiler) {
            return;
        }
        //remove existing Diagnostics for the targeted document
        connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
        //convert string to enum type `compilerType`
        let type = SystemVerilogCompiler_1.compilerType[configurations.get(compilerConfigurationsKeys[0])];
        documentCompiler.validateTextDocument(document, type).then((diagnosticCollection) => {
            // Send the computed diagnostics to VSCode for each document
            for (const [uri, diagnostics] of diagnosticCollection.entries()) {
                connection.sendDiagnostics({ uri: uri, diagnostics });
            }
        }).catch((error) => {
            connection.window.showErrorMessage(error);
        });
    });
}
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map