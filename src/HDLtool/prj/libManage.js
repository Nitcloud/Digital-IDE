const fs = require("../../HDLfilesys");
const vscode = require("vscode");

class libManage {
    constructor(opeParam, monitor) {
        this.opeParam = opeParam;
        this.srcPath = this.opeParam.prjStructure.HardwareSrc;
        this.simPath = this.opeParam.prjStructure.HardwareSim;
        this.prjPath = this.opeParam.prjStructure.prjPath;

        this.localLibPath  = `${this.srcPath}/lib`;
        this.SourceLibPath = `${this.opeParam.rootPath}/lib`;

        this.watcherHDL = monitor.watcherHDL;

        this.getConfig();
        var _this = this;
        vscode.workspace.onDidChangeConfiguration(function () {
            _this.getConfig();
        });

    }

    /**
     * @state finish-test
     * @descriptionCn 动态的更新属性配置
     * @descriptionEn Dynamic update of property configuration
     */
    getConfig() {
        this.customerPath = this.setting.get("PRJ.customer.Lib.repo.path");
    }
    
    async processLibFiles() {
        let delLibFileList = [];
        let addLibFileList = [];

        this.newLibFileList = this.getLibFiles();

        // 将硬件库中的源代码复制到本地中去 (与原本地lib文件进行校对删除多余的，添加新增的)
        if (files.isHasValue(this.opeParam.prjInfo, "HardwareLIB.state", "real")) {
            // 将本地lib的路径转换成扩展硬件库下的路径，方便与newLibFileList进行对比
            // 仅当real类型下的时候应该以本地为准，才要将转换后的更新为 oldLibFileList 
            this.oldLibFileList = this.turn_local_to_lib(localLibPath);

            // 将 oldLibFileList 与 newLibFileList 进行对比
            delLibFileList = this.get_del_LibFileList();
            addLibFileList = this.get_add_LibFileList();

            this.turn_lib_to_local(localLibPath, delLibFileList, (src, dist) => {
                files.removeFile(dist);
            })
            delLibFileList = [];

            this.turn_lib_to_local(localLibPath, addLibFileList, (src, dist) => {
                files.copyFile(src, dist);
            })
            addLibFileList = [];

            this.oldLibFileList = [];
        } 
        else if (files.isHasValue(this.opeParam.prjInfo, "HardwareLIB.state", "virtual")) {
            delLibFileList = this.get_del_LibFileList();
            addLibFileList = this.get_add_LibFileList();

            this.watcherHDL.add(addLibFileList);
            this.watcherHDL.unwatch(delLibFileList);

            this.addFilesInPrj(addLibFileList);
            this.delFilesInPrj(delLibFileList);
            
            if (fs.existsSync(localLibPath)) {
                if (this.setting.get("PRJ.file.structure.notice")) {
                    let select = await this.warn("The local lib folder will be deleted.", 'Yes', 'Cancel');
                    if (select == "Yes") {
                        dirs.rmdir(localLibPath);
                    }
                } else {
                    dirs.rmdir(localLibPath);
                }
            }

            // 从HDLparam中删除用不到的lib文件
            for (let i = 0; i < delLibFileList.length; i++) {
                const elementPath = delLibFileList[i];
                this.indexer.removeCurrentFileParam(elementPath);
            }
        
            this.oldLibFileList = this.newLibFileList;
            
            // 向HDLparam中添加新lib文件
            this.indexer.build_index(addLibFileList, 'lib');
            if (this.treeView) {
                this.treeView.refresh();
            }
        }
    }

    /**
     * @state finish-test
     * @descriptionCn 从配置信息中获取当前需要的库文件路径
     * @descriptionEn get all the needed lib files from property.json
     * @param {Object} opeParam 全局运行参数 
     * @returns {Array} property.json里配置的所有lib文件
     */
    getLibFiles(opeParam) {
        let libFileList = [];

        if (!fs.files.isHasAttr(opeParam.prjInfo, "HardwareLIB")) {
            return libFileList;
        }

        for (const key in opeParam.prjInfo.HardwareLIB) {
            const libList = opeParam.prjInfo.HardwareLIB[key];
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
     * @descriptionCn 将 old 与 new 进行对比，将不需要的进行删除
     * @descriptionEn delete the lib file from old lib file list
     * @returns The lib file to delete
     */
    get_del_LibFileList() {
        let delLibFileList = [];
        for (let i = 0; i < this.oldLibFileList.length; i++) {
            const oldLibFileElement = this.oldLibFileList[i];
            if (!this.newLibFileList.includes(oldLibFileElement)) {
                delLibFileList.push(oldLibFileElement);
            }
        }
        return delLibFileList;
    }

    /**
     * CN: 将 new 与 old 进行对比，将不需要的进行删除
     * EN: add the lib file from new lib file list
     * @returns The lib file to add
     */
    get_add_LibFileList() {
        let addLibFileList = [];
        for (let i = 0; i < this.newLibFileList.length; i++) {
            const newLibFileElement = this.newLibFileList[i];
            if (!this.oldLibFileList.includes(newLibFileElement)) {
                addLibFileList.push(newLibFileElement);
            }
        }
        return addLibFileList;
    }

    /**
     * CN: 将本地lib路径转到硬件库的源代码路径
     * @param {*} localLibPath  工作区存放lib的路径
     * @returns 将工作区的路径转成扩展硬件库的路径
     */
    turn_local_to_lib(localLibPath) {
        let libFiles = [];
        let localLibFiles = [];

        // 获取原本地lib文件夹下的所有HDL文件
        // TODO: 可以尝试使用Map的key进行快速提取，无需重新解析
        this.getHDLFiles(localLibPath, localLibFiles);

        // 遍历本地lib下的所有源文件，并且进行路径的转换
        for (let i = 0; i < localLibFiles.length; i++) {
            const localLibElement = localLibFiles[i];
            if (localLibElement.indexOf("customer") != -1) {
                libFiles.push(localLibElement.replace(`${localLibPath}/customer`, this.customerlocalLibPath));
            } else {
                // 已经保留了 src_lib、xilinx_lib 等文件夹的声明
                libFiles.push(localLibElement.replace(localLibPath, this.localLibPath));
            }
        }
        return libFiles;
    }

    /**
     * @state finish-test
     * @descriptionCn 将硬件库中的源代码路径转到本地lib路径
     * @param {*} localLibPath 
     * @param {*} libFiles 
     * @param {*} callback 
     */
    turn_lib_to_local(localLibPath, libFiles, callback) {
        let localLibFiles = [];

        // 遍历硬件库中的源代码从而进行目标地址的生成
        for (let i = 0; i < libFiles.length; i++) {
            const libFileElement = libFiles[i];
            let dist = "";
            if (libFileElement.includes(this.localLibPath)) {
                dist = libFileElement.replace(this.localLibPath, localLibPath);
                localLibFiles.push(dist);
            }
            else if (libFileElement.includes(this.customerlocalLibPath)) {
                dist = libFileElement.replace(this.customerlocalLibPath, `${localLibPath}/customer`);
                localLibFiles.push(dist);
            } 
             
            let src  = libFileElement;
            callback(src, dist);
        }

        return localLibFiles;
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
                    { label: "common", description: `common library ${this.version}` },
                    { label: "xilinx", description: `xilinx library ${this.version}` },
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
        this.quickPick = vscode.window.createQuickPick();
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