"use strict";

const fs     = require("../../../HDLfilesys");
const vscode = require("vscode");
const child  = require("child_process");

var opeParam = require("../../../param");
/**
 * @descriptionCn xilinx在PL端下的操作
 * @state unfinish-untest
 */
class xilinxOperation {
    constructor() {
        this.setting  = vscode.workspace.getConfiguration();

        this.err  = vscode.showErrorMessage;
        this.warn = vscode.showWarningMessage;
        this.info = vscode.showInformationMessage;

        this.getConfig(opeParam);
        var _this = this;
        vscode.workspace.onDidChangeConfiguration(function () {
             _this.getConfig(opeParam);
        });
    }

    /**
     * @descriptionCn 在getConfig中进行统一管理
     */
    getConfig() {
        this.xip_repo = opeParam.prjInfo.IP_REPO;
        this.xip_path = `${opeParam.rootPath}/IP_repo`;
        this.xbd_path = `${opeParam.rootPath}/lib/xilinx/bd`;
        this.xilinxPath = `${opeParam.rootPath}/resources/script/xilinx`;
        
        this.prjPath = opeParam.prjInfo.ARCH.PRJ_Path;
        this.srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = opeParam.prjInfo.ARCH.Hardware.sim;
        this.datPath = opeParam.prjInfo.ARCH.Hardware.data;

        this.softSrc = opeParam.prjInfo.ARCH.Software.src;
        
        this.HWPath = fs.paths.dirname(this.srcPath);
        
        this.rootPath  = opeParam.rootPath;
        this.prjConfig = opeParam.prjInfo;

        this.customer = {
            "ip_repo" : this.setting.get('PRJ.xilinx.IP.repo.path'),
            "bd_repo" : this.setting.get('PRJ.xilinx.BD.repo.path'),
        }

        this.topMod = {
            'src' : opeParam.srcTopModule.name,
            'sim' : opeParam.simTopModule.name,
        }
    }

