"use strict";

const vscode = require("vscode");

const soc = require("./soc/soc");
const tree = require("./tree/tree");
const build = require("./build/build");

const lspLinter = require("./lsp/protocol/linter");
const lspProvider = require("./lsp/protocol/provider");
const lspFormatter = require("./lsp/protocol/formatter");
const lspCompletion = require("./lsp/protocol/complete");
const lspTranslation = require("./lsp/protocol/translate");

const simInstance = require("./sim/instance");
const simulation = require("./sim/simulation");
const simTestbench = require("./sim/testbench");

const showLibPick = require("./tool/lib/lib");
const showNetlist = require("./tool/netlist/netlist");
const showFSMGraph = require("./tool/fsm/fsm_view");

exports.tree = tree;
exports.build = build;

exports.lspProvider = lspProvider;
exports.lspCompletion = lspCompletion;
exports.simulation = simulation;
exports.simInstance = simInstance;
exports.simTestbench = simTestbench;

/**
 * HDL语言服务注册函数
 * @param {*} context 
 * @param {*} indexer 
 */
function registerLspServer(context, indexer) {

    // Configure Provider manager
    const HDL_lsp = [
        { scheme: 'file', language: 'systemverilog' },
        { scheme: 'file', language: 'verilog' },
        { scheme: 'file', language: 'vhdl' }
    ];
    
    // Translate Language sever
    vscode.commands.registerCommand('TOOL.vhdl2vlog', (uri) => {
        let docPath = uri.fsPath.replace(/\\/g, '/');
        lspTranslation.vhdl2vlog(docPath);
    });

    // Formatting Language sever
    vscode.languages.registerDocumentFormattingEditProvider(
        HDL_lsp,
        new lspFormatter.Formatter()
    );

    // Linter Language sever
    lspLinter.registerLinterServer();

    // Complete Language sever
    vscode.languages.registerCompletionItemProvider(
        [HDL_lsp[0],HDL_lsp[1]],
        new lspCompletion.vlogCompletion(indexer),
        '.','`','$'
    )

    vscode.languages.registerCompletionItemProvider(
        HDL_lsp[2],
        new lspCompletion.vhdlCompletion(),
        '.', '\"'
    );
    // vscode.languages.registerCompletionItemProvider(
    //     { scheme: 'file', language: 'json' },
    //     new lspCompletion.jsonCompletion(),
    //     '\/'
    // );

    // Providers Language sever
    const hovProvider = new lspProvider.HoverProvider(indexer);
    const docProvider = new lspProvider.DocumentSymbolProvider();
    const defProvider = new lspProvider.DefinitionProvider(indexer);
    vscode.languages.registerHoverProvider(HDL_lsp, hovProvider);
    vscode.languages.registerDefinitionProvider(HDL_lsp, defProvider);
    vscode.languages.registerDocumentSymbolProvider(HDL_lsp, docProvider);
    // const symProvider = new lspProvider.WorkspaceSymbolProvider(indexer);
    // vscode.languages.registerWorkspaceSymbolProvider(symProvider);
}
exports.registerLspServer = registerLspServer;

/**
 * 快速仿真服务注册函数
 * @param {*} indexer 
 * @param {*} process 
 */
function registerSimServer(context, indexer, process) {
    var simulate = new simulation.icarus(process);

    context.subscriptions.push(vscode.commands.registerCommand('TOOL.simulate', (uri) => {
        simulate.simulate(uri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('TOOL.instance', () => {
        simInstance.instantiateModuleInteract(indexer);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('TOOL.testbench', (uri) => {
        simTestbench.genInstancetoTbFile(indexer, process.opeParam, uri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('TOOL.Generate_template', () => {
        simTemplate.get_template();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('TOOL.Overwrite_tb', () => {
        simTestbench.Overwrite_tb(process.opeParam);
    }));
}
exports.registerSimServer = registerSimServer;

/**
 * 树状结构服务注册函数
 * @param {*} process 
 */
function registerTreeServer(process) {
    // // Tree View
    vscode.window.registerTreeDataProvider('TOOL.soft_tree', new tree.softTreeDataProvider(process));
    vscode.window.registerTreeDataProvider('TOOL.hard_tree', new tree.hardTreeDataProvider(process));
    vscode.window.registerTreeDataProvider('TOOL.Tool_tree', new tree.toolTreeDataProvider(process));
}
exports.registerTreeServer = registerTreeServer;

/**
 * 内置前端设计辅助服务注册函数
 * @param {*} context 
 * @param {*} indexer 
 * @param {*} process 
 */
function registerToolServer(context, indexer, process) {
    vscode.commands.registerCommand('TOOL.libPick', () => {
        let lib_quickPick = new showLibPick(process);
        lib_quickPick.pickLibItems();
    });

    vscode.commands.registerCommand('TOOL.netlist', (uri) => {
        let netlist_viewer = new showNetlist(context, indexer);
        netlist_viewer.open_viewer(uri, process.opeParam);
    });

    vscode.commands.registerCommand('TOOL.FSMGraph', (uri) => {
        let fsm_viewer = new showFSMGraph(context, process);
        fsm_viewer.open_viewer(uri);
    });
}
exports.registerToolServer = registerToolServer;

/**
 * 后端硬件设计辅助服务注册函数
 * @param {*} process 
 */
function registerHardServer(process) {
    let hardwareBuild = new build.hardwareRegister(process);
    vscode.commands.registerCommand('HARD.Launch', () => {
        hardwareBuild.launch();
    });
    vscode.commands.registerCommand('HARD.Refresh', () => {
        hardwareBuild.refresh();
    });
    vscode.commands.registerCommand('HARD.srcTop', (uri) => {
        hardwareBuild.setSrcTop(uri);
    });
    vscode.commands.registerCommand('HARD.simTop', (uri) => {
        hardwareBuild.setSimTop(uri);
    });
    vscode.commands.registerCommand('HARD.Simulate', () => {
        hardwareBuild.simulate();
    });
    vscode.commands.registerCommand('HARD.Build', () => {
        hardwareBuild.build();
    });
    vscode.commands.registerCommand('HARD.Synth', () => {
        hardwareBuild.synth();
    });
    vscode.commands.registerCommand('HARD.Impl', () => {
        hardwareBuild.impl();
    });
    vscode.commands.registerCommand('HARD.Bit', () => {
        hardwareBuild.generateBit();
    });
    vscode.commands.registerCommand('HARD.Program', () => {
        hardwareBuild.program();
    });
    vscode.commands.registerCommand('HARD.GUI', () => {
        hardwareBuild.gui();
    });
    vscode.commands.registerCommand('HARD.Exit', () => {
        hardwareBuild.exit();
    });
    vscode.commands.registerCommand('TOOL.BOOT', () => {
        hardwareBuild.boot();
    });
    vscode.commands.registerCommand('TOOL.Clean', () => {
        hardwareBuild.clean();
    });
}
exports.registerHardServer = registerHardServer;

/**
 * 软件设计辅助服务注册函数
 * @param {*} opeParam 
 */
function registerSoftServer(process) {
    let softwareRegister = new soc.softwareRegister();
    vscode.commands.registerCommand('SOFT.Launch', () => {
        softwareRegister.launch(process.opeParam);
    });
    vscode.commands.registerCommand('SOFT.Build', () => {
        softwareRegister.build(process.opeParam);
    });
    vscode.commands.registerCommand('SOFT.Download', () => {
        softwareRegister.program(process.opeParam);
    });
}
exports.registerSoftServer = registerSoftServer;