const assert = require("assert");
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const common = require('./common');
const util = require('../util');
const opeParam = require('../../param');
const HDLFile = require('../../../src/HDLfilesys/operation/files');
const HDLPath = require('../../../src/HDLfilesys/operation/path');



const HDLParam = {
    TopModules : new Set(),             // Set<Module>
    PathToModuleFiles : new Map(),      // Map<string, ModuleFile>
    Modules : new Set(),                // Set<Module>
    UnhandleInstances : new Set(),      // Set<Instance> 未处理依赖关系的 Instance

    /**
     * @description 找到对应的 ModuleFile
     * @param {string} path
     * @returns {ModuleFile} 
     */
    findModuleFile(path) {
        return this.PathToModuleFiles.get(path);
    },


    /**
     * @description 根据 path 和 name 判断目标 module 是否存在
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    hasModule(path, name) {
        let moduleFile = this.findModuleFile(path);
        if (!moduleFile) {
            return false;
        }
        let module = moduleFile.findModule(name);
        return Boolean(module);
    },


    /**
     * @description 
     * @param {string} path 
     * @returns {boolean}
     */
    hasModuleFile(path) {
        let moduleFile = this.findModuleFile(path);
        if (!moduleFile) {
            return false;
        } else {
            return true;
        }
    },


    /**
     * @description 根据 path 和 name 找到对应的module对象
     * @param {string} path 
     * @param {string} name 
     * @returns {Module}
     */
    findModule(path, name) {
        let moduleFile = this.findModuleFile(path);
        assert(moduleFile, 'cannot find ' + path + ' in global moduleFiles');
        let module = moduleFile.findModule(name);
        assert(module, 'cannot find module "' + name + '" in file ' + path);
        return module;
    },


    /**
     * @description 根据 path 和 name 删除对应的module
     * @param {string} path 
     * @param {string} name 
     */
    deleteModule(path, name) {
        let moduleFile = this.PathToModuleFiles.get(path);
        if (this.hasModule(path, name)) {
            let module = this.findModule(path, name);

            // 删除包含 module 的任何容器
            moduleFile.nameToModule.delete(module.name);
            this.TopModules.delete(module);
            this.Modules.delete(module);
        }
    },


    /**
     * @description 根据 path 和 name判断当前的module是否为顶层模块
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    isTopModule(path, name) {
        let module = this.findModule(path, name);
        return this.TopModules.has(module);
    },


    /**
     * @description 以列表的形式返回所有注册的 module 对象
     * @returns {Array<Module>}
     */
    getAllModules() {
        const modules = [];
        for (const module of this.Modules) {
            modules.push(module);
        }
        return modules;
    },


    /**
     * @description 以列表的形式返回所有注册的 moduleFile 对象
     * @returns {Array<ModuleFile>}
     */
    getAllModuleFiles() {
        const moduleFiles = [];
        for (const [path, moduleFile] of this.PathToModuleFiles) {
            moduleFiles.push(moduleFile);
        }
        return moduleFiles;
    },


    /**
     * @description 以列表的形式返回所有的 逻辑上为顶层模块的 module 对象
     * @returns {Array<Module>}
     */
    getAllTopModules() {
        let topmodules = [];
        for (const topmodule of this.TopModules) {
            topmodules.push(topmodule);
        }
        return topmodules;
    },


    /**
     * @description 根据路径和已经解析出的结果初始化一个 module file 文件
     * @param {string} path 
     * @param {object} json 
     * @returns {ModuleFile}
     */
    InitByJSON(path, json) {
        let moduleFile = new ModuleFile(path,
                                        json.languageId,
                                        json.marco,
                                        json.modules);
        return moduleFile;
    },


    /**
     * @description 根据Hardware文件夹名初始化
     * @param {string} folder 文件夹路径
     */
    InitByFolder(folder) {
        if (fs.existsSync(folder)) {
            // TODO : vhdl 和 systemverilog 解析器调试好后去除下面的 filter
            const HDLFiles = HDLFile.getHDLFiles(folder).filter(filePath => {
                const langID = HDLFile.getLanguageId(filePath);
                return langID != 'systemverilog';
            });

            for (const filePath of HDLFiles) {
                const langID = HDLFile.getLanguageId(filePath);
                const parser = util.selectParserByLangID(langID);
                let code = fs.readFileSync(filePath, 'utf-8');
                const json = parser.parse(code);
                this.InitByJSON(filePath, json);
            }
        }
    },

    Initialize() {
        assert(fs.existsSync(opeParam.workspacePath), 'workspace not exist, check the initialization of opeParam');
        this.InitByFolder(opeParam.workspacePath);

        for (const moduleFile of this.getAllModuleFiles()) {
            moduleFile.makeInstance();
        }

        let count = 0;
        for (const moduleFile of this.getAllModuleFiles()) {
            count += moduleFile.nameToModule.size;
        }
    },


    /**
     * @description 从HdlParam中去除 path 代表的文件相关的属性
     * @param {string} path 
     */
    deleteModuleFile(path) {
        const moduleFile = this.findModuleFile(path);
        if (moduleFile) {
            for (const [moduleName, module] of moduleFile.nameToModule) {
                this.deleteModule(path, moduleName);
            }
            this.PathToModuleFiles.delete(path);
        }
    },

    /**
     * @description 根据name找到所有的module
     * @param {string} name 
     * @returns {Set<Module>}
     */
     findModulesByName(name) {
        const targetModules = [];
        for (const module of this.Modules) {
            if (module.name == name) {
                targetModules.push(module);
            }
        }
        return new Set(targetModules);
    },


    /**
     * @description 根据path找到所有的module
     * @param {string} path 
     * @returns {Set<Module>}
     */
    findModuleByPath(path) {
        const targetModules = [];
        const moduleFile = this.findModuleFile(path);
        if (moduleFile) {
            moduleFile.nameToModule.forEach((module, name) => {
                targetModules.push(module);
            });
        }
        return new Set(targetModules);
    },
    
};