    /**
     * @state finish-untested
     * @descriptionCn xilinx下的launch运行，打开存在的工程或者再没有工程时进行新建
     * @returns {String} 需要执行的脚本路径
     */
    launch(config) {
        let script = '';
        let scripts = [];

        let prjFilePath = this.prjPath;
        let prjFiles = fs.files.pickFileFromExt(prjFilePath, {
            exts : ".xpr",
            type : "all",
            ignores : []
        });
        
        // 找到工程文件，如果找到就直接打开，找不到就根据配置信息新建工程。
        if (prjFiles.length) {
            if (prjFiles.length > 1) {
                vscode.window.showQuickPick(prjFiles, {
                    placeHolder : "Which project you want to open?"
                }).then((selection) => {
                    this.open(selection, scripts);
                });
            } else {
                prjFilePath = prjFiles[0];
                this.open(prjFilePath, scripts);
            }
        } else {
            this.prjInfo = {
                'path'   : `${prjFilePath}/xilinx`,
                'name'   : fs.files.isHasAttr(this.prjConfig, "PRJ_NAME.PL") ? 
                           this.prjConfig.PRJ_NAME.PL : 'template',
                'device' : fs.files.isHasAttr(this.prjConfig, "Device") ? 
                           this.prjConfig.Device : 'xc7z020clg400-2'
            }
            
            if (!fs.dirs.mkdir(this.prjInfo.path)) {
                this.err(`mkdir ${this.prjInfo.path} failed`)
                return null;
            }

            this.create(scripts);
        }

        // 根据配置信息进行源文件导入
        for (let i = 0; i < scripts.length; i++) {
            const content = scripts[i];
            script += content + '\n';
        }
        let scriptPath = this.refresh();
        script += `source ${scriptPath} -notrace\n`;
        scriptPath = `${this.xilinxPath}/launch.tcl`;
        script += `file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        
        const argu = `-notrace -nolog -nojournal`
        const cmd = `${config.path} -mode tcl -s ${scriptPath} ${argu}`;
        config.terminal.sendText(cmd);
    }

    /**
     * @state finish-untested
     * @descriptionCn 在指定的路径之下进行
     * @param {Array} scripts 
     */
    create(scripts) {
        scripts.push(`set_param general.maxThreads 8`);
        scripts.push(`create_project ${this.prjInfo.name} ${this.prjInfo.path} -part ${this.prjInfo.device} -force`);
        scripts.push(`set_property SOURCE_SET sources_1   [get_filesets sim_1]`);
        scripts.push(`set_property top_lib xil_defaultlib [get_filesets sim_1]`);
        scripts.push(`update_compile_order -fileset sim_1 -quiet`);
    }

    /**
     * @state finish-tested
     * @descriptionCn 在指定的路径之下进行
     * @param {String} path 
     * @param {Array} scripts 
     */
    open(path, scripts) {
        scripts.push(`set_param general.maxThreads 8`);
        scripts.push(`open_project ${path} -quiet`);
    }

    /**
     * @state finish-untested
     * @descriptionCn xilinx刷新整个工程设计
     * @returns {String} 需要执行的脚本路径
     */
    refresh(HDLFiles) {
        let scripts = [];
        // 清除所有源文件
        scripts.push(`remove_files -quiet [get_files]`);

        // 导入 IP_repo_paths
        scripts.push(`set xip_repo_paths {}`);

        if (fs.files.isExist(this.customer.ip_repo)) {
            scripts.push(`lappend xip_repo_paths ${this.customer.ip_repo}`);
        }

        if (this.xip_repo) {
            for (let i = 0; i < this.xip_repo.length; i++) {
                const element = this.xip_repo[i];
                scripts.push(`lappend xip_repo_paths ${this.xip_path}/${element}`);
            }
        }
        scripts.push(`set_property ip_repo_paths $xip_repo_paths [current_project] -quiet`);
        scripts.push(`update_ip_catalog -quiet`);

        // 导入bd设计源文件
        const bd = this.prjConfig.SOC.bd;
        let bdSrcPath = `${this.xbd_path}/${bd}.bd`;
        if (fs.files.isillegal(bdSrcPath)) {
            bdSrcPath = `${this.customer.bd_repo}/${bd}.bd`;
        }

        if (fs.files.isillegal(bdSrcPath)) {
            this.err(`can not find ${bd}.bd in ${this.xbd_path} and ${this.customer.bd_repo}`);
        } else {
            if (fs.files.copyFile(
                bdSrcPath, 
                `${this.HWPath}/bd/${bd}/${bd}.bd`
            )) {
                this.err(`cp ${bd} failed, can not find ${bdSrcPath}`);
            }
        }

        const bdPaths = [
            `${this.HWPath}/bd`,
            `${this.prjInfo.path}/${this.prjInfo.name}.src/sources_1/bd`
        ]
        fs.files.pickFileFromExt(bdPaths, {
            exts : ".bd",
            type : "all",
            ignores : []
        }, (bd_file) => {
            scripts.push(`add_files ${bd_file} -quiet`);
            scripts.push(`add_files ${path.dirname(bd_file)}/hdl -quiet`);
        });

        if (bd) {
            const load_bd_path = `${this.HWPath}/bd/${bd}/${bd}.bd`
            scripts.push(`generate_target all [get_files ${load_bd_path}] -quiet`);
            scripts.push(`make_wrapper -files [get_files ${load_bd_path}] -top -quiet`);
            scripts.push(`open_bd_design ${load_bd_path} -quiet`);
        }

        fs.files.pickFileFromExt(`${this.HWPath}/bd/mref`, {
            exts : ".tcl",
            type : "all",
            ignores : []
        }, (file) => {
            scripts.push(`source ${file}`);
        });

        // 导入ip设计源文件
        const ipPaths = [
            `${this.HWPath}/ip`,
            `${this.prjInfo.path}/${this.prjInfo.name}.src/sources_1/ip`
        ]
        fs.files.pickFileFromExt(ipPaths, {
            exts : ".xci",
            type : "all",
            ignores : []
        }, (ip_file) => {
            scripts.push(`add_files ${ip_file} -quiet`);
        });

        // 导入非本地的设计源文件
        for (let i = 0; i < HDLFiles.length; i++) {
            const element = HDLFiles[i];
            scripts.push(`add_files ${element} -quiet`);
        }
        scripts.push(`add_files -fileset constrs_1 ${this.datPath} -quiet`);

        if (this.topMod.src != '') {
            scripts.push(`set_property top ${this.topMod.src} [current_fileset]`);
        }
        if (this.topMod.sim != '') {
            scripts.push(`set_property top ${this.topMod.sim} [get_filesets sim_1]`);
        }

        let script = '';
        for (let i = 0; i < scripts.length; i++) {
            const content = scripts[i];
            script += content + '\n';
        }
        let scriptPath = `${this.xilinxPath}/refresh.tcl`;
        script += `file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        return scriptPath;
    }

