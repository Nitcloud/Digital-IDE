const vscode = require('vscode');
const assert = require('assert');
const fs = require('fs');

const { HDLParam, Module } = require('../../HDLparser');
const { MarkdownString, BaseDoc, RenderString, RenderType,
        mergeSortByLine, getWavedromsFromFile } = require('./common');

const { getSymbolComments } = require('../lsp/util');
const Global = require('../../global');

const opeParam = require('../../param');
const HDLPath = require('../../HDLfilesys/operation/path');
const HDLFile = require('../../HDLfilesys/operation/files');


function makeSVGElementByLink(link, caption) {
    let mainHtml;
    if (caption) {
        mainHtml = `<div align=center><img src="${link}"></img><p class="ImgCaption">${caption}</p></div>`;
    } else {
        mainHtml = `<div align=center><img src="${link}"></img></div>`;
    }
    return '<br>' + mainHtml + '<br><br>\n';
}

/**
 * @param {MarkdownString} md 
 * @param {Array<object>} array
 * @param {string} name
 * @param {Array<string>} fieldNames 
 */
function makeTableFromObjArray(md, array, name, fieldNames, displayNames) {
    const ws = HDLPath.toSlash(opeParam.workspacePath) + '/';
    if (array.length == 0) {
        md.addText(`no ${name} info`);
    } else {
        const rows = [];
        for (const obj of array) {
            const data = [];
            for (const name of fieldNames) {
                let value = obj[name];
                if (name == 'instModPath' && value) {
                    value = value.replace(ws, '');
                }

                if (value.trim().length == 0) {
                    value = ' ';
                }
                data.push(value);
            }
            rows.push(data);
        }
        if (displayNames) {
            md.addTable(displayNames, rows);
        } else {
            md.addTable(fieldNames, rows);
        }
    }
}

/**
 * @description make the markdown from a module
 * @param {Module} module 
 * @returns {string}
 */
function makeMarkdownFromModule(module) {
    const moduleName = module.name;
    const portNum = module.ports.length;
    const paramNum = module.params.length;
    let topModuleDesc = '';
    if (HDLParam.TopModules.has(module)) {
        topModuleDesc = '√';
    } else {
        topModuleDesc = '×';
    }

    const md = new MarkdownString(module.range.start.line);
    // add module name
    md.addTitle(moduleName, 1);
    md.addTitle('Basic Info', 2);
    const infos = [
        `${portNum} params, ${paramNum} ports`,
        'top module ' + topModuleDesc
    ];
    md.addUnorderedList(infos);
    md.addEnter();

    md.addTitle('params', 2);
    makeTableFromObjArray(md, module.params, 'params', ['name', 'init']);
    md.addEnter();
    
    md.addTitle('ports', 2);
    makeTableFromObjArray(md, module.ports, 'ports', ['name', 'type', 'width']);
    md.addEnter();
    
    md.addTitle('Dependency', 2);
    const insts = [];
    for (const inst of module.getInstances()) {
        insts.push(inst);
    }
    makeTableFromObjArray(md, insts, 'Dependencies',
                         ['name', 'type', 'instModPath'],
                         ['name', 'module', 'path']);

    return md.renderMarkdown();
}

/**
 * @description make markdown according to a file
 * @param {string} path absolute path of the file
 * @returns {string} 
 */
function makeMarkdownFromFile(path) {
    let result = '';
    const moduleFile = HDLParam.findModuleFile(path);
    if (!moduleFile) {
        console.log('Fail to export documentation of', path);
        return '';
    }
    for (const [name, mod] of moduleFile.nameToModule) {
        result += makeMarkdownFromModule(mod);
    }
    return result;
}


/**
 * @description add attribute description to each port/param
 * @param {string} path
 * @param {Array<ModPort|ModParam>} ports
 */
async function patchComment(path, ports) {
    if (!ports || !ports.length) {
        return;
    }
    const ranges = ports.map(port => port.range);
    const comments = await getSymbolComments(path, ranges);
    for (let i = 0; i < ports.length; ++ i) {
        const inlineComment = comments[i].replace(/\n/, ' ');
        ports[i].desc = inlineComment;
    }
}

// base doc
/**
 * @description get basedoc obj from a module
 * @param {Module} module 
 * @returns {Promise<MarkdownString>}
 */
