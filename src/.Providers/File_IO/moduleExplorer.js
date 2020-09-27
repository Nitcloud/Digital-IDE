"use strict";

const file   = require("./file_IO");
const common = require("../utils/common");
const vscode = require("vscode");
// 去除注释
function delComment(content) {
	content = content.replace(/\/\/.*/g,'');
	content = content.replace(/\/\*[\s\S]*?\*\//g,'');
	return content;
}
exports.delComment = delComment;
// 获取当前文件的模块名
function getModuleName(content) {
	content = delComment(content);
	let moduleNameList = [];
	let moduleList = content.match(/module\s+([a-zA-Z_0-9]+)\s*(\#\s*\(|\()/g);
	if (moduleList == null) {
		return null;
	} else {
		moduleList.forEach(element => {
			element = element.replace(/module\s+/g,"");
			element = element.replace(/\s*(\#\s*\(|\()/g,"");
			moduleNameList.push(element);
		});
		return moduleNameList;
	}
}
exports.getModuleName = getModuleName;
// 获取所有文件的模块名
function getAllModuleInfo(path,extname) {
    let moduleNameList = []; 
    let moduleFileList = [];
    let allModuleInfoList = [];           
    moduleFileList = file.pick_Allfile(path,extname);
    moduleFileList.forEach(element => {
        let moduleFilePath = element;
        let content = file.readFile(element);
        moduleNameList = getModuleName(content);
        if (moduleNameList != null) {
            moduleNameList.forEach(element => {
                let moduleInfo = element + " " + moduleFilePath;
                allModuleInfoList.push(moduleInfo)
            });
        } 
    });
    return allModuleInfoList;
}
exports.getAllModuleInfo = getAllModuleInfo;
// 由模块名查询该模块所在的文件的地址
function searchModuleFilePath(moduleName,allModuleInfoList) {
    let moduleFilePathList = [];
    
    allModuleInfoList.forEach(element => {
        let moduleInfoList = element.split(" ");
        if (moduleName == moduleInfoList[0]) {
            moduleFilePathList.push(moduleInfoList[1])
        }
    });
    if (moduleFilePathList.length == 0) {
        vscode.window.showWarningMessage(`Can not find ${moduleName}`);
    } else if (moduleFilePathList.length > 1) {
        vscode.window.showInformationMessage(`Find multiple ${moduleName} modules`);
    }
    return moduleFilePathList;
}
exports.searchModuleFilePath = searchModuleFilePath;
// 获取模块名下的内容
function getModuleContent(content,moduleName) {
    let moduleStart   = content.indexOf(moduleName);
    let moduleEnd     = content.indexOf('endmodule', moduleStart);
    let moduleContent = content.substring(moduleStart, moduleEnd);
    return moduleContent;
}
exports.getModuleContent = getModuleContent;
// 获取当前模块的端口信息支持input、output、inout、param
function getPortInfo(content,portType) {
    var re = new RegExp(portType + 
        "(wire|reg)?(signed|unsigned)?" + 
        "(\\[.+?\\])?[a-zA-Z_0-9]+" + 
        "(=([0-9]+'(b|d|x))?[0-9]+)?" +
        "(,|\\)|;)?","gi");
    // let lines = moduleIO.split('\n');
    let portsInfoList = [];
    let portsList = content.match(re);
	if (portsList == null) {
		return null;
	} else {
		portsList.forEach(element => {
            var re = new RegExp(portType + "(wire|reg)?(signed|unsigned)?","gi");
			element = element.replace(re,"");
			element = element.replace(/(,|\)|;)?/g,"");
			portsInfoList.push(element);
		});
		return portsInfoList;
	}
}
exports.getPortInfo = getPortInfo;
// 获取当前仿真文件的波形镜像路径
function getWaveImagePath(content) {
    content = delComment(content);
    content = content.replace(/\s*/g,"");
    let waveImagePath = content.match(/\$dumpfile\(\"(.+){1}\"\);/gi);
    waveImagePath = RegExp.$1;
	return waveImagePath;
}
exports.getWaveImagePath = getWaveImagePath;
// 获取当前文件中已经例化的模块名，返回模块名的列表，并且去重
function getInstanceModuleName(content) {
	content = delComment(content);
	let moduleNameList = [];
	let moduleList = content.match(/(\s+|;)([a-zA-Z_0-9]+)((\s+[a-zA-Z_0-9]+\s*\(\s*\.)|(\s*\#\s*\(\s*\.))/g);
	if (moduleList == null) {
		return null;
	} else {
		moduleList.forEach(element => {
            element = element.replace(/((\s+[a-zA-Z_0-9]+\s*\(\s*\.)|(\s*\#\s*\(\s*\.))/g,"");
            element = element.replace(/\s*;?/g,"");
			moduleNameList.push(element);
        });
        moduleNameList = common.removeDuplicates(moduleNameList);
		return moduleNameList;
	}
}
exports.getInstanceModuleName = getInstanceModuleName;


// vInstance_Gen.py -- generate verilog module Instance
// generated bench file like this:

//         fifo_sc #(
//             .DATA_WIDTH ( 8 ),
//             .ADDR_WIDTH ( 8 )
//         ) u_fifo_sc (
//             .CLK   ( CLK                     ),
//             .RST_N ( RST_N                   ),
//             .RD_EN ( RD_EN                   ),
//             .WR_EN ( WR_EN                   ),
//             .DIN   ( DIN   [DATA_WIDTH-1 :0] ),
//             .DOUT  ( DOUT  [DATA_WIDTH-1 :0] ),
//             .EMPTY ( EMPTY                   ),
//             .FULL  ( FULL                    )
//         );

function instanceVerilogModule(content,moduleName) {
    let padding = "    ";
    let moduleContent = getModuleContent(content,moduleName).replace(/\s*/g,"");

    let instModuleContent = "";

    let parameterName  = [];
    let parameterValue = [];
    let parameterList  = getPortInfo(moduleContent,"parameter");
    if (parameterList.length != 0) {
        instModuleContent = moduleName + " #(\n";
        parameterList.forEach(element => {
            element = element.replace(/(\[.+?\])?/g,"");
            element = element.replace(/=?/g," ");
            let parameterInfo = element.split('\n');
            parameterName.push(parameterInfo[0]);
            parameterValue.push(parameterInfo[1]);
        });
    }
    else {
        instModuleContent = moduleName + " u_" + moduleName + " (\n";
    }

    let outputPortName  = [];
    let outputPortRange = [];
    let outputPortInfo  = getPortInfo(moduleContent,"output");
    if (outputPort.length != 0) {        
        instModuleContent = "//instance output port\n";
        outputPortInfo.forEach(element => {
            element = element.replace(/(=[0-9]*)?/g,"");
            outputPortRange.push(element.match(/(\[.*\])?/g));
            outputPortName.push(element.replace(/(\[.+?\])?/g,""));
            // element = "wire\t" + portRange[0] + "\t" + element.replace(/(\[.+?\])?/g,"");
            // instModuleContent = instModuleContent + element + ";\n";
        });
    }

    let inputPortName  = [];
    let inputPortInfo  = getPortInfo(moduleContent,"input");
    if (inputPort.length != 0) {        
        inputPortInfo.forEach(element => {
            element = element.replace(/(=[0-9]*)?/g,"");
            inputPortName.push(element.replace(/(\[.+?\])?/g,""));
        });
    }

    let inoutPortName  = [];
    let inoutPortInfo  = getPortInfo(moduleContent,"inout");
    if (inoutPort.length != 0) {        
        inoutPortInfo.forEach(element => {
            element = element.replace(/(=[0-9]*)?/g,"");
            inoutPortName.push(element.replace(/(\[.+?\])?/g,""));
        });
    }

    let maxLength = common.findMaxLength(parameterName
        .push(outputPortName)
        .push(inputPortName)
        .push(inoutPortName));

    
}
exports.instanceVerilogModule = instanceVerilogModule;
