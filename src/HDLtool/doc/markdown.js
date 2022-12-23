const vscode = require('vscode');
const assert = require('assert');
const fs = require('fs');

const { toSlash } = require('../../HDLfilesys/operation/path');
const { HDLParam, Module } = require('../../HDLparser');
const { MarkdownString, BaseDoc, RenderString,
        mergeSortByLine, getWavedromsFromFile } = require('./common');

const opeParam = require('../../param');
const HDLPath = require('../../HDLfilesys/operation/path');

/**
 * @param {MarkdownString} md 
 * @param {Array<object>} array
 * @param {string} name
 * @param {Array<string>} fieldNames 
 */
function makeTableFromObjArray(md, array, name, fieldNames, displayNames) {
    if (array.length == 0) {
        md.addText(`no ${name} info`);
    } else {
        const rows = [];
        for (const obj of array) {
            const data = [];
            for (const name of fieldNames) {
                data.push(obj[name]);
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
    md.addTitle(moduleName, 2);
    md.addTitle('Basic Info', 3);
    const infos = [
        `${portNum} params, ${paramNum} ports`,
        'top module ' + topModuleDesc
    ];
    md.addUnorderedList(infos);
    md.addEnter();

    md.addTitle('params', 3);
    makeTableFromObjArray(md, module.params, 'params', ['name', 'type', 'init']);
    md.addEnter();
    
    md.addTitle('ports', 3);
    makeTableFromObjArray(md, module.ports, 'ports', ['name', 'type', 'width']);
    md.addEnter();
    
    md.addTitle('Dependency', 3);
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



// base doc
/**
 * @description get basedoc obj from a module
 * @param {Module} module 
 * @returns {MarkdownString}
 */
 function getDocsFromModule(module) {
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
    md.addTitle(moduleName, 2);
    md.addTitle('Basic Info', 3);
    const infos = [
        `${portNum} params, ${paramNum} ports`,
        'top module ' + topModuleDesc
    ];
    md.addUnorderedList(infos);
    md.addEnter();

    md.addTitle('params', 3);
    makeTableFromObjArray(md, module.params, 'params', ['name', 'type', 'init']);
    md.addEnter();
    
    md.addTitle('ports', 3);
    makeTableFromObjArray(md, module.ports, 'ports', ['name', 'type', 'width']);
    md.addEnter();
    
    md.addTitle('Dependency', 3);
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
 * @returns {Array<MarkdownString>} 
 */
 function getDocsFromFile(path) {
    let fileDocs = [];
    const moduleFile = HDLParam.findModuleFile(path);
    if (!moduleFile) {
        console.log('Fail to export documentation of', path);
        return '';
    }
    for (const [name, mod] of moduleFile.nameToModule) {
        const markdownString = getDocsFromModule(mod);
        fileDocs.push(markdownString);
    }
    return fileDocs;
}

/**
 * @description get render list of path
 * @param {string} path
 * @returns {Array<RenderString>} 
 */
 function getRenderList(path) {
    const docs = getDocsFromFile(path);
    const svgs = getWavedromsFromFile(path);
    const renderList = mergeSortByLine(docs, svgs);
    return renderList;
}


/**
 * @description return render list of current file 
 * @returns {Array<RenderString>}
 */
function getCurrentRenderList() {
    const editor = vscode.window.activeTextEditor;
    const currentFilePath = toSlash(editor.document.fileName);
    return getRenderList(currentFilePath);
}


function exportCurrentFileDocAsMarkdown() {

}



module.exports = {
    makeMarkdownFromFile,
    getDocsFromFile,
    getRenderList,
    getCurrentRenderList
};