    /**
     * 
     * @returns 
     */
    simulate() {
        const scriptPath = `${this.xilinxPath}/simulate.tcl`;
        const script = `
        if {[current_sim] != ""} {
            relaunch_sim -quiet
        } else {
            launch_simulation -quiet
        }

        set curr_wave [current_wave_config]
        if { [string length $curr_wave] == 0 } {
            if { [llength [get_objects]] > 0} {
                add_wave /
                set_property needs_save false [current_wave_config]
            } else {
                send_msg_id Add_Wave-1 WARNING "No top level signals found. Simulator will start without a wave window. If you want to open a wave window go to 'File->New Waveform Configuration' or type 'create_wave_config' in the TCL console."
            }
        }
        run 1us

        start_gui -quiet
        file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        return scriptPath;
    }

    /**
     * 
     * @param {*} terminal 
     * @returns 
     */
    synth(terminal) {
        let quietArg = '';
        if (opeParam.prjInfo.enableShowlog) {
            quietArg = '-quiet'
        }

        let script = '';
        script += `reset_run synth_1 ${quietArg};`
        script += `launch_runs synth_1 ${quietArg} -jobs 4;`
        script += `wait_on_run synth_1 ${quietArg}`

        terminal.sendText(script);
        return script;
    }

    /**
     * 
     * @param {*} terminal 
     * @returns 
     */
    impl(terminal) {
        let quietArg = '';
        if (opeParam.prjInfo.enableShowlog) {
            quietArg = '-quiet'
        }

        let script = '';
        script += `reset_run impl_1 ${quietArg};`;
        script += `launch_runs impl_1 ${quietArg} -jobs 4;`;
        script += `wait_on_run impl_1 ${quietArg};`;
        script += `open_run impl_1 ${quietArg};`;
        script += `report_timing_summary ${quietArg}`;

        terminal.sendText(script);
        return script;
    }

    /**
     * 
     * @returns 
     */
    build() {
        let quietArg = '';
        if (this.prjConfig.enableShowlog) {
            quietArg = '-quiet'
        }
        
        let script = '';
        script += `reset_run synth_1 ${quietArg}\n`;
        script += `launch_runs synth_1 ${quietArg} -jobs 4\n`;
        script += `wait_on_run synth_1 ${quietArg}\n`;
        script += `reset_run impl_1 ${quietArg}\n`;
        script += `launch_runs impl_1 ${quietArg} -jobs 4\n`;
        script += `wait_on_run impl_1 ${quietArg}\n`;
        script += `open_run impl_1 ${quietArg}\n`;
        script += `report_timing_summary ${quietArg}\n`;

        let scriptPath = this.generateBit();
        script += `source ${scriptPath} -notrace\n`;

        scriptPath = `${this.xilinxPath}/build.tcl`;
        script += `file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        return scriptPath;
    }

