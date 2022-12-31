const vscode = require('vscode');
const HDLPath = require('../../../HDLfilesys/operation/path');

const { getSingleWordAtCurrentPosition, 
        filterSymbolScope, filterInstanceByPosition, 
        isInComment, isVlogKeyword, isPositionInput,
        matchDefine, matchInclude, matchDefineMacro, matchInstance, matchNormalSymbol,
        matchPorts, matchParams,
        getInstParamByPosition, getInstPortByPosition } = require('../util');

const { vlogParser, HDLParam } = require('../../../HDLparser');


class VlogDefinitionProvider {
    /**
     * @description provide definition jump for vlog
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position 
     * @returns {Promise<vscode.Location>}
     */
    async provideDefinition(document, position) {
        const lineText = document.lineAt(position).text;
        // content to output in hover
        const filePath = HDLPath.toSlash(document.fileName);

        try {
            const targetWord = getSingleWordAtCurrentPosition(lineText, position.character);

            // 1. check is key word
            if (isVlogKeyword(targetWord)) {
                return null;
            }

            const code = document.getText();
            const symbolResult = vlogParser.symbol(code);

            // 2. detect comment
            // TODO : replace it in the laster version
            if (isInComment(document, position, symbolResult.comments)) {
                return null;
            }

            // 3. match `include
            const includeResult = matchInclude(position, symbolResult.includes);
            if (includeResult) {
                const absPath = HDLPath.rel2abs(filePath, includeResult.name);
                const targetFile = vscode.Uri.file(absPath);
                const targetPosition = new vscode.Position(0, 0);
                return new vscode.Location(targetFile, targetPosition);
            }

            // 4. match `define
            const defineResult = matchDefine(position, symbolResult.defines)
            if (defineResult) {
                return null;
            }

            // 5. match macro
            const macroResult = matchDefineMacro(position, targetWord, symbolResult.defines);
            if (macroResult) {
                const name = macroResult.name;
                const value = macroResult.value;
                return new vscode.Location(document.uri, macroResult.range.start);
            }


            // locate at one module
            const scopeSymbols = filterSymbolScope(position, symbolResult.symbols);
            const currentModule = HDLParam.findModule(filePath, scopeSymbols.module.name);

            // 6. match instance
            const instResult = matchInstance(targetWord, currentModule);
            if (instResult) {
                const instModule = instResult.module;
                if (!instModule || !instResult.instModPath) {
                    return null;
                }
                const targetFile = vscode.Uri.file(instResult.instModPath);
                const range = instModule.range;
                const targetPosition = new vscode.Position(range.start.line, range.start.character);
                return new vscode.Location(targetFile, targetPosition);
            }

            // 7. match port or param definition (position input)
            if (isPositionInput(lineText, position.character)) {
                const currentInstResult = filterInstanceByPosition(position, scopeSymbols.symbols, currentModule);
                const instParamPromise = getInstParamByPosition(currentInstResult, position, targetWord);
                const instPortPromise = getInstPortByPosition(currentInstResult, position, targetWord);
                
                const instParam = await instParamPromise;
                const instPort = await instPortPromise;
                const instModPathUri = vscode.Uri.file(currentInstResult.instModPath);

                if (instParam) {
                    return new vscode.Location(instModPathUri, instParam.range.start);
                }
                if (instPort) {
                    return new vscode.Location(instModPathUri, instPort.range.start);
                }
            }

            // 8. match params
            const paramResult = matchParams(targetWord, currentModule);
            if (paramResult) {
                const start = paramResult.range.start;
                const targetPosition = new vscode.Position(start.line, start.character);
                return new vscode.Location(document.uri, targetPosition);
            }

            // 9. match ports
            const portResult = matchPorts(targetWord, currentModule);
            if (portResult) {
                const start = portResult.range.start;
                const targetPosition = new vscode.Position(start.line, start.character);
                return new vscode.Location(document.uri, targetPosition);
            }

            // 10. match others
            const normalResult = matchNormalSymbol(targetWord, scopeSymbols.symbols);
            if (normalResult) {
                const start = normalResult.start;
                const targetPosition = new vscode.Position(start.line, start.character);
                return new vscode.Location(document.uri, targetPosition);
            }
            
            return null;

        } catch (err) {
            console.log(err);
        }
    }
}


const vlogDefinitionProvider = new VlogDefinitionProvider();


module.exports = {
    vlogDefinitionProvider
};