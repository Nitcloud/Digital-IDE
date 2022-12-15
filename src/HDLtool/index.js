const vscode = require("vscode");

const prj  = require('./prj/prjManage');
const tree = require("./tree/tree");

const instance = require("./sim/instance");
const testbench = require("./sim/testbench");

const manage = prj.PrjManage;
// /**
//  * HDL语言服务注册函数
//  * @param {*} context 
//  * @param {*} indexer 
//  */
// function registerLspServer(context, indexer) {

//     // Configure Provider manager
//     const HDL_lsp = [
//         { scheme: 'file', language: 'systemverilog' },
//         { scheme: 'file', language: 'verilog' },
//         { scheme: 'file', language: 'vhdl' }
//     ];
    
//     // Translate Language sever
//     vscode.commands.registerCommand('TOOL.vhdl2vlog', (uri) => {
//         let docPath = uri.fsPath.replace(/\\/g, '/');
//         lspTranslation.vhdl2vlog(docPath);
//     });

//     // Formatting Language sever
//     vscode.languages.registerDocumentFormattingEditProvider(
//         HDL_lsp,
//         new lspFormatter.Formatter()
//     );

//     // Linter Language sever
//     lspLinter.registerLinterServer();

//     // Complete Language sever
//     vscode.languages.registerCompletionItemProvider(
//         [HDL_lsp[0],HDL_lsp[1]],
//         new lspCompletion.vlogCompletion(indexer),
//         '.','`','$'
//     )

//     vscode.languages.registerCompletionItemProvider(
//         HDL_lsp[2],
//         new lspCompletion.vhdlCompletion(),
//         '.', '\"'
//     );
//     // vscode.languages.registerCompletionItemProvider(
//     //     { scheme: 'file', language: 'json' },
//     //     new lspCompletion.jsonCompletion(),
//     //     '\/'
//     // );

//     // Providers Language sever
//     const hovProvider = new lspProvider.HoverProvider(indexer);
//     const docProvider = new lspProvider.DocumentSymbolProvider();
//     const defProvider = new lspProvider.DefinitionProvider(indexer);
//     vscode.languages.registerHoverProvider(HDL_lsp, hovProvider);
//     vscode.languages.registerDefinitionProvider(HDL_lsp, defProvider);
//     vscode.languages.registerDocumentSymbolProvider(HDL_lsp, docProvider);
//     // const symProvider = new lspProvider.WorkspaceSymbolProvider(indexer);
//     // vscode.languages.registerWorkspaceSymbolProvider(symProvider);
// }
// exports.registerLspServer = registerLspServer;


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

function registerTreeServer() {
    vscode.window.registerTreeDataProvider('TOOL.arch_tree', new tree.ArchTreeProvider());
    vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new tree.ToolTreeProvider());
    vscode.window.registerTreeDataProvider('TOOL.hard_tree', new tree.HardwareTreeProvider());
    vscode.window.registerTreeDataProvider('TOOL.soft_tree', new tree.SoftwareTreeProvider());
}

function registerPrjServer() {
    prj.register();
    return new prj.PrjManage();
}

module.exports = {
    registerPrjServer,
    registerSimServer,
    registerTreeServer,
}