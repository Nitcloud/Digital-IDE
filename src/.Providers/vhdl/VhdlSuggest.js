'use strict';
const vscode = require('vscode');
const vhdlScopeGuesser_1 = require('./vhdlScopeGuesser');
let kwLibrary = createCompletionKeyword('library');
let kwUse = createCompletionKeyword('use');
let kwPackage = createCompletionKeyword('package');
let kwArchitecture = createCompletionKeyword('architecture');
let kwEntity = createCompletionKeyword('entity');
let kwConfiguration = createCompletionKeyword('configuration');
let kwIs = createCompletionKeyword('is');
let kwBegin = createCompletionKeyword('begin');
let kwEnd = createCompletionKeyword('end');
let kwMap = createCompletionKeyword('map');
let kwOf = createCompletionKeyword('of');
let kwFor = createCompletionKeyword('for');
let operatorOptions = [
    createCompletionOption('abs'),
    createCompletionOption('and'),
    createCompletionOption('mod'),
    createCompletionOption('nand'),
    createCompletionOption('nor'),
    createCompletionOption('not'),
    createCompletionOption('or'),
    createCompletionOption('rem'),
    createCompletionOption('rol'),
    createCompletionOption('ror'),
    createCompletionOption('sla'),
    createCompletionOption('sll'),
    createCompletionOption('sra'),
    createCompletionOption('srl'),
    createCompletionOption('xnor'),
    createCompletionOption('xor'),
];
let archTypeOptions = [
    createCompletionOption('array'),
    createCompletionOption('type'),
    createCompletionOption('component'),
    createCompletionOption('constant'),
    createCompletionOption('signal'),
    createCompletionOption('subtype'),
    createCompletionOption('variable'),
    createCompletionOption('assert'),
    createCompletionOption('severity'),
    createCompletionOption('report'),
    createCompletionOption('process'),
    createCompletionOption('with'),
    createCompletionOption('select'),
    createCompletionOption('when'),
    createCompletionOption('others'),
    createCompletionOption('block'),
    createCompletionOption('function'),
    createCompletionOption('procedure'),
    createCompletionOption('case'),
    createCompletionOption('else'),
    createCompletionOption('elsif'),
    createCompletionOption('for'),
    createCompletionOption('generate'),
    createCompletionOption('if'),
    createCompletionOption('loop'),
    createCompletionOption('map'),
    createCompletionOption('next'),
    createCompletionOption('others'),
    createCompletionOption('return'),
    createCompletionOption('wait'),
    createCompletionOption('then'),
    createCompletionOption('return'),
    createCompletionOption('when'),
    createCompletionOption('while'),
];
let portTypeOptions = [
    createCompletionOption('in'),
    createCompletionOption('out'),
    createCompletionOption('inout'),
    createCompletionOption('buffer'),
    createCompletionOption('linkage'),
];
let entityOptions = [
    createCompletionOption('generic'),
    createCompletionOption('port'),
];
let scalaTypes = [
    createCompletionKeyword('bit', `The bit data type can only have the value 0 or 1.`),
    createCompletionKeyword('bit_vector', `
The bit_vector data type is the vector version of the bit type consisting of two or more bits. Each bit in a bit_vector can only have the value 0 or 1.`),
    createCompletionKeyword('boolean', `
True or false  
    `),
    createCompletionKeyword('integer', `32-bit	integers.`),
    createCompletionKeyword('natural', `non	negative integer.`),
    createCompletionKeyword('positive', `positive	integer.`),
    createCompletionKeyword('real', `
floating point number. 
    `),
    createCompletionKeyword('time', `
Time in fs,	ps,	ns,	us,	ms,	sec, min, hr  
    `),
    createCompletionKeyword('character', ``),
    createCompletionKeyword('string', `
String for VHDL.  
    `),
    createCompletionOption('downto'),
    createCompletionOption('std_logic'),
];
function createCompletionKeyword(label, doc) {
    let item = new vscode.CompletionItem(label);
    item.kind = vscode.CompletionItemKind.Keyword;
    if (doc) {
        item.documentation = doc;
    }
    return item;
}
function createCompletionOption(option, doc) {
    let item = new vscode.CompletionItem(option);
    item.kind = vscode.CompletionItemKind.Value;
    item.documentation = doc;
    return item;
}
class VhdlCompletionItemProvider {
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
            let scope = vhdlScopeGuesser_1.guessScope(document, position.line);
            //console.log(scope.syntax);
            //console.log(textBeforeCursor);
            switch (scope.kind) {
                case vhdlScopeGuesser_1.VhdlScopeKind.Vhdl: {
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
                case vhdlScopeGuesser_1.VhdlScopeKind.Entity: {
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
                case vhdlScopeGuesser_1.VhdlScopeKind.Architecture: {
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
                case vhdlScopeGuesser_1.VhdlScopeKind.Configuration: {
                    suggestions.push(kwFor);
                    break;
                }
            }
            return resolve(suggestions);
        });
    }
}
exports.VhdlCompletionItemProvider = VhdlCompletionItemProvider;
//# sourceMappingURL=VhdlSuggest.js.map