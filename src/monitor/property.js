const fs = require('fs');

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
 * @description update a complex object by another object
 * @param {object} originalObj 
 * @param {object} newObj
 * @param {Array<string>} keyTrace
 * @param {(keyTrace: Array<string>, oldValue: any, newValue: any) => boolean} updateCallback
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
                if (originalType == 'object') {
                    // recurse if the type is object, record newKey for callback
                    recurseUpdateObject(originalValue, newValue, keyTrace, updateCallback);
                } else {
                    const needChange = updateCallback(keyTrace, originalValue, newValue);
                    if (needChange === undefined || needChange) {
                        originalObj[newKey] = newValue;
                    }
                }
                keyTrace.pop();
            }
        }
    }
}

function coverRecurse() {
    
}


/**
 * @description update property 
 * if there exist that key not covered, use original value instead
 * @param {*} newProperty 
 */
function updateProperty(newProperty) {
    const originalPrjInfo = opeParam.prjInfo;
    
    
    recurseUpdateObject(originalPrjInfo, newProperty, [], 
        (keyTrace, oldValue, newValue) => {
            const keyName = keyTrace.join('.');
            
            return true;
        });
}

/**
 * @description cover property
 * if there exist that key not covered, use original value instead
 * @param {*} newProperty 
 */
function coverProperty(newProperty) {

}

async function add() {
    const ppyPath = getPropertyPath();
    try {
        const newProperty = HDLFile.pullJsonInfo(ppyPath);
        updateProperty(newProperty);
    } catch (err) {
        console.log('parse error json');
    }
}

async function change() {
    const ppyPath = getPropertyPath();
    try {
        const newProperty = HDLFile.pullJsonInfo(ppyPath);
        updateProperty(newProperty);
    } catch (err) {
        console.log('parse error json');
        return;
    }
}

async function unlink() {
    const defaultProperty = getDefaultProperty();
}

module.exports = {
    add, 
    change, 
    unlink
};