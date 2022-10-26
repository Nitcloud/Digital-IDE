"use strict";

const fspath = require("path");
const vscode = require("vscode");

var utils = {
    /**
     * @state finish-test
     * @descriptionCn 更新所有模块下所有模块信息 : 名字 + @ + 绝对路径
     * @param {Array} HDLparam   全局HDL文件参数
     * @returns {Array} ModuleNameList   由名字 + @ + 绝对路径组成的所有模块信息
     */
    getModuleInfoList : function(HDLparam) {
        let ModuleNameList = [];
        for (let index = 0; index < HDLparam.length; index++) {
            const unitMoudule = HDLparam[index];
            let ModuleInfo = unitMoudule.moduleName + 
                             "  @  " +
                             unitMoudule.modulePath;
            ModuleNameList.push(ModuleInfo);
        }
        return ModuleNameList;
    },

    /**
     * @state finish-test
     * @descriptionCn 根据模块信息(名字 + 绝对路径)找到对应的模块参数信息
     *                通过模块的名字和所在路径进行精确定位
     * @param {Array}  HDLparam    全局HDL文件参数
     * @param {String} ModuleInfo  待查的模块信息由(名字 + 绝对路径)组成
     * @returns {Object}  moduleInfo  输出模块的全部参数信息
     */
    findModuleFromInfo : function(HDLparam, ModuleInfo) {
        let moduleInfo = [];
        let info = ModuleInfo.split("  @  ");
        let name = info[0];
        let path = info[1];
        for (let index = 0; index < HDLparam.length; index++) {
            const unitMoudule = HDLparam[index];
            if (unitMoudule.moduleName == name && unitMoudule.modulePath.includes(path)) {
                moduleInfo.push(unitMoudule);
            }
        }
        return moduleInfo;
    },

    /**
     * @state finish-test
     * @descriptionCn 根据模块名找到对应的模块属性
     * @param {Array} HDLparam     全局HDL文件参数
     * @param {String} ModuleName  所需要的寻找的模块名
     * @param {String} property    是否只导出指定的属性
     * @param {Number} index       只输出第几个
     * @returns {Array} 所选模块的 property 属性，如果property为undefined则输出全属性
     */
    findModuleFromName : function(HDLparam, ModuleName, property, index) {
        let moduleParam = [];
        let len = HDLparam.length;
        for (let index = 0; index < len; index++) {
            const unitMoudule = HDLparam[index];
            if (unitMoudule.moduleName == ModuleName) {
                if (property) {
                    moduleParam.push(unitMoudule[property]);
                } else {
                    moduleParam.push(unitMoudule);
                }
            }
        }

        if (index) {
            return moduleParam[index];
        } else {
            return moduleParam;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 根据模块地址找到对应的模块属性
     * @param {Array}  HDLparam  全局HDL文件参数
     * @param {String} Path      所需要的寻找的模块地址
     * @param {String} property  是否只导出指定的属性
     * @returns {Array} 所选模块的 property 属性，如果property为undefined则输出全属性
     */
    findModuleFromPath : function(HDLparam, Path, property) {
        let moduleParam = [];
        let len = HDLparam.length;
        for (let index = 0; index < len; index++) {
            const unitMoudule = HDLparam[index];
            if (unitMoudule.modulePath == Path) {
                if (property == undefined) {
                    moduleParam.push(unitMoudule);
                } else {
                    moduleParam.push(unitMoudule[property]);
                }
            }
        }
        return moduleParam;
    },

    /**
     * @state finish-test
     * @descriptionCn 从所有模块信息(名字 + 绝对路径)中选择需要例化的模块进行返回，用于例化
     * @param {Array} HDLparam 全局HDL文件参数
     * @returns {Object} 对应模块所有参数
     */
     selectModuleFromAll : async function(HDLparam) {
        let allModuleInfos = this.getModuleInfoList(HDLparam);
        const selectModule = await vscode.window.showQuickPick(allModuleInfos);
        if (!selectModule) {
            return null;
        } else {
            var modules = [];
            modules = this.findModuleFromInfo(HDLparam, selectModule);
            return modules[0];
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 从当前文件中选择指定的模块，按照模块名进行选择，返回的是所选模块的所有属性。
     * @param {Array} HDLparam 全局HDL文件参数
     * @param {String} docPath  当前文档的绝对路径
     * @returns {Object} 所选模块的所有属性
     */
    selectCurrentFileModule : async function(HDLparam, docPath) {
        docPath = docPath.replace(/\\/g,"\/");
        let selectModule = null;
        let moduleList = this.findModuleFromPath(HDLparam, docPath);
        if (moduleList.length == 0) {
            vscode.window.showErrorMessage(`There is no module in ${docPath} !!!`);
        }
        else if (moduleList.length == 1) {
            selectModule = moduleList[0];
        }
        else if (moduleList.length > 1) {
            let moduleNameList = [];
            let len = moduleList.length;
            for (let index = 0; index < len; index++) {
                const element = moduleList[index];
                moduleNameList.push(element.moduleName);
            }
            let selectModuleName = await vscode.window.showQuickPick(moduleNameList, {placeHolder:"Which module you want to select?"});
            for (let index = 0; index < len; index++) {
                const element = moduleList[index];
                if (element.moduleName == selectModuleName) {
                    selectModule = element;
                    break;
                }
            }
        }
        return selectModule;
    },

    /**
     * @state finish-test
     * @descriptionCn : 获取顶层模块所需要的依赖
     * @param {Array} HDLparam 全局HDL文件参数
     * @param {Object} module  顶层模块的信息 {name, path}
     * @returns {Object} {
            inst:instmoduleFilePathList,
            include:includeFilePathList
        }
     */
    getModuleDependence : function(HDLparam, module) {
        let includeFilePathList = [];
        let instmoduleFilePathList = [];

        this.getIncludeFilePathList(HDLparam, module, includeFilePathList);
        this.getInstmoduleFilePathList(HDLparam, module, instmoduleFilePathList);

        includeFilePathList = this.removeDuplicates(includeFilePathList);
        instmoduleFilePathList = this.removeDuplicates(instmoduleFilePathList);

        // 从instmodule中去除include同名文件的部分
        let len = includeFilePathList.length;
        for (let i = 0; i < len; i++) {
            let includeFilePathElement = includeFilePathList[i];
            let index = instmoduleFilePathList.indexOf(includeFilePathElement);
            if (index != -1) {
                instmoduleFilePathList.splice(index, 1);
            }
        }

        // 
        return {
            inst:instmoduleFilePathList,
            include:includeFilePathList
        };
    },

    /**
     * @state finish-test
     * @descriptionCn  获取例化模块所在文件的列表
     * @param {Array}  HDLparam 全局HDL文件参数
     * @param {Object} module   顶层模块的信息 {name, path}
     * @param {Array} instmoduleFilePathList 待存储的数组
     */
    getInstmoduleFilePathList : function(HDLparam, module, instmoduleFilePathList) {
        let len = HDLparam.length;
        for (let i = 0; i < len; i++) {
            const unitModule = HDLparam[i];
            if (unitModule.moduleName == module.name && 
                unitModule.modulePath == module.path) {
                for (let i = 0; i < unitModule.instances.length; i++) {
                    const instanceModule = unitModule.instances[i];
                    if (instanceModule.instModPath != module.path) {
                        instmoduleFilePathList.push(instanceModule.instModPath);
                    }
                    this.getInstmoduleFilePathList(
                        HDLparam, 
                        {name:instanceModule.instModule, path:instanceModule.instModPath}, 
                        instmoduleFilePathList
                    );
                }
                break;
            }         
        }
    },
    
    /**
     * @state finish-test
     * @descriptionCn  获取include文件的列表
     * @param {Array}  HDLparam 全局HDL文件参数
     * @param {Object} module   顶层模块的信息 {name, path}
     * @param {Array} instmoduleFilePathList 待存储的数组
     */
    getIncludeFilePathList : function(HDLparam, module, includeFilePathList) {
        let len = HDLparam.length;
        for (let i = 0; i < len; i++) {
            const unitModule = HDLparam[i];
            if (unitModule.moduleName == module.name && 
                unitModule.modulePath == module.path) {
                let len = unitModule.includes.length;
                // 将相对路径整理成绝对路径
                for (let i = 0; i < len; i++) {
                    let pathElement = unitModule.includes[i];
                    includeFilePathList.push(pathElement);
                }
                len = unitModule.instances.length;
                // 递归遍历当前模块下的例化模块所包含的include文件    
                for (let i = 0; i < len; i++) {
                    const instanceModule = unitModule.instances[i];
                    this.getIncludeFilePathList(
                        HDLparam, 
                        {name:instanceModule.instModule, path:instanceModule.instModPath}, 
                        includeFilePathList
                    );
                }
                break;
            }         
        }
    },

    /**
     * @state finish-test
     * @descriptionCn  获取顶层模块的属性
     * @param {Array}  HDLparam 全局HDL文件参数
     * @param {String} type 元素类型
     * @returns {Array} 顶层模块列表
     */
    getTopElement : function(HDLparam, type){
        let TopElementList = [];
        let isTopElement = true;
        
        for (let index = 0; index < HDLparam.length; index++) {
            const currentModule = HDLparam[index];
            for (let index = 0; index < HDLparam.length; index++) {
                const unitModule = HDLparam[index];
                for (let index = 0; index < unitModule.instances.length; index++) {
                    const unitInstModule = unitModule.instances[index];
                    if (unitInstModule.instModule == currentModule.moduleName) {
                        isTopElement = false;
                        break;
                    }
                }
                if (!isTopElement) {
                    break;
                }
            }
            if (isTopElement) {
                let TopElement = {
                    "mode"   : "top",
                    "type"   : type,
                    "name"   : "",
                    "fsPath" : ""
                };
                TopElement.name   = currentModule.moduleName;
                TopElement.fsPath = currentModule.modulePath;
                TopElementList.push(TopElement);
            } else {
                isTopElement = true;
            }
        }
        return TopElementList;
    },

    /**
     * @state finish-test
     * @descriptionCn 将index格式下的范围转化为range范围格式
     * @param {String} text  文本内容
     * @param {Object} index index格式的范围{
            "startIndex" : startIndex,
            "lastIndex"  : lastIndex,
        }
     * @returns {Object} range = {
            "start" : {"line":line, "character":character},
            "end"   : {"line":line, "character":character},
        }
     */
    index_to_range : function (text, index) {
        let lines = text.split('\n');
        let line = 0;
        let offset = 0;
        let range = {
            "start" : {line:0, character:0},
            "end"  : {line:0, character:0},
        };
        while (1) {
            offset += lines[line].length + 1; 
            if (offset > index.startIndex) {
                break;
            }
            line++;
        }
        range.start.line = line;
        range.start.character = index.startIndex + lines[line].length - offset + 1;

        while (1) {
            if (offset > index.lastIndex) {
                break;
            }
            line++;
            offset += lines[line].length + 1; 
        }
        range.end.line = line;
        range.end.character = index.lastIndex + lines[line].length - offset + 1;

        return range;
    },

    position_to_index(text, position) {
        let text_splice = text.split('\n');
        let character_index = 0;
        for (let i = 0; i < position.line; ++i) {
            character_index += text_splice[i].length + 1;
        }
        character_index += position.character;
        return character_index;
    },
}
module.exports = utils;