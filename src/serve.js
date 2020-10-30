var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const tree   = require("./tree");
const utils  = require("./utils");
const parse  = require("./parse");

const vscode = require("vscode");
const child  = require("child_process");

let gtkwaveInstallPath = vscode.workspace.getConfiguration().get('TOOL.gtkwave.install.path');

let opeParam = {
    "os"            : "",
    "rootPath"      : `${__dirname}`.replace(/\\/g,"\/"),
    "workspacePath" : ""
}
exports.opeParam = opeParam;

/* 启动预处理服务 */

class preProcess {
    constructor(statusbar, parser, channel) {
        this.building = false;
        this.symbolsCount = 0;
        this.NUM_FILES = 250;
        this.HDLFileExtensions = ["sv", "v", "svh", "vh"];
        this.globPattern = "**/*.{" + this.HDLFileExtensions.join(",") + "}";
        this.exclude = undefined;
        this.forceFastIndexing = false;
        this.statusbar = statusbar;
        this.parser = parser;
        this.outputChannel = channel;
        this.symbols = new Map();
        const settings = vscode.workspace.getConfiguration();
        if (!settings.get('HDL.Indexing')) {
            this.statusbar.text = "HDL: Indexing disabled on boot";
        }
        else {
            this.build_index().then(() => {
                this.updateMostRecentSymbols(undefined);
            });
        }
    };
    /**
        Processes one file and updates this.symbols with an entry if symbols exist in the file.

        @param uri uri to the document
        @param total_files total number of files to determine parse-precision
    */
    processFile(uri, total_files = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                resolve(vscode.workspace.openTextDocument(uri).then(doc => {
                    if (total_files >= 1000 * this.parallelProcessing || this.forceFastIndexing) {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                    else if (total_files >= 100 * this.parallelProcessing) {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                    else {
                        return this.parser.get_HDLfileparam(doc, null, 0, null);
                    }
                }));
            })).then((output) => {
                if (output.length > 0) {
                    if (this.symbols.has(uri.fsPath)) {
                        this.symbolsCount += output.length - this.symbols.get(uri.fsPath).length;
                    }
                    else {
                        this.symbolsCount += output.length;
                    }
                    this.symbols.set(uri.fsPath, output);
                    if (total_files == 0) { // If total files is 0, it is being used onChange
                        this.statusbar.text = 'HDL: ' + this.symbolsCount + ' indexed objects';
                    }
                }
            }).catch((error) => {
                // this.outputChannel.appendLine("HDL: Indexing: Unable to process file: " + uri.toString());
                // this.outputChannel.appendLine(error);
                if (this.symbols.has(uri.fsPath)) {
                    this.symbolsCount -= this.symbols.get(uri.fsPath).length;
                    this.symbols.delete(uri.fsPath);
                }
                return undefined;
            });
        });
    }
    /**
        Scans the `workspace` for HDL,
        Looks up all the `symbols` that it exist on the queried files,
        and saves the symbols as `HDLSymbol` objects to `this.symbols`.

        @return status message when indexing is successful or failed with an error.
    */
    build_index() {
        return __awaiter(this, void 0, void 0, function* () {
            var cancelled = false;
            this.building = true;
            this.symbolsCount = 0;
            this.statusbar.text = "HDL: Indexing..";
            const settings = vscode.workspace.getConfiguration();
            this.forceFastIndexing  = settings.get('HDL.forceFastIndexing');
            this.parallelProcessing = settings.get('HDL.parallelProcessing');
            let exclude = settings.get('HDL.excludeIndexing');
            if (exclude == "insert globPattern here") {
                exclude = undefined;
            }
            return yield vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "HDL Indexing...",
                cancellable: true
            }, (_progress, token) => __awaiter(this, void 0, void 0, function* () {
                this.symbols = new Map();
                let uris = yield Promise.resolve(vscode.workspace.findFiles(this.globPattern, exclude, undefined, token));

                for (var filenr = 0; filenr < uris.length; filenr += this.parallelProcessing) {
                    let subset = uris.slice(filenr, filenr + this.parallelProcessing);
                    if (token.isCancellationRequested) {
                        cancelled = true;
                        break;
                    }
                    yield Promise.all(subset.map(uri => {
                        return this.processFile(uri, uris.length);
                    }));
                }
            })).then(() => {
                this.building = false;
                this.parser.get_instModulePath();
                new tree.FileExplorer();
                if (cancelled) {
                    this.statusbar.text = "HDL: Indexing cancelled";
                }
                else {
                    this.statusbar.text = 'HDL: ' + this.symbolsCount + ' indexed objects';
                }
            });
        });
    }
    /**
        Updates `mostRecentSymbols` with the most recently used symbols
        When `mostRecentSymbols` is undefined, add the top `this.NUM_FILES` symbol from `this.symbols`
        When `mostRecentSymbols` is defined, add the symbols in `recentSymbols` one by one to the top of the array

        @param recentSymbols the recent symbols
    */
    updateMostRecentSymbols(recentSymbols) {
        if (this.mostRecentSymbols) {
            if (!recentSymbols) {
                return;
            }
            while (recentSymbols.length > 0) {
                let currentSymbol = recentSymbols.pop();
                //if symbol already exists, remove it
                for (let i = 0; i < this.mostRecentSymbols.length; i++) {
                    let symbol = this.mostRecentSymbols[i];
                    if (symbol == currentSymbol) {
                        this.mostRecentSymbols.splice(i, 1);
                        break;
                    }
                }
                //if the array has reached maximum capacity, remove the last element
                if (this.mostRecentSymbols.length >= this.NUM_FILES) {
                    this.mostRecentSymbols.pop();
                }
                //add the symbol to the top of the array
                this.mostRecentSymbols.unshift(currentSymbol);
            }
        }
        else {
            let maxSymbols = new Array();
            //collect the top symbols in `this.symbols`
            for (var list of this.symbols.values()) {
                if (maxSymbols.length + list.length >= this.NUM_FILES) {
                    let limit = this.NUM_FILES - maxSymbols.length;
                    maxSymbols = maxSymbols.concat(list.slice(-1 * limit));
                    break;
                }
                else {
                    maxSymbols = maxSymbols.concat(list);
                }
            }
            this.mostRecentSymbols = maxSymbols;
        }
    }
}
exports.preProcess = preProcess;

