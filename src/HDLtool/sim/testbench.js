"use strict";

const vscode   = require("vscode");
const instance = require("./instance");

const fs = require("../../HDLfilesys");

class testbench {
    constructor(param) {
        this.param = param;
        this.inst = new instance();
        this.rootPath = param.opeParam.rootPath;
        this.simuPath = param.opeParam.ARCH.Hardware.sim;
        this.tbSrcPath = `${this.this.rootPath}/lib/testbench.v`;
        this.tbDisPath = `${this.this.simuPath}/testbench.v`;
    }

    overwrite() {
        const options = {
            preview: false,
            viewColumn: vscode.ViewColumn.Active
        };
        const uri = vscode.Uri.file(this.tbSrcPath)
        vscode.window.showTextDocument(uri, options);
    }

    generate(module) {
        let temp = fs.files.readFile(this.tbSrcPath);
        if (!temp) {
            return null;
        }

        let content = '';
        const lines = temp.split('\n');
        const len = lines.length;
        for (let index = 0; index < len; index++) {
            const line = lines[index];
            content += line + '\n';
            if (line.indexOf("//Instance ") != -1) {
                // 只写到testbench.v中去 只要例化成verilog形式即可
                content += this.inst.vlog(module) + '\n';
            }
        }

        if (!fs.files.writeFile(this.tbDisPath, content)) {
            return null;
        }
    }
}