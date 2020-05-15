const fs     = require("fs");
const fspath = require("path");
const vscode = require("vscode");

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

function move_xbd_xIP(workspace_path, property_path) {
	let prj_info = pullJsonInfo(property_path);
	let target_path = "";
	let source_IP_path = `${workspace_path}prj/xilinx/${prj_info.PRJ_NAME.FPGA}.srcs/sources_1/ip`;
	let source_bd_path = `${workspace_path}prj/xilinx/${prj_info.PRJ_NAME.FPGA}.srcs/sources_1/bd`;
	if (prj_info.SOC_MODE.soc == "none") {
		target_path = `${workspace_path}user`;
	}else{
		target_path = `${workspace_path}user/Hardware`;
	}
	if (fs.existsSync(source_IP_path)) {
		fs.readdirSync(source_IP_path).forEach(element => {
			movedir(`${source_IP_path}/${element}`,`${target_path}/IP`)
		});
	}
	if (fs.existsSync(source_bd_path)) {
		fs.readdirSync(source_bd_path).forEach(element => {
			movedir(`${source_bd_path}/${element}`,`${target_path}/bd`)
		});
	}
}
exports.move_xbd_xIP = move_xbd_xIP;

function xclean(workspace_path,mode) {
	if (mode == "all") {
		deleteDir(`${workspace_path}prj`);
	}
	deleteDir(`${workspace_path}.Xil`);
	let file_list = pick_file(workspace_path,".jou");
	file_list.forEach(element => {
		deleteFile(`${workspace_path}${element}`)
	});
	file_list = pick_file(workspace_path,".log");
	file_list.forEach(element => {
		deleteFile(`${workspace_path}${element}`)
	});
	file_list = pick_file(workspace_path,".str");
	file_list.forEach(element => {
		deleteFile(`${workspace_path}${element}`)
	});
}
exports.xclean = xclean;