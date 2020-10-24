const fs     = require("fs");
const fspath = require("path");
const vscode = require("vscode");
const exec   = require('child_process').exec;

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
exports.prjInitparam = prjInitparam;

/* INIT */

/* FILE */

/* file or folder operation */

// 获取当前工作区文件夹路径
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

/* folder operation */
class folderOperation {
    ensureExists(path) {
        return fs.existsSync(path);
    }
    mkdir(path) {
        if (fs.existsSync(path)) {
          return true;
        } else {
            if (this.mkdir(fspath.dirname(path))) {
                fs.mkdirSync(path);
                return true;
            }
        }
    }
    deleteDir(path){
        var files = [];
        if( fs.existsSync(path) ) {  
            files = fs.readdirSync(path);   
            files.forEach(function(file,index){
                var curPath = fspath.join(path,file);
                    
                if(fs.statSync(curPath).isDirectory()) { 
                    this.deleteDir(curPath);
                } else {    
                    fs.unlinkSync(curPath);    
                }
                    
            });
            fs.rmdirSync(path); //清除文件夹
        }
    }
    movedir(oldpath,newpath) {
        folder  = fspath.basename(oldpath);
        newpath = newpath + '/' + folder;
        if (fs.existsSync(oldpath)) {
            if (fs.existsSync(newpath)) {
                this.deleteDir(newpath);
            }
            fs.renameSync(oldpath,newpath);
        }else{
            this.mkdir(newpath);	
        }
    }
    readFolder(path) {
        return fs.readdirSync(path);
    }
};
exports.folderOperation = folderOperation;

/* folder operation */
class fileOperation {
    constructor () {
        this.folderOperation = new folderOperation()
    }
    readFile(path) {
        return fs.readFileSync(path, 'utf8');
    }
    writeFile(path,data) {
        if (!fs.existsSync(fspath.dirname(path))) {
            this.folderOperation.mkdir(fspath.dirname(path));
        }
        fs.writeFileSync(path, data, 'utf8');
    }
    deleteFile(path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
    pick_file(file_path,extname) {
        let file_list = fs.readdirSync(file_path);
        let output_list = [];
        file_list.filter(function (file) {
            if(fspath.extname(file).toLowerCase() === extname){
                output_list.push(file)
            }
        });
        return output_list;
    }
    pick_Allfile(file_path,extname,output_list = []) {
        let file_list = fs.readdirSync(file_path);
        file_list.forEach(element => {
            if (fs.statSync(`${file_path}/${element}`).isDirectory()) {
                this.pick_Allfile(`${file_path}/${element}`,extname,output_list);
            } else {		
                if(fspath.extname(element).toLowerCase() === extname){
                    output_list.push(`${file_path}/${element}`)
                }
            }
        });
        return output_list;
    }
};
exports.fileOperation = fileOperation;

/* JSON file operation */
class jsonOperation {
    addJsonInfo(sourceJSON,addJSON,objectName,jsonPath) {
        sourceJSON[`${objectName}`] = addJSON;
        this.pushJsonInfo(jsonPath,sourceJSON)
    }
    pullJsonInfo(JSON_path) {
        var data = fs.readFileSync(JSON_path, 'utf8');
        let prjinfo = JSON.parse(data);
        return prjinfo;
    }
    pushJsonInfo(JSON_path,JSON_data){
        var str = JSON.stringify(JSON_data,null,'\t');
        if (!fs.existsSync(fspath.dirname(JSON_path))) {
            fs.mkdirSync(fspath.dirname(JSON_path));
        }
        fs.writeFileSync(JSON_path, str, 'utf8');
    }
};
exports.jsonOperation = jsonOperation;

/* array operation */
class arrayOperation {
    findMaxLength(arry) {
        let Max_len = 0;
        for (let i = 0; i < arry.length; i++) {
            if (arry[i].length > Max_len)
            Max_len = arry[i].length;
        }
        return Max_len;
    }
    removeDuplicates(arry) {
        let r = [];
        for(var i = 0, l = arry.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
            if (arry[i] === arry[j]) j = ++i;
            r.push(arry[i]);
        }
        return r;
    }
}
exports.arrayOperation = arrayOperation;

/* Terminal operation */
class terminalOperation {
    runCmd(cmdline) {
        exec(cmdline,function (error, stdout, stderr) {
            vscode.window.showInformationMessage(stdout);
            if (error !== null) {
                vscode.window.showErrorMessage(error);
            }
        });
    }
    colorText(text,colorIndex) {
        var output = '';
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            if (char === ' ' || char === '\r' || char === '\n') {
                output += char;
            }
            else {
                output += "\u001B[3" + colorIndex++ + "m" + text.charAt(i) + "\u001B[0m";
                if (colorIndex > 6) {
                    colorIndex = 1;
                }
            }
        }
        return output;
    }
    selectTerminal() {
        var terminals = vscode.window.terminals;
        var items = terminals.map(function (t) {
            return {
                label: "name: " + t.name,
                terminal: t
            };
        });
        return vscode.window.showQuickPick(items).then(function (item) {
            return item ? item.terminal : undefined;
        });
    }
    ensureTerminalExists(name) {
        let Exists_flag = false
        vscode.window.terminals.forEach(element => {
            if (element.name == name) {
                Exists_flag = true
            }
        });
        return Exists_flag
    }
}
exports.terminalOperation = terminalOperation;

