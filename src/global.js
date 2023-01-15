const vscode = require('vscode');

const ignoreReportType = [];

const HDLGlobal = {
    context : null,

    /**
     * @param {vscode.ExtensionContext} context 
     */
    setContext(context) {
        this.context = context;
    },

    /**
     * @returns {vscode.ExtensionContext}
     */
    getContext() {
        return this.context;
    }
};

const Doc = {
    svgMakeTimes : 0,
    resetSvgMakeTimes() {
        this.svgMakeTimes = 0;
    }
}

const MainOutput = {
    _output : vscode.window.createOutputChannel('DIDE Report'),
    report(message, type='debug') {
        if (ignoreReportType.includes(type)) {
            return;
        }
        this._output.appendLine('[' + type + '] ' + message);
    }
}


module.exports = {
    HDLGlobal,
    Doc,
    MainOutput
};