const fs = require('fs');

const PathModuleSplit = ' @ ';

function makeModuleID(path, name) {
    return name + PathModuleSplit + path;
}


/**
 * 将路径上的json文件以对象读出
 * @param {string} path 
 * @returns {object}
 */
function readJSON(path) {
    let rawText = fs.readFileSync(path);
    return JSON.parse(rawText);    
}


module.exports = {
    readJSON,
    makeModuleID
}