const fs = require('fs');
const HDLFile = require('../HDLfilesys/operation/files');
const HDLPath = require('../HDLfilesys/operation/path');
const { HDLParam, 
        selectParserByLangID, getSymbolJSONFromFile, 
        Module, Position, Range, Instance, RawModule, RawInstance } = require('../HDLparser');


const { refreshArchTree } = require('../HDLtool/tree/tree');

async function add(path) {
    path = HDLPath.toSlash(path);
    const HDLfiles = [path];
    
    // create corresponding moduleFile
    HDLParam.InitHDLFiles(HDLfiles);

    const moduleFile = HDLParam.findModuleFile(path);
    if (!moduleFile) {
        console.log('error happen when create moduleFile', path);
    } else {
        moduleFile.makeInstance();
        for (const [moduleName, module] of moduleFile.nameToModule) {
            module.solveUnhandleInstance();
        }
    }
    refreshArchTree();
}

/**
 * @param {Module} originalModule original module object in moduleFile
 * @param {RawModule} newModule unstructure object from parse
 */
function updateModule(originalModule, newModule) {
    // 1. assign ports and params directly
    originalModule.resetParams(newModule.params);
    originalModule.resetPorts(newModule.ports);

    // 2. recompute range
    originalModule.resetRange(newModule.start, newModule.end);

    // 3. compare and make change to instance
    const uncheckedInstanceNames = new Set();
    for (const inst of originalModule.getInstances()) {
        uncheckedInstanceNames.add(inst.name);
    }

    for (const newInst of newModule.instances) {
        if (uncheckedInstanceNames.has(newInst.name)) {     
            // match exist instance, compare and update
            const originalInstance = originalModule.findInstance(newInst.name);
            uncheckedInstanceNames.delete(newInst.name);
            updateInstance(originalInstance, newInst);
        } else {        
            // unknown instance, create it
            originalModule.createInstance(newInst);
        }
    }

    // 4. delete Instance that not visited
    for (const instName of uncheckedInstanceNames) {
        originalModule.deleteInstanceByName(instName);
    }
}

/**
 * @param {Instance} originalInstance 
 * @param {RawInstance} newInstance 
 */
function updateInstance(originalInstance, newInstance) {
    originalInstance.resetType(newInstance.type);
    originalInstance.resetRange(newInstance.start, newInstance.end);
    originalInstance.resetInstParams(newInstance.instparams);
    originalInstance.resetInstPorts(newInstance.instports);
}


async function change(path) {
    path = HDLPath.toSlash(path);
    const json = getSymbolJSONFromFile(path);
    const moduleFile = HDLParam.findModuleFile(path);

    // 1. update marco directly
    moduleFile.makeMarco(json.marco);

    // 2. update modules one by one
    const uncheckedModuleNames = new Set();
    for (const name of moduleFile.nameToModule.keys()) {
        uncheckedModuleNames.add(name);
    }

    const currentModuleNames = Object.keys(json.modules);
    for (const moduleName of currentModuleNames) {
        if (uncheckedModuleNames.has(moduleName)) {     
            // match the same module, check then
            const originalModule = moduleFile.findModule(moduleName);
            uncheckedModuleNames.delete(moduleName);
            updateModule(originalModule, json.modules[moduleName]);
        } else {                                    
            // no matched, create it
            const rawModule = json.modules[moduleName];
            const newModule = moduleFile.createModule(moduleName, rawModule);
            newModule.makeNameToInstances();
            newModule.solveUnhandleInstance();
        }
    }

    // 3. delete module not visited yet
    for (const moduleName of uncheckedModuleNames) {
        moduleFile.deleteModule(moduleName);
    }

    refreshArchTree();
}

async function unlink(path) {
    path = HDLPath.toSlash(path);
    HDLParam.deleteModuleFile(path);

    refreshArchTree();
}

module.exports = {
    add,
    change,
    unlink
};