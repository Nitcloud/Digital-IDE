var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

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

            // synth param    
            case 'parameter':   return vscode.SymbolKind.Constant;
            case 'localparam':  return vscode.SymbolKind.Constant;
            case 'integer':     return vscode.SymbolKind.Constant;
            case 'char':        return vscode.SymbolKind.Constant;
            case 'float':       return vscode.SymbolKind.Constant;
            case 'int':         return vscode.SymbolKind.Constant;

            // unsynth param
            case 'string':      return vscode.SymbolKind.String;
            case 'struct':      return vscode.SymbolKind.Struct;
            case 'class':       return vscode.SymbolKind.Class;
            
            case 'logic':       return vscode.SymbolKind.Variable;
            case 'wire':        return vscode.SymbolKind.Variable;
            case 'reg':         return vscode.SymbolKind.Variable;
            case 'bit':         return vscode.SymbolKind.Variable;
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

/* TOOL */

/* xilinx File TOOL */
class xilinxFileExplorer {
    constructor () {
        this.json   = new jsonOperation();
        this.file   = new fileOperation();
        this.folder = new folderOperation();
    }
    move_xbd_xIP(workspace_path, property_path) {
        let prj_info = this.json.pullJsonInfo(property_path);
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
                file.movedir(`${source_IP_path}/${element}`,`${target_path}/IP`)
            });
        }
        if (fs.existsSync(source_bd_path)) {
            fs.readdirSync(source_bd_path).forEach(element => {
                file.movedir(`${source_bd_path}/${element}`,`${target_path}/bd`)
            });
        }
    }
    xclean(workspace_path,mode) {
        if (mode == "all") {
            this.folder.deleteDir(`${workspace_path}prj`);
        }
        this.folder.deleteDir(`${workspace_path}.Xil`);
        let file_list = this.file.pick_file(workspace_path,".jou");
        file_list.forEach(element => {
            this.file.deleteFile(`${workspace_path}${element}`)
        });
        file_list = this.file.pick_file(workspace_path,".log");
        file_list.forEach(element => {
            this.file.deleteFile(`${workspace_path}${element}`)
        });
        file_list = this.file.pick_file(workspace_path,".str");
        file_list.forEach(element => {
            this.file.deleteFile(`${workspace_path}${element}`)
        });
    }
    pick_elf_file(boot_path) {
        let elf_list = this.file.pick_file(boot_path,".elf");
            elf_list = elf_list.filter(function (elf_file) {
            return elf_file !== 'fsbl.elf';
        });
        return elf_list
    }
    xbootgenerate(workspace_path,root_path) {
        let BOOT_folder = `${workspace_path}user/BOOT`;
        let output_path = `${root_path}/.TOOL/Xilinx/BOOT`;
    
        let elf_path  = '';
        let bit_path  = '';
        let fsbl_path = '';
    
        let elf_list = [""];
        let bit_list = [""];
    
        let output_context =  "//arch = zynq; split = false; format = BIN\n";
            output_context += "the_ROM_image:\n";
            output_context += "{\n";
    
        if (file.ensureExists(BOOT_folder)) {
            if (file.ensureExists(BOOT_folder+"/fsbl.elf")) {
                fsbl_path = `\t[bootloader]${BOOT_folder}/fsbl.elf\n`;
            }
            else {
                fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
            }
            elf_list = pick_elf_file(BOOT_folder);
            if (elf_list.length == 1) {
                elf_path = "\t" + BOOT_folder + "/" + elf_list[0] + "\n";
                bit_list = file.pick_file(workspace_path,".bit");
                    if (bit_list.length <= 1) {
                        if (bit_list.length == 0) {
                            vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
                        }
                        bit_path = "\t" + workspace_path + bit_list[0] + "\n";
                        output_context += fsbl_path + bit_path + elf_path + "}";
                        file.writeFile(`${output_path}/output.bif`,output_context);
                        let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                        terminal.runCmd(cmd);	
                    }
                    else{
                        vscode.window.showQuickPick(bit_list).then(selection => {
                            if (!selection) {
                                return;
                            }
                            bit_path = "\t" + workspace_path + selection + "\n";
                            output_context += fsbl_path + bit_path + elf_path + "}";
                            file.writeFile(`${output_path}/output.bif`,output_context);
                            let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                            terminal.runCmd(cmd);	
                        });
                    }
            }
            else {
                vscode.window.showQuickPick(elf_list).then(selection => {
                    if (!selection) {
                        return;
                    }
                    elf_path = "\t" + BOOT_folder + "/" + selection + "\n";
                    bit_list = file.pick_file(workspace_path,".bit");
                    if (bit_list.length <= 1) {
                        if (bit_list.length == 0) {
                            vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
                        }
                        bit_path = "\t" + workspace_path + bit_list[0] + "\n";
                        output_context += fsbl_path + bit_path + elf_path + "}";
                        file.writeFile(`${output_path}/output.bif`,output_context);
                        let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                        terminal.runCmd(cmd);	
                    }
                    else{
                        vscode.window.showQuickPick(bit_list).then(selection => {
                            if (!selection) {
                                return;
                            }
                            bit_path = "\t" + workspace_path + selection + "\n";
                            output_context += fsbl_path + bit_path + elf_path + "}";
                            file.writeFile(`${output_path}/output.bif`,output_context);
                            let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                            terminal.runCmd(cmd);		
                        });
                    }
                });
            }
        }
        else {
            fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
            elf_list = pick_elf_file(output_path);
            if (elf_list.length == 1) {
                elf_path = "\t" + output_path + "/" + elf_list[0] + "\n";
                bit_list = file.pick_file(workspace_path,".bit");
                if (bit_list.length == 0) {
                    vscode.window.showErrorMessage("The bit file was not found\nCannot only BOOT the pl part");
                } else if (bit_list.length == 1) {
                    bit_path = "\t" + workspace_path + bit_list[0] + "\n";
                    output_context += fsbl_path + bit_path + elf_path + "}";
                    file.writeFile(`${output_path}/output.bif`,output_context);
                    let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                    terminal.runCmd(cmd);	
                } else if (bit_list.length > 1) {
                    vscode.window.showQuickPick(bit_list).then(selection => {
                        if (!selection) {
                            return;
                        }
                        bit_path = "\t" + workspace_path + selection + "\n";
                        output_context += fsbl_path + bit_path + elf_path + "}";
                        file.writeFile(`${output_path}/output.bif`,output_context);
                        let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                        terminal.runCmd(cmd);	
                    });
                }
            } else {
                vscode.window.showQuickPick(elf_list).then(selection => {
                    if (!selection) {
                        return;
                    }
                    elf_path = "\t" + output_path + "/" + selection + "\n";
                    bit_list = file.pick_file(workspace_path,".bit");
                    if (bit_list.length <= 1) {
                        if (bit_list.length == 0) {
                            vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
                        }
                        bit_path = "\t" + workspace_path + bit_list[0] + "\n";
                        output_context += fsbl_path + bit_path + elf_path + "}";
                        file.writeFile(`${output_path}/output.bif`,output_context);
                        let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                        terminal.runCmd(cmd);	
                    }
                    else{
                        vscode.window.showQuickPick(bit_list).then(selection => {
                            if (!selection) {
                                return;
                            }
                            bit_path = "\t" + workspace_path + selection + "\n";
                            output_context += fsbl_path + bit_path + elf_path + "}";
                            file.writeFile(`${output_path}/output.bif`,output_context);
                            let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
                            terminal.runCmd(cmd);		
                        });
                    }
                });
            }
        }
    }
    bootLoad(workspace_path,root_path) {
        let BOOT_folder = `${workspace_path}user/BOOT`;
        let output_path = `${root_path}/.TOOL/Xilinx/BOOT`;
    }
}
exports.xilinxFileExplorer = xilinxFileExplorer;
