const vscode = require('vscode');
const HDLPath = require('../../../HDLfilesys/operation/path');

const { vlogParser, HDLParam } = require('../../../HDLparser');

const { getVlogKeywordItem, getLastSingleWord, 
        filterInstanceByPosition, filterSymbolScope, 
        positionAfterEqual } = require('../util');

const { provideIncludeFiles, provideMacros, providePositionPorts,
        provideModules, provideParamsPorts, provideNets } = require('../util/completion');

class VlogIncludeCompletionProvider {
    /**
     * 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position
     * @returns {Promise<Array<vscode.CompletionItem>>} 
     */
    async provideCompletionItems(document, position) {
        try {
            return provideIncludeFiles(document, position);
        } catch (err) {
            console.log(err);
        }
    }
};


class VlogMacroCompletionProvider {
    /**
     * 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position
     * @returns {Promise<Array<vscode.CompletionItem>>} 
     */
    async provideCompletionItems(document, position) {
        try {
            const lineText = document.lineAt(position).text;
            const prefixString = lineText.substring(0, position.line);
            const targetWord = getLastSingleWord(prefixString);

            const code = document.getText();
            const symbolResult = vlogParser.symbol(code);
            return provideMacros(targetWord, symbolResult.defines);
        } catch (err) {
            console.log(err);
        }
    }
}


class VlogPositionPortProvider {
    /**
     * 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position
     * @returns {Promise<Array<vscode.CompletionItem>>} 
     */
    async provideCompletionItems(document, position) {
        try {
            const suggestPositionPorts = [];
            const lineText = document.lineAt(position).text;
            const filePath = HDLPath.toSlash(document.fileName);
            const prefixString = lineText.substring(0, position.line);
            const code = document.getText();
            const symbolResult = vlogParser.symbol(code);
        
            const scopeSymbols = filterSymbolScope(position, symbolResult.symbols)
            if (!scopeSymbols || 
                !scopeSymbols.module || 
                !scopeSymbols.symbols || 
                !HDLParam.hasModule(filePath, scopeSymbols.module.name)) {
                return suggestPositionPorts;
            }

            const currentModule = HDLParam.findModule(filePath, scopeSymbols.module.name);
            const currentInst = filterInstanceByPosition(position, scopeSymbols.symbols, currentModule);
            // find instance and instMod is not null (solve the dependence already)
            console.log(symbolResult);
            console.log(currentInst);

            if (currentInst && currentInst.module && currentInst.instModPath) {
                console.log('enter');
                const portsparams = providePositionPorts(position, currentInst);
                console.log(portsparams);
                suggestPositionPorts.push(...portsparams);
            }
            
            return suggestPositionPorts;

        } catch (err) {
            console.log(err);
        }
    }
}

class VlogCompletionProvider {
    /**
     * 
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position
     * @returns {Promise<Array<vscode.CompletionItem>>} 
     */
    async provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text;
        const filePath = HDLPath.toSlash(document.fileName);
        try {
            const prefixString = lineText.substring(0, position.line);
            const targetWord = getLastSingleWord(prefixString);

            // 1. provide keyword
            const completions = getVlogKeywordItem();

            const code = document.getText();
            const symbolResult = vlogParser.symbol(code);

            // locate at one module
            const scopeSymbols = filterSymbolScope(position, symbolResult.symbols);
            if (!scopeSymbols || 
                !scopeSymbols.module || 
                !HDLParam.hasModule(filePath, scopeSymbols.module.name)) {
                return completions;
            }

            // find wrapper module
            const currentModule = HDLParam.findModule(filePath, scopeSymbols.module.name);

            // 3. provide modules
            const suggestModulesPromise = provideModules(filePath, symbolResult.includes);

            // 4. provide params and ports of wrapper module
            const suggestParamsPortsPromise = provideParamsPorts(currentModule);

            // 5. provide nets
            const suggestNetsPromise = provideNets(scopeSymbols.symbols);

            // collect
            completions.push(...await suggestModulesPromise);
            completions.push(...await suggestParamsPortsPromise);
            completions.push(...await suggestNetsPromise);
            
            return completions;

        } catch (err) {
            console.log(err);
        }
    }
};


const vlogCompletionProvider = new VlogCompletionProvider();
const vlogIncludeCompletionProvider = new VlogIncludeCompletionProvider();
const vlogMacroCompletionProvider = new VlogMacroCompletionProvider();
const vlogPositionPortProvider = new VlogPositionPortProvider();

module.exports = {
    vlogCompletionProvider,
    vlogIncludeCompletionProvider,
    vlogMacroCompletionProvider,
    vlogPositionPortProvider
};