var opeParam = require("../../../param");

const fs     = require("../../HDLfilesys");
const vscode = require("vscode");

class libManage {
    constructor() {
        this.err  = vscode.showErrorMessage;
        this.warn = vscode.showWarningMessage;
        this.info = vscode.showInformationMessage;

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

    }

    /**
     * @state finish-test
     * @descriptionCn 动态的更新属性配置customer.Lib.repo.path
     * @descriptionEn Dynamic update of property configuration
     */
    getConfig() {
        this.customerPath = this.setting.get("PRJ.customer.Lib.repo.path");

        this.srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = opeParam.prjInfo.ARCH.Hardware.sim;
        this.prjPath = opeParam.prjInfo.ARCH.prjPath;

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
                    if (this.setting.get("PRJ.file.structure.notice")) {
                        let select = await this.warn("local lib will be removed.", 'Yes', 'Cancel');
                        if (select == "Yes") {
                            fs.dirs.rmdir(localLibPath);
                        }
                    } else {
                        fs.dirs.rmdir(localLibPath);
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
                    case "xilinx":
                        const xilinxPath = `${this.SourceLibPath}/xilinx/${element}`
                        fs.files.getHDLFiles(xilinxPath, libFileList);
                    break;
                    case "intel":
                        const intelPath = `${this.SourceLibPath}/intel/${element}`
                        fs.files.getHDLFiles(intelPath, libFileList);
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

class libPick {
    constructor (process) {
        this.curPath = '';
        this.curType = '';
        this.version = '@0.0.1'
        this.process = process;
        this.quickPick = null;
        this.selectItem = null;
        this.localLibPath = this.process.opeParam.rootPath + "/lib";

        this.quickPick = vscode.window.createQuickPick();

    }

    getLibInfo() {
        let description = '';
        switch (this.curType) {
            case 'common': description = this.version; break;
            case 'xilinx': description = `by xilinx ${this.version}`; break;
            case 'customer': description = `by user`; break;
            default: break;
        }
        let out = filesys.dirs.readdir(this.curPath, false, (element) => {
            return { label: element, description: `${element} library ${description}` };
        });
        out.splice(0, 0, { label: '.', description: `return to parent path` });
        out.push({ label: 'finish', description: `import all` })
        return out;
    }

    provideLibItem(name) {
        switch (name) {
            case '/':
                return [    // 选项列表
                    { label: "common",   description: `common library ${this.version}` },
                    { label: "xilinx",   description: `xilinx library ${this.version}` },
                    { label: "customer", description: "user define library" },
                ];
            case '.': 
                if (this.curPath == this.localLibPath) {
                    return this.provideLibItem('/');
                }
                this.curPath = filesys.paths.dirname(this.curPath);
                return this.getLibInfo();
            case 'common': 
                this.curType = 'common';
                this.curPath = `${this.localLibPath}/com/Hardware`; 
                return this.getLibInfo();
                
            case 'xilinx': 
                this.curType = 'xilinx';
                this.curPath = `${this.localLibPath}/xilinx/src`; 
                return this.getLibInfo();

            case 'customer': 
                this.curType = 'customer';
                this.curPath = this.process.customerlocalLibPath; 
                return this.getLibInfo();
            default: 
                this.curPath = this.curPath + '/' + name;
                if (filesys.dirs.isillegal(this.curPath)) {
                    this.processLibPath();
                    this.quickPick.dispose();
                    this.quickPick = null;
                } else {
                    return this.getLibInfo();
                }
        }
    }

    processLibPath() {
        let element = '';
        let prjInfo = this.process.opeParam.prjInfo;
        if (!prjInfo) {
            return null;
        }

        if (!prjInfo.HardwareLIB) {
            prjInfo.HardwareLIB = {};
        }
        switch (this.curType) {
            case 'common': 
                element = this.curPath.replace(`${this.localLibPath}/com/Hardware/`, ''); 
                if (!prjInfo.HardwareLIB.common) {
                    prjInfo.HardwareLIB.common = [];
                }
                prjInfo.HardwareLIB.common.push(element);
            break;
            case 'xilinx': 
                element = this.curPath.replace(`${this.localLibPath}/xilinx/src/`, '');
                if (!prjInfo.HardwareLIB.xilinx) {
                    prjInfo.HardwareLIB.xilinx = [];
                } 
                prjInfo.HardwareLIB.xilinx.push(element);
            break;
            case 'customer': 
                element = this.curPath.replace(`${this.process.customerlocalLibPath}/`, ''); 
                if (!prjInfo.HardwareLIB.customer) {
                    prjInfo.HardwareLIB.customer = [];
                }
                prjInfo.HardwareLIB.customer.push(element);
            break;
            default: break;
        }
        
        let path = this.process.opeParam.propertyPath;
        filesys.files.pushJsonInfo(path, prjInfo);
    }

    pickLibItems() {
        // let buttons = new vscode.QuickInputButtons.Back;
        // console.log(buttons);
        this.quickPick.items = this.provideLibItem('/');
        // quickPick.canSelectMany = true; // Enable checkboxes
        // Set listeners
        this.quickPick.onDidChangeSelection(items => {
            // --> Do an important action here <--
            if (items[0]) {
                this.selectItem = items[0];
            }
        });
        this.quickPick.onDidAccept(() => {
            if (this.selectItem) {
                if (this.selectItem.label == 'finish') {
                    this.processLibPath();
                    this.quickPick.dispose();
                    this.quickPick = null;
                } else {
                    this.quickPick.items = this.provideLibItem(this.selectItem.label);
                }
            }
        });
        this.quickPick.show();
    }
}