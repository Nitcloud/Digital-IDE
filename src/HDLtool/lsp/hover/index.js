const vscode = require('vscode');

const { getSingleWordAtCurrentPosition, 
        filterSymbolScope, filterInstanceByPosition, 
        isInComment, isVlogKeyword, isPositionInput,
        matchDefine, matchInclude, matchDefineMacro, matchInstance, matchNormalSymbol,
        matchPorts, matchParams, transferVlogNumber,
        makeVlogHoverContent, makePortDesc, makeParamDesc,
        getInstParamByPosition, getInstPortByPosition } = require('../util');

const { vlogParser, HDLParam } = require('../../../HDLparser');

const HDLPath = require('../../../HDLfilesys/operation/path');

class VlogHoverProvider {
    /**
     * @param {vscode.TextDocument} document 
     * @param {vscode.Position} position
     * @returns {Promise<vscode.Hover>}
     */
    async provideHover(document, position) {
        const lineText = document.lineAt(position).text;
        // content to output in hover
        const content = new vscode.MarkdownString('', true);
        const filePath = HDLPath.toSlash(document.fileName);

        try {
            const targetWord = getSingleWordAtCurrentPosition(lineText, position.character);

            // 1. check is key word
            if (isVlogKeyword(targetWord)) {
                return new vscode.Hover(content);
            }

            // feature 1 : detect number and transfer
            const numberPromise = transferVlogNumber(lineText, position.character);

            const code = document.getText();
            const symbolResult = vlogParser.symbol(code);

            // 2. detect comment
            // TODO : replace it in the laster version
            if (isInComment(document, position, symbolResult.comments)) {
                return new vscode.Hover(content);
            }

            // TODO : port comment

            // 3. match `include
            const includeResult = matchInclude(position, symbolResult.includes);
            if (includeResult) {
                const absPath = HDLPath.rel2abs(filePath, includeResult.name);
                content.appendCodeblock(`"${absPath}"`, 'verilog');
                return new vscode.Hover(content);
            } else if (lineText.trim().startsWith('`include')) {
                return new vscode.Hover(content);
            }
            
            // 4. match `define
            const defineResult = matchDefine(position, symbolResult.defines)
            if (defineResult) {
                return new vscode.Hover(content);
            }

            // 5. match macro
            const macroResult = matchDefineMacro(position, targetWord, symbolResult.defines);
            if (macroResult) {
                const name = macroResult.name;
                const value = macroResult.value;
                content.appendCodeblock(`\`define ${name} ${value}`, 'verilog');
                return new vscode.Hover(content);
            }
            
            // locate at one module
            const scopeSymbols = filterSymbolScope(position, symbolResult.symbols);
            if (!scopeSymbols || 
                !scopeSymbols.module || 
                !HDLParam.hasModule(filePath, scopeSymbols.module.name)) {
                return new vscode.Hover(content);
            }
            const currentModule = HDLParam.findModule(filePath, scopeSymbols.module.name);

            // 6. match instance
            const instResult = matchInstance(targetWord, currentModule);
            if (instResult) {
                const instModule = instResult.module;
                if (!instModule || !instResult.instModPath) {
                    content.appendMarkdown('cannot find the definition of the module');
                    return new vscode.Hover(content);
                }
                await makeVlogHoverContent(content, instModule);
                return new vscode.Hover(content);
            }


            // 7. match port or param definition (position input)
            if (isPositionInput(lineText, position.character)) {
                const currentInstResult = filterInstanceByPosition(position, scopeSymbols.symbols, currentModule);
                
                const instParamPromise = getInstParamByPosition(currentInstResult, position, targetWord);
                const instPortPromise = getInstPortByPosition(currentInstResult, position, targetWord);
                
                const instParam = await instParamPromise;
                const instPort = await instPortPromise;

                if (instParam) {
                    const initParamDesc = makeParamDesc(instParam);
                    content.appendCodeblock(initParamDesc, 'verilog');
                    return new vscode.Hover(content);
                }
                if (instPort) {
                    const initPortDesc = makePortDesc(instPort);
                    content.appendCodeblock(initPortDesc, 'verilog');
                    return new vscode.Hover(content);
                }
            }

            // 8. match params
            const paramResult = matchParams(targetWord, currentModule);
            if (paramResult) {
                const paramDesc = makeParamDesc(paramResult);
                content.appendCodeblock(paramDesc, 'verilog');
                return new vscode.Hover(content);
            }

            // 9. match ports
            const portResult = matchPorts(targetWord, currentModule);
            if (portResult) {
                const portDesc = makePortDesc(portResult);
                content.appendCodeblock(portDesc, 'verilog');
                return new vscode.Hover(content);
            }

            // 10. match others
            const normalResult = matchNormalSymbol(targetWord, scopeSymbols.symbols);
            if (normalResult) {
                const normalDesc = normalResult.type + ' ' + normalResult.name;
                content.appendCodeblock(normalDesc, 'verilog');
                return new vscode.Hover(content);
            }


            // collect Promise
            // feature 1. number signed and unsigned number display
            const numberResult = await numberPromise;
            if (numberResult) {
                const bits = targetWord.length - 1;
                content.appendCodeblock(bits + "'" + targetWord, 'verilog');
                content.appendMarkdown("`unsigned` " + numberResult.unsigned);
                content.appendText('\n')
                content.appendMarkdown("`signed` " + numberResult.signed);
            }

            return new vscode.Hover(content);
        } catch (err) {
            console.log(err);
        }

    }
};

const vlogHoverProvider = new VlogHoverProvider();

module.exports = {
    vlogHoverProvider
}