    /**
     * 
     */
    generateBit() {
        let scripts = [];
        let core = this.prjConfig.SOC.core;
        let sysdefPath = `${this.prjInfo.path}/${this.prjInfo.name}.runs` + 
                         `/impl_1/${this.prjInfo.name}.sysdef`;

        if (core && (core != "none")) {
            if (fs.files.isExist(sysdefPath)) {
                scripts.push(`file copy -force ${sysdefPath} ${this.softSrc}/[current_project].hdf`);
            } else {
                scripts.push(`write_hwdef -force -file ${this.softSrc}/[current_project].hdf`);
            }
            // TODO: 是否专门设置输出文件路径的参数
            scripts.push(`write_bitstream ./[current_project].bit -force -quiet`);
        } else {
            scripts.push(`write_bitstream ./[current_project].bit -force -quiet -bin_file`);
        }

        let script = '';
        for (let i = 0; i < scripts.length; i++) {
            const content = scripts[i];
            script += content + '\n';
        }
        let scriptPath = `${this.xilinxPath}/bit.tcl`;
        script += `file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        return scriptPath;
    }

    /**
     * @descriptenCn 将程序下载到器件中去
     * @returns 
     */
    program() {
        let scriptPath = `${this.xilinxPath}/program.tcl`;
        let script = `
        open_hw -quiet
        connect_hw_server -quiet
        set found 0
        foreach hw_target [get_hw_targets] {
            current_hw_target $hw_target
            open_hw_target -quiet
            foreach hw_device [get_hw_devices] {
                if { [string equal -length 6 [get_property PART $hw_device] ${this.prjInfo.device}] == 1 } {
                    puts "------Successfully Found Hardware Target with a ${this.prjInfo.device} device------ "
                    current_hw_device $hw_device
                    set found 1
                }
            }
            if {$found == 1} {break}
            close_hw_target
        }   

        #download the hw_targets
        if {$found == 0 } {
            puts "******ERROR : Did not find any Hardware Target with a ${this.prjInfo.device} device****** "
        } else {
            set_property PROGRAM.FILE ./[current_project].bit [current_hw_device]
            program_hw_devices [current_hw_device] -quiet
            disconnect_hw_server -quiet
        }
        file delete ${scriptPath} -force\n`;

        fs.files.writeFile(scriptPath, script);
        return scriptPath;
    }

    gui(mode, installPath, filePath) {
        if (mode == "direct") {
            let command = `${installPath} -mode gui -s ${filePath} -notrace -nolog -nojournal`
            child.exec(command, (error, stdout, stderr) => {
                if (error !== null) {
                    this.err(stderr);
                } else {
                    this.info("GUI open successfully")
                }
            });
        } 
        else if (mode == "terminal") {
            let terminal = this.process.terminal;
            if (!terminal) {
                return null;
            }
            terminal.sendText("start_gui -quiet");
        }
    }

    xExecShowLog(logPath) {
        let logPathList = ["runme", "xvlog", "elaborate"];
        let fileName = path.basename(logPath, ".log");

        if (!logPathList.includes(fileName)) {
            return null;
        }

        let content = fs.files.readFile(logPath);
        if (!content) {
            return null;
        }

        if (content.indexOf("INFO: [Common 17-206] Exiting Vivado") == -1) {
            return null;
        }

        let log = '';
        var regExp = /(?<head>CRITICAL WARNING:|ERROR:)(?<content>[\w\W]*?)(INFO:|WARNING:)/g;

        while (true) {
            let match = regExp.exec(content);
            if (match == null) {
                break;      
            }

            log += match.groups.head.replace("ERROR:", "[error] :");
            log += match.groups.content;
        }
        
        if (log != '') {
            this.outputCH.show(true);
            this.outputCH.appendLine(log);
        }
    }

    addFilesInPrj(filePaths) {
        if (!this.terminal) {
            return null;
        }
        if (files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            if (opeParam.prjInfo.TOOL_CHAIN == "xilinx") {
                this.processFileInPrj(filePaths, "add_file");
            }				
        }
    }

    delFilesInPrj(filePaths) {
        if (!this.terminal) {
            return null;
        }
        if (!files.isHasAttr(opeParam.prjInfo, "TOOL_CHAIN")) {
            if (opeParam.prjInfo.TOOL_CHAIN == "xilinx") {
                this.processFileInPrj(filePaths, "remove_files");
            }				
        }
    }

    processFileInPrj(filePaths, command) {
        for (let i = 0; i < filePaths.length; i++) {
            const libFileElement = filePaths[i];
            this.terminal.sendText(`${command} ${libFileElement}`);
        }
    }
}
module.exports = xilinxOperation;

class xilinxBoot {
    constructor() {

    }

    async getfsblPath(outsidePath, insidePath) {
        let paths = fs.files.filter(outsidePath, (element) => {
            if(fs.paths.extname(element) != ".elf"){
                return null;
            }

            if (element.includes("fsbl.elf")) {
                return element;
            }

            return null;
        });

        if (paths.length) {
            if (paths.length == 1) {
                return `\t[bootloader]${outsidePath}/${paths[0]}\n`;
            }

            let selection = await vscode.window.showQuickPick(paths);
            if (!selection) {
                return false;
            }
            return `\t[bootloader]${outsidePath}/${selection}\n`;
        }
        
        return `\t[bootloader]${insidePath}/fsbl.elf\n`;
    }

    async getBitPath(bit_path) {
        let bitList = fs.files.pickFile(bit_path,".bit");
        if (bitList.length == 0) {
            vscode.window.showInformationMessage("Generated only from elf file");
        } 
        else if (bitList.length == 1) {
            return"\t" + bit_path + bitList[0] + "\n";
        }
        else {
            let selection = await vscode.window.showQuickPick(bitList);
            if (!selection) {
                return false;
            }
            return "\t" + bit_path + selection + "\n";
        }
    }

    async getElfPath(BootInfo) {
        // 优先在外层寻找elf文件
        let elfs = this.pickElfFile(BootInfo.outsidePath);

        if (elfs.length) {
            if (elfs.length == 1) {
                return `\t${BootInfo.outsidePath}/${elfs[0]}\n`;
            }

            let selection = await vscode.window.showQuickPick(elfs);
            if (!selection) {
                return false;
            }
            return `\t${BootInfo.outsidePath}/${selection}\n`;
        }

        // 如果外层找不到文件则从内部调用
        elfs = this.pickElfFile(BootInfo.insidePath);
        if (elfs.length) {
            if (elfs.length == 1) {
                return `\t${BootInfo.insidePath}/${elfs[0]}\n`;
            }

            let selection = await vscode.window.showQuickPick(elfs);
            if (!selection) {
                return false;
            }
            return `\t${BootInfo.insidePath}/${selection}\n`;
        }

        // 如果内层也没有则直接退出
        vscode.window.showErrorMessage("The elf file was not found\n");
        return false;
    }
    
    pickElfFile(path) {
        return fs.files.filter(path, (element) => {
            if(fs.paths.extname(element) != ".elf"){
                return null;
            }

            if (!element.includes("fsbl.elf")) {
                return element;
            }

            return null;
        });
    }
}

class xilinxTool {
    constructor() {

    }

    /**
     * 
     */
    clean() {
        this.move_bd_ip();
        const prjPath = opeParam.prjInfo.ARCH.PRJ_Path;
        const wkSpace = opeParam.workspacePath;

        fs.dirs.rmdir(prjPath); 
        fs.dirs.rmdir(`${wkSpace}/.Xil`); 

        fs.files.pickFileFromExt(wkSpace, {
            exts : [".str", ".log"],
            type : "once",
            ignores : []
        }, (file) => {
            fs.files.removeFile(file);
        });
    }

    /**
     * 
     */
    move_bd_ip() {
        const prjName = opeParam.prjInfo.PRJ_NAME.PL;
        const srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        const target_path = fs.paths.dirname(srcPath);

        const source_ip_path = `${opeParam.workspacePath}/prj/xilinx/${prjName}.srcs/sources_1/ip`;
        const source_bd_path = `${opeParam.workspacePath}/prj/xilinx/${prjName}.srcs/sources_1/bd`;

        fs.dirs.mvdir(source_ip_path, target_path);
        fs.dirs.mvdir(source_bd_path, target_path);
    }

    
    async boot() {
        // 声明变量
        let opeParam = this.process.opeParam;
        let BootInfo = {
            "outsidePath" : `${path.dirname(opeParam.prjStructure.prjPath)}/boot`,
            "insidePath"  : `${opeParam.rootPath}/resources/boot/xilinx`,
            "outputPath"  : `${opeParam.rootPath}/resources/boot/xilinx/output.bif`,
            "elf_path"    : '',
            "bit_path"    : '',
            "fsbl_path"   : ''
        };

        if (opeParam.prjInfo.INSIDE_BOOT_TYPE) {
            BootInfo.insidePath = `${BootInfo.insidePath}/${opeParam.prjInfo.INSIDE_BOOT_TYPE}`;
        } else {
            BootInfo.insidePath = `${BootInfo.insidePath}/microphase`;
        }
    
        let output_context =  "//arch = zynq; split = false; format = BIN\n";
            output_context += "the_ROM_image:\n";
            output_context += "{\n";
    
        BootInfo.fsbl_path = await this.getfsblPath(BootInfo.outsidePath, BootInfo.insidePath);
        if (!BootInfo.fsbl_path) {
            return null;
        }
        output_context += BootInfo.fsbl_path;

        BootInfo.bit_path  = await this.getBitPath(opeParam.workspacePath);
        if (BootInfo.bit_path) {
            output_context += BootInfo.bit_path;
        }

        BootInfo.elf_path  = await this.getElfPath(BootInfo);
        if (!BootInfo.elf_path) {
            return null;
        }
        output_context += BootInfo.elf_path;

        output_context += "}";
        let result = fs.files.writeFile(BootInfo.outputPath, output_context);
        if (!result) {
            return null;
        }

        let command = `bootgen -arch zynq -image ${BootInfo.outputPath} -o ${opeParam.workspacePath}/BOOT.bin -w on`;
        child.exec(command, function (error, stdout, stderr) {
            if (error) {
                vscode.window.showErrorMessage(`${error}`);
                vscode.window.showErrorMessage(`stderr: ${stderr}`);
                return;
            } else {
                vscode.window.showInformationMessage("write boot file successfully!!")
            }
        });
    }
}

class xilinxBd {
    constructor() {
        this.err  = vscode.showErrorMessage;
        this.warn = vscode.showWarningMessage;
        this.info = vscode.showInformationMessage;

        this.setting = vscode.workspace.getConfiguration();
    }

    getConfig() {
        this.rootPath = opeParam.rootPath;

        this.xbd_path = `${opeParam.rootPath}/lib/bd/xilinx`;
        this.schemaPath = opeParam.propertySche;
        this.schemaCont = fs.files.pullJsonInfo(this.schemaPath);
        this.bdEnum = this.schemaCont.properties.SOC.properties.bd.enum;

        this.bd_repo = this.setting.get('PRJ.xilinx.BD.repo.path');
    }

    /**
     * 
     * @param {*} uri 
     */
    Owr_bd(uri) {
        this.getConfig();
        // 获取当前bd file的路径
        vscode.window.showQuickPick(this.bdEnum).then(select => {
            // the user canceled the select
            if (!select) {
                return;
            }
            
            let bdSrcPath = `${this.xbd_path}/${select}.bd`;
            if (fs.files.isillegal(bdSrcPath)) {
                bdSrcPath = `${this.bd_repo}/${select}.bd`;
            }

            if (fs.files.isillegal(bdSrcPath)) {
                this.err(`can not find ${select}.bd in ${this.xbd_path} and ${this.bd_repo}, please load again.`);
            } else {
                const docPath = fs.paths.toSlash(uri.fsPath);
                fs.files.writeFile(bdSrcPath, fs.files.readFile(docPath));
            }
        });
    }

    /**
     * 
     * @param {*} uri 
     * @returns 
     */
    Add_bd(uri) {
        this.getConfig();
        // 获取当前bd file的路径
        let docPath = fs.paths.toSlash(uri.fsPath);
        let bd_name = fs.paths.basename(docPath); 

        // 检查是否重复
        if (this.bdEnum.includes(bd_name)) {
            this.warn(`The file already exists.`);
            return null;
        }

        // 获取存放路径
        let storePath = this.setting.get('PRJ.xilinx.BD.repo.path');
        if (!fs.files.isExist(storePath)) {
            this.warn(`This bd file will be added into extension folder.We don't recommend doing this because it will be cleared in the next update.`);
            storePath = this.xbd_path;
        }