class ModPort {
    /**
     * @param {string} name                     port名
     * @param {common.PortType} type            port的类型，必须是PortType类型的枚举量
     * @param {string} width                    位宽，形如 "[3:0]" 的字符串
     * @param {vscode.Range} range              端口定义的开始和结束
     */
    constructor(name, type, width, range) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.range = range;
    }
};


class ModParam {
    /**
     * @param {string} name                       param名
     * @param {common.ParamType} type           param的类型
     * @param {string} init                       初始化参数
     * @param {vscode.Range} range             端口定义的开始和结束
     */
    constructor(name, type, init, range) {
        this.name = name;
        this.type = type;
        this.init = init;
        this.range = range;
    }
};


class Instance {
    /**
     * @param {string} name                             实例名称
     * @param {string} type                             实例自的模块名字
     * @param {string} instModPath                      实例模块路径
     * @param {vscode.Range} instparams                 params起始
     * @param {vscode.Range} instports                  ports起始
     * @param {Module} parentMod                        所属的 Module
     */
    constructor(name, type, instModPath, instparams, instports, parentMod) {
        this.name = name;
        this.type = type;
        this.parentMod = parentMod;
        
        // two range, duck type
        this.instparams = instparams;
        this.instports = instports;

        this.instModPath = instModPath;

        this.module = null;
        if (instModPath) {
            this.locateModule();
        }
    }

    /**
     * 将当前的Instance对象加入目标 module 的 refers 中
     * @param {Module} targetModule 
     */
    addToModuleRefer(targetModule) {
        targetModule.refers.add(this);
        if (HDLParam.TopModules.has(targetModule)) {
            HDLParam.TopModules.delete(targetModule);
        }
    }

    locateModule() {
        const instModPath = this.instModPath;
        const instModName = this.type;

        // 通过 HDLParam 找到 module
        this.module = HDLParam.findModule(instModPath, instModName);
        // 为 module 增加引用
        this.addToModuleRefer(this.module);
    }
};


class Module {
    /**
     * @param {ModuleFile} file             所属的ModuleFile
     * @param {string} name                 模块名
     * @param {vscode.Range} range          模块内容的开始和结束
     * @param {ModParam} params             params           
     * @param {ModPort} ports               ports
     * @param {Array<Instance>} instances   Module内部使用的实例化模块
     */
    constructor(file, name, range, params, ports, instances) {
        this.file = file;
        this.name = name;
        this.range = range;
        this.path = file.path;
        
        this.params = this.makeModParams(params);
        this.ports = this.makeModPort(ports);

        this._instances = instances;
        this.unhandleInstances = new Set();

        // 默认情况下刚刚创建时将当前的Module加入
        HDLParam.TopModules.add(this);
        HDLParam.Modules.add(this);

        // refers 代表实例化了这个Module的所有的Instance对象
        this.refers = new Set();
    }


    /**
     * 获取当前的 module 对象的文件路径
     * @returns {string}
     */
    getPath() {
        return this.file.path;
    }

    /**
     * 将 params 转换为现有数据结构
     * @param {Array<ModParam>} params 
     * @returns {Array<ModParam>}
     */
    makeModParams(params) {
        let new_params = [];
        for (const param of params) {
            let range = {start: param.start, end: param.end};
            let new_param = new ModParam(param.name,
                                         param.type,
                                         param.init,
                                         range);
            new_params.push(new_param);
        }
        return new_params;
    }

    /**
     * 将 ports 转换为现有数据结构
     * @param {Array<ModPort>} ports 
     * @returns {Array<ModPort>}
     */
    makeModPort(ports) {
        let new_ports = [];
        for (const port of ports) {
            let range = {start: port.start, end: port.end};
            let new_port = new ModPort(port.name,
                                       port.type,
                                       port.width,
                                       range);
            new_ports.push(new_port);
        }
        return new_ports;
    }


