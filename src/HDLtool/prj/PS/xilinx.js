"use strict";

const vscode = require("vscode");
const fs = require("../../../HDLfilesys");
var opeParam = require("../../../param");

/**
 * @state finish-untest
 * @descriptionCn xilinx工具链下PS端的操作类
 */
class xilinxOperation {
    constructor() {
        this.log  = vscode.window.showInformationMessage;
        this.err  = vscode.window.showErrorMessage;
        this.warn = vscode.window.showWarningMessage;
    }

    getConfig() {
        this.config = {
            'path' : `${opeParam.rootPath}/resources/script/xilinx/soft`,
            'hw' : "SDK_Platform",
            'bsp': "BSP_package",
            'dat': opeParam.prjInfo.ARCH.Software.data,
            'src': opeParam.prjInfo.ARCH.Software.src,
            'soc': {
                "core": "ps7_cortexa9_0",
                "name": "template",
                "app": "Hello World",
                "os": "standalone"
            }
        };

        if (fs.files.isHasAttr(opeParam.prjInfo, "SOC")) {
            this.config.soc = opeParam.prjInfo.SOC;
        }

        if (fs.files.isHasAttr(opeParam.prjInfo, "PRJ_NAME.PS")) {
            this.config.soc["name"] = opeParam.prjInfo.PRJ_NAME.PS;
        }
    }

    launch(config) {
        this.getConfig();

        const hdfs = fs.files.pickFileFromExt(this.config.dat, {
            exts : ".hdf",
            type : "all",
            ignore : []
        });

        if (hdfs.length) {
            this.err(`There is no hdf file in ${this.config.dat}.`)
            return null;
        }

        const scriptPath = `${this.config.path}/launch.tcl`;
        const script = `
setws ${this.config.src}
if { [getprojects -type hw] == "" } {
    createhw -name ${this.config.hw} -hwspec ${this.config.dat}/
} else {
    openhw ${this.config.src}/[getprojects -type hw]/system.hdf 
}

if { [getprojects -type bsp] == "" } {
    createbsp -name ${this.config.bsp} \\
                -hwproject ${this.config.hw} \\
                -proc ${this.config.soc.core} \\
                -os ${this.config.soc.os}
}

if { [getprojects -type app] == "" } {
    createapp -name ${this.config.soc.name} \\
                -hwproject ${this.config.hw} \\
                -bsp ${this.config.bsp} \\
                -proc ${this.config.soc.core} \\
                -os ${this.config.soc.os} \\
                -lang C \\
                -app {${this.config.soc.app}}
}
file delete ${scriptPath} -force\n`;
        
        fs.files.writeFile(scriptPath, script);
        config.terminal.show(true);
        config.terminal.sendText(`${config.path} ${scriptPath}`);
    }

    build(config) {
        this.getConfig();
        
        const scriptPath = `${this.config.path}/build.tcl`;
        const script = `
setws ${this.config.src}
openhw ${this.config.src}/[getprojects -type hw]/system.hdf
projects -build
file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        config.terminal.show(true);
        config.terminal.sendText(`${config.path} ${scriptPath}`);
    }

    program(config) {
        this.getConfig();
        
        const len = this.config.soc.core.length;
        const index = this.config.soc.core.slice(len-1, len);
        const scriptPath = `${this.config.path}/program.tcl`;
        const script = `
setws ${this.config.src}
openhw ${this.config.src}/[getprojects -type hw]/system.hdf
connect
targets -set -filter {name =~ "ARM*#${index}"}
rst -system
namespace eval xsdb { 
    source ${this.config.src}/${this.config.hw}/ps7_init.tcl
    ps7_init
}
fpga ./${this.config.soc.name}.bit
dow  ${this.config.src}/${this.config.soc.name}/Debug/${this.config.soc.name}.elf
con
file delete ${scriptPath} -force\n`;
        fs.files.writeFile(scriptPath, script);
        config.terminal.show(true);
        config.terminal.sendText(`${config.path} ${scriptPath}`);
    }
}
module.exports = xilinxOperation