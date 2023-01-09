var opeParam = require("../../param");

const fs = require("../../HDLfilesys");
const vscode = require("vscode");

/**
 * @state finish-untest
 * @descriptionCn library 工程管理类
 * @note 一次实例，一直使用
 */
class libManage {
    constructor() {
        this.err  = vscode.showErrorMessage;
        this.warn = vscode.showWarningMessage;
        this.info = vscode.showInformationMessage;

        this.set  = vscode.workspace.getConfiguration;

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
        this.customerPath = this.set().get("PRJ.customer.Lib.repo.path");

        this.srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = opeParam.prjInfo.ARCH.Hardware.sim;
        this.prjPath = opeParam.prjInfo.ARCH.PRJ_Path;

        this.localLibPath  = `${this.srcPath}/lib`;
        this.SourceLibPath = `${opeParam.rootPath}/lib`;
    }
    
    /**
     * @descriptionCn 处理library文件信息
     * @param {Object} library prjInfo中的HardwareLib属性
     * @returns {Object} {
     *     'add' : [], // 需要处理的增加文件的数组
     *     'del' : [], // 需要处理的删除文件的数组
     * }
     */
    async processLibFiles(library) {
        this.getConfig();
        // 在不设置state属性的时候默认为remote
        this.next.list = this.getLibFiles(library.Hardware);
        if (!fs.files.isHasAttr(library, 'state')) {
            this.next.type = 'remote';
        } else {
            if (library.state !== 'remote' && library.state !== 'local') {
                this.err("HardwareLib.state was wrong!!")
                return {
                    'add' : [],
                    'del' : [],
                }
            }
            this.next.type = library.state;
        }

        // 处于初始状态时的情况
        if (!this.curr.type) {
            if (fs.dirs.isillegal(this.localLibPath)) {
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
                add = fs.files.diffElement(this.curr.list, this.next.list);
                del = fs.files.diffElement(this.next.list, this.curr.list);
            break;
            case 'remote-local':
                // 删除的内容全是remote的，将curr的交出去即可
                del = this.curr.list;
                
                // 将新增的全部复制到本地，交给monitor进行处理
                this.remote_to_local(this.next.list, (src, dist) => {
                    fs.files.copyFile(src, dist);
                });
            break;   
            case 'local-remote':
                // 本地的lib全部删除，交给monitor进行处理
                if (fs.files.isExist(this.localLibPath)) {
                    if (this.set().get("PRJ.file.structure.notice")) {
                        let select = await this.warn("local lib will be removed.", 'Yes', 'Cancel');
                        if (select == "Yes") {
                            fs.dirs.rmdir(this.localLibPath);
                        }
                    } else {
                        fs.dirs.rmdir(this.localLibPath);
                    }
                }

                // 增加的内容全是remote的，将next的交出去即可
                add = this.next.list;
            break;
            case 'local-local':
                // 只管理library里面的内容，如果自己再localPath里加减代码，则不去管理
                add = fs.files.diffElement(this.curr.list, this.next.list);
                del = fs.files.diffElement(this.next.list, this.curr.list);

                this.remote_to_local(add, (src, dist) => {
                    fs.files.copyFile(src, dist);
                });

                this.remote_to_local(del, (src, dist) => {
                    fs.files.removeFile(dist);
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
                        fs.files.getHDLFiles(commonPath, libFileList);
                    break;
                    case "customer":
                        if (fs.dirs.isillegal(this.customerPath)) {
                            this.err(`The PRJ.customer.Lib.repo.path ${this.customerPath} do not exist or not dir.`);
                        } else {
                            const customerPath = `${this.customerPath}/${element}`
                            fs.files.getHDLFiles(customerPath, libFileList);
                        }
                    break;
                
                    default: break;
                }
            }
        }

        // Remove duplicate HDL files
        libFileList = fs.files.removeDuplicates(libFileList);
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
        this.set  = vscode.workspace.getConfiguration;
        this.config = {
            'common' : `${opeParam.rootPath}/lib/common`,
            'custom' : this.set("PRJ.customer.Lib.repo").get("path"),
        };
        this.start = [
            {label: "common", description: fs.files.readFile(this.config.common+'/readme.md')},
            {label: "custom", description: `custom library by yourself`}
        ];
        this.curPath = '/';
    }

    provide(item) {
        if (item == '..') {
            if ((this.curPath == this.config.common) || (this.curPath == this.config.custom)) {
                return this.start;
            } else {
                this.curPath = fs.paths.dirname(this.curPath);
                return this.provide(this.curPath);
            }
        }
        
        if (item == "/") {
            return this.start;
        } else if (item == "common") {
            this.curPath = this.config.common;
        } else if (item == "custom") {
            this.curPath = this.config.custom;
        } else {
            this.curPath = `${this.curPath}/${item}`;
        }

        let res = [{
            label: "..", 
            description: 'return to last'
        }];
        const list = fs.dirs.readdir(this.curPath, false);
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const description = fs.files.readFile(`${this.curPath}/${element}/readme.md`);
            res.push({
                label : element,
                description : description ? description : ''
            })
        }
        return res;
    }

    pickItems() {
        this.pick = vscode.window.createQuickPick();
        this.pick.items = this.provide('/');

        this.pick.onDidChangeSelection(items => {
            // --> Do an important action here <--
            if (items[0]) {
                this.select = items[0];
            }
        });

        this.pick.onDidAccept(() => {
            if (this.select) {
                this.pick.items = this.provide(this.select.label);
            }
        });


        this.pick.show();
    }
}