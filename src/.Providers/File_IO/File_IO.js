const fs     = require("fs");
const fspath = require("path");
const vscode = require("vscode");

let prjInitparam = {
	"FPGA_VERSION": "xilinx",
	"PRJ_NAME": {
		"FPGA": "template"
	},
	"SOC_MODE": {
		"soc": "none"
	},
	"enableShowlog": false,
	"Device": "xc7z020clg400-2"
}

// file or folder operation
// folder operation
function getCurrentWorkspaceFolder() {
	var folder = vscode.workspace.workspaceFolders[0].uri.toString();
	folder = folder.substr(8, folder.length);
	folder += "/";
	var Drive = folder[0];
	folder = folder.substr(4, folder.length);
	folder = Drive + ":" + folder;
	return folder;
};
exports.getCurrentWorkspaceFolder = getCurrentWorkspaceFolder;

function ensureExists(path) {
	return fs.existsSync(path);
};
exports.ensureExists = ensureExists;

function readFolder(path) {
	return fs.readdirSync(path);
};
exports.readFolder = readFolder;

function deleteDir(path){
	var files = [];
	if( fs.existsSync(path) ) {  
		files = fs.readdirSync(path);   
		files.forEach(function(file,index){
			var curPath = fspath.join(path,file);
				
			if(fs.statSync(curPath).isDirectory()) { 
				deleteDir(curPath);
			} else {    
				fs.unlinkSync(curPath);    
			}
				
		});
		fs.rmdirSync(path); //清除文件夹
	}
}
exports.deleteDir = deleteDir;

function mkdir(path) {
    if (fs.existsSync(path)) {
      return true;
    } else {
		if (mkdir(fspath.dirname(path))) {
			fs.mkdirSync(path);
			return true;
		}
    }
}
exports.mkdir = mkdir;

function movedir(oldpath,newpath) {
	folder  = fspath.basename(oldpath);
	newpath = newpath + '/' + folder;
	if (fs.existsSync(oldpath)) {
		if (fs.existsSync(newpath)) {
			deleteDir(newpath);
		}
		fs.renameSync(oldpath,newpath);
	}else{
		mkdir(newpath);	
	}
}
exports.movedir = movedir;


// file operation
function readFile(path) {
	return fs.readFileSync(path, 'utf8');
};
exports.readFile = readFile;

function writeFile(path,data) {
	if (!fs.existsSync(fspath.dirname(path))) {
		mkdir(fspath.dirname(path));
	}
	fs.writeFileSync(path, data, 'utf8');
};
exports.writeFile = writeFile;

function deleteFile(path) {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path);
	}
};
exports.deleteFile = deleteFile;

function pick_file(file_path,extname) {
	let file_list = fs.readdirSync(file_path);
	let output_list = [];
	file_list.filter(function (file) {
		if(fspath.extname(file).toLowerCase() === extname){
			output_list.push(file)
		}
	});
	return output_list;
};
exports.pick_file = pick_file;

function pick_Allfile(file_path,extname) {
	let file_list = fs.readdirSync(file_path);
	let output_list = [];
	file_list.forEach(element => {
		if (fs.statSync(`${file_path}/${element}`).isDirectory()) {
			pick_Allfile(`${file_path}/${element}`,extname);
		} else {		
			if(fspath.extname(element).toLowerCase() === extname){
				output_list.push(element)
			}
		}
	});
	return output_list;
};
exports.pick_Allfile = pick_Allfile;

//JSON file operation
function pullJsonInfo(JSON_path) {
	var data    = fs.readFileSync(JSON_path, 'utf8');
	// let prjinfo = eavl("("+data+")");
	let prjinfo = JSON.parse(data);
	return prjinfo;
}
exports.pullJsonInfo = pullJsonInfo;

function pushJsonInfo(JSON_path,JSON_data){
	var str = JSON.stringify(JSON_data,null,'\t');
	if (!fs.existsSync(fspath.dirname(JSON_path))) {
		fs.mkdirSync(fspath.dirname(JSON_path));
	}
	fs.writeFileSync(JSON_path, str, 'utf8');
}
exports.pushJsonInfo = pushJsonInfo;


//FPGA file operation
function generatePropertypath(workspace_path) {
	let Property_path = `${workspace_path}.vscode/Property.json`;
	if (!ensureExists(Property_path)) {
		if (!ensureExists(`${workspace_path}Property.json`)) {
			vscode.window.showInformationMessage("There is no Property.json here, where you want to generate?",'.vscode','root')
			.then(function(select){
				if (select == ".vscode") {
					pushJsonInfo(`${workspace_path}.vscode/Property.json`,prjInitparam);
				} else if (select == "root") {
					pushJsonInfo(`${workspace_path}Property.json`,prjInitparam);
				}
			});
		}else {
			vscode.window.showWarningMessage("Property file already exists");
		}
	}
	else {
		vscode.window.showWarningMessage("Property file already exists");
	}
}
exports.generatePropertypath = generatePropertypath;

