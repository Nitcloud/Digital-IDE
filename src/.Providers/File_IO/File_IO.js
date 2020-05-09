const vscode = require('vscode');
const Path   = require("path");
const fs     = require("fs");

class getFolders {
    getCurrentWorkspaceFolder() {
        var folder = vscode.workspace.workspaceFolders[0].uri.toString();
        folder = folder.substr(8, folder.length);
        folder += "/";
        var Drive = folder[0];
        folder = folder.substr(4, folder.length);
        folder = Drive + ":" + folder;
        return folder;
    }

    getAllWorkspaceFolders() {
        var folderObj = vscode.workspace.workspaceFolders;
        var folder = [""];
		for(let i in folderObj) {
			folder += folderObj[i].uri.toString();
		}
        return folder;
    }

	pick_file(file_path,extname) {
		let file_list = fs.readdirSync(file_path).filter(function (file) {
			return Path.extname(file).toLowerCase() === extname;
		});
		return file_list;
	}

    readFolder(path) {
        return fs.readdirSync(path);
    };

    readFile(path) {
        return fs.readFileSync(path, 'utf8');
    }

	writeFile(path,data) {
        fs.writeFileSync(path, data, 'utf8');
	}
	
    ensureExists(path) {
        return fs.existsSync(path);
    }
}
exports = module.exports = new getFolders;

function getPrjInfo(property_path) {
	let data = fs.readFileSync(property_path, 'utf8');
	let prjinfo = JSON.parse(data);
	return prjinfo;
}
exports.getPrjInfo = getPrjInfo;