    /**
     * 将 instances 转化为对应的Instance对象
     */
    makeNameToInstances() {
        let nameToInstances = new Map();
        for (const inst of this._instances) {
            // TODO : 核心，能否更加优雅
            let instModPath = this.searchInstModPath(inst);
            let new_inst = new Instance(inst.name,
                                        inst.type,
                                        instModPath,
                                        inst.instparams,
                                        inst.instports,
                                        this);
            nameToInstances.set(inst.name, new_inst);
            if (!instModPath) {
                HDLParam.UnhandleInstances.add(new_inst);
                this.unhandleInstances.add(new_inst);
            }
            
        }
        this.nameToInstances = nameToInstances;
        delete this._instances;
    }


    /**
     * @description 返回该模块下的所有 例化 对象
     * @returns {IterableIterator<Instance>}
     */
    getInstances() {
        return this.nameToInstances.values();
    }

    /**
     * @param {string} instName 
     * @returns {Instance}
     */
    getInstanceByName(instName) {
        return this.nameToInstances.get(instName);
    }

    /**
     * @returns {number}
     */
    getInstanceNum() {
        return this.nameToInstances.size;
    }

    /**
     * @description 所有的 ModuleFile 初始化完后再调用该函数
     * @param {Instance} inst 
     */
    searchInstModPath(inst) {
        // 搜索例化的模块 优先级 “当前文件” -> “include的文件” -> “其余工程文件”
        const targetModuleName = inst.type;
        // 为“其余工程文件”的扫描 提前做准备的数据结构
        const excludeFile = new Set([this.file]);

        // 搜索 “当前文件”
        for (const [name, module] of this.file.nameToModule) {
            if (targetModuleName == name) {
                return this.getPath();      // 如果当前文件中就有 instance 的模块，直接返回当前文件的路径
            }
        }


        // 搜索 “include的文件”
        for (const include of this.file.marco.includes) {
            const absIncludePath = HDLPath.rel2abs(this.getPath(), include.path);
            const includeFile = HDLParam.findModuleFile(absIncludePath);
            if (includeFile) {
                excludeFile.add(includeFile);
                if (includeFile.hasModule(targetModuleName)) {
                    return includeFile.path;
                }
            }
        }

        // 搜索 “其余工程文件”
        for (const moduleFile of HDLParam.getAllModuleFiles()) {
            if (!excludeFile.has(moduleFile) && moduleFile.hasModule(targetModuleName)) {
                return moduleFile.path;
            }
        }

        return null;
    }
};


class ModuleFile {
    /**
     * @param {string} path 
     * @param {string} languageId 
     * @param {common.Marco} marco 
     * @param {Map<string, Module>} nameToModule 
     */
    constructor(path, languageId, marco, modules) {

        this.path = HDLPath.toSlash(path);
        this.languageId = languageId;

        // process in constructor
        this.marco = this.makeMarco(marco);
        this.nameToModule = this.makeNameToModule(modules);
        
        // add to global HDLParam
        HDLParam.PathToModuleFiles.set(path, this);
    }


    /**
     * @description 根据 name 判断有无 module 对象
     * @param {string} name
     * @returns {boolean} 
     */
    hasModule(name) {
        return this.nameToModule.has(name);
    }

    /**
     * transform wasm format object to real marco object
     * @param {any} 
     * @returns {common.Marco}
     */
    makeMarco(mar) {
        if (mar instanceof common.Marco) {
            return mar;
        } else {
            let real_marco = new common.Marco(null, 
                                             mar.defines, 
                                             mar.includes, 
                                             mar.invalid);
            return real_marco;
        }
    }

    /**
     * @description 初始化 module 数组
     * @param {Array} modules
     * @returns {Map<string, Module>}
     */
    makeNameToModule(modules) {
        // transform any[] to Module[]
        let module_names = Object.keys(modules);
        if (module_names.length > 0 && !(modules[module_names[0]] instanceof Module)) {
            for (const module_name of module_names) {
                let module = modules[module_name];
                // generate range
                let range = {start: module.start, end: module.end};

                // replace the original object with a Module object
                modules[module_name] = new Module(this,
                                                  module_name,
                                                  range,
                                                  module.params,
                                                  module.ports,
                                                  module.instances)
            }
        }
        
        // transform to map
        let nameToModule = new Map();
        for (let module_name of module_names) {
            nameToModule.set(module_name, modules[module_name]);
        }
        
        return nameToModule;
    }

    /**
     * @description 根据 name 找到对应的 module 对象
     * @param {string} name
     * @returns {Module} 
     */
    findModule(name) {
        let module = this.nameToModule.get(name);
        return module;
    }


    /**
     * @description 初始化当前 文件下的每个的module的每个instance对象，必须在所有的
     * moduleFile对象初始化完调用。Instance的依赖关系会在这个函数中被初始化
     */
    makeInstance() {
        for (const [name, module] of this.nameToModule) {
            module.makeNameToInstances();
        }
    }
};


module.exports = {
    ModPort,
    ModParam,
    Module,
    ModuleFile,
    Instance,
    HDLParam
};