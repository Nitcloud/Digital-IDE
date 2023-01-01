const vscode = require("vscode");

const prj  = require('./prj/prjManage');
const tree = require("./tree/tree");

const instance = require("./sim/instance");
const testbench = require("./sim/testbench");

const html = require('./doc/html');
const doc = require('./doc');

const Lsp = require('./lsp');

// /**
//  * HDL语言服务注册函数
//  * @param {*} context 
//  * @param {*} indexer 
//  */
function registerLspServer(context) {
    // Configure Provider manager
    const vlogSelector = { scheme: 'file', language: 'verilog' };
    const svlogSelector = { scheme: 'file', language: 'systemverilog' };
    const vhdlSelector = { scheme: 'file', language: 'vhdl' };
    const HDLSelector = [vlogSelector, svlogSelector, vhdlSelector];
    
    // Translate Language sever
    Lsp.translateProvider();

    // Linter Language sever
    Lsp.linterProvider();

    // Formatting Language sever
    vscode.languages.registerDocumentFormattingEditProvider(HDLSelector, Lsp.formatterProvider.hdlFormatterProvide);

    // verilog lsp
    vscode.languages.registerHoverProvider(vlogSelector, Lsp.hoverProvider.vlogHoverProvider);
    vscode.languages.registerDefinitionProvider(vlogSelector, Lsp.definitionProvider.vlogDefinitionProvider);
    vscode.languages.registerDocumentSymbolProvider(vlogSelector, Lsp.docSymbolProvider.vlogDocSymbolProvider);

    vscode.languages.registerCompletionItemProvider(vlogSelector, Lsp.completionProvider.vlogIncludeCompletionProvider, '/');
    vscode.languages.registerCompletionItemProvider(vlogSelector, Lsp.completionProvider.vlogMacroCompletionProvider, '`');
    vscode.languages.registerCompletionItemProvider(vlogSelector, Lsp.completionProvider.vlogPositionPortProvider, '.');
    vscode.languages.registerCompletionItemProvider(vlogSelector, Lsp.completionProvider.vlogCompletionProvider);
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

    // context.subscriptions.push(vscode.commands.registerCommand('TOOL.Overwrite_tb', () => {
    //     simTestbench.Overwrite_tb(process.opeParam);
    // }));
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

function registerPrjServer(context) {
    prj.register();
    return new prj.PrjManage();
}

module.exports = {
    registerPrjServer,
    registerSimServer,
    registerTreeServer,
    registerDocumentation,
    registerLspServer
}