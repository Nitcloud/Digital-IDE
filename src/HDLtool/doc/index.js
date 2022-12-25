const vscode = require('vscode');

const { getIconConfig } = require('../../HDLfilesys/icons');
const { exportCurrentFileDocAsMarkdown, exportProjectDocAsMarkdown } = require('./markdown');
const { exportCurrentFileDocAsHTML, exportProjectDocAsHTML } = require('./html');
const { exportCurrentFileDocAsPDF, exportProjectDocAsPDF } = require('./pdf');

const availableFormat = [
    'markdown', 'pdf', 'html'
];

class ExportFunctionItem {
    /**
     * @description description of exportItem
     * @param {string} format 
     * @param {function} exportFunc 
     */
    constructor(format, desc, exportFunc) {
        // TODO : 等到sv的解析做好后，写入对于不同hdl的图标
        let iconID = '$(export-' + format + ') ';
        this.label = iconID + desc;
        this.format = format;
        this.exportFunc = exportFunc;
    }
};

function registerFileDocExport(context) {
    vscode.commands.registerCommand('TOOL.export.file', () => {
        const option = {
            placeHolder: 'Select an Export Format'
        };
        const items = [
            new ExportFunctionItem('markdown', ' markdown',  exportCurrentFileDocAsMarkdown),
            new ExportFunctionItem('pdf', ' pdf (only support light theme)', exportCurrentFileDocAsPDF),
            new ExportFunctionItem('html', ' html (only support light theme)', exportCurrentFileDocAsHTML)
        ];
		
        vscode.window.showQuickPick(items, option).then(item => {
            item.exportFunc();
        });
	});
}

function registerProjectDocExport(context) {
    vscode.commands.registerCommand('TOOL.export.project', () => {
        const option = {
            placeHolder: 'Select an Export Format'
        };
        const items = [
            new ExportFunctionItem('markdown',' markdown', exportProjectDocAsMarkdown),
            new ExportFunctionItem('pdf', ' pdf (only support light theme)', exportProjectDocAsPDF),
            new ExportFunctionItem('html', ' html (only support light theme)', exportProjectDocAsHTML)
        ];
		
        vscode.window.showQuickPick(items, option).then(item => {
            item.exportFunc();
        });
	});
}

module.exports = {
    registerFileDocExport,
    registerProjectDocExport,
}