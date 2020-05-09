const fs     = require("fs");
const fspath = require("path");
const vscode = require("vscode");

class getFolders {
    getCurrentWorkspaceFolder() {
        var folder = vscode.workspace.workspaceFolders[0].uri.toString();
        folder = folder.substr(8, folder.length);
        folder += "/";
        var Drive = folder[0];
        folder = folder.substr(4, folder.length);
        folder = Drive + ":" + folder;
        return folder;
    };

	pick_file(file_path,extname) {
		let file_list = fs.readdirSync(file_path).filter(function (file) {
			return Path.extname(file).toLowerCase() === extname;
		});
		return file_list;
	};

    readFolder(path) {
        return fs.readdirSync(path);
    };
	
    ensureExists(path) {
        return fs.existsSync(path);
	};
	
	readFile(path) {
        return fs.readFileSync(path, 'utf8');
    };

	writeFile(path,data) {
		if (!fs.existsSync(fspath.dirname(path))) {
			fs.mkdirSync(fspath.dirname(path))
		}
        fs.writeFileSync(path, data, 'utf8');
	};
}
exports = module.exports = new getFolders;

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
		fs.mkdirSync(fspath.dirname(JSON_path))
	}
	fs.writeFileSync(JSON_path, str, 'utf8');
}
exports.pushJsonInfo = pushJsonInfo;

