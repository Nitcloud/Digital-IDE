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
const { MainOutput } = require('./global');
/**
 * @param {vscode.ExtensionContext} context 
 */
function launch(context) {
    opeParam.rootPath = HDLPath.resolve(__dirname, '..');
    const HDLfiles = HDLtool.registerManageServer();
    // initialize HDLParam
    HDLParam.Initialize(HDLfiles);
    MainOutput.report('finish HDLParam Initialize', 'launch');
    
    // register command
    HDLtool.registerSimServer(context);
    MainOutput.report('finish registerSimServer', 'launch');

    HDLtool.registerTreeServer(context);
    MainOutput.report('finish registerTreeServer', 'launch');

    HDLtool.registerDocumentation(context);
    MainOutput.report('finish registerDocumentation', 'launch');

    HDLtool.registerLspServer(context);
    MainOutput.report('finish registerLspServer', 'launch');

    HDLtool.registerToolServer(context);
    MainOutput.report('finish registerToolServer', 'launch');
    
    // launch monitor
    monitor.start();
    MainOutput.report('start monitor', 'launch');
}

/**
 * @param {vscode.ExtensionContext} context 
 */
async function activate(context) {
    const start = Date.now();

    launch(context);
    MainOutput.report('rootPath ' + opeParam.rootPath, 'path');
    MainOutput.report('workspace ' + opeParam.workspacePath, 'path');
    const costTime = (Date.now() - start) / 1000;
    MainOutput.report('launch cost ' + costTime + ' s', 'performance');
}

exports.activate = activate;


function deactivate() {
    monitor.close();    
}
exports.deactivate = deactivate;