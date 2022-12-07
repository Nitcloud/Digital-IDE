const assert = require("assert");
const vscode = require('vscode');

const constant = require('./constant');
const marco = require('./marco');
const util = require('../util');

const HdlParam = {    
    TopModules : new Set(),             // Set<Module>
    NameToModuleFiles : new Map(),      // Map<string, ModuleFile>
    Modules : new Set(),                // all the modules Set<Module>

    _moduleRefCache : new Map(),        // Map<string, Instance>

    
    /**
     * @description 找到对应的 ModuleFile
     * @param {string} path
     * @returns {ModuleFile} 
     */
    findModuleFile(path) {
        return this.NameToModuleFiles.get(path);
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
        let mod = moduleFile.findModule(name);
        return Boolean(mod);
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
        let mod = moduleFile.findModule(name);
        assert(mod, 'cannot find module "' + name + '" in file ' + path);
        return mod;
    },


    /**
     * @description 根据 path 和 name 删除对应的module
     * @param {*} path 
     * @param {*} name 
     */
    deleteModule(path, name) {
        let moduleFile = this.NameToModuleFiles.get(path);
        if (this.hasModule(path, name)) {
            let mod = this.findModule(path, name);

            // 删除包含 module 的任何容器
            moduleFile.nameToModule.delete(mod.name);
            this.TopModules.delete(mod);
            this.Modules.delete(mod);
        }
    },


    /**
     * @description 根据 path 和 name判断当前的module是否为顶层模块
     * @param {string} path 
     * @param {string} name 
     * @returns {boolean}
     */
    isTopModule(path, name) {
        let mod = this.findModule(path, name);
        return this.TopModules.has(mod);
    },


    /**
     * @description 以列表的形式返回所有注册的 module 对象
     * @returns {Array<Module>}
     */
    getAllModules() {
        let modules = [];
        for (const mod of this.Modules) {
            modules.push(mod);
        }
        return modules;
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
     * @param {*} path 
     * @param {*} json 
     * @returns {ModuleFile}
     */
    InitByWasmJSON(path, json) {
        let moduleFile = new ModuleFile(path,
                                        json.languageId,
                                        json.marco,
                                        json.modules);
        return moduleFile;
    },


    /**
     * @description 从HdlParam中去除 path 代表的文件相关的属性
     * @param {string} path 
     */
    deleteModuleFile(path) {
        const moduleFile = this.findModuleFile(path);
        if (moduleFile) {
            for (const [moduleName, mod] of moduleFile.nameToModule) {
                this.deleteModule(path, moduleName);
            }
            this.NameToModuleFiles.delete(path);
        }
    },




    // getModuleInfoList() {
    //     const module
    // }


    
};





class ModPort {
    /**
     * @param {string} name                     port名
     * @param {constant.PortType} type          port的类型，必须是PortType类型的枚举量
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
     * @param {constant.ParamType} type           param的类型
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
     * @param {*} instModInfo                           实例模块信息
     * @param {string} instModPath                      实例模块路径
     * @param {vscode.Range} instparams                 params起始
     * @param {vscode.Range} instports                  ports起始
     */
    constructor(name, type, instModInfo, instModPath, instparams, instports) {
        this.name = name;
        this.type = type;
        
        // two range, duck type
        this.instparams = instparams;
        this.instports = instports;
        
        // find module according to HdlParam
        this.module = HdlParam.findModule(instModPath, type);
        
        if (!this.module) {     // 如果没有module，那么就加入cache中，等待目标被创建
            const cache = HdlParam._moduleRefCache;

            let moduleID = util.makeModuleID(instModPath, type);
            if (!cache.has(moduleID)) {
                cache.set(moduleID, [])
            }
            cache.get(moduleID).push(this);            

        } else {
            // add refer to this.module
            this.addToModuleRefer(this.module);
        }
    }

    /**
     * 将当前的Instance对象加入目标 module 的 refers 中
     * @param {Module} targetModule 
     */
    addToModuleRefer(targetModule) {
        targetModule.refers.add(this);
        if (HdlParam.TopModules.has(targetModule)) {
            HdlParam.TopModules.delete(targetModule);
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
     * @param {any[]} instances             Module内部使用的实例化模块
     */
    constructor(file, name, range, params, ports, instances) {
        this.file = file;
        this.name = name;
        this.range = range;
        this.path = file.path;
        
        this.params = this.makeModParams(params);
        this.ports = this.makeModPort(ports);
        this.nameToInstances = this.makeNameToInstances(instances);

        // 默认情况下刚刚创建时将当前的Module加入
        HdlParam.TopModules.add(this);
        HdlParam.Modules.add(this);

        // refers 代表实例化了这个Module的所有的Instance对象
        this.refers = new Set();

        // 检查 HdlParam的cache中是否存在对于该类ID的Instance
        this.checkHdlParamCache();
    }


    setFile(moduleFile) {
        assert(moduleFile instanceof ModuleFile);
        this.file = moduleFile;
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
     * @param {*} params 
     * @returns {Array<ModParam>}
     */
    makeModParams(params) {
        let new_params = [];
        for (const param of params) {
            let range = new vscode.Range(param.start, param.end);
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
     * @param {*} ports 
     * @returns {Array<ModPort>}
     */
    makeModPort(ports) {
        let new_ports = [];
        for (const port of ports) {
            let range = new vscode.Range(port.start, port.end);
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
     * @param {*} instances 
     * @returns {Map<string, Instance>}
     */
    makeNameToInstances(instances) {
        let nameToInstances = new Map();
        for (const inst of instances) {
            let new_inst = new Instance(inst.name,
                                        inst.type,
                                        inst.instModInfo,
                                        inst.instModPath,
                                        inst.instparams,
                                        inst.instports)
            nameToInstances.set(inst.name, new_inst);
        }
        return nameToInstances;
    }

    checkHdlParamCache() {
        const moduleID = util.makeModuleID(this.getPath(), this.name);
        const cache = HdlParam._moduleRefCache;
        if (cache.has(moduleID)) {
            cache.get(moduleID).forEach(inst => {
                inst.addToModuleRefer(this);
            });
            cache.delete(moduleID);
        }
    }
};


class ModuleFile {
    /**
     * @param {string} path 
     * @param {string} languageId 
     * @param {marco.Marco} marco 
     * @param {Map<string, Module>} nameToModule 
     */
    constructor(path, languageId, marco, modules) {
        this.path = path;
        this.languageId = languageId;

        // process in constructor
        this.marco = this.makemarco(marco);
        this.nameToModule = this.makeNameToModule(modules);
        
        // add to global HdlParam
        HdlParam.NameToModuleFiles.set(path, this);
    }

    /**
     * transform wasm format object to real marco object
     * @param {any} 
     * @returns {marco.Marco}
     */
    makemarco(mar) {
        if (mar instanceof marco.Marco) {
            return mar;
        } else {
            let real_marco = new marco.Marco(null, 
                                             mar.defines, 
                                             mar.includes, 
                                             mar.invalid);
            return real_marco;
        }
    }

    /**
     * transform wasm format object to real Module object
     * @param {any[]} 
     * @returns {Map<string, Module>}
     */
    makeNameToModule(modules) {
        // transform any[] to Module[]
        let module_names = Object.keys(modules);
        if (module_names.length > 0 && !(modules[module_names[0]] instanceof Module)) {
            for (const module_name of module_names) {
                let mod = modules[module_name];
                // generate range
                let range = new vscode.Range(mod.start, mod.stop);

                // replace the original object with a Module object
                modules[module_name] = new Module(this,
                                                   module_name,
                                                   range,
                                                   mod.params,
                                                   mod.ports,
                                                   mod.instances)
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
     * find specific module
     * @param {string} name
     * @returns {Module} 
     */
    findModule(name) {
        let module = this.nameToModule.get(name);
        return module;
    }
};


module.exports = {
    ModPort,
    ModParam,
    Module,
    ModuleFile,
    HdlParam
};