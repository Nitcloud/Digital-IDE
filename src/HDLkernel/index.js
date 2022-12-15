const os = require('os');
const fs = require("../HDLfilesys");

const kernel = require("./kernel/kernel");

class operation {
    constructor() {
        this.kernel = null;
    }

    async launch() {
        this.kernel = await kernel(); 
        fs.vrfs.module = this.kernel;
    }

    /**
     * @state finish-test
     * @descriptionCn 直接执行指令
     * @param {String} command 
     */
    exec(command) {
        this.vrfs.module.ccall('run', '', ['string'], [command]);
    }

    /**
     * @state finish-test
     * @descriptionCn 输出帮助界面
     */
    printHelp() {
        this.vrfs.module.TTY.message = '';
        this.exec("help");
        return this.vrfs.module.TTY.message;
    }

    /**
     * @state finish-test
     * @descriptionCn 设置内置log输出的使能
     * @param {Boolean} params (true : 打开内置log输出 | false : 关闭内置log输出)
     */
    setInnerOutput(params) {
        this.vrfs.module.TTY.innerOutput = params;
    }

    /**
     * @state finish-test
     * @descriptionCn 设置message的回调函数
     * @param {*} callback 对message操作的回调函数
     */
    setMessageCallback(callback) {
        this.vrfs.module.TTY.innerOutput = false;
        this.vrfs.module.TTY.callbackOutput = true;
        this.vrfs.module.TTY.callback = callback;
    }

    /**
     * @state finish-test
     * @descriptionCn 导入文件到工程之中(仅适用于nodefs) 默认支持sv且覆盖
     * @param {Array} files 数组形式输入 输入所需导入工程的文件数组
     * @returns {String} 导入过程中所输出的日志(仅适用与message回调关闭的时候)
     */
    load(files) {
        this.module.TTY.message = "";
        const command = 'read_verilog -sv -formal -overwrite';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (os.platform().toLowerCase() === 'win32') {
                this.exec(`${command} /${file}`);
            } else {
                this.exec(`${command} /host/${file}`);
            }
        }

        return this.module.TTY.message;
    }

    synth(options) {
        options.argu = options.argu ? options.argu : '';
        let command = '';
        switch (options.type) {
            case 'json':
                command = 'write_json';
            break;
            case 'verilog':
                command = 'write_verilog';
            break;
            case 'aiger':
                command = 'write_aiger';
            break;
            case 'blif':
                command = 'write_blif';
            break;
            case 'edif':
                command = 'write_edif';
            break;
            default: break;
        }
        this.exec(`${command} ${options.argu} /${options.path}`);
    }

    /**
     * @descriptionCn 以指定的模式导出设计
     * @param {Object} options {
     *      path : '' // 在虚拟文件系统中存放的路径
     *      type : '' // 指定的模式
     *      argu : '' // 指定导出的参数
     * }
     * @returns {String} 设计的内容
     */
    export(options) {
        options.path = options.path ? options.path : 'output';
        options.argu = options.argu ? options.argu : '';

        let command = '';
        switch (options.type) {
            case 'json':
                command = 'write_json';
            break;
            case 'verilog':
                command = 'write_verilog';
            break;
            case 'aiger':
                command = 'write_aiger';
            break;
            case 'blif':
                command = 'write_blif';
            break;
            case 'edif':
                command = 'write_edif';
            break;
            default: break;
        }
        this.exec(`${command} ${options.argu} /${options.path}`);
        return this.vrfs.readFileToText(options.path);
    }

    reset() {
        this.exec('design -reset');
    }

    exit() {
        this.kernel = null;
        fs.vrfs.module = null;
    }
}
module.exports = operation;