const vscode = require("vscode");

const prj  = require('./prj/prjManage');
const tree = require("./tree/tree");

const instance = require("./sim/instance");
const testbench = require("./sim/testbench");

const html = require('./doc/html');
const doc = require('./doc');

const lsp = require('./lsp');
const tool = require('./tool');

function registerLspServer(context) {
    // Configure Provider manager
    const vlogSelector = { scheme: 'file', language: 'verilog' };
    const svlogSelector = { scheme: 'file', language: 'systemverilog' };
    const vhdlSelector = { scheme: 'file', language: 'vhdl' };
    const HDLSelector = [vlogSelector, svlogSelector, vhdlSelector];
    
    // Translate Language sever
    lsp.translateProvider();

    // Linter Language sever
    lsp.linterProvider();

    // Formatting Language sever
    vscode.languages.registerDocumentFormattingEditProvider(HDLSelector, lsp.formatterProvider.hdlFormatterProvide);

    // verilog lsp
    vscode.languages.registerHoverProvider(vlogSelector, lsp.hoverProvider.vlogHoverProvider);
    vscode.languages.registerDefinitionProvider(vlogSelector, lsp.definitionProvider.vlogDefinitionProvider);
    vscode.languages.registerDocumentSymbolProvider(vlogSelector, lsp.docSymbolProvider.vlogDocSymbolProvider);

    vscode.languages.registerCompletionItemProvider(vlogSelector, lsp.completionProvider.vlogIncludeCompletionProvider, '/');
    vscode.languages.registerCompletionItemProvider(vlogSelector, lsp.completionProvider.vlogMacroCompletionProvider, '`');
    vscode.languages.registerCompletionItemProvider(vlogSelector, lsp.completionProvider.vlogPositionPortProvider, '.');
    vscode.languages.registerCompletionItemProvider(vlogSelector, lsp.completionProvider.vlogCompletionProvider);
}

function registerSimServer(context) {
    // var simulate = new simulation.icarus(process);

    // context.subscriptions.push(vscode.commands.registerCommand('TOOL.simulate', (uri) => {
    //     simulate.simulate(uri);
    // }));

    context.subscriptions.push(vscode.commands.registerCommand('TOOL.instance', () => {
        instance.instantiation();
    }));

    context.subscriptions.push(vscode.commands.registerCommand('TOOL.testbench', (uri) => {
        testbench.generate(uri);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('TOOL.overwrite.tb', () => {
        testbench.overwrite();
    }));
}

function registerTreeServer(context) {
    // register normal tree
    vscode.window.registerTreeDataProvider('TOOL-tree-arch', tree.archTreeProvider);
    vscode.window.registerTreeDataProvider('TOOL-tree-tool', tree.toolTreeProvider);
    vscode.window.registerTreeDataProvider('TOOL-tree-hardware', tree.hardwareTreeProvider);
    vscode.window.registerTreeDataProvider('TOOL-tree-software', tree.softwareTreeProvider);
    
    // constant used in tree
    vscode.commands.executeCommand('setContext', 'TOOL-tree-expand', false);

    // register command in tree
    vscode.commands.registerCommand('TOOL.tree.arch.expand', tree.expandTreeView);
    vscode.commands.registerCommand('TOOL.tree.arch.collapse', tree.collapseTreeView);
    vscode.commands.registerCommand('TOOL.tree.arch.refresh', tree.refreshArchTree);
    vscode.commands.registerCommand('TOOL.tree.arch.openFile', tree.openFileByUri);
}

function registerDocumentation(context) {
    vscode.commands.registerCommand('TOOL.doc.webview.show', html.showDocWebview);
    doc.registerFileDocExport(context);
    doc.registerProjectDocExport(context);
}

function registerToolServer(context) {
    context.subscriptions.push(vscode.commands.registerCommand('TOOL.netlist', (uri) => {
        const netViewer = new tool.net(context);
        netViewer.open(uri);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('TOOL.FSMGraph', (uri) => {
        const fsmViewer = new tool.fsm(context);
        fsmViewer.open(uri);
    }));
}

function registerPrjServer(context) {
    prj.register();

    return new prj.PrjManage();
}

module.exports = {
    registerPrjServer,
    registerSimServer,
    registerTreeServer,
    registerDocumentation,
    registerLspServer,
    registerToolServer
}