"use strict";

const vscode = require("vscode");
const filesys = require("HDLfilesys");
const utils = require("./utils/utils");
exports.utils = utils;

const vlogParser = require("./src/main/vlog/vlogParser");
const vhdlParser = require("./src/main/vhdl/vhdlParser");

// const vlogParser = require("./parser_RegExp/vlogParser");
// const vhdlParser = require("./parser_RegExp/vhdlParser");
exports.vlogParser = vlogParser;
exports.vhdlParser = vhdlParser;

class indexer {
    constructor() {
        this.HDLparam = [];
        this.vlog = new vlogParser();
        this.vhdl = new vhdlParser();
    };

    /**
     * @state finish-test
     * @descriptionCn 全局检索构建函数
     * @param {Array} files 需要解析的文件
     */
    async build_index(files, type) {
        if (!files.length) {
            return null;
        }
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `The progress of parse ${type} HDL Files...`,
            cancellable: false
        }, async (progress) => {
            // 初始化进度
            await Promise.all(files.map(async (path, index) => {
                let increment = (index / files.length)*100;
                try {
                    progress.report({ increment: increment, message: `${index} @ ${path}` });
                    console.log(`${index}\n@ ${path}`);
                    this.processFile(path);
                } catch (error) {
                    console.log(`${error}\n@ ${path}`);
                }
            }));
            this.refreshInstModulePath();
        });
    }

    /**
     * @state finish-test
     * @descriptionCn  单文件处理解析函数
     * @param {String} path 所要处理的文件路径 
     */
    processFile(path) {
        let text = filesys.files.readFile(path);
        if (!text) {
            return null;
        }

        let languageId = utils.getLanguageId(path);
        let option = {
            text : text + '\n',
            path : path,
            isFast : true,
            isPreProcess : true,
            // symbol : null,
        }

        switch (languageId) {
            case "verilog":
            case "systemverilog":    
                this.HDLparam = this.vlog.getFileParam(option, this.HDLparam);
            break;

            case "vhdl":    
                this.HDLparam = this.vhdl.getFileParam(option, this.HDLparam);
            break;

            default: break;
        }

        return this.HDLparam;
    }

    /**
     * @state finish-test
     * @descriptionCn 从HDLparam数组中去除掉当前文件相关的属性
     * @param {String} currentFilePath 当前文件路径
     */
    removeCurrentFileParam(currentFilePath) {
        for (let index = 0; index < this.HDLparam.length; ) {
            const HDLelement = this.HDLparam[index];
            if (HDLelement.modulePath == currentFilePath) {
                this.HDLparam.splice(index,1);
            } else{
                index++;
            }
        }
    }

    /**
     * @state finish-test
     * @descriptionCn 刷新HDLparam数组中所有模块间的依赖关系
     * @note 支持include的依赖
     */
    refreshInstModulePath() {
        let len = this.HDLparam.length;
        for (let i = 0; i < len; i++) {
            // 每个模块
            const unitMoudule = this.HDLparam[i];
            let instLen = unitMoudule.instances.length;
            for (let x = 0; x < instLen; x++) {
                // 每个模块下的例化模块
                const unitInstanceModule = unitMoudule.instances[x];

                // 首先遍历include文件
                let isExistInclude = false;
                for (let y = 0; y < unitMoudule.includes.length; y++) {
                    const unitInclude = unitMoudule.includes[y];
                    const includeModule = utils.findModuleFromPath(this.HDLparam, unitInclude, "moduleName");
                    if (includeModule.includes(unitInstanceModule.instModule)) {
                        unitInstanceModule.instModPath = unitInclude;
                        isExistInclude = true;
                        break;
                    }
                }

                // 如果不在include中则进行全局遍历
                let isExist = false;
                if (!isExistInclude) {
                    for (let z = 0; z < len; z++) {
                        const unitHDLFileElement = this.HDLparam[z];
                        if (unitInstanceModule.instModule == unitHDLFileElement.moduleName) {
                            unitInstanceModule.instModPath = unitHDLFileElement.modulePath;
                            isExist = true;
                            break;
                        }
                    }
                }

                // 如果全局还不存在则设置为空
                if (!isExist && !isExistInclude) {
                    unitInstanceModule.instModPath = '';
                }
            }
        }
    }
}
exports.indexer = indexer;