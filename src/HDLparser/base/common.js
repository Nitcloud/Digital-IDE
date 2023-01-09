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
    static INOUT = 'INOUT';
    static OUTPUT = 'OUTPUT';
    static INOUT = 'INOUT';
};


class ParamType {
    static LOCALPARAM = 'LOCALPARAM'
    static PARAMETER = 'PARAMETER'
};

class ModuleFileType {
    static SRC = 'src'
    static SIM = 'sim'
    static LOCAL_LIB = 'local_lib'
    static REMOTE_LIB = 'remote_lib'
};


class HDLLanguageID {
    static VERILOG = 'verilog'
    static SYSTEM_VERILOG = 'systemverilog'
    static VHDL = 'vhdl'
};

class InstModPathStatus {
    static CURRENT = 'CURRENT'
    static INCLUDE = 'INCLUDE'
    static OTHERS = 'OTHERS'
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


class RawParam {
    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string} init 
     * @param {Position} start 
     * @param {Position} end 
     */
    constructor(name, type, init, start, end) {
        this.name = name;
        this.type = type;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}


class RawPort {
    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string} width 
     * @param {Position} start 
     * @param {Position} end 
     */
     constructor(name, type, width, start, end) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.start = start;
        this.end = end;
    }
}

class RawInstance {
    /**
     * @param {string} name 
     * @param {string} type 
     * @param {string} instModPath 
     * @param {Range} instparams 
     * @param {Range} instports 
     * @param {Position} start 
     * @param {Position} end 
     */
    constructor(name, type, instModPath, instparams, instports, start, end) {
        this.name = name;
        this.type = type;
        this.instModPath = instModPath;
        this.instparams = instparams;
        this.instports = instports;
        this.start = start;
        this.end = end;
    }
}


class RawModule {
    /**
     * @description describe a raw module from json
     * @param {Array<RawParam>} params 
     * @param {Array<RawPort>} ports 
     * @param {Array<RawInstance>} instances 
     * @param {Position} start 
     * @param {Position} end 
     */
    constructor(params, ports, instances, start, end) {
        this.params = params;
        this.ports = ports;
        this.instances = instances;
        this.start = start;
        this.end = end;
    }
}

module.exports = {
    Position,
    Range,
    PortType,
    ParamType,
    InstModPathStatus,
    Error,
    MarcoContext,
    Marco,
    RawParam,
    RawPort,
    RawInstance,
    RawModule,
    ModuleFileType,
    HDLLanguageID
}