const vscode = require('vscode');

class Error {
    /**
     * 
     * @param {number} severity             警告等级，一个三个级别，0，1，2
     * @param {vscode.Range} range          错误代码所在位置 position
     * @param {string} message              错误信息 
     * @param {string} source               诊断器的名字
     */
    constructor(severity, range, message, source) {
        this.severity = severity;
        this.range = range;
        this.message = message;
        this.source = source;
    }
};


class MarcoContext {
    /**
     * 
     * @param {any} value                   被定义的宏值
     * @param {vscode.Position} position    宏的位置
     */
    constructor(value, position) {
        this.value = value;
        this.position = position;
    }
};


class Marco {
    /**
     * @param {Array<Error>} errors                     错误
     * @param {Map<string, MarcoContext>} defines       定义的宏
     * @param {Array<string>} includes                     include的文件
     * @param {Array<vscode.Position>} invalid          无效的位置
     */
    constructor(errors, defines, includes, invalid) {
        // TODO : 修改！！！等到parser好了
        if (includes.length > 0) {
            includes = ['child_1.v'];
        }
        
        this.errors = errors;
        this.defines = defines;
        this.includes = includes;
        this.invalid = invalid;
    }
};

module.exports = {
    Error,
    MarcoContext,
    Marco
};