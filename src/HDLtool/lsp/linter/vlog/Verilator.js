
const BaseLinter = require('../BaseLinter');

class Verilator extends BaseLinter {
    constructor() {
        super();

        this.PARAMETERS = {
            // VHDL  : 'verilog_syntax',
            VLOG  : 'verilator',
            SVLOG : 'verilator',
            argu : {
                // VHDL  : '',
                VLOG  : '--lint-only -Wall -bbox-sys --bbox-unsup -DGLBL',
                SVLOG : '--lint-only -sv -Wall -bbox-sys --bbox-unsup -DGLBL',
            },
        };
    }

    async lint(file, options) {
        let result = await this.exec_linter(
            file, 
            this.PARAMETERS, 
            options
        );

        let file_split_space = file.split('\\ ')[0];
        let errors_str = result.stderr;
        let errors_str_lines = errors_str.split(/\r?\n/g);
        let errors = [];
        // Parse output lines
        errors_str_lines.forEach((line) => {
            if (line.startsWith('%')) {
                // remove the %
                line = line.substr(1);

                // was it for a submodule
                if (line.search(file_split_space) > 0) {
                    // remove the filename
                    line = line.replace(file_split_space, '');
                    line = line.replace(/\s+/g, ' ').trim();

                    let terms = this.split_terms(line);
                    let severity = this.getSeverity(terms[0]);
                    let message = terms.slice(2).join(' ');
                    let lineNum = parseInt(terms[1].trim()) - 1;

                    if (!isNaN(lineNum)) {
                        let error = {
                            'severity': severity,
                            'description': message,
                            'location': {
                                'file': file.replace('\\ ', ' '),
                                'position': [lineNum, 0]
                            }
                        };
                        errors.push(error);
                    }
                }
            }
        });
        return this.parse_error(errors);
    }

    split_terms(line) {
        let terms = line.split(':');
        for (var i = 0; i < terms.length; i++) {
            if (terms[i] === ' ') {
                terms.splice(i, 1);
                i--;
            }
            else {
                terms[i] = terms[i].trim();
            }
        }
        return terms;
    }

    getSeverity(severity_string) {
        let severity = "";
        if (severity_string.startsWith('Error')) {
            severity = "error";
        }
        else if (severity_string.startsWith('Warning')) {
            severity = "warning";
        }
        return severity;
    }
}

module.exports = Verilator;
