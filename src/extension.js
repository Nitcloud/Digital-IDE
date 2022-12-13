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
const hdlPath = require('./HDLfilesys/operation/path');
const opeParam = require('./param');


function launch() {
    // TODO : 构建好完整的配置加载后去除下面两行
    opeParam.prjInfo.ARCH.Hardware.sim = '.';
    opeParam.prjInfo.ARCH.Hardware.src = '.';

    console.log(hdlPath.resolve('.'));
}

async function activate(context) {
    launch();
    HDLtool.registerSimServer(context);
}

exports.activate = activate;


function deactivate() {
    
}
exports.deactivate = deactivate;