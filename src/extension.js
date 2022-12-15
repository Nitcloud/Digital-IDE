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
const HDLparser = require('./HDLparser');
const opeParam = require('./param');

const hdlFile = require('./HDLfilesys/operation/files');


function launch() {
    // 初始化 opeParam
    const manage = new HDLtool.prjManage.PrjManage();
    manage.getOpeParam(opeParam);

    // 初始化HdlParam
    const HdlParam = HDLparser.HdlParam;
    HdlParam.Initialize();

    const files = [];
    hdlFile.getHDLFiles(opeParam.workspacePath, files);


    console.log(opeParam.prjInfo.ARCH);
    console.log('init num', HdlParam.Modules.size);
}

async function activate(context) {
    launch();
    HDLtool.registerSimServer(context);
    HDLtool.registerTreeServer(context);
}

exports.activate = activate;


function deactivate() {
    
}
exports.deactivate = deactivate;