const assert = require("assert");
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const common = require('./common');
const util = require('../util');
const opeParam = require('../../param');
const HDLFile = require('../../../src/HDLfilesys/operation/files');
const HDLPath = require('../../../src/HDLfilesys/operation/path');

/**
 * @param {Set<Module>} TopModules
 * If folders of src and sim are the same, use TopModules
 * 
 * @param {Set<Module>} SrcTopModules
 * @param {Set<Module>} SimTopModules
 */
const HDLParam = {
    TopModules : new Set(),             // Set<Module>
    SrcTopModules : new Set(),          // Set<Module>
    SimTopModules : new Set(),          // Set<Module>
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
        // assert(moduleFile, 'cannot find ' + path + ' in global moduleFiles');
        if (!moduleFile) {
            return undefined;
        }
        let module = moduleFile.findModule(name);
        // assert(module, 'cannot find module "' + name + '" in file ' + path);
        return module;
    },


    /**
     * @description 根据 path 和 name 删除对应的module
     * @param {string} path 
     * @param {string} name 
     */
    deleteModule(path, name) {
        let moduleFile = this.findModuleFile(path);
        moduleFile.deleteModule(name);
    },


    /**
     * @description 根据 path 和 name判断当前的module是否为顶层模块
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    isTopModule(path, name) {
        const module = this.findModule(path, name);
        return this.TopModules.has(module);
    },


    /**
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    isSrcTopModule(path, name) {
        const module = this.findModule(path, name);
        return this.SrcTopModules.has(module);  
    },

    /**
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    isSimTopModule(path, name) {
        const module = this.findModule(path, name);
        return this.SimTopModules.has(module);
    },


    /**
     * @description get SrcTopModules and SimTopModules by module
     * @param {Module} module 
     * @return {Set<Module>}
     */
    selectTopModule(module) {
        switch (module.file.type) {
            case common.ModuleFileType.SRC: return this.SrcTopModules;
            case common.ModuleFileType.SIM: return this.SimTopModules;
            case common.ModuleFileType.LOCAL_LIB: return this.SrcTopModules;
            case common.ModuleFileType.REMOTE_LIB: return this.SrcTopModules;
            default: return this.SrcTopModules;        
        }
    },

    addSrcSimTopModule(module) {
        const topModules = this.selectTopModule(module);
        topModules.add(module);
    },

    deleteSrcSimTopModule(module) {
        const topModules = this.selectTopModule(module);
        topModules.delete(module);
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
     * @returns {Array<Module>}
     */
    getSrcTopModules() {
        const srcTopModules = this.SrcTopModules;
        if (!srcTopModules) {
            return [];
        }
        const moduleFiles = [];
        for (const module of srcTopModules) {
            moduleFiles.push(module);
        }
        return moduleFiles;
    },

    /**
     * @returns {Array<Module>}
     */
    getSimTopModules() {
        const simTopModules = this.SimTopModules;
        if (!simTopModules) {
            return [];
        }
        const moduleFiles = [];
        for (const module of simTopModules) {
            moduleFiles.push(module);
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
     * @description Initialize HDLfiles
     * @param {Array<string>} HDLfiles
     */
     InitHDLFiles(HDLfiles) {
        // TODO : systemverilog 解析器调试好后去除下面的 filter
        HDLfiles = HDLfiles.filter(filePath => {
            const langID = HDLFile.getLanguageId(filePath);
            return langID != 'systemverilog';
        });

        for (const filePath of HDLfiles) {
            const json = util.getSymbolJSONFromFile(filePath);
            this.InitByJSON(filePath, json);
        }
    },

    /**
     * @description Initialize
     * @param {Array<string>} HDLfiles 
     */
    Initialize(HDLfiles) {
        this.InitHDLFiles(HDLfiles);
        for (const moduleFile of this.getAllModuleFiles()) {
            moduleFile.makeInstance();
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
    

    /**
     * 
     * @param {string} path path of the module
     * @param {string} name name of the module
     * @returns {{
     *      current: Array<string>,         // module import from current file
     *      include: Array<string>,         // module import by "`include"
     *      others: Array<string>           // module search by extension
     * }}
     */
    getAllDependences(path, name) {
        if (!this.hasModule(path, name)) {
            return null;
        }
        
        const module = this.findModule(path, name);
        const dependencies = {
            current: [],
            include: [],
            others: []
        };

        for (const inst of module.getInstances()) {
            if (!inst.module) {
                continue;
            }
            const status = inst.instModPathStatus;
            if (status == common.InstModPathStatus.CURRENT) {
                dependencies.current.push(inst.instModPath);
            } else if (status == common.InstModPathStatus.INCLUDE) {
                dependencies.include.push(inst.instModPath);
            } else if (status == common.InstModPathStatus.OTHERS) {
                dependencies.others.push(inst.instModPath);
            }
            const instDependencies = this.getAllDependences(inst.module.path, inst.module.name);
            if (instDependencies) {
                dependencies.current.push(...instDependencies.current);
                dependencies.include.push(...instDependencies.include);
                dependencies.others.push(...instDependencies.others);
            }
        }

        return dependencies;
    },

    /**
     * @param {string} typeName 
     * @returns {Instance}
     */
    findUnhandleInstanceByType(typeName) {
        for (const inst of this.UnhandleInstances) {
            if (inst.type == typeName) {
                return inst;
            }
        }
        return null;
    },

    addUnhandleInstance(inst) {
        this.UnhandleInstances.add(inst);
    },

    deleteUnhandleInstance(inst) {
        this.UnhandleInstances.delete(inst);
    }
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
     * @param {common.InstModPathStatus} instModPath    实例模块路径被引入的状态 （当前文件、include、项目搜索）
     * @param {vscode.Range} instparams                 params起始
     * @param {vscode.Range} instports                  ports起始
     * @param {Module} parentMod                        所属的 Module
     */
    constructor(name, type, instModPath, instModPathStatus, instparams, instports, range, parentMod) {
        this.name = name;
        this.type = type;
        assert(parentMod, "parentMod can't be null!");
        this.parentMod = parentMod;
        
        // two range, duck type
        this.instparams = instparams;
        this.instports = instports;

        this.instModPath = instModPath;
        this.instModPathStatus = instModPathStatus;
        this.range = range;

        this.module = null;
        if (instModPath) {
            this.locateModule();
        }
    }

    resetType(type) {
        this.type = type;
    }

    resetInstParams(instparams) {
        this.instparams = instparams;
    }

    resetInstPorts(instports) {
        this.instports = instports;
    }

    resetRange(start, end) {
        this.range = {start, end};
    }

    /**
     * @description is a instance which parentMod and instMod in the same source
     * @returns {boolean}
     */
    isSameSource() {
        const parentMod = this.parentMod;
        const instMod = this.module;
        if (instMod) {
            return parentMod.file.type == instMod.file.type;
        }
        return false;
    }

    locateModule() {
        const instModPath = this.instModPath;
        const instModName = this.type;

        // 通过 HDLParam 找到 module
        this.module = HDLParam.findModule(instModPath, instModName);
        // add refer for module 
        this.module.addReferInstance(this);
        // if module and parent module share the same source (e.g both in src folder)
        if (this.isSameSource()) {
            this.module.addLocalReferInstance(this);
        }
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

        HDLParam.TopModules.add(this);
        HDLParam.addSrcSimTopModule(this);
        HDLParam.Modules.add(this);

        // represents all the instance from this
        this.refers = new Set();

        // represents all the instance from this created in the same scope
        // scope: src or sim (lib belongs to src)
        // localRefers subset to refers
        this.localRefers = new Set();
    }

    resetPorts(ports) {
        this.ports = this.makeModPort(ports);
    }

    resetParams(params) {
        this.params = this.makeModParams(params);
    }

    resetRange(start, end) {
        this.range = {start, end};
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
        if (!params) {
            return [];
        }
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
        if (!ports) {
            return [];
        }
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
     * 
     * @param {common.RawInstance} inst
     */
    createInstance(inst) {
        const instMod = this.searchInstModPath(inst);
        const range = {start: inst.start, end: inst.end};
        const new_inst = new Instance(inst.name,
                                    inst.type,
                                    instMod.path,
                                    instMod.status,
                                    range,
                                    inst.instparams,
                                    inst.instports,
                                    this);
        if (!instMod.path) {
            HDLParam.addUnhandleInstance(new_inst);
            this.addUnhandleInstance(new_inst);
        }
        if (this.nameToInstances) {
            this.nameToInstances.set(inst.name, new_inst);
        }
    }

    /**
     * @description delete an Instance and its context by name
     * @param {string} instName 
     */
    deleteInstanceByName(instName) {
        const targetInst = this.findInstance(instName);
        this.deleteInstance(targetInst);
    }

    /**
     * @description delete an Instance and its context
     * @param {Instance} inst
     */
    deleteInstance(inst) {
        if (inst) {
            this.deleteUnhandleInstance(inst);
            HDLParam.deleteUnhandleInstance(inst);
            if (this.nameToInstances) {
                this.nameToInstances.delete(inst.name);
            }
            // delete reference from instance's instMod
            const instMod = inst.module;
            if (instMod) {
                instMod.deleteReferInstance(inst);
                if (inst.isSameSource()) {
                    instMod.deleteLocalReferInstance(inst);
                }
            }
        }
    }

    /**
     * @description transform raw instance to instance object
     */
    makeNameToInstances() {
        this.nameToInstances = new Map();
        for (const inst of this._instances) {
            this.createInstance(inst);
        }
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
     * @returns {number}
     */
    getInstanceNum() {
        const nameToInstances = this.nameToInstances;
        if (!nameToInstances) {
            console.log("error in getInstanceNum, don't have nameToInstances");
            return [];
        }
        return this.nameToInstances.size;
    }

    /**
     * @param {string} name 
     * @returns {Instance}
     */
    findInstance(name) {
        const nameToInstance = this.nameToInstances;
        if (!nameToInstance) {
            return null;
        } 
        return nameToInstance.get(name);
    }

    /**
     * @description get all the instance from the module
     * @returns {Set<Instance>}
     */
    getReferInstances() {
        return this.refers;
    }

    /**
     * @description get all the instances from module from the same source
     * @returns {Set<Instance>}
     */
    getLocalReferInstances() {
        return this.localRefers;
    }

    /**
     * @param {Instance} inst 
     */
    deleteReferInstance(inst) {
        this.refers.delete(inst);
        if (this.refers.size == 0) {
            HDLParam.TopModules.add(this);
        }
    }

    /**
     * @param {Instance} inst
     */
    addReferInstance(inst) {
        this.refers.add(inst);
        if (this.refers.size > 0) {
            HDLParam.TopModules.delete(this);
        }
    }

    /**
     * 
     * @param {Instance} inst 
     */
    deleteLocalReferInstance(inst) {
        this.localRefers.delete(inst);
        if (this.localRefers.size == 0) {
            const topModule = HDLParam.selectTopModule(this);
            topModule.add(this);
        }
    }

    /**
     * 
     * @param {Instance} inst 
     */
    addLocalReferInstance(inst) {
        this.localRefers.add(inst);
        if (this.localRefers.size > 0) {
            const topModule = HDLParam.selectTopModule(this);
            topModule.delete(this);
        }
    }

    /**
     * @param {Instance} inst 
     */
    addUnhandleInstance(inst) {
        this.unhandleInstances.add(inst);
    }

    /**
     * @param {Instance} inst 
     */
    deleteUnhandleInstance(inst) {
        this.unhandleInstances.delete(inst);
    }

    /**
     * @description 所有的 ModuleFile 初始化完后再调用该函数
     * @param {Instance} inst 
     * @returns {{path: string, status: common.InstModPathStatus}}
     */
    searchInstModPath(inst) {
        // 搜索例化的模块 优先级 “当前文件” -> “include的文件” -> “其余工程文件”
        const targetModuleName = inst.type;
        // 为“其余工程文件”的扫描 提前做准备的数据结构
        const excludeFile = new Set([this.file]);

        // 搜索 “当前文件”
        for (const [name, module] of this.file.nameToModule) {
            if (targetModuleName == name) { // 如果当前文件中就有 instance 的模块，直接返回当前文件的路径
                return {path : this.getPath(), status: common.InstModPathStatus.CURRENT};      
            }
        }


        // 搜索 “include的文件”
        for (const include of this.file.marco.includes) {
            const absIncludePath = HDLPath.rel2abs(this.getPath(), include.path);
            const includeFile = HDLParam.findModuleFile(absIncludePath);
            if (includeFile) {
                excludeFile.add(includeFile);
                if (includeFile.hasModule(targetModuleName)) {
                    return {path: includeFile.path, status: common.InstModPathStatus.INCLUDE};
                }
            }
        }

        // 搜索 “其余工程文件”
        for (const moduleFile of HDLParam.getAllModuleFiles()) {
            if (!excludeFile.has(moduleFile) && moduleFile.hasModule(targetModuleName)) {
                return {path: moduleFile.path, status: common.InstModPathStatus.OTHERS};
            }
        }

        return {path: null, status: null};
    }


    solveUnhandleInstance() {
        const inst = HDLParam.findUnhandleInstanceByType(this.name);

        if (inst) {
            const userModule = inst.parentMod;
            // match a inst with the same type name of the module
            // remove from unhandle list
            HDLParam.deleteUnhandleInstance(inst);
            userModule.deleteUnhandleInstance(inst);

            // assign instModPath
            inst.instModPath = this.path;

            // judge the type of instModPathStatus
            if (userModule.path == this.path) {
                inst.instModPathStatus = common.InstModPathStatus.CURRENT;
            } else {
                const userIncludePaths = userModule.file.marco.includes.map(
                    include => HDLPath.rel2abs(userModule.path, include.path));
                if (userIncludePaths.includes(this.path)) {
                    inst.instModPathStatus = common.InstModPathStatus.INCLUDE;
                } else {
                    inst.instModPathStatus = common.InstModPathStatus.OTHERS;
                }
            }
            
            // make
            inst.locateModule();            
        }
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
        this.type = HDLFile.getModuleFileType(path);

        // process in constructor
        this.makeMarco(marco);
        this.makeNameToModule(modules);
        
        // add to global HDLParam
        HDLParam.PathToModuleFiles.set(path, this);
    }

    updateType() {
        this.type = HDLFile.getModuleFileType(this.path);
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
     * @returns {Array<Module>}
     */
    getModules() {
        const modules = [];
        for (const module of this.nameToModule.values()) {
            modules.push(module);
        }
        return modules;
    }

    /**
     * transform wasm format object to real marco object
     * @param {any} 
     * @returns {common.Marco}
     */
    makeMarco(mar) {
        if (!mar) {
            this.marco = null;
        } else {
            this.marco = new common.Marco(null, 
                                          mar.defines, 
                                          mar.includes, 
                                          mar.invalid)
        }
    }

    /**
     * @param {string} moduleName
     * @param {common.RawModule} rawModule
     * @returns {Module}
     */
    createModule(moduleName, rawModule) {
        const range = {start: rawModule.start, end: rawModule.end};

        const newModule = new Module(this,
                                     moduleName,
                                     range,
                                     rawModule.params,
                                     rawModule.ports,
                                     rawModule.instances);
        this.nameToModule.set(moduleName, newModule);
        return newModule;
    }

    /**
     * @description transfrom RawModules to Modules
     * @param {object} modules
     * @returns {Map<string, Module>}
     */
    makeNameToModule(modules) {
        this.nameToModule = new Map();
        for (const moduleName of Object.keys(modules)) {
            const rawModule = modules[moduleName];
            this.createModule(moduleName, rawModule);
        }  
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

    deleteModule(name) {
        const module = this.findModule(name);
        if (module) {
            // delete child reference in the module which use this
            for (const childInst of module.getReferInstances()) {
                const userModule = childInst.parentMod;
                childInst.module = null;
                childInst.instModPath = null;
                childInst.instModPathStatus = null;

                HDLParam.addUnhandleInstance(childInst);
                userModule.addUnhandleInstance(childInst);
            }

            // delete all the instance in the module
            for (const inst of module.getInstances()) {
                module.deleteInstance(inst);
            }

            // delete any variables containing module
            HDLParam.TopModules.delete(module);
            HDLParam.deleteSrcSimTopModule(module);
            HDLParam.Modules.delete(module);
            this.nameToModule.delete(module.name);
        }
    }


    /**
     * @description 初始化当前 文件下的每个的module的每个instance对象，必须在所有的
     * moduleFile对象初始化完调用。Instance的依赖关系会在这个函数中被初始化
     */
    makeInstance() {
        for (const module of this.getModules()) {
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