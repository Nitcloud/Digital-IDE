"use strict";
const os = require('os');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const temp = require("temp");

const vlogFormatter = require("./vlogFormatter.js");
const vhdlFormatter = require("./vhdlFormatter.js");

class Formatter {
    constructor() {
        this.vlogFormatter = new VLOGFormatter();
        this.vhdlFormatter = new VHDLFormatter();
    }

    async provideDocumentFormattingEdits(document, options, token) {
        const edits = [];
        //Get document code
        let code_document = document.getText();
        let selection_document = this.getDocumentRange(document);
        //Get selected text
        let editor = vscode.window.activeTextEditor;
        let selection_selected_text = '';
        let code_selected_text = '';
        if (editor !== undefined) {
            selection_selected_text = editor.selection;
            code_selected_text = editor.document.getText(editor.selection);
        }
        //Code to format
        let code_to_format = '';
        let selection_to_format = '';
        if (code_selected_text !== '') {
            code_to_format = code_selected_text;
            selection_to_format = selection_selected_text;
        } else {
            code_to_format = code_document;
            selection_to_format = selection_document;
        }

        let code_format = await this.format(document.languageId, code_to_format);
        if (code_format === null) {
            console.log("Error format code.");
            return edits;
        } else {
            const replacement = vscode.TextEdit.replace(selection_to_format, code_format);
            edits.push(replacement);
            return edits;
        }
    }

    async format(language, code) {
        let options = null;
        let formatted_code = '';
        try {
            if (language === "vhdl") {
                options = this.get_vhdl_config();
                formatted_code = await this.vhdlFormatter.format_from_code(code, options);
            } 
            else {
                options = this.get_vlog_config();
                formatted_code = await this.vlogFormatter.format_from_code(code, options);
            }
            return formatted_code;
        } catch (error) {
            return code;
        }
    }

    get_vlog_config() {
        let style = vscode.workspace.getConfiguration("HDL.formatter.vlog.default").get("style");
        let args = vscode.workspace.getConfiguration("HDL.formatter.vlog.default").get("args");
        return `--style=${style} ${args}`;
    }

    get_vhdl_config() {
        let configuration = vscode.workspace.getConfiguration('HDL.formatter.vhdl.default');
        let settings = {
            "RemoveComments": false,
            "RemoveAsserts": false,
            "CheckAlias": false,
            "AlignComments": configuration.get('align-comments'),
            "SignAlignSettings": {
                "isRegional": true,
                "isAll": true,
                "mode": 'local',
                "keyWords": [
                    "FUNCTION",
                    "IMPURE FUNCTION",
                    "GENERIC",
                    "PORT",
                    "PROCEDURE"
                ]
            },
            "KeywordCase": configuration.get('keyword-case'),
            "TypeNameCase": configuration.get('type-name-case'),
            "Indentation": ' '.repeat(configuration.get('indentation')),
            "NewLineSettings": {
                "newLineAfter": [
                    ";",
                    "then"
                ],
                "noNewLineAfter": []
            },
            "EndOfLine": "\n"
        };
        return settings;
    }

    getDocumentRange(document) {
        const lastLineId = document.lineCount - 1;
        return new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
    }
}

class VLOGFormatter {
    constructor() {
    }

    async format_from_code(code, options) {
        let verilogFormatter = await vlogFormatter();
        verilogFormatter.FS.writeFile("/share/FILE_IN.v", code, { encoding: 'utf8' });
        verilogFormatter.ccall('run', '', ['string'], [`${options} finish`]);
        let formatted_code = verilogFormatter.FS.readFile("/share/FILE_OUT.v", { encoding: 'utf8' });
        return formatted_code;
    }

    verilogFormatterServe(code, options) {
        vlogFormatter().then((Module) => {
            Module.FS.writeFile("/share/FILE_IN.v", code, { encoding: 'utf8' });
            Module.ccall('run', '', ['string'], [`${options} finish`]);
            let formatted_code = Module.FS.readFile("/share/FILE_OUT.v", { encoding: 'utf8' });
            return formatted_code;
        });
    }
}

class VHDLFormatter {
    constructor() {
    }

    async format_from_code(code, options) {
        let beautifuler = new vhdlFormatter.Beautifuler();
        let formatted_code = beautifuler.beauty(code, options);
        return formatted_code;
    }
}

class BaseFormatter {
    _get_command(file, synt, synt_windows, options) {
        let command = "";
        if (options !== undefined && options.custom_bin !== undefined) {
            command += options.custom_bin + " ";
        }
        else if (os.platform() === "win32") {
            if (options !== undefined && options.custom_path !== undefined) {
                command += options.custom_path + path.sep + synt_windows + " ";
            }
            else {
                command += synt_windows + " ";
            }
        }
        else {
            if (options !== undefined && options.custom_path !== undefined) {
                command += options.custom_path + path.sep + synt + " ";
            }
            else {
                command += synt + " ";
            }
        }

        if (options !== undefined && options.custom_arguments !== undefined) {
            command += options.custom_arguments + " ";
        }

        command += file;
        return command;
    }

    async _create_temp_file_of_code(content) {
        const temp_file = temp.openSync();
        if (temp_file === undefined) {
            // eslint-disable-next-line no-throw-literal
            throw "Unable to create temporary file";
        }
        fs.writeSync(temp_file.fd, content);
        fs.closeSync(temp_file.fd);
        return temp_file.path;
    }

    async _exec_formatter(file, synt, synt_windows, options) {
        var command = this._get_command(file, synt, synt_windows, options);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                let result = { 'stdout': stdout, 'stderr': stderr };
                resolve(result);
            });
        });
    }
}

class Vsg extends BaseFormatter {
    constructor() {
        super();
    }

    //Options: {custom_path:"/path/to/bin, custom_bin:"bin", file_rules:"path/to/rules.json"}
    async format_from_code(code, options) {
        let temp_file = await this._create_temp_file_of_code(code);
        let formatted_code = await this._format(temp_file, options);
        return formatted_code;
    }

    async _format(file, options) {
        let synt = "";
        if (options !== undefined && options.file_rules !== undefined) {
            synt = `vsg --fix -lr ${options.file_rules} -f `;
        }
        else {
            synt = `vsg --fix -f `;
        }
        await this._exec_formatter(file, synt, synt, options);
        let formatted_code = fs.readFileSync(file, 'utf8');
        return formatted_code;
    }
}

class Verible extends BaseFormatter {
    constructor() {
        super();
        this.PARAMETERS = {
            'SYNT': "verilog_format ",
            'SYNT_WINDOWS': "verilog_format "
        };
    }

    //Options: {path:"/path/to/bin"}
    async format_from_code(code, options) {
        let temp_file = await this._create_temp_file_of_code(code);
        let formatted_code = await this._format(temp_file, options);
        return formatted_code;
    }

    async _format(file, options) {
        let formatted_code = await this._exec_linter(file, this.PARAMETERS.SYNT,
            this.PARAMETERS.SYNT_WINDOWS, options);
        return formatted_code.stdout;
    }
}

const hdlFormatterProvide = new Formatter();
module.exports = {hdlFormatterProvide};