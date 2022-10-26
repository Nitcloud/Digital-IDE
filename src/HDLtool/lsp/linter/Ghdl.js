
const BaseLinter = require('./BaseLinter');

class Ghdl extends BaseLinter {
    constructor() {
        super();

        this.PARAMETERS = {
            VHDL : 'ghdl',
            argu : {
                VHDL : '-s -fno-color-diagnostics',
            },
        };
    }

    async lint(file, options) {
        let result = await this.exec_linter(
            file, 
            this.PARAMETERS, 
            options
        );

        try {
            file = file.replace('\\ ', ' ');
            let errors_str = result.stderr;
            let errors_str_lines = errors_str.split(/\r?\n/g);
            let errors = [];
            errors_str_lines.forEach((line) => {
                if (line.startsWith(file)) {
                    line = line.replace(file, '');
                    let terms = line.split(':');
                    let line_num = parseInt(terms[1].trim());
                    let column_num = parseInt(terms[2].trim());
                    if (terms.length === 4) {
                        let error = {
                            'severity': "error",
                            'description': terms[3].trim(),
                            'location': {
                                'file': file,
                                'position': [line_num - 1, column_num - 1]
                            }
                        };
                        errors.push(error);
                    }
                    else if (terms.length >= 4) {
                        let sev;
                        if (terms[2].trim() === 'error') {
                            sev = "error";
                        }
                        else if (terms[2].trim() === 'warning') {
                            sev = "warning";
                        }
                        else {
                            sev = "information";
                        }
                        let error = {
                            'severity': sev,
                            'description': terms[3].trim(),
                            'location': {
                                'file': file,
                                'position': [line_num - 1, column_num - 1]
                            }
                        };
                        errors.push(error);
                    }
                }
            });
            return this.parse_error(errors);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

module.exports = Ghdl;
