var opeParam = require("../../param");

const fs = require("../../HDLfilesys");
const vscode = require("vscode");
const HDLPath = require("../../HDLfilesys/operation/path");
const HDLFile = require("../../HDLfilesys/operation/files");
const HDLDir = require("../../HDLfilesys/operation/dirs");

const { HDLLanguageID } = require('../../HDLparser/base/common');
const { getIconConfig } = require('../../HDLfilesys/icons');


function checkPrjInfoLibrary(prjInfo) {
    if (!prjInfo.library) {
        prjInfo.library = {
            state: "",         
            Hardware: {
                common: [],
                custom: []
            }
        }
    }
}

function checkPrjInfoLibraryHardware(prjInfo) {
    checkPrjInfoLibrary(prjInfo);
    if (!prjInfo.library.Hardware) {
        prjInfo.library.Hardware = {
            common: [],
            custom: []
        }
    }
}

function appendLibraryCommonPath(path, prjInfo) {
    checkPrjInfoLibraryHardware(prjInfo);
    const prjInfoCommon = prjInfo.library.Hardware.common;
    if (!prjInfoCommon || !(prjInfoCommon instanceof Array)) {
        prjInfo.library.Hardware.common = [];
    }
    prjInfo.library.Hardware.common.push(path);
}

function appendLibraryCustomPath(path, prjInfo) {
    checkPrjInfoLibraryHardware(prjInfo);
    const prjInfoCustom = prjInfo.library.Hardware.custom;
    if (!prjInfoCustom || !(prjInfoCustom instanceof Array)) {
        prjInfo.library.Hardware.custom = [];
    }
    prjInfo.library.Hardware.custom.push(path);
}

/**
 * @state finish-untest
 * @descriptionCn library 工程管理类
 * @note 一次实例，一直使用
 */
class libManage {
    constructor() {
        this.err  = vscode.window.showErrorMessage;
        this.warn = vscode.window.showWarningMessage;
        this.info = vscode.window.showInformationMessage;

        this.config  = vscode.workspace.getConfiguration;

        this.curr = {
            'type' : null,
            'list' : [],
        };
        this.next = {
            'type' : null,
            'list' : [],
        }

        this.getConfig();
        var _this = this;
        vscode.workspace.onDidChangeConfiguration(function () {
            _this.getConfig();
        });

        vscode.commands.registerCommand('TOOL.libPick', () => {
            const pick = new libPick();
            pick.pickItems();
        })
    }

    /**
     * @state finish-test
     * @descriptionCn 动态的更新属性配置customer.Lib.repo.path
     * @descriptionEn Dynamic update of property configuration
     */
    getConfig() {
        this.customerPath = this.config().get("PRJ.custom.Lib.repo.path");

        this.srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = opeParam.prjInfo.ARCH.Hardware.sim;
        this.prjPath = opeParam.prjInfo.ARCH.PRJ_Path;

        this.localLibPath  = `${this.srcPath}/lib`;
        this.SourceLibPath = `${opeParam.rootPath}/lib`;
    }
    