function gentbFile(path,root_path) {
	if (!fs.existsSync(path)) {
		let tb_template = fs.readFileSync(`${root_path}/.TOOL/.Data/testbench.v`, 'utf8');
		fs.writeFileSync(path, tb_template, 'utf8');
	}
};
exports.gentbFile = gentbFile;

function updateFolder(root_path,workspace_path,property_path) {
	let prj_info = pullJsonInfo(property_path);
	mkdir(`${workspace_path}prj/xilinx`);
	mkdir(`${workspace_path}prj/intel`);
	mkdir(`${workspace_path}prj/simulation`);
	if (prj_info.SOC_MODE.soc == "none") {
		deleteDir(`${workspace_path}user/Software`);
		movedir(`${workspace_path}user/Hardware/IP`  ,`${workspace_path}user`);
		movedir(`${workspace_path}user/Hardware/bd`  ,`${workspace_path}user`);
		movedir(`${workspace_path}user/Hardware/src` ,`${workspace_path}user`);
		movedir(`${workspace_path}user/Hardware/sim` ,`${workspace_path}user`);
		movedir(`${workspace_path}user/Hardware/data`,`${workspace_path}user`);
		deleteDir(`${workspace_path}user/Hardware`);
		gentbFile(`${workspace_path}user/sim/testbench.v`,root_path);
	} else {
		mkdir(`${workspace_path}user/Software/data`);
		mkdir(`${workspace_path}user/Software/src`);
		mkdir(`${workspace_path}user/Hardware`);
		movedir(`${workspace_path}user/IP`  ,`${workspace_path}user/Hardware`);
		movedir(`${workspace_path}user/bd`  ,`${workspace_path}user/Hardware`);
		movedir(`${workspace_path}user/src` ,`${workspace_path}user/Hardware`);
		movedir(`${workspace_path}user/data`,`${workspace_path}user/Hardware`);
		movedir(`${workspace_path}user/sim` ,`${workspace_path}user/Hardware`);
		gentbFile(`${workspace_path}user/Hardware/sim/testbench.v`,root_path);
	}
};
exports.updateFolder = updateFolder;

function updatePrjInfo(root_path, Property_path) {

	let prj_param = pullJsonInfo(Property_path);
	
	let CONFIG_contex = "FPGA_VERSION\n";
	CONFIG_contex += prj_param.FPGA_VERSION + '\n';
	CONFIG_contex += "PRJ_NAME.FPGA\n";
	CONFIG_contex += prj_param.PRJ_NAME.FPGA + '\n';
	CONFIG_contex += "PRJ_NAME.SOC\n";
	CONFIG_contex += prj_param.PRJ_NAME.SOC + '\n';
	CONFIG_contex += "SOC_MODE.soc\n";
	CONFIG_contex += prj_param.SOC_MODE.soc + '\n';
	CONFIG_contex += "SOC_MODE.bd_file\n";
	CONFIG_contex += prj_param.SOC_MODE.bd_file + '\n';
	CONFIG_contex += "SOC_MODE.os\n";
	CONFIG_contex += prj_param.SOC_MODE.os + '\n';
	CONFIG_contex += "SOC_MODE.app\n";
	CONFIG_contex += prj_param.SOC_MODE.app + '\n';
	CONFIG_contex += "enableShowlog\n";
	CONFIG_contex += prj_param.enableShowlog + '\n';
	CONFIG_contex += "Device\n";

	prj_param = pullJsonInfo(Property_path);
	CONFIG_contex += prj_param.Device + '\n\n';

	writeFile(`${root_path}/.TOOL/CONFIG`,CONFIG_contex);
}
exports.updatePrjInfo = updatePrjInfo;

function getPropertypath(workspace_path) {
	let Property_path = `${workspace_path}.vscode/Property.json`;
	if (!ensureExists(Property_path)) {
		if (!ensureExists(`${workspace_path}Property.json`)) {
			pushJsonInfo(`${workspace_path}.vscode/Property.json`,prjInitparam);
		}
		else{
			Property_path = `${workspace_path}Property.json`;
		}
	}
	return Property_path;
}
exports.getPropertypath = getPropertypath;

function getFpgaVersion(Property_path) {
	let prj_param = pullJsonInfo(Property_path);
	return prj_param.FPGA_VERSION;
}
exports.getFpgaVersion = getFpgaVersion;

function getSocMode(Property_path) {
	let prj_param = pullJsonInfo(Property_path);
	if(prj_param.SOC_MODE.soc == "none"){
		return false;
	} else {
		return true;
	}
}
exports.getSocMode = getSocMode;