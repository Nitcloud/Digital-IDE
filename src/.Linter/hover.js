"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var vscode = require("vscode");
var HoverProvider = /** @class */ (function () {
    function HoverProvider(lang) {
        this._excludedText = RegExp(/\b(alias|always|always_comb|always_ff|always_latch|and|assert|assign|assume|automatic|before|begin|bind|bins|binsof|bit|break|buf|bufif0|bufif1|byte|case|casex|casez|cell|chandle|class|clocking|cmos|config|const|constraint|context|continue|cover|covergroup|coverpoint|cross|deassign|default|defparam|design|disable|dist|do|edge|else|end|endcase|endclass|endclocking|endconfig|endfunction|endgenerate|endgroup|endinterface|endmodule|endpackage|endprimitive|endprogram|endproperty|endspecify|endsequence|endtable|endtask|enum|event|expect|export|extends|extern|final|first_match|for|force|foreach|forever|fork|forkjoin|function|generate|genvar|highz0|highz1|if|iff|ifnone|ignore_bins|illegal_bins|import|incdir|include|initial|inout|input|inside|instance|int|integer|interface|intersect|join|join_any|join_none|large|liblist|library|local|localparam|logic|longint|macromodule|matches|medium|modport|module|nand|negedge|new|nmos|nor|noshowcancelled|not|notif0|notif1|null|or|output|package|packed|parameter|pmos|posedge|primitive|priority|program|property|protected|pull0|pull1|pulldown|pullup|pulsestyle_onevent|pulsestyle_ondetect|pure|rand|randc|randcase|randsequence|rcmos|real|realtime|ref|reg|release|repeat|return|rnmos|rpmos|rtran|rtranif0|rtranif1|scalared|sequence|shortint|shortreal|showcancelled|signed|small|solve|specify|specparam|static|string|strong0|strong1|struct|super|supply0|supply1|table|tagged|task|this|throughout|time|timeprecision|timeunit|tran|tranif0|tranif1|tri|tri0|tri1|triand|trior|trireg|type|typedef|union|unique|unsigned|use|uwire|var|vectored|virtual|void|wait|wait_order|wand|weak0|weak1|while|wildcard|wire|with|within|wor|xnor|xor)\b/);
        this.lang = lang;
    }
    HoverProvider.prototype.provideHover = function (document, position, token) {
        // get word start and end
        var textRange = document.getWordRangeAtPosition(position);
        // hover word
        var targetText = document.getText(textRange);
        if (targetText.search(this._excludedText) !== -1) { // systemverilog keywords
            return;
        }
        else { // find declaration
            var declarationText = this._findDeclaration(document, position, targetText);
            if (declarationText !== undefined) {
                return new vscode.Hover([{ language: this.lang, value: declarationText.element }, declarationText.comment]);
            }
            else {
                return;
            }
        }
    };
    HoverProvider.prototype._findDeclaration = function (document, position, target) {
        // check target is valid variable name
        if (target.search(/[A-Za-z_][A-Za-z0-9_]*/g) === -1) {
            return;
        }
        var variableType;
        if (this.lang == "systemverilog")
            variableType = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\b(input|output|inout|reg|wire|logic|integer|bit|byte|shortint|int|longint|time|shortreal|real|double|realtime|rand|randc)\bs+"], ["\\b(input|output|inout|reg|wire|logic|integer|bit|byte|shortint|int|longint|time|shortreal|real|double|realtime|rand|randc)\\b\\s+"])));
        else if (this.lang == "verilog")
            variableType = String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\b(input|output|inout|reg|wire|integer|time|real)\bs+"], ["\\b(input|output|inout|reg|wire|integer|time|real)\\b\\s+"])));
        var variableTypeStart = '^' + variableType;
        var paraType = String.raw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["^\b(parameter|localparam)\bs+\b", "\b"], ["^\\b(parameter|localparam)\\b\\s+\\b", "\\b"])), target);
        var regexTarget = RegExp(String.raw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\b", "\b"], ["\\b", "\\b"])), target));
        var regexVariableType = RegExp(variableType, 'g');
        var regexVariableTypeStart = RegExp(variableTypeStart);
        var regexParaType = RegExp(paraType);
        // from previous line to first line
        for (var i = position.line - 1; i >= 0; i--) {
            // text at current line
            var line = document.lineAt(i).text;
            var element = line.replace(/\/\/.*/, '').trim().replace(/\s+/g, ' ');
            var lastChar = element.charAt(element.length - 1);
            if (lastChar === ',' || lastChar === ';') { // remove last ',' or ';'
                element = element.substring(0, element.length - 1);
            }
            // find variable declaration type
            if (element.search(regexVariableTypeStart) !== -1) {
                // replace type to '', like input, output
                var subText = element.replace(regexVariableType, '').trim();
                // replace array to '', like [7:0]
                subText = subText.replace(/(\[.+?\])?/g, '').trim();
                if (subText.search(regexTarget) !== -1) {
                    var comment = getPrefixedComment(document, i);
                    if (comment)
                        return { element: element, comment: comment };
                    else {
                        comment = getSuffixedComment(document, i);
                        return { element: element, comment: comment };
                    }
                }
            }
            // find parameter declaration type
            if (element.search(regexParaType) !== -1) {
                var comment = getPrefixedComment(document, i);
                if (comment)
                    return { element: element, comment: comment };
                else {
                    comment = getSuffixedComment(document, i);
                    return { element: element, comment: comment };
                }
            }
        }
    };
    return HoverProvider;
}());
exports.HoverProvider = HoverProvider;
function getPrefixedComment(document, lineNo) {
    var i = lineNo - 1;
    var buf = '';
    while (true) {
        var line = document.lineAt(i).text.trim();
        if (!line.startsWith('//'))
            break;
        buf = line.substring(3) + '\n' + buf;
        i--;
    }
    return buf;
}
function getSuffixedComment(document, lineNo) {
    // Spearate comment after the declaration
    var line = document.lineAt(lineNo).text;
    var idx = line.indexOf("//");
    if (idx !== -1)
        return line.substr(idx + 2).trim();
    else
        return undefined;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
