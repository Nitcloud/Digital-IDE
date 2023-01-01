
const BaseLinter = require('../BaseLinter');

class Verible extends BaseLinter {
    constructor() {
        super();

        this.PARAMETERS = {
            // VHDL  : 'verilog_syntax',
            VLOG  : 'verilog_syntax',
            SVLOG : 'verilog_syntax',
            argu : {
                // VHDL  : '',
                VLOG  : '',
                SVLOG : '',
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
            let errors_str = result.stdout;
            let errors_str_lines = errors_str.split(/\r?\n/g);
            let errors = [];
            errors_str_lines.forEach((line) => {
                if (line.startsWith(file)) {
                    line = line.replace(file, '');
                    let terms = line.split(':');
                    let line_num = parseInt(terms[1].trim());
                    let column_num = parseInt(terms[2].trim());
                    if (terms.length === 3) {
                        let error = {
                            'severity': "warning",
                            'description': terms[3].trim(),
                            'location': {
                                'file': file,
                                'position': [line_num - 1, column_num - 1]
                            }
                        };
                        errors.push(error);
                    }
                    else if (terms.length > 3) {
                        let message = "";
                        for (let x = 3; x < terms.length - 1; ++x) {
                            message += terms[x].trim() + ":";
                        }
                        message += terms[terms.length - 1].trim();
                        let error = {
                            'severity': 'warning',
                            'description': message,
                            'location': {
                                'file': "file",
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

module.exports = Verible;
