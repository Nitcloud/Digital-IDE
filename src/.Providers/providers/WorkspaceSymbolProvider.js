"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../symbol");
class SystemVerilogWorkspaceSymbolProvider {
    constructor(indexer) {
        this.NUM_FILES = 250;
        this.indexer = indexer;
    };
    /**
        Queries a symbol from `this.symbols`, performs an exact match if `exactMatch` is set to true,
        and a partial match if it's not passed or set to false.

        @param query the symbol's name
        @param token the CancellationToken
        @param exactMatch whether to perform an exact or a partial match
        @return an array of matching SystemVerilogSymbol
    */
    provideWorkspaceSymbols(query, token, exactMatch) {
        return new Promise((resolve, reject) => {
            if (query.length === 0) {
                resolve(this.indexer.mostRecentSymbols);
            }
            else {
                const pattern = new RegExp(".*" + query.replace(" ", "").split("").map((c) => c).join(".*") + ".*", 'i');
                let results = new Array();
                this.indexer.symbols.forEach(list => {
                    list.forEach(symbol => {
                        if (exactMatch === true) {
                            if (symbol.name == query) {
                                results.push(symbol);
                            }
                        }
                        else if (symbol.name.match(pattern)) {
                            results.push(symbol);
                        }
                    });
                });
                this.indexer.updateMostRecentSymbols(results.slice(0)); //pass a shallow copy of the array
                resolve(results);
            }
        });
    }
    /**
        Queries a `module` with a given name from `this.symbols`, performs an exact match if `exactMatch` is set to true,
        and a partial match if it's not passed or set to false.
        @param query the symbol's name
        @return the module's SystemVerilogSymbol
    */
    provideWorkspaceModule(query) {
        if (query.length === 0) {
            return undefined;
        }
        else {
            let symbolInfo = undefined;
            this.indexer.symbols.forEach(list => {
                list.forEach(symbol => {
                    if (symbol.name == query && symbol.kind == symbol_1.getSymbolKind("module")) {
                        symbolInfo = symbol;
                        return false;
                    }
                });
                if (symbolInfo) {
                    return false;
                }
            });
            this.indexer.updateMostRecentSymbols([symbolInfo]);
            return symbolInfo;
        }
    }
}
exports.SystemVerilogWorkspaceSymbolProvider = SystemVerilogWorkspaceSymbolProvider;
//# sourceMappingURL=WorkspaceSymbolProvider.js.map