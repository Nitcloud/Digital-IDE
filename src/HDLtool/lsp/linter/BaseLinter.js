
const os   = require('os');
const vscode = require("vscode");

class BaseLinter {

    /**
     * @descriptionCn 获取三方调用指令
     * @param {String} path 
     * @param {Object} param 
     * @param {Object} options 
     * @returns 
     */
    get_command(path, param, options) {
        // 默认为已经添加到系统变量的情况
        let command = param[options.id] + ' ';

        // options一定存在
        // 如果 custom_path 不存在则默认为已经添加到系统变量
        if (options.custom_path) {
            if (os.platform() === "win32") {
                command = `"${options.custom_path}"`
                        + '/' 
                        + param[options.id] 
                        + (options.name == 'vivado"' ? '.bat\" ' : '.exe\" ');
            } else {
                command = `"${options.custom_path}`
                        + '/'
                        + param[options.id]
                        + '\" ';
            }
        }

        command += param.argu[options.id] + ' ';;

        if (options.custom_argu) {
            command += options.custom_argu + ' ';
        }

        command += path;
        return command;
    }

    async exec_linter(file, param, options) {
        let command = this.get_command(file, param, options);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (error, stdout, stderr) => {
                let result = { 'stdout': stdout, 'stderr': stderr };
                if (stderr !== '') {
                    console.log(`[error]> ${stderr}`);
                }
                resolve(result);
            });
        });
    }

    parse_error(errors) {
        let diagnostics = [];
        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            let code = "";
            if (errors[i].code !== undefined) {
                code = errors[i].code;
            }
            else {
                code = errors[i].severity;
            }
            diagnostics.push({
                severity: this.get_severity(errors[i]['severity']),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `HDL:${this.linter_name}`
            });
        }
        return diagnostics;
    }

    get_severity(sev) {
        switch (sev) {
            case "error":
                return vscode.DiagnosticSeverity.Error;
            case "warning":
                return vscode.DiagnosticSeverity.Warning;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }
}

module.exports = BaseLinter;