/* 前端开发辅助功能 */

/* 语言服务功能 */

// 定义跳转
class DefinitionProvider {
    constructor(workspaceSymProvider) {
        // Strings used in regex'es
        // private regex_module = '$\\s*word\\s*(';
        this.regex_port = '\\.word\\s*\\(';
        this.regex_package = '\\b(\\w+)\\s*::\\s*(word)';
        this.workspaceSymProvider = workspaceSymProvider;
    };
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let range = document.getWordRangeAtPosition(position);
            let line = document.lineAt(position.line).text;
            let word = document.getText(range);
            // Check for port
            let match_port = line.match(this.regex_port.replace('word', word));
            let match_package = line.match(this.regex_package.replace('word', word));
            if (!range) {
                reject();
            }
            // Port
            else if (match_port && match_port.index === range.start.character - 1) {
                let container = this.moduleFromPort(document, range);
                resolve(Promise.resolve(this.workspaceSymProvider.provideWorkspaceSymbols(container, token, true).then(res => {
                    return Promise.all(res.map(x => this.findPortLocation(x, word)));
                }).then(arrWithUndefined => {
                    return this.clean(arrWithUndefined, undefined);
                })));
                reject();
            }
            // Parameter
            else if (match_package && line.indexOf(word, match_package.index) == range.start.character) {
                yield this.workspaceSymProvider.provideWorkspaceSymbols(match_package[1], token, true)
                    .then((ws_symbols) => {
                    if (ws_symbols.length && ws_symbols[0].location) {
                        return ws_symbols[0].location.uri;
                    }
                }).then(uri => {
                    if (uri) {
                        vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri, word).then((symbols) => {
                            let results = [];
                            this.getDocumentSymbols(results, symbols, word, uri, match_package[1]);
                            resolve(results);
                        });
                    }
                });
                reject();
            }
            else {
                // Lookup all symbols in the current document
                yield vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri, word)
                    .then((symbols) => {
                    let results = [];
                    this.getDocumentSymbols(results, symbols, word, document.uri);
                    if (results.length !== 0) {
                        resolve(results);
                    }
                });
                yield this.workspaceSymProvider.provideWorkspaceSymbols(word, token, true)
                    .then(res => {
                    if (res.length !== 0) {
                        resolve(res.map(x => x.location));
                    }
                });
                reject();
            }
        }));
    }
    findPortLocation(symbol, port) {
        return vscode.workspace.openTextDocument(symbol.location.uri).then(doc => {
            for (let i = symbol.location.range.start.line; i < doc.lineCount; i++) {
                let line = doc.lineAt(i).text;
                if (line.match("\\bword\\b".replace('word', port))) {
                    return new vscode.Location(symbol.location.uri, new vscode.Position(i, line.indexOf(port)));
                }
            }
        });
    }
    moduleFromPort(document, range) {
        let text = document.getText(new vscode.Range(new vscode.Position(0, 0), range.end));
        let depthParathesis = 0;
        let i = 0;
        for (i = text.length; i > 0; i--) {
            if (text[i] == ')')
                depthParathesis++;
            else if (text[i] == '(')
                depthParathesis--;
            if (depthParathesis == -1) {
                let match_param = text.slice(0, i).match(/(\w+)\s*#\s*$/);
                let match_simple = text.slice(0, i).match(/(\w+)\s+(\w+)\s*$/);
                if (match_param)
                    return match_param[1];
                else if (match_simple)
                    return match_simple[1];
            }
        }
    }
    getDocumentSymbols(results, entries, word, uri, containerName) {
        for (let entry of entries) {
            if (entry.name === word) {
                if (containerName) {
                    if (entry.containerName === containerName) {
                        results.push({
                            uri: uri,
                            range: entry.range,
                        });
                    }
                }
                else {
                    results.push({
                        uri: uri,
                        range: entry.range,
                    });
                }
            }
            if (entry.children) {
                this.getDocumentSymbols(results, entry.children, word, uri);
            }
        }
    }
    clean(arr, deleteValue) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == deleteValue) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }
}
exports.DefinitionProvider = DefinitionProvider;

