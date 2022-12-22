const vscode = require('vscode');
const assert = require('assert');
const fs = require('fs');

const { getDocsFromFile } = require('./markdown');
const { getWavedromsFromFile } = require('./easy-wavedrom');
const { toSlash } = require('../../HDLfilesys/operation/path');
const { getIconConfig } = require('../../HDLfilesys/icons');
const { MarkdownString } = require('./common');
const { WavedromString } = require('./easy-wavedrom');
const opeParam = require('../../param');
const HDLPath = require('../../HDLfilesys/operation/path');

const _cache = {
    css : null
}

function makeFinalHTML(body, style) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="write">
        ${body}
    </div>
</body>
<style>
    ${style}
</style>
</html>`;
}

function getDocCssString() {
    if (_cache.css) {
        return _cache.css;
    } else {
        const cssPath = HDLPath.join(opeParam.rootPath, 'css/documentation.css');
        const cssString = fs.readFileSync(cssPath, 'utf-8');
        _cache.css = cssString;
        return cssString;
    }
}

/**
 * @description merge sort by line
 * @param {Array<MarkdownString>} docs
 * @param {Array<WavedromString>} svgs 
 * @returns {Array<MarkdownString | WavedromString>}
 */
function mergeSortByLine(docs, svgs) {
    const renderList = [];
    let i = 0, j = 0;
    while (i < docs.length && j < svgs.length) {
        if (docs[i].line < svgs[j].line) {
            renderList.push(docs[i]);
            i ++;
        } else {
            renderList.push(svgs[j]);
            j ++;
        }
    }
    while (i < docs.length) {
        renderList.push(docs[i]);
        i ++;
    }
    while (j < svgs.length) {
        renderList.push(svgs[j]);
        j ++;
    }
    return renderList;
}


function makeWavedromRenderErrorHTML() {
    return `<div class="error-out">
    <p class="error">Error Render</p>
</div>`;
}

function showDocWebview() {
    const editor = vscode.window.activeTextEditor;
    const path = toSlash(editor.document.fileName);
    const docs = getDocsFromFile(path);
    const svgs = getWavedromsFromFile(path);
    const renderList = mergeSortByLine(docs, svgs);

    // start to render the real html
    let body = '';
    for (const r of renderList) {
        const renderResult = r.render();
        if (renderResult) {
            body += renderResult + '\n';
        } else {
            body += makeWavedromRenderErrorHTML() + '\n';
        }
    }

    // add css
    let style = getDocCssString();
    const html = makeFinalHTML(body, style);
    fs.writeFileSync(HDLPath.join(opeParam.rootPath, 'result.html'), html);

    const webview = vscode.window.createWebviewPanel(
        'TOOL.showDocWebview', 
        'document',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,            // enable JS
            retainContextWhenHidden: true,  // unchange webview when hidden, prevent extra refresh
        }
    );
    webview.iconPath = getIconConfig('documentation');
    webview.webview.html = html;
}


module.exports = {
    showDocWebview
};