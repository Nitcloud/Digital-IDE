const parser = require("../../../../HDLparser");
const filesys = require("../../../../HDLfilesys");

class Default {
    constructor() {
        this.vlogLinter = parser.vlogParser;
        this.vhdlLinter = parser.vhdlParser;
    }

    async lint(file, options) {
        try {
            let text = filesys.files.readFile(file);
            if (!text) {
                return null;
            }

            text = text + '\r\n';
            let diagnostics = [];
            switch (options.id) {
                case "SVLOG":
                case "VLOG":
                    diagnostics = this.vlogLinter.lint(text);
                break;
                case "VHDL":   
                    diagnostics = this.vhdlLinter.lint(text);
                break;
                default: break;
            }
            return diagnostics;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

module.exports = Default;