async function getDocsFromModule(module) {
    const moduleName = module.name;
    const portNum = module.ports.length;
    const paramNum = module.params.length;
    
    // add desc can optimizer in the future version
    const paramPP = patchComment(module.path, module.params);
    const portPP = patchComment(module.path, module.ports);

    let topModuleDesc = '';
    if (HDLParam.TopModules.has(module)) {
        topModuleDesc = '√';
    } else {
        topModuleDesc = '×';
    }

    const md = new MarkdownString(module.range.start.line);
    // add module name
    md.addTitle(moduleName, 1);
    md.addTitle('Basic Info', 2);
    const infos = [
        `${portNum} params, ${paramNum} ports`,
        'top module ' + topModuleDesc
    ];
    md.addUnorderedList(infos);
    md.addEnter();

    // wait param and port patch
    await paramPP;
    await portPP;

    // param section
    md.addTitle('params', 2);
    makeTableFromObjArray(md, module.params, 'params', 
                          ['name', 'init', 'desc'],
                          ['name', 'init', 'description']);
    md.addEnter();
    

    // port section
    md.addTitle('ports', 2);
    makeTableFromObjArray(md, module.ports, 'ports', 
                          ['name', 'type', 'width', 'desc'],
                          ['name', 'type', 'width', 'description']);
    md.addEnter();
    

    // dependency section
    md.addTitle('Dependency', 2);
    const insts = [];
    for (const inst of module.getInstances()) {
        insts.push(inst);
    }
    makeTableFromObjArray(md, insts, 'Dependencies',
                         ['name', 'type', 'instModPath'],
                         ['name', 'module', 'path']);

    md.addEnter();
    return md;
}


/**
 * @description get basedoc obj according to a file
 * @param {string} path absolute path of the file
 * @returns {Promise<Array<MarkdownString>>} 
 */
async function getDocsFromFile(path) {
    const moduleFile = HDLParam.findModuleFile(path);
    if (!moduleFile) {
        console.log('Fail to export documentation of', path);
        return '';
    }
    const markdownStringPromises = [];
    for (const [name, mod] of moduleFile.nameToModule) {
        const markdownStringPromise = getDocsFromModule(mod);
        markdownStringPromises.push(markdownStringPromise);
    }
    const fileDocs = [];
    for (const p of markdownStringPromises) {
        const markdownString = await p;
        fileDocs.push(markdownString);
    }
    return fileDocs;
}

/**
 * @description get render list of path
 * @param {string} path
 * @returns {Promise<Array<RenderString>>} 
 */
async function getRenderList(path) {
    if (!HDLFile.isHDLFiles(path)) {
        vscode.window.showErrorMessage('Please use the command in a HDL file!');
        return [];
    }
    const docs = await getDocsFromFile(path);
    const svgs = getWavedromsFromFile(path);
    const renderList = mergeSortByLine(docs, svgs);
    return renderList;
}


/**
 * @description return render list of current file 
 * @returns {Promise<Array<RenderString>>}
 */
async function getCurrentRenderList() {
    const editor = vscode.window.activeTextEditor;
    const currentFilePath = HDLPath.toSlash(editor.document.fileName);
    return await getRenderList(currentFilePath);
}


async function exportCurrentFileDocAsMarkdown() {
    const editor = vscode.window.activeTextEditor;
    const currentFilePath = HDLPath.toSlash(editor.document.fileName);
    const HDLFileName = HDLPath.basename(currentFilePath);

    const renderList = await getRenderList(currentFilePath);
    if (renderList.length == 0) {
        return;
    }

    const wsPath = opeParam.workspacePath;
    const markdownFolderPath = HDLPath.join(wsPath, 'markdown');
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

    let markdown = '';
    for (const r of renderList) {
        if (r.type == RenderType.Markdown) {
            markdown += r.renderMarkdown() + '\n';
        } else if (r.type == RenderType.Wavedrom) {
            const svgString = r.render();
            const svgName = 'wavedrom-' + Global.Doc.svgMakeTimes + '.svg';
            const svgPath = HDLPath.join(figureFolder, svgName);
            fs.writeFileSync(svgPath, svgString);
            const relatePath = HDLPath.join('./figure', svgName);
            const svgHtml = makeSVGElementByLink(relatePath);
            markdown += '\n\n' + svgHtml + '\n\n';
        }
    }
    
    const markdownName = 'index.md';
    const markdownPath = HDLPath.join(currentRoot, markdownName);
    Global.Doc.resetSvgMakeTimes();
    fs.writeFileSync(markdownPath, markdown);
}

async function exportProjectDocAsMarkdown() {
    vscode.window.showInformationMessage('this is exportProjectDocAsMarkdown');
}

module.exports = {
    makeMarkdownFromFile,
    getDocsFromFile,
    getRenderList,
    getCurrentRenderList,
    exportCurrentFileDocAsMarkdown,
    exportProjectDocAsMarkdown
};