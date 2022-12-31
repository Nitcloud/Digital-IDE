class Position {
    /**
     * @param {number} line 目标的行数
     * @param {number} character 目标的列数
     */
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
};


class Range {
    /**
     * @param {Position} start 目标起始的位置
     * @param {Position} end 目标结束的位置
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
};

class PortType {
    static INOUT = 'INOUT'
    static OUTPUT = 'OUTPUT'
    static INOUT = 'INOUT'
};


class ParamType {
    static LOCALPARAM = 'LOCALPARAM'
    static PARAMETER = 'PARAMETER'
};


class Error {
    /**
     * 
     * @param {number} severity             警告等级，一个三个级别，0，1，2
     * @param {Range} range          错误代码所在位置 position
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
     * @param {any} value                   被定义的宏值
     * @param {vscode.Position} position    宏的位置
     */
    constructor(value, position) {
        this.value = value;
        this.position = position;
    }
};


class Include {
    /**
     * @param {string} path 
     * @param {vscode.Range} range 
     */
    constructor(path, range) {
        this.path = path;
        this.range = range;
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
        this.errors = errors;
        this.defines = defines;
        this.includes = this.makeIncludes(includes);
        this.invalid = invalid;
    }

    /**
     * 
     * @param {object} includes
     * @returns {Array<Include>} 
     */
    makeIncludes(includes) {
        const new_includes = [];
        for (const path of Object.keys(includes)) {
            const new_include = new Include(path, includes[path]);
            new_includes.push(new_include);
        }

        return new_includes;
    }
};

module.exports = {
    Position,
    Range,
    PortType,
    ParamType,
    Error,
    MarcoContext,
    Marco
}