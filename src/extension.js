/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : lstm-kirigaya
 * #Date         : 2020-02-15 15:44
 * #lastTime     : 2023-01-06 16:20
 * #FilePath     : \src\extension.js
 * #Description  : main of the extension
 */
const vscode = require('vscode');
const HDLtool = require('./HDLtool');
const { HDLParam } = require('./HDLparser');
const opeParam = require('./param');
const HDLFile = require('./HDLfilesys/operation/files');
const monitor = require('./monitor');
const HDLPath = require('./HDLfilesys/operation/path');

/**
 * @param {vscode.ExtensionContext} context 
 */
function launch(context) {
    opeParam.rootPath = HDLPath.resolve(__dirname, '..');
    const HDLfiles = HDLtool.registerManageServer();
    // initialize HDLParam
    HDLParam.Initialize(HDLfiles);
    // register command
    HDLtool.registerSimServer(context);
    HDLtool.registerTreeServer(context);
    HDLtool.registerDocumentation(context);
    HDLtool.registerLspServer(context);
    HDLtool.registerToolServer(context);
    
    // launch monitor
    monitor.start();

    // console.log('#module ', HDLParam.Modules.size);
    // console.log(opeParam.prjInfo);
    // return vscode.window.withProgress({
    //     location: vscode.ProgressLocation.Notification,
    //     title: 'Initialize the project'
    // }, async progress => {

    // });
}

/**
 * @param {vscode.ExtensionContext} context 
 */
async function activate(context) {
    const start = Date.now();
    const output = vscode.window.createOutputChannel("DIDE");

	output.appendLine("[message] DIDE launch");
    launch(context);
    output.appendLine('[32m[debug] rootPath ' + opeParam.rootPath);
    output.appendLine('[32m[debug] workspace ' + opeParam.workspacePath);
    
    output.appendLine('[33m[message] cost time : ' + (Date.now() - start) / 1000 + 's');
}

exports.activate = activate;


function deactivate() {
    monitor.close();    
}
exports.deactivate = deactivate;