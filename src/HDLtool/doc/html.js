const vscode = require('vscode');
const assert = require('assert');
const fs = require('fs');

const { getDocsFromFile, getRenderList, getCurrentRenderList } = require('./markdown');
const { getIconConfig } = require('../../HDLfilesys/icons');

const opeParam = require('../../param');
const HDLPath = require('../../HDLfilesys/operation/path');
const { RenderType } = require('./common');
const Global = require('../../global');

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
    <div id="wrapper">
        <div id="write">
            ${body}
        </div>
    </div>
</body>
<style>
    ${style}
</style>
</html>`;
}


function makeExportHTML(cssHref, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="${cssHref}"></link>
</head>
<body>
    <div id="wrapper">
        <div id="write">
            ${body}
        </div>
    </div>
</body>
</html>`;
}

function makeCommonElement(renderResult) {
    return renderResult + '<br>\n';
}

function makeSVGElement(renderResult, caption) {
    let mainHtml;
    if (caption) {
        mainHtml = '<div align=center>' + renderResult + `<p class="ImgCaption">${caption}</p>` + '</div>';
    } else {
        mainHtml = '<div align=center>' + renderResult + '</div>';
    }
    return '<br>' + mainHtml + '<br><br>\n';
}

function makeSVGElementByLink(link, caption) {
    let mainHtml;
    if (caption) {
        mainHtml = `<div align=center><img src="${link}"></img><p class="ImgCaption">${caption}</p></div>`;
    } else {
        mainHtml = `<div align=center><img src="${link}"></img></div>`;
    }
    return '<br>' + mainHtml + '<br><br>\n';
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


function makeWavedromRenderErrorHTML() {
    return `<div class="error-out">
    <p class="error">Error Render</p>
</div><br>`;
}


/**
 * @description make the html string of a finial display style
 * @param {string} usage in whick module is used
 * @returns {Promise<string>}
 */
async function makeShowHTML(usage) {
    const renderList = await getCurrentRenderList();
    if (renderList.length == 0) {
        return '';
    }

    // start to render the real html
    let body = '';
    for (const r of renderList) {
        const renderResult = r.render();
        if (renderResult) {
            if (r.type == RenderType.Markdown) {
                body += makeCommonElement(renderResult);
            } else if (r.type == RenderType.Wavedrom) {
                body += makeSVGElement(renderResult, r.desc);
            }
        } else {
            body += makeWavedromRenderErrorHTML();
        }
    }

    // add css
    let cssString = getDocCssString();
    if (usage == 'webview') {          // if invoked by webview, change background image
        const webviewConfig = vscode.workspace.getConfiguration("TOOL.doc.webview");
        const imageUrl = webviewConfig.backgroundImage;
        cssString = cssString.replace("--backgroundImage", imageUrl);
    } else if (usage == 'pdf') {      // if invoked by pdf, transform .vscode-light to #write
        cssString = cssString.replace(/\.vscode-light/g, '#write');
    }
    const html = makeFinalHTML(body, cssString);
    return html;
}

async function showDocWebview() {
    const htmlPromise = makeShowHTML("webview")
    const webview = vscode.window.createWebviewPanel(
        'TOOL.doc.webview.show', 
        'document',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,            // enable JS
            retainContextWhenHidden: true,  // unchange webview when hidden, prevent extra refresh
        }
    );
    webview.iconPath = getIconConfig('documentation');
    webview.webview.html = await htmlPromise;
}


async function exportCurrentFileDocAsHTML() {
    if (vscode.window.activeColorTheme.kind != vscode.ColorThemeKind.Light) {
        vscode.window.showErrorMessage('Please export html in a light theme!');
        return;
    }

    const editor = vscode.window.activeTextEditor;
    const currentFilePath = HDLPath.toSlash(editor.document.fileName);
    const HDLFileName = HDLPath.basename(currentFilePath);
    const renderList = await getRenderList(currentFilePath);
    if (renderList.length == 0) {
        return;
    }

    const wsPath = opeParam.workspacePath;
    const markdownFolderPath = HDLPath.join(wsPath, 'html');
    if (!fs.existsSync(markdownFolderPath)) {
        fs.mkdirSync(markdownFolderPath);
    }
    const currentRoot = HDLPath.join(markdownFolderPath, HDLFileName);
    if (fs.existsSync(currentRoot)) {
        HDLPath.deleteFolder(currentRoot);
    }
    fs.mkdirSync(currentRoot);
    const figureFolder = HDLPath.join(currentRoot, 'figure');
    fs.mkdirSync(figureFolder);

    const cssFolder = HDLPath.join(currentRoot, 'css');
    fs.mkdirSync(cssFolder);
    const relateCssPath = './css/index.css';
    const cssPath = HDLPath.join(cssFolder, 'index.css');
    let cssString = getDocCssString();

    // only support export in the ligth theme
    cssString = cssString.replace(/\.vscode-light/g, '#write');
    fs.writeFileSync(cssPath, cssString);

    let body = '';
    for (const r of renderList) {
        const renderResult = r.render();
        if (r.type == RenderType.Markdown) {
            body += makeCommonElement(renderResult);
        } else if (r.type == RenderType.Wavedrom) {
            const svgName = 'wavedrom-' + Global.Doc.svgMakeTimes + '.svg';
            const svgPath = HDLPath.join(figureFolder, svgName);
            fs.writeFileSync(svgPath, renderResult);
            const relatePath = HDLPath.join('./figure', svgName);
            body += makeSVGElementByLink(relatePath, r.desc);
        }
    }

    const html = makeExportHTML(relateCssPath, body);    
    const htmlName = 'index.html';
    const htmlPath = HDLPath.join(currentRoot, htmlName);
    Global.Doc.resetSvgMakeTimes();
    fs.writeFileSync(htmlPath, html);
}


async function exportProjectDocAsHTML() {
    vscode.window.showInformationMessage('this is exportProjectDocAsHTML');
}


module.exports = {
    showDocWebview,
    exportCurrentFileDocAsHTML,
    exportProjectDocAsHTML,
    makeShowHTML,
    makeSVGElementByLink
};