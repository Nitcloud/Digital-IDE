// @ts-nocheck
/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 15:44:35
 * #lastTime     : 2020-02-15 17:26:23
 * #FilePath     : \src\extension.js
 * #Description  : 
 */

const HDLtool = require('./HDLtool');
const { HDLParam } = require('./HDLparser');
const opeParam = require('./param');

const HDLFile = require('./HDLfilesys/operation/files');


function launch() {
    // 初始化 opeParam
    const manage = HDLtool.registerPrjServer();
    manage.getOpeParam(opeParam);

    // 初始化HdlParam
    HDLParam.Initialize();

    const files = HDLFile.getHDLFiles(opeParam.workspacePath);

    console.log(opeParam.prjInfo.ARCH);
    console.log('init num', HDLParam.Modules.size);
}

async function activate(context) {
    const start = Date.now();
    launch();
    HDLtool.registerSimServer(context);
    HDLtool.registerTreeServer(context);
    HDLtool.registerDocumentation(context);

    console.log('cost time : ' + (Date.now() - start) / 1000 + 's');
}

exports.activate = activate;


function deactivate() {
    
}
exports.deactivate = deactivate;