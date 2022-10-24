"use strict";

const vscode = require("vscode");
const xsdk = require("./xilinx");

class softwareRegister {
    constructor () {
        this.SoftWare = null;

        this.warn = vscode.window.showWarningMessage;
    }

    isIllegal(opeParam) {
        let soc_mode = opeParam.prjInfo.SOC_MODE.soc;
        if (!soc_mode) {
            return true;
        }
        
        if (soc_mode == "none") {
            return true;
        } else {
            return false;
        }
    }

    launch(opeParam) {
        if (this.isIllegal(opeParam)) {
            this.warn("Please confirm the mode of soc");
        }
        
        this.SoftWare = this.getTerminal("SoftWare");

        let scriptPath = xsdk.launch(opeParam);
        if (scriptPath) {
            this.SoftWare.show(true);
            this.SoftWare.sendText(`xsct ${scriptPath}`);
        }
    }

    build(opeParam) {
        if (this.isIllegal(opeParam)) {
            this.warn("Please confirm the mode of soc");
        }
        
        this.SoftWare = this.getTerminal("SoftWare");

        let scriptPath = xsdk.build(opeParam);
        if (scriptPath) {
            this.SoftWare.show(true);
            this.SoftWare.sendText(`xsct ${scriptPath}`);
        }
    }
    
    program(opeParam) {
        if (this.isIllegal(opeParam)) {
            this.warn("Please confirm the mode of soc");
        }

        this.SoftWare = this.getTerminal("SoftWare");
        
        let scriptPath = xsdk.program(opeParam);
        if (scriptPath) {
            this.SoftWare.show(true);
            this.SoftWare.sendText(`xsct ${scriptPath}`);
        }
    }

    getTerminal(name) {
        for (let index = 0; index < vscode.window.terminals.length; index++) {
            const terminalElement = vscode.window.terminals[index];
            if (terminalElement.name == name) {
                return terminalElement;
            }
        }

        return vscode.window.createTerminal({ name : name });
    }
}
exports.softwareRegister = softwareRegister;