/* refresh property */
class refreshProperty {
    constructor () {
        this.json   = new jsonOperation();
        this.file   = new fileOperation();
        this.folder = new folderOperation();
    }
    generatePropertypath(workspace_path) {
        let Property_path = `${workspace_path}.vscode/Property.json`;
        if (!this.folder.ensureExists(Property_path)) {
            if (!this.folder.ensureExists(`${workspace_path}Property.json`)) {
                vscode.window.showInformationMessage("There is no Property.json here, where you want to generate?",'.vscode','root')
                .then(function(select){
                    if (select == ".vscode") {
                        this.json.pushJsonInfo(`${workspace_path}.vscode/Property.json`,prjInitparam);
                    } else if (select == "root") {
                        this.json.pushJsonInfo(`${workspace_path}Property.json`,prjInitparam);
                    }  else if (select == "no") {
                        Property_path = "";
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
    gentbFile(path,root_path) {
        if (!fs.existsSync(path)) {
            let tb_template = fs.readFileSync(`${root_path}/.TOOL/.Data/testbench.v`, 'utf8');
            fs.writeFileSync(path, tb_template, 'utf8');
        }
    }
    updateFolder(root_path,workspace_path,property_path) {
        let prj_info = this.json.pullJsonInfo(property_path);
        this.folder.mkdir(`${workspace_path}prj/xilinx`);
        this.folder.mkdir(`${workspace_path}prj/intel`);
        this.folder.mkdir(`${workspace_path}prj/simulation`);
        if (prj_info.SOC_MODE.soc == "none") {
            this.folder.deleteDir(`${workspace_path}user/Software`);
            this.folder.movedir(`${workspace_path}user/Hardware/IP`  ,`${workspace_path}user`);
            this.folder.movedir(`${workspace_path}user/Hardware/bd`  ,`${workspace_path}user`);
            this.folder.movedir(`${workspace_path}user/Hardware/src` ,`${workspace_path}user`);
            this.folder.movedir(`${workspace_path}user/Hardware/sim` ,`${workspace_path}user`);
            this.folder.movedir(`${workspace_path}user/Hardware/data`,`${workspace_path}user`);
            this.folder.deleteDir(`${workspace_path}user/Hardware`);
            this.gentbFile(`${workspace_path}user/sim/testbench.v`,root_path);
        } else {
            this.folder.mkdir(`${workspace_path}user/Software/data`);
            this.folder.mkdir(`${workspace_path}user/Software/src`);
            this.folder.mkdir(`${workspace_path}user/Hardware`);
            this.folder.movedir(`${workspace_path}user/IP`  ,`${workspace_path}user/Hardware`);
            this.folder.movedir(`${workspace_path}user/bd`  ,`${workspace_path}user/Hardware`);
            this.folder.movedir(`${workspace_path}user/src` ,`${workspace_path}user/Hardware`);
            this.folder.movedir(`${workspace_path}user/data`,`${workspace_path}user/Hardware`);
            this.folder.movedir(`${workspace_path}user/sim` ,`${workspace_path}user/Hardware`);
            this.gentbFile(`${workspace_path}user/Hardware/sim/testbench.v`,root_path);
        }
    }
    getPropertypath(workspace_path) {
        let Property_path = `${workspace_path}.vscode/Property.json`;
        if (!this.folder.ensureExists(Property_path)) {
            if (!this.folder.ensureExists(`${workspace_path}Property.json`)) {
                Property_path = "";
            }
            else{
                Property_path = `${workspace_path}Property.json`;
            }
        }
        return Property_path;
    }
    getFpgaVersion(Property_path) {
        let prj_param = this.json.pullJsonInfo(Property_path);
        return prj_param.FPGA_VERSION;
    }
    getSocMode(Property_path) {
        let prj_param = this.json.pullJsonInfo(Property_path);
        if(prj_param.SOC_MODE.soc == "none"){
            return false;
        } else {
            return true;
        }
    }
    updatePrjInfo(root_path, Property_path) {
        if (this.folder.ensureExists(Property_path)) {
            let prj_param = this.json.pullJsonInfo(Property_path);
            
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
        
            prj_param = this.json.pullJsonInfo(Property_path);
            CONFIG_contex += prj_param.Device + '\n';
            
            let xip_repo_path = vscode.workspace.getConfiguration().get('PRJ.xilinx.IP.repo.path');
            CONFIG_contex += "xip_repo_path\n";
            CONFIG_contex += xip_repo_path + '\n';
        
            this.file.writeFile(`${root_path}/.TOOL/CONFIG`,CONFIG_contex);
        } else {
            vscode.window.showWarningMessage('There is no Property.json here!');
        }
    }
}
exports.refreshProperty = refreshProperty;


/* Symbol */
/**
 * Creates a new symbol information object.
 */
class HDLSymbol {
    /**
     * set a symbol information object.
     *
     * @param  name The name of the symbol.
     * @param  type The name of the symbol.
     * @param  containerName The name of the symbol containing the symbol.
     * @param  location The location of the symbol.
     * @return The object of the SymbolInformation.
     */
    setSymbolInformation(match, containerName, document, offset){
        let location = new vscode.Location(
            document.uri, 
            new vscode.Range(
                document.positionAt(match.index + offset), 
                document.positionAt(match.index + match[0].length + offset)));
        return vscode.SymbolInformation(
            match.groups.name,
            this.getSymbolKind(match.groups.type),
            containerName,
            location);
    }
    /**
     * get a symbol Kind.
     *
     * @param name The name of the symbol.
     * @return     The SymbolKind of the symbol's name.
     */
    getSymbolKind(name) {
        if (name === undefined || name === '') { // Ports may be declared without type
            return vscode.SymbolKind.Variable;
        } else if (name.indexOf('[') != -1) {
            return vscode.SymbolKind.Array;
        }
        switch (name) {
            case 'module':      return vscode.SymbolKind.Package;
            case 'package':     return vscode.SymbolKind.Package;
            case 'import':      return vscode.SymbolKind.Package;
            case 'program':     return vscode.SymbolKind.Package;
            case 'begin':       return vscode.SymbolKind.Operator;
    
            case 'task':        return vscode.SymbolKind.Method;
            case 'function':    return vscode.SymbolKind.Function;
    
            case 'assert':
            case 'event':       return vscode.SymbolKind.Event;
    
            case 'time':
            case 'define':
            case 'typedef':     return vscode.SymbolKind.TypeParameter;
            case 'generate':    return vscode.SymbolKind.Operator;
            case 'enum':        return vscode.SymbolKind.Enum;
            case 'modport':     return vscode.SymbolKind.Null;
            case 'property':    return vscode.SymbolKind.Property;
            // port 
            case 'interface':   return vscode.SymbolKind.Interface;
            case 'logic':       return vscode.SymbolKind.Interface;
            case 'wire':        return vscode.SymbolKind.Interface;
            case 'reg':         return vscode.SymbolKind.Interface;
            case 'bit':         return vscode.SymbolKind.Interface;
            // synth param    
            case 'parameter':   return vscode.SymbolKind.Constant;
            case 'localparam':  return vscode.SymbolKind.Constant;
            // unsynth param
            case 'string':      return vscode.SymbolKind.String;
            case 'struct':      return vscode.SymbolKind.Struct;
            case 'class':       return vscode.SymbolKind.Class;
    
            case 'integer':     return vscode.SymbolKind.Variable;
            case 'char':        return vscode.SymbolKind.Variable;
            case 'float':       return vscode.SymbolKind.Variable;
            case 'int':         return vscode.SymbolKind.Variable;
            default:            return vscode.SymbolKind.Field;
        }
        /* Unused/Free SymbolKind icons
            return SymbolKind.Number;
            return SymbolKind.Enum;
            return SymbolKind.EnumMember;
            return SymbolKind.Operator;
            return SymbolKind.Array;
        */
    }
}
exports.HDLSymbol = HDLSymbol;

/**
    Gets the `range` of a line given the line number

    @param line the line number
    @return the line's range
*/
function getLineRange(line, offendingSymbol, startPosition) {
    let endPosition;
    if (startPosition == null && offendingSymbol == null) {
        startPosition = 0;
        endPosition = Number.MAX_VALUE;
    }
    else {
        endPosition = startPosition + offendingSymbol.length;
    }
    return vscode_languageserver.Range.create(vscode_languageserver.Position.create(line, startPosition), vscode_languageserver.Position.create(line, (endPosition)));
}
exports.getLineRange = getLineRange;