"use strict";

const vscode = require("vscode");

// Verilog or SystemVerilog only
const Icarus = require('./vlog/Icarus');
const Verible = require('./vlog/Verible');
const Verilator = require('./vlog/Verilator');

// VHDL only
const Ghdl = require('./vhdl/Ghdl');

// HDL linter
const Vivado = require('./mixed/Vivado');
const Default = require("./mixed/Default");
const Modelsim = require('./mixed/Modelsim');

function registerLinterServer() {
    let linter = new Linter();
    vscode.workspace.onDidOpenTextDocument((doc) => {
        linter.lint(doc);
    });
    vscode.workspace.onDidSaveTextDocument((doc) => {
        linter.lint(doc);
    });
    vscode.workspace.onDidCloseTextDocument((doc) => {
        linter.remove(doc)
    });
}
module.exports = registerLinterServer;

class Linter {
    constructor() {
        this.config = vscode.workspace.getConfiguration;
        this.diags = vscode.languages.createDiagnosticCollection();

        // Configuration
        this.vhdl = {
            name : "default",
            option : null,
            linter : null,
        }

        this.vlog = {
            name : "default",
            option : null,
            linter : null,
        }

        // 预加载，并实时更新，可直接调用
        this.config_linter();
        var _this = this;
        vscode.workspace.onDidChangeConfiguration(function () {
            _this.config_linter();
        });
    }

    /**
     * @state unfinish-untest
     * @descriptionCn 获取linter所有相关配置
     */
    config_linter() {
        this.vlog.name = this.config("HDL.linting.vlog").get("linter");
        this.vhdl.name = this.config("HDL.linting.vhdl").get("linter");

        switch (this.vlog.name) {
            case "vivado":    this.vlog.linter = new Vivado();    break;
            case "default":   this.vlog.linter = new Default();   break;
            case "modelsim":  this.vlog.linter = new Modelsim();  break;
            case "iverilog":  this.vlog.linter = new Icarus();    break;
            case "verible":   this.vlog.linter = new Verible();   break;
            case "verilator": this.vlog.linter = new Verilator(); break;
            default: this.vlog.linter = null; this.vlog.name = null; break;
        }
        this.vlog.option = this.get_option(this.vlog.name);

        switch (this.vhdl.name) {
            case "ghdl":     this.vhdl.linter = new Ghdl();      break;
            case "vivado":   this.vhdl.linter = new Vivado();    break;
            case "default":  this.vlog.linter = new Default(); break;
            case "modelsim": this.vhdl.linter = new Modelsim();  break;
            default: this.vhdl.linter = null; this.vhdl.name = null; break;
        }
        this.vhdl.option = this.get_option(this.vhdl.name);
    }

    /**
     * @state unfinish-untest
     * @descriptionCn 根据检查器的名字获取对应的参数
     * @param {String} name 检查器的名字
     * @returns {Object} 对应的参数对象 {custom_path & custom_arguments}
     */
    get_option(name) {
        if (!name) {
            return null;
        }

        let path = null;
        let argu = null;
        if (name != 'default') {
            path = this
            .config("TOOL." + name + ".install")
            .get("path").replace(/\\/g, '/');
    
            path = ((path === '') ? null : path);
    
            argu = this
            .config("HDL.linting." + name)
            .get("arguments").replace(/\\/g, '/');
    
            argu = ((argu === '') ? null : argu);
        }

        let options = {
            'name' : name,
            'custom_path': path,
            'custom_argu': argu
        };
        
        return options;
    }

    /**
     * @state unfinish-untest
     * @descriptionCn
     * @param {*} doc 
     * @returns 
     */
    async lint(doc) {
        if (!doc) {
            return null;
        }

        let diagnostics = [];
        let current_path = doc.uri.fsPath.replace(/\\/g, '/');
        switch (doc.languageId) {
            case "verilog":
                if (this.vlog.linter) {
                    this.vlog.option.id = "VLOG";
                    diagnostics = await this.vlog.linter.lint(
                        current_path,
                        this.vlog.option
                    );
                }
            break;
            case "systemverilog":
                if (this.vlog.linter) {
                    this.vlog.option.id = "SVLOG";
                    diagnostics = await this.vlog.linter.lint(
                        current_path,
                        this.vlog.option
                    );
                }
            break;
            case "vhdl":
                if (this.vhdl.linter) {
                    this.vhdl.option.id = "VHDL";
                    diagnostics = await this.vhdl.linter.lint(
                        current_path,
                        this.vhdl.option
                    );
                }
            break;
            default: return null;
        }

        this.diags.set(doc.uri, diagnostics);
    }

    remove(doc) {
        if (!doc) {
            return null;
        }
        
        this.diags.delete(doc.uri);
    }
}