// 悬停提示
class HoverProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            var lookupRange = document.getWordRangeAtPosition(position);
            if (!lookupRange) {
                return resolve(undefined);
            }
            let defination = vscode.commands.executeCommand("vscode.executeDefinitionProvider", document.uri, position, token);
            resolve(defination.then((loc) => {
                return vscode.workspace.openTextDocument(loc[0].uri).then(doc => {
					let content = doc.lineAt(loc[0].range.start.line).text;
					if(String.prototype.trim) {
						content = content.trim();
					} else {
						content = content.replace(/^\s+(.*?)\s+$/g, "$1");
                    }
                    this.del_spacing(content, 4);
                    content = content.replace(/\/\//g, "\n//") + "\n" + this.get_comment(doc, loc[0].range.start.line - 1);
					return content;
                });
            }).then((str) => {
                return new vscode.Hover( { language: 'systemverilog', value: str } );
            }));
        });
    }
    get_comment(doc, line) {
        let comment = "";
        let commentList = [];
        let content = doc.lineAt(line).text;
        let isblank   = content.match(/\S+/g);
        let l_comment = content.match(/\/\/.*/g);
        let b_comment = content.match(/.*\*\//g);
        while (1) {
            if ( l_comment == null && b_comment == null && isblank != null) {
                break;
            } else {
                if ( isblank != null ) {                    
                    if (l_comment != null) {
                        commentList.push(l_comment + "\n");
                    } else {
                        commentList.push(b_comment + "\n");
                        while (1) {
                            line = line - 1;
                            content = doc.lineAt(line).text;
                            b_comment = content.match(/\/\*.*/g);
                            if (b_comment != null || line == 0) {
                                commentList.push(b_comment + "\n");
                                break;
                            }
                            commentList.push(content + "\n");
                        }
                    }
                }
                line = line - 1;
                content = doc.lineAt(line).text;
                isblank   = content.match(/\S+/g);
                l_comment = content.match(/\/\/.*/g);
                b_comment = content.match(/.*\*\//g);
            }
        }
        for (let index = (commentList.length - 1); index >= 0; index--) {
            comment = comment + commentList[index];
        }
        return comment;
    }
    del_spacing(content, spacingNum) {
        let newContent = '';
        let i = 0;
        for (let index = 0; index < content.length; index++) {
            const element = content[index];
            if (element == ' ') {
                i++;
            }
            if ((element != ' ') || (i <= spacingNum)) {
                newContent = newContent + element;
                if (i > spacingNum) {
                    i = 0;
                }
            }
        }
        content = newContent;
    }
}
exports.HoverProvider = HoverProvider;

// 文件标志
class DocumentSymbolProvider {
    constructor(parser) {
        this.depth = -1;
        this.parser = parser;
        const settings = vscode.workspace.getConfiguration();
        this.precision = settings.get("HDL.documentSymbolsPrecision");
        if (this.precision != "full") {
            this.depth = 1;
        }
    }
    /**
        Matches the regex pattern with the document's text. If a match is found, it creates a `Symbol` object.
        If `documentSymbols` is not `undefined`, than the object is added to it,
        otherwise add the objects to an empty list and return it.
        
        @param document The document in which the command was invoked.
        @param token A cancellation token.
        @return A list of `Symbol` objects or a thenable that resolves to such. The lack of a result can be
        signaled by returning `undefined`, `null`, or an empty list.
    */
    provideDocumentSymbols(document, token) {
        console.debug("provideDocumentSymbols!", document.uri.path);
        return new Promise((resolve) => {
            /*
            Matches the regex and uses the index from the regex to find the position
            TODO: Look through the symbols to check if it either is defined in the current file or in the workspace.
                  Use that information to figure out if an instanciated 'unknown' object is of a known type.
            */
            resolve(this.parser.get_HDLfileparam(document, "symbol", 0, null));
            // resolve(show_SymbolKinds(document.uri));
        });
    }
}
exports.DocumentSymbolProvider = DocumentSymbolProvider;

// 工作区标志
class WorkspaceSymbolProvider {
    constructor(indexer) {
        this.NUM_FILES = 250;
        this.indexer = indexer;
        this.HDLSymbol = new utils.HDLSymbol();
    };
    /**
        Queries a symbol from `this.symbols`, performs an exact match if `exactMatch` is set to true,
        and a partial match if it's not passed or set to false.

        @param query the symbol's name
        @param token the CancellationToken
        @param exactMatch whether to perform an exact or a partial match
        @return an array of matching Symbol
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
        @return the module's Symbol
    */
    provideWorkspaceModule(query) {
        if (query.length === 0) {
            return undefined;
        }
        else {
            let symbolInfo = undefined;
            this.indexer.symbols.forEach(list => {
                list.forEach(symbol => {
                    if (symbol.name == query && symbol.kind == this.HDLSymbol.getSymbolKind("module")) {
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
exports.WorkspaceSymbolProvider = WorkspaceSymbolProvider;

/* 自动补全功能 */
class vhdlCompletionOption {
    constructor () {
        let Keyword = ['library','use','package','entity','configuration','is','begin','map','of','for']
        let operatorOptions = ['abs','and','mod','nand','nor','not','or','rem','rol','ror','sla','sll','sra','srl','xnor','xor'];
        let archTypeOptions = ['array','type','component','constant','signal','subtype','variable','assert','severity','report','process','with','select','when','others','block','function','procedure','case','else','elsif','for','generate','if','loop','map','next','others','return','wait','then','return','when','while'];
        let portTypeOptions = ['in','out','inout','buffer','linkage'];
        let entityOptions   = ['generic','port'];
    }
    createCompletionKeyword(label, doc) {
        let item = new vscode.CompletionItem(label);
        item.kind = vscode.CompletionItemKind.Keyword;
        if (doc) {
            item.documentation = doc;
        }
        return item;
    }
    createCompletionOption(option, doc) {
        let item = new vscode.CompletionItem(option);
        item.kind = vscode.CompletionItemKind.Value;
        item.documentation = doc;
        return item;
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;
            if (lineText.match(/^\s*\-\-/)) {
                return resolve([]);
            }
            let inString = false;
            if ((lineText.substring(0, position.character).match(/\"/g) || []).length % 2 === 1) {
                inString = true;
            }
            let suggestions = [];
            let textBeforeCursor = lineText.substring(0, position.character - 1);
            let scope = vhdlScopeGuesser.guessScope(document, position.line);
            //console.log(scope.syntax);
            //console.log(textBeforeCursor);
            switch (scope.kind) {
                case vhdlScopeGuesser.VhdlScopeKind.Vhdl: {
                    suggestions.push(kwArchitecture);
                    suggestions.push(kwBegin);
                    suggestions.push(kwConfiguration);
                    suggestions.push(kwEnd);
                    suggestions.push(kwEntity);
                    suggestions.push(kwIs);
                    suggestions.push(kwPackage);
                    suggestions.push(kwUse);
                    suggestions.push(kwLibrary);
                    break;
                }
                case vhdlScopeGuesser.VhdlScopeKind.Entity: {
                    if (textBeforeCursor.match(/^\s*\w*$/)) {
                        suggestions.push(...entityOptions);
                        suggestions.push(...portTypeOptions);
                        suggestions.push(kwBegin);
                        suggestions.push(kwEnd);
                    }
                    else if (textBeforeCursor.match(/(in|out|inout|buffer|linkage)\s*$/)) {
                        suggestions.push(...scalaTypes);
                    }
                    break;
                }
                case vhdlScopeGuesser.VhdlScopeKind.Architecture: {
                    if (textBeforeCursor.match(/^\s*\w*$/)) {
                        suggestions.push(...archTypeOptions);
                        suggestions.push(kwBegin);
                        suggestions.push(kwEnd);
                        suggestions.push(kwIs);
                        suggestions.push(kwOf);
                    }
                    else if (textBeforeCursor.match(/(in|out|inout|buffer|linkage)\s*$/)) {
                        suggestions.push(...scalaTypes);
                    }
                    else if (textBeforeCursor.match(/(signal|variable|constant|subtype|type|array)\s*\w*:\s*$/)) {
                        suggestions.push(...scalaTypes);
                    }
                    else if (textBeforeCursor.match(/(<=|:=)\s*\w*\s*$/)) {
                        suggestions.push(...operatorOptions);
                    }
                    break;
                }
                case vhdlScopeGuesser.VhdlScopeKind.Configuration: {
                    suggestions.push(kwFor);
                    break;
                }
            }
            return resolve(suggestions);
        });
    }
}
exports.vhdlCompletionOption = vhdlCompletionOption;

/* 仿真功能 */
class iverilogOperation {
    constructor() {
        vscode.workspace.onDidChangeConfiguration(function () {
            this.getConfig();
        });
        this.parse    = new parse.HDLParser();
        this.file     = new utils.fileOperation();
        this.array    = new utils.arrayOperation();
        this.folder   = new utils.folderOperation();
        this.property = new utils.refreshProperty();
    }
    getConfig() {
        this.installPath  = vscode.workspace.getConfiguration().get('TOOL.iVerilog.install.path');
        this.runFilePath  = vscode.workspace.getConfiguration().get('HDL.linting.runFilePath');
        this.iverilogArgs = vscode.workspace.getConfiguration().get('HDL.linting.iverilog.arguments');
    }
    lint(doc) {
        var lastIndex = doc.uri.fsPath.replace(/\\/g,"\/");
        var docFolder = doc.uri.fsPath.substr(0, lastIndex); 
        var runLocation = (this.runAtFileLocation == true) ? docFolder : vscode.workspace.rootPath; //choose correct location to run
        var svArgs = (doc.languageId == "systemverilog") ? "-g2012" : ""; //SystemVerilog args
        var command = 'iverilog ' + svArgs + ' -t null ' + this.iverilogArgs + ' \"' + doc.fileName + '\"'; //command to execute
        // this.logger.log(command, Logger.Log_Severity.Command);
        child.exec(command, { cwd: runLocation }, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stderr.split(/\r?\n/g);
            // Parse output lines
            lines.forEach(function (line, i) {
                if (line.startsWith(doc.fileName)) {
                    line = line.replace(doc.fileName, '');
                    var terms = line.split(':');
                    var lineNum = parseInt(terms[1].trim()) - 1;
                    if (terms.length == 3) {
                        diagnostics.push({
                            severity: vscode.DiagnosticSeverity.Error,
                            range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[2].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                    else if (terms.length >= 4) {
                        var sev = void 0;
                        if (terms[2].trim() == 'error')
                            sev = vscode.DiagnosticSeverity.Error;
                        else if (terms[2].trim() == 'warning')
                            sev = vscode.DiagnosticSeverity.Warning;
                        else
                            sev = vscode.DiagnosticSeverity.Information;
                        diagnostics.push({
                            severity: sev,
                            range: new vscode.Range(lineNum, 0, lineNum, Number.MAX_VALUE),
                            message: terms[3].trim(),
                            code: 'iverilog',
                            source: 'iverilog'
                        });
                    }
                }
            });
            this.logger.log(diagnostics.length + ' errors/warnings returned');
            this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    }
    simulate(workspace_path) {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // 获取运行时的路径
        if (this.runFilePath == "") {
            this.runFilePath = `${workspace_path}prj/simulation/iVerilog`
            this.folder.mkdir(this.runFilePath);
        }

        // 获取运行工具的路径
        let vvpPath      = "vvp";
        let gtkwavePath  = "gtkwave";
        let iVerilogPath = "iverilog";
        if (this.installPath != "") {
            vvpPath = iVerilogInstallPath + "vvp.exe";
            iVerilogPath = iVerilogInstallPath + "iverilog.exe";
        }
        if (gtkwaveInstallPath != "") {
            gtkwavePath = gtkwaveInstallPath + "gtkwave.exe";
        }

        // 获取对应厂商的仿真库路径
        let LibPath = "";
        let GlblPath = "";
        let simLibRootPath = "";
        let propertyPath = this.property.getPropertypath(workspace_path);
        if (propertyPath != '') {
            if (this.property.getFpgaVersion(propertyPath) == "xilinx") {					
                simLibRootPath = vscode.workspace.getConfiguration().get('TOOL.xilinx.install.path');
                if (simLibRootPath != "") {                
                    simLibRootPath = simLibRootPath + "/Vivado/2018.3/data/verilog/src";
                    GlblPath = simLibRootPath + "/glbl.v ";
                    LibPath  = "-y " + simLibRootPath + "/xeclib ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unisims ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unimacro ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/unifast ";
                    LibPath = LibPath + "-y " + simLibRootPath + "/retarget ";
                } else {
                    vscode.window.showInformationMessage("TOOL.xilinx.install.path is empty");
                }
            }
        }

        // 获取当前文件的模块名和模块数
        let moduleNameList = [];
        HDLparam.forEach(element => {
            if (element.modulePath == editor.document.fileName) {
                moduleNameList.push(element.moduleName);
            }
        });
        if (moduleNameList.length != 0) {
            // 选择要仿真的模块
            let simModuleName = '';
            if (moduleNameList.length >= 2) {
                vscode.window.showInformationMessage("There are multiple modules, please select one of them");
                simModuleName = __awaiter(this, void 0, void 0, function* () {
                    vscode.window.showQuickPick(moduleNameList).then(selection => {
                        if (!selection) {
                            return null;
                        } else {
                            return selection;
                        }
                    });
                });
            }
            else {
                simModuleName = moduleNameList[0];
            }
            let rtlFilePath  = "";
            let iverilogPath = "";
            iverilogPath = workspace_path + "prj/simulation/iVerilog/" + simModuleName;
            iverilogPath = editor.document.fileName;                    

            // 获取所有例化模块所在文件的路径
            let instmoduleFilePathList = [];
            HDLparam.forEach(unitModule => {     
                if (unitModule.moduleName == simModuleName) {
                    unitModule.instmodule.forEach(instanceModule => {
                        instmoduleFilePathList.push(instanceModule.instModPath);
                    });
                }          
            });
            instmoduleFilePathList = this.array.removeDuplicates(instmoduleFilePathList);
            instmoduleFilePathList.forEach(element => {
                rtlFilePath = rtlFilePath + element + " ";
            });
        
            let command = `${iVerilogPath} -g2012 -o ${iverilogPath} ${editor.document.fileName} ${rtlFilePath} ${GlblPath} ${LibPath}`;

            let waveImagePath = this.parse.getWaveImagePath(editor.document.text);
            child.exec(command, { cwd: this.runFilePath }, function (error, stdout, stderr) {
                vscode.window.showInformationMessage(stdout);
                if (error !== null) {
                    vscode.window.showErrorMessage(stderr);
                } else {
                    vscode.window.showInformationMessage("iVerilog simulates successfully!!!");
                    if (waveImagePath != '') {
                        let waveImageExtname = waveImagePath.split('.');
                        let Simulate = vscode.window.createTerminal({ name: 'Simulate' });
                        Simulate.show(true);
                        Simulate.sendText(`${vvpPath} ${iverilogPath} -${waveImageExtname[waveImageExtname.length-1]}`);
                        let gtkwave = vscode.window.createTerminal({ name: 'gtkwave' });
                        gtkwave.show(true);
                        gtkwave.sendText(`${gtkwavePath} ${waveImagePath}`);

                    } else {
                        vscode.window.showWarningMessage("There is no wave image path in this testbench");
                    }
                }
            });
        }         
        else {
            vscode.window.showWarningMessage("There is no module in this file")
        }
    }
}
exports.iverilogOperation = iverilogOperation;

class xvlogOperation {
    constructor(logger) {
        return _super.call(this, "xvlog", logger) || this;
    }
    lint(doc) {
        var _this = this;
        this.logger.log('xvlog lint requested');
        if (doc.languageId == "vhdl") {
            var command = "xvhdl " + " -nolog " + doc.fileName;
        } else {
            //Systemverilog args
            var svArgs = (doc.languageId == "systemverilog") ? "-sv" : ""; 
            var command = "xvlog " + svArgs + " -nolog " + doc.fileName;
        }
        this.logger.log(command, Logger.Log_Severity.Command);
        child.exec(command, function (error, stdout, stderr) {
            var diagnostics = [];
            var lines = stdout.split(/\r?\n/g);
            lines.forEach(function (line) {
                var tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
                if (tokens.length < 4
                    || tokens[0] != "ERROR"
                    || !tokens[1].startsWith("VRFC")) {
                    return;
                }
                var _a = tokens[3].split(/:(\d+)/), filename = _a[0], lineno_str = _a[1];
                var lineno = parseInt(lineno_str) - 1;
                var diagnostic = {
                    severity: vscode.DiagnosticSeverity.Error,
                    code: tokens[1],
                    message: "[" + tokens[1] + "] " + tokens[2],
                    range: new vscode.Range(lineno, 0, lineno, Number.MAX_VALUE),
                    source: "xvlog"
                };
                diagnostics.push(diagnostic);
            });
            _this.logger.log(diagnostics.length + ' errors/warnings returned');
            _this.diagnostic_collection.set(doc.uri, diagnostics);
        });
    }
}
exports.xvlogOperation = xvlogOperation;

class LintManager {
    constructor(logger) {
        this.logger = logger;
        vscode.workspace.onDidOpenTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidCloseTextDocument(this.removeFileDiagnostics, this, this.subscriptions);
        vscode.workspace.onDidChangeConfiguration(this.configLinter, this, this.subscriptions);
        this.configLinter();
    }
    configLinter() {
        var linter_name;
        linter_name = vscode.workspace.getConfiguration("HDL.linting").get("linter");
        if (this.linter == null || this.linter.name != linter_name) {
            switch (linter_name) {
                case "iverilog":
                    this.linter = new IcarusLinter["default"](this.logger);
                    break;
                case "xvlog":
                    this.linter = new XvlogLinter["default"](this.logger);
                    break;
                case "modelsim":
                    this.linter = new ModelsimLinter["default"](this.logger);
                    break;
                case "verilator":
                    this.linter = new VerilatorLinter["default"](this.logger);
                    break;
                default:
                    console.log("Invalid linter name.");
                    this.linter = null;
                    break;
            }
        }
        if (this.linter != null) {
            console.log("Using linter " + this.linter.name);
        }
    }
    lint(doc) {
        // Check for language id
        var lang = doc.languageId;
        var linter_name = vscode.workspace.getConfiguration("HDL.linting").get("linter");
        if (linter_name == "xvlog") {
            if (this.linter != null && (lang === "verilog" || lang === "systemverilog" || lang === "vhdl"))
                this.linter.startLint(doc);
        } else {
            if (this.linter != null && (lang === "verilog" || lang === "systemverilog"))
                this.linter.startLint(doc);
        }
    }
    removeFileDiagnostics(doc) {
        if (this.linter != null)
            this.linter.removeFileDiagnostics(doc);
    }
    RunLintTool() {
        return __awaiter(this, void 0, void 0, function () {
            var lang, linterStr, tempLinter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lang = vscode.window.activeTextEditor.document.languageId;
                        if (!(vscode.window.activeTextEditor === undefined || (lang !== "verilog" && lang !== "systemverilog" && lang !== "vhdl")))
                            return [3 /*break*/, 1];
                        vscode.window.showErrorMessage("Verilog HDL: No document opened");
                        return [3 /*break*/, 4];
                    case 1: return [4 /*yield*/, vscode.window.showQuickPick([
                        {
                            label: "iverilog",
                            description: "Icarus Verilog"
                        },
                        {
                            label: "xvlog",
                            description: "Vivado Logical Simulator"
                        },
                        {
                            label: "modelsim",
                            description: "Modelsim"
                        },
                        {
                            label: "verilator",
                            description: "Verilator"
                        }
                    ], {
                        matchOnDescription: true,
                        placeHolder: "Choose a linter to run"
                    })];
                    case 2:
                        linterStr = _a.sent();
                        if (linterStr === undefined)
                            return [2 /*return*/];
                        switch (linterStr.label) {
                            case "iverilog":
                                tempLinter = new IcarusLinter["default"](this.logger);
                                break;
                            case "xvlog":
                                tempLinter = new XvlogLinter["default"](this.logger);
                                break;
                            case "modelsim":
                                tempLinter = new ModelsimLinter["default"](this.logger);
                                break;
                            case "verilator":
                                tempLinter = new VerilatorLinter["default"](this.logger);
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        return [4 /*yield*/, vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Verilog HDL: Running lint tool..."
                        }, function (progress, token) {
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    tempLinter.removeFileDiagnostics(vscode.window.activeTextEditor.document);
                                    tempLinter.startLint(vscode.window.activeTextEditor.document);
                                    return [2 /*return*/];
                                });
                            });
                        })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
}
exports.LintManager = LintManager;

class simulateManager {

}
exports.simulateManager = simulateManager;

/* 后端开发辅助功能 */

/* 调试开发辅助功能 */
