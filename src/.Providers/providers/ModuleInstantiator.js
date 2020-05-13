"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const symbol_1 = require("../symbol");
/**
 * Processing states:
 * --------------------------------------------
 * INITIAL: before the ports/parameters header.
 * PARAMETERS: inside the parameters header.
 * PORTS: inside the ports header.
 * COMPLETE: processing is finished.
 * --------------------------------------------
 */
var processingState;
(function (processingState) {
    processingState[processingState["INITIAL"] = 1] = "INITIAL";
    processingState[processingState["PARAMETERS"] = 2] = "PARAMETERS";
    processingState[processingState["PORTS"] = 3] = "PORTS";
    processingState[processingState["COMPLETE"] = 4] = "COMPLETE";
})(processingState || (processingState = {}));
/**
 * key symbols
 */
const ports_key_symbols = ["input", "output", "inout"];
const parameter_key_symbol = "parameter";
/**
 * space padding
 */
const padding = " ".repeat(vscode_1.workspace.getConfiguration(null, null).get('editor.tabSize'));
/**
 * non-breaking white space
 */
const non_breaking_space = "\xa0";
/**
    Checks if symbol is a port.

    @param symbol the symbol
    @return true, if symbol is a port
*/
function isPortSymbol(symbol) {
    if (isEmptyKey(symbol)) {
        return false;
    }
    let exists = false;
    symbol = symbol.trim();
    ports_key_symbols.forEach(function (key) {
        if (symbol == key) {
            exists = true;
            return false;
        }
    });
    return exists;
}
/**
    Checks if symbol is a parameter.

    @param symbol the symbol
    @return true, if symbol is a parameter
*/
function isParameterSymbol(symbol) {
    if (isEmptyKey(symbol)) {
        return false;
    }
    symbol = symbol.trim();
    return symbol == parameter_key_symbol;
}
/**
 * Checks if the given key is empty
 *
 * @param key the key
 * @return true, if the key is empty
*/
function isEmptyKey(key) {
    if (key === undefined || key === null || key == "") {
        return true;
    }
    let regex = new RegExp(non_breaking_space, "g");
    key = key.replace(regex, "");
    key = key.replace((/ +|\r\n|\n|\r/g), "");
    return key.length == 0;
}
/**
    Checks if the module is parameterized.

    @param symbol the module's symbol
    @param container the module's container
    @return true, if the module is parameterized
*/
function moduleIsParameterized(symbol, container) {
    if (isEmptyKey(symbol) || isEmptyKey(container)) {
        return false;
    }
    //remove new lines
    container = container.replace(/\r\n|\n|\r/g, ' ');
    //surround '#(' with space
    container = container.replace(/#\(/g, ' #\( ');
    //replace multiple white spaces with a single whitespace
    container = container.replace(/  +/g, ' ');
    let keys = container.split(" ");
    if (keys.length < 3) {
        return false;
    }
    if (keys[0] == "module" && keys[1] == symbol && keys[2] == "#\(") {
        return true;
    }
    return false;
}
/**
 * Module instantiator class which queries a given module, fetches the relative container, and parses an instance.
*/
class ModuleInstantiator {
    constructor() { }
    ;
    /**
        Uses the given symbol to query the module's definition,
        and then return the module's instance.

        @param query the module's name
        @return the module's instance.
    */
    auto_instantiate(query) {
        return new Promise((resolve, reject) => {
            // return this.workspaceSymbolProvider.provideWorkspaceSymbols(query, undefined, true)
            return vscode_1.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", query, undefined, true)
                .then((symbols) => {
                for (let i = 0; i < symbols.length; i++) {
                    const s = symbols[i];
                    if (s.kind == symbol_1.getSymbolKind("module")) {
                        return s;
                    }
                }
                reject(query + " module was not found in the workspace.");
            }).then(s => {
                vscode_1.workspace.openTextDocument(s.location.uri).then(doc => {
                    let container = doc.getText(s.location.range);
                    if (isEmptyKey(container)) {
                        reject(query + "'s definition is undefined in the workspace.");
                    }
                    let instance = undefined;
                    try {
                        instance = formatInstance(query, container);
                    }
                    catch (error) {
                        console.log(error);
                        reject("An error occurred when formatting the instance for " + query + ": " + error);
                    }
                    if (instance === undefined) {
                        reject("An error occurred when formatting the instance for " + query + ".");
                    }
                    resolve(instance);
                });
            });
        });
    }
    /**
        Gets module name from the user, and looks up in the workspaceSymbolProvider for a match.
        Looks up the module's definition, and parses it to build the module's instance.
        @return the module's instance, assigns the default parameter values.
    */
    instantiateModule() {
        const options = {
            prompt: "Enter the module name to instantiate",
            placeHolder: "Enter the module name to instantiate",
        };
        // request the module's name from the user
        vscode_1.window.showInputBox(options).then((value) => {
            if (!value) {
                return;
            }
            // current editor
            const editor = vscode_1.window.activeTextEditor;
            // check if there is no selection
            if (editor.selection.isEmpty) {
                if (editor) {
                    this.auto_instantiate(value).then(function (v) {
                        editor.edit((editBuilder) => {
                            editBuilder.replace(editor.selection, v);
                        });
                    }, function (e) {
                        vscode_1.window.showErrorMessage(e);
                    });
                }
            }
        });
    }
}
exports.ModuleInstantiator = ModuleInstantiator;
/**
    Uses the given symbol, and given container to format the module's instance.

    @param symbol string the module's name
    @container the module's container
    @return the module's instance.
    @throws Array Out of Bounds error with incorrect syntax
*/
function formatInstance(symbol, container) {
    if (isEmptyKey(symbol) || isEmptyKey(container)) {
        return undefined;
    }
    let original_container = container;
    container = cleanUpContainer(container);
    let isParameterized = moduleIsParameterized(symbol, original_container);
    let maxLength = findMaxLength(container, isParameterized);
    container = parseContainer(symbol, container, isParameterized, maxLength);
    return container;
}
exports.formatInstance = formatInstance;
/**
 * Cleans up the container from extra characters, and surround delimiters with white space.
 *
 * @param container the module's container
 * @return cleaned up container.
*/
function cleanUpContainer(container) {
    if (isEmptyKey(container)) {
        return undefined;
    }
    //replace white space with non-breaking white space
    container = container.replace(/ /g, ' ' + non_breaking_space + ' ');
    //surround ',' '=' '(' ')' '//' '/*' with whitespace
    container = container.replace(/,/g, ' , ');
    container = container.replace(/=/g, ' = ');
    container = container.replace(/\(/g, ' \( ');
    container = container.replace(/\)/g, ' \) ');
    container = container.replace(/\/\//g, ' \/\/ ');
    container = container.replace(/\/\*/g, ' \/\* ');
    //surround key symbols with space
    var regex;
    ports_key_symbols.forEach(function (key) {
        regex = new RegExp(key, "g");
        container = container.replace(regex, " " + key + " ");
    });
    regex = new RegExp(parameter_key_symbol, "g");
    container = container.replace(regex, " " + parameter_key_symbol + " ");
    //replace multiple white spaces with a single whitespace
    container = container.replace(/  +/g, ' ');
    container = container.trim();
    return container;
}
/**
 * Get the maximum length of the ports and parameters in the module container.
 *
 * @param container the module's container
 * @param moduleIsParameterized whether the module has parameters or not
 * @return the maximum length
*/
function findMaxLength(container, moduleIsParameterized) {
    if (isEmptyKey(container)) {
        return undefined;
    }
    let keys = container.split(" ");
    let output = [];
    let maxLength = 0;
    let lastPort = undefined;
    let lastParameter = undefined;
    let passedEqualSign = false;
    let state = processingState.INITIAL;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == undefined) {
            continue;
        }
        //single comment
        if (keys[i] == "//") {
            i = getSingleComment(keys, output, i);
        }
        //block comment
        else if (keys[i] == "/*") {
            i = getBlockComment(keys, output, i);
        }
        else if (state == processingState.INITIAL) {
            if (keys[i] == "(") {
                if (moduleIsParameterized) {
                    state = processingState.PARAMETERS;
                }
                else {
                    state = processingState.PORTS;
                }
            }
        }
        else if (state == processingState.PARAMETERS) {
            if (keys[i] == ")") {
                state = processingState.PORTS;
            }
            else if (keys[i] == "," && lastParameter) {
                maxLength = Math.max(lastParameter.length, maxLength);
                lastParameter = undefined;
                passedEqualSign = false;
            }
            else if (keys[i] == "=") {
                passedEqualSign = true;
            }
            else if (!isParameterSymbol(keys[i]) && !isEmptyKey(keys[i])) {
                if (!passedEqualSign) {
                    lastParameter = keys[i].trim();
                }
            }
        }
        else if (state == processingState.PORTS) {
            if (lastParameter) {
                maxLength = Math.max(lastParameter.length, maxLength);
                lastParameter = undefined;
            }
            if (keys[i] == ")") {
                state = processingState.COMPLETE;
            }
            else if (keys[i] == "," && lastPort) {
                maxLength = Math.max(lastPort.length, maxLength);
                lastPort = undefined;
            }
            else if (!isPortSymbol(keys[i]) && !isEmptyKey(keys[i])) {
                lastPort = keys[i].trim();
            }
        }
        //last item
        if (i >= keys.length - 1) {
            if (state == processingState.PARAMETERS && lastParameter) {
                maxLength = Math.max(lastParameter.length, maxLength);
            }
            else if (state == processingState.PORTS && lastPort) {
                maxLength = Math.max(lastPort.length, maxLength);
            }
        }
        if (state == processingState.COMPLETE) {
            if (lastPort) {
                maxLength = Math.max(lastPort.length, maxLength);
            }
            break;
        }
    }
    return maxLength;
}
/**
 * Parse the container, and create the module's instance.
 *
 * @param symbol the module's symbol
 * @param container the module's container
 * @param moduleIsParameterized whether the module has parameters or not
 * @param maxLength the maximum length of ports/parameters
 * @return the module's instance
*/
function parseContainer(symbol, container, moduleIsParameterized, maxLength) {
    if (isEmptyKey(symbol) || isEmptyKey(container)) {
        return undefined;
    }
    if (maxLength < 0) {
        return undefined;
    }
    let output = [];
    let keys = container.split(" ");
    let lastPort = undefined;
    let lastParameter = undefined;
    let lastParameterDefault = undefined;
    let passedEqualSign = false;
    let state = processingState.INITIAL;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] == undefined) {
            continue;
        }
        //single comment
        if (keys[i] == "//") {
            i = getSingleComment(keys, output, i);
        }
        //block comment
        else if (keys[i] == "/*") {
            i = getBlockComment(keys, output, i);
        }
        else if (state == processingState.INITIAL) {
            if (keys[i] == "(") {
                if (moduleIsParameterized) {
                    state = processingState.PARAMETERS;
                }
                else {
                    state = processingState.PORTS;
                }
            }
        }
        else if (state == processingState.PARAMETERS) {
            if (keys[i] == ")") {
                state = processingState.PORTS;
            }
            else if (keys[i] == "," && lastParameter) {
                //set with default value if it exists
                if (passedEqualSign) {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameterDefault + ")");
                    passedEqualSign = false;
                }
                else {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameter + ")");
                }
                output.push(",\n");
                lastParameter = undefined;
            }
            else if (keys[i] == "=") {
                passedEqualSign = true;
            }
            else if (!isParameterSymbol(keys[i]) && !isEmptyKey(keys[i])) {
                if (passedEqualSign) {
                    lastParameterDefault = keys[i].trim();
                }
                else {
                    lastParameter = keys[i].trim();
                }
            }
        }
        else if (state == processingState.PORTS) {
            if (lastParameter) {
                //set with default value if it exists
                if (passedEqualSign) {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameterDefault + ")\n");
                    passedEqualSign = false;
                }
                else {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameter + ")\n");
                }
                output.push(") u_" + symbol + " (\r\n");
                lastParameter = undefined;
            }
            if (keys[i] == ")") {
                state = processingState.COMPLETE;
            }
            else if (keys[i] == "," && lastPort) {
                output.push(padding + "." + lastPort + " ".repeat(maxLength - lastPort.length) + " ".repeat(4) + "(" + lastPort + ")");
                output.push(",\r\n");
                lastPort = undefined;
            }
            else if (!isPortSymbol(keys[i]) && !isEmptyKey(keys[i])) {
                lastPort = keys[i].trim();
            }
        }
        //last item
        if (i >= keys.length - 1) {
            if (state == processingState.PARAMETERS && lastParameter) {
                //set with default value if it exists
                if (passedEqualSign) {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameterDefault + ")\n");
                    passedEqualSign = false;
                }
                else {
                    output.push(padding + "." + lastParameter + " ".repeat(maxLength - lastParameter.length) + " ".repeat(4) + "(");
                    output.push(lastParameter + ")\n");
                }
            }
            else if (state == processingState.PORTS && lastPort) {
                output.push(padding + "." + lastPort + " ".repeat(maxLength - lastPort.length) + " ".repeat(4) + "(" + lastPort + ")");
                output.push("\r\n");
            }
        }
        if (state == processingState.COMPLETE) {
            if (lastPort) {
                output.push(padding + "." + lastPort + " ".repeat(maxLength - lastPort.length) + " ".repeat(4) + "(" + lastPort + ")");
                output.push("\r\n");
            }
            break;
        }
    }
    let instance = [];
    if (moduleIsParameterized) {
        instance.push(symbol + " #(\n");
        instance.push(output.join("") + ");");
    }
    else {
        instance.push(symbol + " u_" + symbol);
        instance.push(" (\r\n" + output.join("") + ");");
    }
    return instance.join("");
}
/**
 * Parses a single comment from the container starting from a given index in keys.
 *
 * @param keys the container's keys.
 * @param output the array to add the single comment to
 * @param i the start index
 * @return the index where the single comment ends
*/
function getSingleComment(keys, output, i) {
    if (!keys || !output) {
        return undefined;
    }
    if (i < 0 || i > keys.length) {
        return undefined;
    }
    let regex = new RegExp(non_breaking_space, "g");
    output.push(padding + keys[i].replace(regex, " "));
    if (!keys[i].includes("\n") && !keys[i].includes("\r")) {
        i++;
        while (i < keys.length && !keys[i].includes("\n") && !keys[i].includes("\r")) {
            output.push(keys[i].replace(regex, " "));
            i++;
        }
        if (i < keys.length) {
            output.push(keys[i].replace(regex, " "));
        }
        else {
            output.push("\n");
        }
    }
    return i;
}
/**
 * Parses a block comment from the container starting from a given index in keys.
 *
 * @param keys the container's keys.
 * @param output the array to add the block comment to
 * @param i the start index
 * @return the index where the block comment ends
*/
function getBlockComment(keys, output, i) {
    if (!keys || !output) {
        return undefined;
    }
    if (i < 0 || i > keys.length) {
        return undefined;
    }
    let regex = new RegExp(non_breaking_space, "g");
    output.push(padding + keys[i].replace(regex, " "));
    i++;
    while (i < keys.length && !(keys[i].trim()).includes("*/")) {
        //if there is an upcoming new line of comments, add padding
        if (/\r|\n/.exec(keys[i])) {
            output.push(keys[i].replace(regex, " "));
            i++;
            if (i < keys.length) {
                output.push(keys[i].replace(regex, " "));
            }
        }
        else {
            output.push(keys[i].replace(regex, " "));
        }
        i++;
    }
    if (i < keys.length) {
        output.push(keys[i].replace(regex, " "));
    }
    return i;
}
//# sourceMappingURL=ModuleInstantiator.js.map