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

const vscode   = require("vscode");

const tool     = require("HDLtool");
const linter   = require("HDLlinter");
const parser   = require("HDLparser");
const filesys  = require("HDLfilesys");

function activate(context) {
    var HDLparam = [];
    let HDLFileList = [];
    let opeParam = {
        "os"             : "",
        "prjInfo"        : null,
        "rootPath"       : "",
        "workspacePath"  : "",
        "currentSrcPath" : "",
        "prjInitParam"   : "",
        "propertyPath"   : ""
    }
    filesys.prjs.getOpeParam(`${__dirname}`,opeParam);
    filesys.prjs.refreshPrjFiles(opeParam, HDLFileList);

	// Output Channel
	var outputChannel = vscode.window.createOutputChannel("HDL");

    // Status Bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	context.subscriptions.push(statusBar);
    
    tool.registerXilinxServer(opeParam);
    tool.registerDebugServer(opeParam);
    tool.registerTreeServer(opeParam);
    tool.registerToolServer(opeParam);
    tool.registerSocServer(opeParam);

    let parse = new parser.ParserLib.ParserFactory;

    try {
        parse.getParser("verilog").then((lang_parser)=>{
            console.time('timer');
            const indexer = new parser.indexer(statusBar, HDLparam, lang_parser);
            indexer.build_index(HDLFileList).then(() => {
                console.timeEnd('timer');
                // console.log(indexer.HDLparam);
                // console.log(indexer.symbols);
                var vlogComplete = new tool.lspCompletion.vlogCompletion(indexer.HDLparam);
                var fileExplorer = new tool.tree.FileExplorer(indexer.HDLparam, opeParam);
                let watcher = filesys.monitor.monitor(opeParam.workspacePath, opeParam, indexer, outputChannel, () => {
                    vlogComplete.HDLparam = indexer.HDLparam;
                    fileExplorer.treeDataProvider.HDLparam = indexer.HDLparam;
                    fileExplorer.treeDataProvider.refresh();
                });
            //    let processLib = new filesys.prjs.processLib(opeParam, watcher);
            //     filesys.monitor.processPropertyFile(opeParam, indexer, processLib); 
                // linter Server
                // new linter.registerLinterServer("vhdl", "linter", context);
                // project Server
                filesys.registerPrjsServer(context, opeParam);
                // tool Server
                tool.registerSimServer(indexer, opeParam);
                tool.registerLspServer(context, indexer, vlogComplete);
                tool.registerBuildServer(context, indexer, opeParam);
            });
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;