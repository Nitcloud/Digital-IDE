
const BaseLinter = require('../BaseLinter');

class Icarus extends BaseLinter {
    constructor() {
        super();

        this.PARAMETERS = {
            VLOG  : 'iverilog',
            SVLOG : 'iverilog',
            argu : {
                VLOG  : '-Wall',
                SVLOG : '-Wall -g2012',
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
                    let lineNum = parseInt(terms[1].trim()) - 1;
                    if (terms.length === 3) {
                        let error = {
                            'severity': "error",
                            'description': terms[2].trim(),
                            'location': {
                                'file': file,
                                'position': [lineNum, 0]
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
                                'position': [lineNum, 0]
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

module.exports = Icarus;