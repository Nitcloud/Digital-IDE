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

const vscode  = require("vscode");

const tool    = require("HDLtool");
const linter  = require("HDLlinter");
const parser  = require("HDLparser");
const filesys = require("HDLfilesys");

function activate(context) {
    var HDLparam = [];
    let HDLFileList = [];
    let opeParam = {
        "os"             : "",
        "rootPath"       : "",
        "workspacePath"  : "",
        "prjInfo"        : null,
        "currentHDLPath" : [],
        "prjInitParam"   : "",
        "propertyPath"   : ""
    }
    if(filesys.prjs.getOpeParam(`${__dirname}`,opeParam) != null) {
        filesys.prjs.getPrjFiles(opeParam, HDLFileList);
    
        // Output Channel
        var outputChannel = vscode.window.createOutputChannel("HDL");
        
        tool.registerXilinxServer(opeParam);
        tool.registerDebugServer(opeParam);
        tool.registerTreeServer(opeParam);
        tool.registerToolServer(opeParam);
        tool.registerSocServer(opeParam);

        // project Server
        filesys.registerPrjsServer(context, opeParam);
    
        try {
            console.time('timer');
            const indexer = new parser.indexer(HDLparam);
            indexer.build_index(HDLFileList).then(() => {
                console.timeEnd('timer');
                console.log(indexer.HDLparam);
                console.log(indexer.symbols);
                
                var fileExplorer = new tool.tree.FileExplorer(indexer.HDLparam, opeParam);
                filesys.monitor.monitor(opeParam.workspacePath, opeParam, indexer, outputChannel, () => {
                    fileExplorer.treeDataProvider.HDLparam = indexer.HDLparam;
                    fileExplorer.treeDataProvider.refresh();
                });
                // linter Server
                // new linter.registerLinterServer("vhdl", "linter", context);
                // tool Server
                tool.registerSimServer(indexer, opeParam);
                tool.registerLspServer(context, indexer);
                tool.registerBuildServer(context, indexer, opeParam);
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;