    /**
     * @descriptionCn 处理library文件信息
     * @param {Object} library prjInfo中的HardwareLib属性
     * @returns {{
     *     'add' : [], // 需要处理的增加文件的数组
     *     'del' : [], // 需要处理的删除文件的数组
     * }} 
     */
    processLibFiles(library) {
        this.getConfig();
        const configFolder = HDLPath.join(opeParam.workspacePath, '.vscode');
        const commonFolder = HDLPath.join(opeParam.rootPath, 'lib', 'common', 'Apply');

        // transform to abs path
        if (library.Hardware && library.Hardware.common instanceof Array) {
            library.Hardware.common = library.Hardware.common.map(path => HDLPath.rel2abs(commonFolder, path));
        }

        if (library.Hardware && library.Hardware.custom instanceof Array) {
            library.Hardware.custom = library.Hardware.custom.map(path => HDLPath.rel2abs(configFolder, path));
        }

        // 在不设置state属性的时候默认为remote
        this.next.list = this.getLibFiles(library.Hardware);
        if (!HDLFile.isHasAttr(library, 'state')) {
            this.next.type = 'remote';
        } else {
            if (library.state !== 'remote' && library.state !== 'local') {
                return {
                    'add' : [],
                    'del' : [],
                }
            }
            this.next.type = library.state;
        }

        // 处于初始状态时的情况
        if (!this.curr.type) {
            if (HDLDir.isillegal(this.localLibPath)) {
                this.curr.type = 'local';
            } else {
                this.curr.type = 'remote';
            }
        }

        let state = `${this.curr.type}-${this.next.type}`;
        let add = [];
        let del = [];
        switch (state) {
            case 'remote-remote':
                add = HDLFile.diffElement(this.next.list, this.curr.list);
                del = HDLFile.diffElement(this.curr.list, this.next.list);
            break;
            case 'remote-local':
                // 删除的内容全是remote的，将curr的交出去即可
                del = this.curr.list;
                
                // 将新增的全部复制到本地，交给monitor进行处理
                this.remote_to_local(this.next.list, (src, dist) => {
                    HDLFile.copyFile(src, dist);
                });
            break;   
            case 'local-remote':
                // 本地的lib全部删除，交给monitor进行处理
                const fn = async () => {
                    if (HDLFile.isExist(this.localLibPath)) {
                        if (this.config().get("PRJ.file.structure.notice")) {
                            let select = await this.warn("local lib will be removed.", 'Yes', 'Cancel');
                            if (select == "Yes") {
                                HDLDir.rmdir(this.localLibPath);
                            }
                        } else {
                            HDLDir.rmdir(this.localLibPath);
                        }
                    }
                };
                fn();

                // 增加的内容全是remote的，将next的交出去即可
                add = this.next.list;
            break;
            case 'local-local':
                // 只管理library里面的内容，如果自己再localPath里加减代码，则不去管理
                add = HDLFile.diffElement(this.next.list, this.curr.list);
                del = HDLFile.diffElement(this.curr.list, this.next.list);

                this.remote_to_local(add, (src, dist) => {
                    HDLFile.copyFile(src, dist);
                });

                this.remote_to_local(del, (src, dist) => {
                    HDLFile.removeFile(dist);
                });
                add = []; del = [];
            break;
            default: break;
        }

        return {
            'add' : add,
            'del' : del,
        }
    }

    /**
     * @state finish-test
     * @descriptionCn 从配置信息中获取当前需要的库文件路径
     * @descriptionEn get all the needed lib files from property.json
     * @param {Object} library 配置参数中的HardwareLib属性 
     * @returns {Array} property.json里HardwareLib配置的所有lib文件
     */
    getLibFiles(library) {
        let libFileList = [];

        for (const key in library) {
            const libList = library[key];
            for (let i = 0; i < libList.length; i++) {
                const element = libList[i];
                switch (key) {
                    case "common":
                        const commonPath = `${this.SourceLibPath}/common/${element}`
                        HDLFile.getHDLFiles(commonPath, libFileList);
                    break;
                    case "custom":
                        if (HDLDir.isillegal(this.customerPath)) {
                            this.err(`The PRJ.custom.Lib.repo.path ${this.customerPath} do not exist or not dir.`);
                        } else {
                            const customerPath = `${this.customerPath}/${element}`
                            HDLFile.getHDLFiles(customerPath, libFileList);
                        }
                    break;
                
                    default: break;
                }
            }
        }

        // Remove duplicate HDL files
        libFileList = HDLFile.removeDuplicates(libFileList);
        return libFileList;
    }

    /**
     * @state finish-test
     * @descriptionCn 将硬件库中的源代码路径转到本地lib路径
     * @param {Array} remotes 远程库的路径
     * @param {Function} callback 回调函数，用于操作替换前后的路径
     */
    remote_to_local(remotes, callback) {
        for (let i = 0; i < remotes.length; i++) {
            const src = remotes[i];
            if (src.includes(this.customerPath)) {
                var dist = src.replace(this.customerPath, this.localLibPath);
            } else {
                var dist = src.replace(this.SourceLibPath, this.localLibPath);
            }
            callback(src, dist);
        }
    }
}
module.exports = libManage;

class libPick {
    constructor () {
        this.config = vscode.workspace.getConfiguration;
        this.commonPath = HDLPath.join(opeParam.rootPath, 'lib', 'common');
        this.customPath = HDLPath.toSlash(this.config("PRJ.custom.Lib.repo").get("path")); 

        this.commonQuickPickItem = {
            label: "$(libpick-common) common", 
            description: 'common library provided by us',
            detail: 'current path: ' + this.commonPath,
            path: this.commonPath,
            buttons: [{iconPath: getIconConfig('import'), tooltip: 'import everything in common'}]
        };

        this.customQuickPickItem = {
            label: "$(libpick-custom) custom", 
            description: 'custom library by yourself',
            detail: 'current path: ' + this.customPath,
            path: this.customPath,
            buttons: [{iconPath: getIconConfig('import'), tooltip: 'import everything in custom'}]
        };

        this.rootItems = [
            this.commonQuickPickItem,
            this.customQuickPickItem
        ];

        this.backQuickPickItem = {
            label: '...', 
            description: 'return'
        };

        this.curPath = null;
    }

