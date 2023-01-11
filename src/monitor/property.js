const fs = require('fs');
const vscode = require('vscode');

const { HDLParam } = require('../HDLparser');
const HDLFile = require('../HDLfilesys/operation/files');
const HDLPath = require('../HDLfilesys/operation/path');
const opeParam = require('../param');

const { getPropertyPath, getDefaultProperty } = require('../HDLtool/manager/prjManage');
const { refreshArchTree } = require('../HDLtool/tree/tree');


/**
 * @param {object} obj 
 * @returns {Set<string>}
 */
function makeKeySet(obj) {
    const keySet = new Set();
    for (const k of Object.keys(obj)) {
        keySet.add(k);
    }
    return keySet;
}

/**
 * 
 * @param {Set} setA 
 * @param {Set} setB 
 */
function sameSet(setA, setB) {
    if (setA.size != setB.size) {
        return false;
    }
    let countA = 0;
    for (const el of setB) {
        if (setA.has(el)) {
            countA ++;
        } else {
            return false;
        }
    }
    return countA == setA.size;
}

function addFile(path) {
    if (path.endsWith('.sv')) {
        return;
    }
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
}

function unlinkFile(path) {
    if (path.endsWith('.sv')) {
        return;
    }
    path = HDLPath.toSlash(path);
    HDLParam.deleteModuleFile(path);
}


/**
 * @description update a complex object by another object
 * @param {object} originalObj 
 * @param {object} newObj
 * @param {Array<string>} keyTrace
 * @param {(keyTrace: Array<string>, oldValue: any, newValue: any) => any} updateCallback
 */
function recurseUpdateObject(originalObj, newObj, keyTrace, updateCallback) {
    const originalKeys = makeKeySet(originalObj);
    const newKeys = makeKeySet(newObj);
    // take original keys as template to do update
    for (const newKey of newKeys) {
        if (originalKeys.has(newKey)) {
            // do update only original container have the key
            const originalValue = originalObj[newKey];
            const newValue = newObj[newKey];
            const originalType = typeof originalValue;
            const newType = typeof newValue;

            if (newValue && originalType == newType && originalValue != newValue) {
                // do update only 
                // 1. value corresponding to the key is not null
                // 2. they are the same type
                // 3. they don't have the same value
                keyTrace.push(newKey);
                if (originalValue instanceof Array) {
                    // TODO : implement there
                    if (newValue instanceof Array) {
                        const originalSet = new Set(originalValue);
                        const newSet = new Set(newValue);
                        if (!sameSet(originalSet, newSet)) {
                            console.log('change lib');
                            const returnVal = updateCallback(keyTrace, originalValue, newValue);
                            if (returnVal) {
                                originalObj[newKey] = returnVal;
                            }
                        }
                    }
                } else if (originalType == 'object') {
                    // recurse if the type is object, record newKey for callback
                    recurseUpdateObject(originalValue, newValue, keyTrace, updateCallback);
                } else {
                    const returnVal = updateCallback(keyTrace, originalValue, newValue);
                    if (returnVal) {
                        originalObj[newKey] = returnVal;
                    }
                }
                keyTrace.pop();
            }
        }
    }
}


/**
 * 
 * @param {object} obj q
 * @param {Array<string>} trace 
 */
function getObjValueByTrace(obj, trace) {
    let result = obj;
    for (const key of trace) {
        result = result[key];
    }
    return result;
}


/**
 * @description update property 
 * if there exist that key not covered, use original value instead
 * @param {*} newProperty
 * @param {{remakeHDLMonitor: (name: string)}} monitor
 */
function updateProperty(newProperty, monitor) {
    const originalPrjInfo = opeParam.prjInfo;
    let HDLFileChanged = false;
    const configFolder = HDLPath.join(opeParam.workspacePath, '.vscode');
    const commonFolder = HDLPath.join(opeParam.rootPath, 'lib', 'common', 'Apply');

    const originalHDLfiles = opeParam.PrjManager.getPrjFiles();
    
    recurseUpdateObject(originalPrjInfo, newProperty, [], 
        (keyTrace, oldValue, newValue) => {
            console.log('enter callback ', keyTrace, oldValue, newValue);
            if (keyTrace.length >= 3 && 
                keyTrace[0] == 'ARCH' &&
                keyTrace[1] == 'Hardware' &&
                (keyTrace[2] == 'src' || keyTrace[2] == 'sim')) {
                const path = getObjValueByTrace(newProperty, keyTrace);
                const absPath = HDLPath.rel2abs(configFolder, path);
                if (!fs.existsSync(absPath)) {
                    vscode.window.showErrorMessage(absPath + " dont't exist!");
                    return null;
                } else {
                    HDLFileChanged = true;
                    return absPath;
                }
            }

            if (keyTrace.length >= 3 &&
                keyTrace[0] == 'library' &&
                keyTrace[1] == 'Hardware' &&
                (keyTrace[2] == 'common' || keyTrace[2] == 'custom')) {
                
                const existPaths = [];
                const rootPath = keyTrace[2] == 'common' ? commonFolder : configFolder;

                for (const path of newValue) {
                    const absPath = HDLPath.rel2abs(rootPath, path);
                    console.log(absPath);
                    if (fs.existsSync(absPath)) {
                        existPaths.push(absPath);
                    }
                }
                HDLFileChanged = true;
                return existPaths;
            }
            
            return newValue;
        });
    
    if (HDLFileChanged) {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'adjust the project'
        }, async progress => {
            monitor.remakeHDLMonitor('HDL');
            const uncheckedFiles = new Set(originalHDLfiles);
            const newFilePaths = new Set(opeParam.PrjManager.getPrjFiles());
            
            for (const newFilePath of newFilePaths) {
                if (!uncheckedFiles.has(newFilePath)) {
                    addFile(newFilePath);
                }
                uncheckedFiles.delete(newFilePath);
            }
            for (const oldFilePath of uncheckedFiles) {
                unlinkFile(oldFilePath);
            }

            refreshArchTree();
        })
    }
    return null;
}

async function add(path, monitor) {
    console.log('add property');
    const ppyPath = getPropertyPath();
    const newProperty = HDLFile.pullJsonInfo(ppyPath);
    if (newProperty) {
        return updateProperty(newProperty, monitor);
    }
}

async function change(path, monitor) {
    console.log('change property');
    const ppyPath = getPropertyPath();
    const newProperty = HDLFile.pullJsonInfo(ppyPath);
    if (newProperty) {
        return updateProperty(newProperty, monitor);
    }
}

async function unlink(path, monitor) {
    console.log('unlink property');
    const defaultProperty = getDefaultProperty();
    return updateProperty(defaultProperty, monitor);
}

module.exports = {
    add, 
    change, 
    unlink
};