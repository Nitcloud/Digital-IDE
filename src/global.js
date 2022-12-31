const vscode = require('vscode');

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


module.exports = {
    HDLGlobal,
    Doc
};