// @ts-nocheck
/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 15:44:35
 * #lastTime     : 2020-02-15 17:26:23
 * #FilePath     : \src\extension.js
 * #Description  : 
 */
'use strict';

const fspath  = require("path");
const vscode  = require("vscode");

const tool    = require("HDLtool");
const linter  = require("HDLlinter");
const parser  = require("HDLparser");
const filesys = require("HDLfilesys");

// var synth = require("./yosys");

async function launch(process, indexer, context) {
    // linter Server
    linter.registerLinterServer();
    
    // project Server
    filesys.registerPrjsServer(process.opeParam);
    
    new tool.tree.FileExplorer(indexer, process);

    tool.registerTreeServer(process);
    tool.registerSoftServer(process);
    tool.registerHardServer(process);
    tool.registerLspServer(context,  indexer);
    tool.registerSimServer(context,  indexer, process);
    tool.registerToolServer(context, indexer, process);
}

async function activate(context) {
    const indexer = new parser.indexer();
    const process = new filesys.processPrjFiles(indexer);

    if (!process.getOpeParam(fspath.dirname(__dirname))) {
        return null;
    }

    process.monitorHDL();
    process.monitorPrjLog();
    process.monitorProperty();

    let result = await process.processPrjFiles(true);
    if (!result) {
        vscode.commands.registerCommand('TOOL.Launch', async () => {
            await process.processPrjFiles(true);
            launch(process, indexer, context);
        });
        return null;
    }

    launch(process, indexer, context);
}
exports.activate = activate;


function deactivate() {}
exports.deactivate = deactivate;