    getPathIcon(path) {
        let prompt;
        if (HDLDir.isillegal(path)) {
            const langID = HDLFile.getLanguageId(path);
            if (langID == HDLLanguageID.VHDL) {
                prompt = 'vhdl';
            } else if (langID == HDLLanguageID.VERILOG ||
                       langID == HDLLanguageID.SYSTEM_VERILOG) {
                prompt = 'verilog';
            } else {
                prompt = 'unknown';
            }
        } else {
            prompt = 'folder';
        }
        return `$(libpick-${prompt})`;
    }

    /**
     * @param {string} path 
     * @param {boolean} back 
     * @returns {Array<vscode.QuickPickItem>}
     */
    makeQuicjPickItemsByPath(path, back=true) {
        const items = [];
        if (!HDLFile.isExist(path)) {
            return items;
        }
        if (back) {
            items.push(this.backQuickPickItem);
        }

        for (const fileName of HDLDir.readdir(path, false)) {
            const filePath = HDLPath.join(path, fileName);
            const themeIcon = this.getPathIcon(filePath);
            const label = themeIcon + " " + fileName;
            const mdPath = HDLPath.join(path, fileName, 'readme.md');
            const mdText = HDLFile.readFile(mdPath);
            const description = mdText ? mdText : '';
            const buttons = [{iconPath: getIconConfig('import'), tooltip: 'import everything in ' + fileName}];
            items.push({label, description, path: filePath, buttons});
        }
        return items;
    }

    /**
     * @description provide item for quickpick 
     * @param {vscode.QuickPickItem} item file/folder name of category name
     * @returns {Array<vscode.QuickPickItem>}
     */
    provideQuickPickItem(item) {
        if (!item) {
            return this.rootItems;
        } else if (item == this.backQuickPickItem) {
            if ((this.curPath == this.commonPath) || 
                (this.curPath == this.customPath)) {
                return this.rootItems;
            } else {
                // rollback the current path
                this.curPath = HDLPath.dirname(this.curPath);
            }
        } else if (item == this.commonQuickPickItem) {
            this.curPath = this.commonPath;
        } else if (item == this.customQuickPickItem) {
            this.curPath = this.customPath;
        } else {
            const label = item.label;
            const fileName = label.replace(/\$\([\s\S]*\)/, '').trim();
            this.curPath = HDLPath.join(this.curPath, fileName);
        }

        return this.makeQuicjPickItemsByPath(this.curPath);
    }

    async pickItems() {
        const pickWidget = vscode.window.createQuickPick();
        this.pickWidget = pickWidget;
        
        pickWidget.placeholder = 'pick the library';
        pickWidget.items = this.provideQuickPickItem();
        
        pickWidget.onDidChangeSelection(items => {
            // --> Do an important action here <--
            console.log('enter onDidChangeSelection');
            if (items[0]) {
                this.selectedQuickPickItem = items[0];
            }
        });

        pickWidget.onDidAccept(() => {
            console.log('enter onDidAccept');
            if (this.selectedQuickPickItem) {
                const childernItems = this.provideQuickPickItem(this.selectedQuickPickItem);
                if (childernItems && childernItems.length > 0) {
                    pickWidget.items = childernItems;
                }
            }
        });

        pickWidget.onDidTriggerItemButton(event => {
            const selectedPath = event.item.path;
            if (selectedPath && HDLFile.isExist(selectedPath)) {
                const ppyPath = HDLPath.join(opeParam.workspacePath, '.vscode', 'property.json');
                let prjInfo = null;
                if (!HDLFile.isExist(ppyPath)) {
                    prjInfo = HDLFile.pullJsonInfo(opeParam.prjInitParam);
                } else {
                    prjInfo = HDLFile.pullJsonInfo(ppyPath);
                }

                
                if (selectedPath.includes(this.commonQuickPickItem.path)) {
                    // this is a module import from common, use relative path
                    const relPath = selectedPath.replace(this.commonQuickPickItem.path + '/', '');
                    appendLibraryCommonPath(relPath, prjInfo);
                } else {
                    // this is a module import from custom, use absolute path
                    appendLibraryCustomPath(selectedPath, prjInfo);
                }
                HDLFile.pushJsonInfo(ppyPath, prjInfo);
            }
        })

        pickWidget.show();
    }
}