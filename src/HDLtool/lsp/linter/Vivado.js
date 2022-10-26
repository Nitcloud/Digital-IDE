
const BaseLinter = require('./BaseLinter');

class Vivado extends BaseLinter {
    constructor() {
        super();

        this.PARAMETERS = {
            VHDL  : 'xvhdl',
            VLOG  : 'xvlog',
            SVLOG : 'xvlog',
            argu : {
                VHDL  : '-nolog',
                VLOG  : '-nolog',
                SVLOG : '--sv --nolog',
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
        errors_str_lines.forEach((line) => {
            let tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
            if (tokens.length < 4
                || tokens[0] !== "ERROR"
                || !tokens[1].startsWith("VRFC")) {
                return;
            }

            // Get filename and line number
            // eslint-disable-next-line no-unused-vars
            let [filename, lineno_str] = tokens[3].split(/:(\d+)/);
            let lineno = parseInt(lineno_str) - 1;
            let error = {
                'severity': "error",
                'description': "[" + tokens[1] + "] " + tokens[2],
                'code': tokens[1],
                'location': {
                    'file': file,
                    'position': [lineno, 0]
                }
            };
            errors.push(error);
        });

        return this.parse_error(errors);
    }
}

module.exports = Vivado;