        // 写入
        const bd_path = `${storePath}/${bd_name}.bd`;
        fs.files.writeFile(bd_path, fs.files.readFile(docPath));

        this.schemaCont.properties.SOC.properties.bd.enum.push(bd_name);
        fs.files.pushJsonInfo(this.schemaPath, this.schemaCont);
    }

    /**
     * 
     */
    Del_bd() {
        this.getConfig();
        vscode.window.showQuickPick(this.bdEnum).then(select => {
            // the user canceled the select
            if (!select) {
                return;
            }
            
            let bdSrcPath = `${this.xbd_path}/${select}.bd`;
            if (fs.files.isillegal(bdSrcPath)) {
                bdSrcPath = `${this.bd_repo}/${select}.bd`;
            }

            if (fs.files.isillegal(bdSrcPath)) {
                this.err(`can not find ${select}.bd in ${this.xbd_path} and ${this.bd_repo}, please load again.`);
            } else {
                fs.files.removeFile(bdSrcPath);
            }
        });
    }

    /**
     * 
     */
    load_bd() {
        this.getConfig();
        fs.files.pickFileFromExt(this.bd_repo, {
            exts : ".bd",
            type : "once",
            ignores : []
        }, (bd_file) => {
            let basename = fs.paths.basename(bd_file);
            if (this.bdEnum.includes(basename)) {
                return;
            }
            this.schemaCont.properties.SOC.properties.bd.enum.push(basename);
        });
        
        fs.files.pushJsonInfo(this.schemaPath, this.schemaCont);
    }
}
