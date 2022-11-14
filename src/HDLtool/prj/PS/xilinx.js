"use strict";
const fs = require("../../../HDLfilesys");

var xsdkScript = {

    hw_name : "SDK_Platform",

    bsp_name : "BSP_package",

    launch : function (opeParam) {
        let script = '';
        let dataPath = opeParam.prjStructure.SoftwareData;
        let srcPath  = opeParam.prjStructure.SoftwareSrc;

        let hdf_files = filesys.files.pickFile(dataPath, ".hdf");
        if (!hdf_files.length) {
            return false;
        }

        script += `set hw_file ${dataPath}/${hdf_files[0]}\n`;
        script += `set hw_path ${dataPath}\n`;
        script += `set ws_path ${srcPath}\n`;

        script += `set hw_name ${this.hw_name}\n`;
        script += `set bsp_name ${this.bsp_name}\n`;

        if (filesys.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.soc")) {
            script += `set cpu ${opeParam.prjInfo.SOC_MODE.soc}\n`;
        } else {
            script += `set cpu ps7_cortexa9_0\n`;
        }

        let app = "Hello World";
        if (filesys.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.app")) {
            app = opeParam.prjInfo.SOC_MODE.app;
        }

        if (filesys.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.os")) {
            script += `set os ${opeParam.prjInfo.SOC_MODE.os}\n`;
        } else {
            script += `set os standalone\n`;
        }

        if (filesys.files.isHasAttr(opeParam.prjInfo, "PRJ_NAME.SOC")) {
            script += `set prj_name ${opeParam.prjInfo.PRJ_NAME.SOC}\n`;
        } else {
            script += `set prj_name template\n`;
        }
        
        script += `setws $ws_path\n`;
        script += `if { [getprojects -type hw] == "" } {
    createhw -name $hw_name -hwspec $hw_file
} else {
    openhw $ws_path/[getprojects -type hw]/system.hdf 
}

if { [getprojects -type bsp] == "" } {
    createbsp -name $bsp_name -hwproject $hw_name -proc $cpu -os $os
}

if { [getprojects -type app] == "" } {
    createapp -name $prj_name -hwproject $hw_name -bsp $bsp_name -proc $cpu -os $os -lang C -app {${app}}
}\n`;
        let scriptPath = `${opeParam.rootPath}/resources/script/xilinx/soft`;
        let lanuchScript = `${scriptPath}/launch.tcl`;
        script += `file delete ${lanuchScript} -force\n`;
        filesys.files.writeFile(lanuchScript, script);
        return lanuchScript;
    },

    build : function (opeParam) {
        let script = '';
        script += `set ws_path ${opeParam.prjStructure.SoftwareSrc}\n`;
        script += `setws  $ws_path\n`;
        script += `openhw $ws_path/[getprojects -type hw]/system.hdf\n`;
        script += `projects -build\n`;

        let scriptPath = `${opeParam.rootPath}/resources/script/xilinx/soft`;
        let buildScript = `${scriptPath}/build.tcl`;
        script += `file delete ${buildScript} -force\n`;
        filesys.files.writeFile(buildScript, script);
        return buildScript;
    },

    program : function (opeParam) {
        let script = '';
        script += `set ws_path ${opeParam.prjStructure.SoftwareSrc}\n`;

        script += `setws  $ws_path\n`;
        script += `openhw $ws_path/[getprojects -type hw]/system.hdf\n`;
        script += `connect\n`;

        if (filesys.files.isHasAttr(opeParam.prjInfo, "SOC_MODE.soc")) {
            let len = opeParam.prjInfo.SOC_MODE.soc.length;
            let index = opeParam.prjInfo.SOC_MODE.soc.slice(len-1, len);
            script += `targets -set -filter {name =~ "ARM*#${index}"}\n`;
        } else {
            script += `targets -set -filter {name =~ "ARM*#$0"}\n`;
        }

        script += `rst -system\n`;
        script += `namespace eval xsdb { 
    source ${opeParam.prjStructure.SoftwareSrc}/${this.hw_name}/ps7_init.tcl
    ps7_init
}\n`;

        if (filesys.files.isHasAttr(opeParam.prjInfo, "PRJ_NAME.SOC")) {
            script += `set prj_name ${opeParam.prjInfo.PRJ_NAME.SOC}\n`;
        } else {
            script += `set prj_name template\n`;
        }

        script += `fpga ./$prj_name.bit\n`;
        script += `dow  ${opeParam.prjStructure.SoftwareSrc}/$prj_name/Debug/$prj_name.elf`;
        script += `con\n`;

        let scriptPath = `${opeParam.rootPath}/resources/script/xilinx/soft`;
        let programScript = `${scriptPath}/program.tcl`;
        script += `file delete ${programScript} -force\n`;
        filesys.files.writeFile(programScript, script);
        return programScript;
    }
}
module.exports = xsdkScript;
