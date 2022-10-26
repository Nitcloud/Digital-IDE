"use strict";
/**
 * 实现方式：静态类
 * 输入格式：斜杠路径
 */
const fs = require("fs");
const paths = require("./path");

// const 
var fileOperation = {
    log : console.log,

    /**
     * @state finish-test
     * @descriptionCn 非法性检查 存在且为file
     * @descriptionEn Illegality check
     * @param {string} path 
     * @returns {boolean} (true: illegal | false: legal)
     */
    isillegal : function (path) {
        if (!fs.existsSync(path)) {
            return true;
        }

        let state = fs.statSync(path);
        if (state.isDirectory()) {
            return true;
        }
        return false;
    },

    /**
     * @state finish-test
     * @descriptionCn 检查该地址对应的文件是否存在
     * @param {String} path 文件地址
     * @returns {Boolean} (true : 存在 | false : 不存在)
     */
    isExist : function (path) {
        if (fs.existsSync(path)) {
            return true;
        }
        return false;
    },

    /**
     * @state finish-test
     * @descriptionCn Remove duplicate element form the array
     * @param {Array} array the array need to be removed duplicate element
     * @returns {Array} the array without duplicate element
     */
    removeDuplicates(array) {
        let h = {};
        let arr = [];
        let len = array.length;
        for (let index = 0; index < len; index++) {
            if(!h[array[index]]){
                arr.push(array[index]);
            }
        }
        return arr;
    },

    /**
     * @state finish-test
     * @descriptionCn 读取文件内容
     * @param {String} path 文件的绝对地址 ('/'分隔)
     * @returns {String | Boolean} (文件内容 | false 读取失败)
     */
    readFile : function (path) {
        if (this.isillegal(path)) {
            return false;
        }

        try {
            let content = fs.readFileSync(path, "utf-8");
            return content;
        } catch (error) {
            return false;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 向文件中写入内容
     * @param {String} path 文件的绝对地址 ('/'分隔)
     * @returns {String | Boolean} (文件内容 | false 读取失败)
     */
    writeFile : function (path, content) {
        try {
            let parent = paths.dirname(path);
            fs.mkdirSync(parent, {recursive:true});
            fs.writeFileSync(path, content);
            return true;
        } catch (error) {
            this.log(error);
            return false;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 删除指定文件
     * @param {String} path 文件的绝对地址 ('/'分隔)
     * @returns {Boolean} (true:成功 | false:失败)
     */
    removeFile : function (path) {
        // 如果不存在或者为dir则直接退出
        if (this.isillegal(path)) {
            return false;
        }

        try {
            fs.unlinkSync(path);
        } catch (error) {
            this.log(error);
            return false;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 移动文件
     * @param {String} src 文件的绝对地址  - 源地址 ('/'分隔)
     * @param {String} dest 文件的绝对地址 - 目的地址 ('/'分隔)
     * @param {Boolean} cover true:覆盖 | false:不覆盖
     * @returns {Boolean} (true:成功 | false:失败)
     */
    moveFile : function (src, dest, cover) {
        if (src == dest) {
            return false;
        }

        // 如果不存在或者不为dir则直接退出
        if (this.isillegal(src)) {
            return false;
        }

        if (!cover) {
            cover = true;
        }
        
        this.copyFile(src, dest, cover);
        try {
            fs.unlinkSync(src);
        } catch (error) {
            this.log(error);
            return false;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 复制文件
     * @param {String} src 文件的绝对地址  - 源地址 ('/'分隔)
     * @param {String} dest 文件的绝对地址 - 目的地址 ('/'分隔)
     * @param {Boolean} cover true:覆盖 | false:不覆盖
     * @returns {Boolean} (true:成功 | false:失败)
     */
    copyFile : function (src, dest, cover) {
        if (src == dest) {
            return false;
        }

        // 如果不存在或者不为dir则直接退出
        if (this.isillegal(src)) {
            return false;
        }

        if (!cover) {
            cover = true;
        }

        try {
            let parent = paths.dirname(dest);
            fs.mkdirSync(parent, {recursive:true});
            if (!fs.existsSync(dest)) {
                fs.copyFileSync(src,dest);
            } else {
                if (cover) {
                    fs.copyFileSync(src,dest);
                }
            }
            return true;
        } catch (error) {
            this.log(error);
            return false;
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 从指定文件夹下过滤出指定的要求的文件
     * @param {String}   path 文件夹的绝对地址 ('/'分隔) 同时支持文件夹和单文件
     * @param {Function} callback 过滤函数传参为(file)单个文件路径
     * @param {Object}   options {
                type : "once", // once:只一级文件搜索 | all:所有文件搜索
                ignores : []   // 要忽视的文件所在的文件夹(绝对路径)
            };
     * @returns {Array} 返回满足要求的文件数组
     */
    filter : function (path, callback, options) {
        // 检查 file path 是否存在
        if (!fs.existsSync(path)) {
            return [];
        }

        let output = [];
        if (!options) {
            var options = {
                type : "once",
                ignores : []
            };
        } else {
            if (!options.type) {
                options.type = "once";
            }
    
            if (!options.ignores) {
                options.ignores = [];
            }
        }

        // 检查 file path 是否是文件夹
        let state = fs.statSync(path);
        if (!state.isDirectory()) {
            if (this.isIgnore(options.ignores, path)) {
                return [];
            }
            let result = callback(path);
            if (result) {
                output.push(result);
            }

            return output;
        }

        let files = fs.readdirSync(path);
        
        // 递归遍历该文件夹下的所有满足条件的文件
        // 开始遍历
        for (let i = 0; i < files.length; i++) {
            const file = files[i]; 
            // 如果是合法文件(存在且为文件)
            if (!this.isillegal(`${path}/${file}`)) {
                if (this.isIgnore(options.ignores, `${path}/${file}`)) {
                    continue;
                }
                let result = callback(`${path}/${file}`);
                if (result) {
                    output.push(result);
                }
            } 
            
            if (options.type === "all") {
                // 默认全是存在的，既然不是文件就是文件夹
                output.push(...(this.filter(`${path}/${file}`, callback, options)));
            }
        }
        
        return output;
    },

    /**
     * @state finish-test
     * @descriptionCn 从指定文件夹下找到指定后缀名的文件
     * @param {String} path 文件夹的绝对地址 ('/'分隔)
     * @param {Object} options {
                exts : [] | "" // 可以是数组(多个后缀)，也可以是字符串(单个后缀)
                type : "once", // once:只一级文件搜索 | all:所有文件搜索
                ignores : []   // 要忽视的文件所在的文件夹(绝对路径)
            };
     * @returns {Array} 返回文件数组
     */
    pickFileFromExt : function (path, options) {
        if (!options) {
            return [];
        }

        // options中的exts属性是必须的
        if (!options.exts) {
            return [];
        }

        if (Object.prototype.toString.call(options.exts) == '[object Array]') {
            return this.filter(path, (file)=> {
                if(options.exts.includes(paths.extname(file))) {
                    return file;
                }
            }, options);
        }
        else if (Object.prototype.toString.call(options.exts) == '[object String]') {
            return this.filter(path, (file)=> {
                if(options.exts === paths.extname(file)) {
                    return file;
                }
            }, options);
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 获取文件夹下的所有HDL文件，已经进行了文件存在性的检查，并且同时支持文件和文件夹
     * @param {String} path 所指定的文件夹路径
     * @param {Array} HDLFiles 最后输出的HDL文件列表
     */
     getHDLFiles(path, HDLFiles, ignores) {
        let options = {
            exts : [
                // verilog
                ".v", ".V", ".vh", ".vl", 
                // systemverilog
                ".sv", ".SV", 
                // vhdl
                ".vhd", ".vhdl", ".vho", ".vht"
            ],
            type : "all",
            ignores : ignores ? ignores : []  
        }
        
        HDLFiles.push(...(this.pickFileFromExt(path, options)));

        return HDLFiles;
    },

    /**
     * @state finish-test
     * @descriptionCn  获取当前文件的语言类型
     * @param {String} path 文件的绝对路径
     * @returns {String} 文件的语言类型 (verilog | systemverilog | vhdl)
     */
     getLanguageId : function(path) {
        let vhdlExtensions = [".vhd",".vhdl",".vho",".vht"];
        let vlogExtensions = [".v",".V",".vh",".vl"];
        let svlogExtensions = [".sv",".SV"];
        let value = paths.extname(path);
        if (vlogExtensions.includes(value)) {
            return "verilog";
        }
        else if (svlogExtensions.includes(value)) {
            return "systemverilog";
        }
        else if (vhdlExtensions.includes(value)) {
            return "vhdl";
        }
        return null;
    },

    /**
     * @state finish-test
     * @descriptionCn 从指定文件夹下找到指定后缀名的文件
     * @param {Array}  ignores 要忽视的文件所在的文件夹(绝对路径)
     * @param {String} path 被测试的文件路径
     * @returns {Boolean} (true:需要被忽视 | false:需要被保留)
     */
    isIgnore : function (ignores, path) {
        for (let i = 0; i < ignores.length; i++) {
            const element = ignores[i];
            if (path.includes(element)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @state finish-test
     * @descriptionCn 拉取json文件中的属性信息
     * @param {String} path json文件的路径
     * @returns {Object} 获取到的对象信息
     */
    pullJsonInfo : function (path) {
        if (this.isillegal(path)) {
            return {};
        }

        var data = fs.readFileSync(path, "utf-8");
        let obj = JSON.parse(data);
        return obj;
    },

    /**
     * @state finish-test
     * @descriptionCn 将对象内容推送到json文件中去
     * @param {String} path json文件的路径
     * @param {Object} obj 
     * @returns 
     */
    pushJsonInfo : function (path, obj){
        var str = JSON.stringify(obj,null,'\t');
        this.writeFile(path, str);
        return true;
    },

    /**
     * @state finish-test
     * @descriptionCn 对对象进行检查是否存在指定的属性
     * @param {Object} obj  待检查的对象
     * @param {String} attr 指定的属性名称
     * @returns {Boolean} (true : 存在 | false : 不存在或对象不存在)
     */
    isHasAttr : function (obj, attr){
        if (!obj) {
            return false;
        }
        let tempObj = obj;
        attr = attr.replace(/\[(\w+)\]/g, '.$1');
        attr = attr.replace(/^\./, '');
      
        let keyArr = attr.split('.');
        for (let i = 0; i < keyArr.length; i++) {
            const element = keyArr[i];
            if (!tempObj) return false;
            if (element in tempObj) {
                tempObj = tempObj[element];
            } else {
                return false;
            }
        }
        return true;
    },

    /**
     * @state finish-test
     * @descriptionCn 对对象进行检查是否存在指定的属性，且属性值是否正确
     * @param {Object} obj  待检查的对象
     * @param {String} attr 指定的属性名称
     * @param {*} value     指定的属性值
     * @returns {Boolean} (true : 存在且正确 | false : 不正确或不存在或对象不存在)
     */
    isHasValue : function (obj, attr, value){
        if (!obj) {
            return false;
        }
        let tempObj = obj;
        attr = attr.replace(/\[(\w+)\]/g, '.$1');
        attr = attr.replace(/^\./, '');
      
        let keyArr = attr.split('.');
        for (let i = 0; i < keyArr.length; i++) {
            const element = keyArr[i];
            if (!tempObj) return false;
            if (element in tempObj) {
                tempObj = tempObj[element];
                if (i == keyArr.length - 1 && tempObj != value) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
}
module.exports = fileOperation;