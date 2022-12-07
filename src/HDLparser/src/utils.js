const parser = require("./kernel");

var utils  = {
    getSymbols : function (options) {
        switch (options.languageId) {
            case "verilog":
            case "systemverilog":
                const vlog = new parser.vlog();
                return vlog.symbol(options.code);
            case "vhdl":
                const vhdl = new parser.vhdl();
                return vhdl.symbol(options.code);
            default: return[];
        }
    },

    getSymbolsFromType : function (type, symbols, callback) {
        let results = [];
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            if (symbol.type !== type) {
                continue;
            }

            if (callback) {
                if (!callback(symbol)) {
                    return null;
                }
            }

            results.push(symbol);
        }
        return results;
    },

    getSymbolsFromName : function (name, symbols, callback) {
        let results = [];
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            if (symbol.name !== name) {
                continue;
            }

            if (callback) {
                callback(symbol);
            }
            results.push(symbol);
        }
        return results;
    }
}
module.exports = utils;