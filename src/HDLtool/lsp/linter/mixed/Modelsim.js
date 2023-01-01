
const BaseLinter = require('../BaseLinter');

class Modelsim extends BaseLinter {

    constructor() {
        super();

        this.PARAMETERS = {
            VHDL  : 'vcom',
            VLOG  : 'vlog',
            SVLOG : 'vlog',
            argu : {
                VHDL  : '-quiet -nologo -2008',
                VLOG  : '-quiet -nologo',
                SVLOG : '-quiet -nologo -sv',
            },
        };
    }

    async lint(file, options) {
        let result = await this.exec_linter(
            file, 
            this.PARAMETERS, 
            options
        );

        file = file.replace('\\ ', ' ');
        let errors_str = result.stdout;
        let errors_str_lines = errors_str.split(/\r?\n/g);
        let errors = [];

        // Parse output lines
        errors_str_lines.forEach((line) => {
            if (line.startsWith('**')) {
                // eslint-disable-next-line max-len
                let regex_exp = /(Error|Warning).+?(?: *?(?:.+?(?:\\|\/))+.+?\((\d+?)\):|)(?: *?near "(.+?)":|)(?: *?\((.+?)\)|) +?(.+)/gm;
                let m = regex_exp.exec(line);
                try {
                    //Severity
                    let sev = "warning";
                    if (m[1] === "Error") {
                        sev = "error";
                    }
                    else if (m[1] === "Warning") {
                        sev = "warning";
                    }
                    else {
                        sev = "note";
                    }

                    if (sev !== "note") {
                        let message = m[5];
                        let code = m[4];
                        let line = parseInt(m[2]) - 1;

                        let error = {
                            'severity': sev,
                            'description': message,
                            'code': code,
                            'location': {
                                'file': file,
                                'position': [line, 0]
                            }
                        };
                        errors.push(error);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
        return this.parse_error(errors);
    }
}

module.exports = Modelsim;
