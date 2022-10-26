"use strict";

const fs = require("fs");
const fspath = require("path");

var dirOperation = {
    os  : process.platform,
    log : console.log,

    /**
     * @state finish
     * @descriptionCn 非法性检查 存在且为dir
     * @descriptionEn Illegality check
     * @param {string} path 
     * @returns {boolean} true: illegal | false: legal
     */
    isillegal : function (path) {
        if(!fs.existsSync(path)) {  
            return true;
        }

        let state = fs.statSync(path);
        if (!state.isDirectory()) {
            return true;
        }

        return false;
    },

    /**
     * @state finish
     * @example path: path/ => path/child_1/child_2/...
     * @descriptionCn 创建文件夹，递归创建所有子项，已经进行合法性检查，本身存在也视为成功
     * @descriptionEn Create a folder based on the destination path passed in
     * @param {string} path A Directory Path you want to create
     * @returns {Boolean} true: success false: failed -> path is not a directory
     */
    mkdir : function (path) {
        // 如果存在则直接退出
        if (fs.existsSync(path)) {
            return true;
        }

        try {
            fs.mkdirSync(path, {recursive:true});
            return true;
        } 
        catch (error) {
            this.log(error);
            fs.mkdirSync(path, {recursive:true});
        }
    },

    /**
     * @state finish
     * @example path: parent/path/child_1/child_2/... => parent/
     * @descriptionCn 删除文件夹，递归强制删除自己以及所有子项
     * @descriptionEn Delete the target folder and all files/folders under the folder
     * @param {string} path A Directory Path you want to delete
     * @returns {Boolean} true: success false: failed -> path is not a directory
     */
    rmdir : function (path){
        // 如果不存在或者不为dir则直接退出
        if (this.isillegal(path)) {
            return false;
        }
        
        try {
            fs.rmSync(path, { recursive: true, force: true }); 
            return true;
        } 
        catch (error) {
            this.log(error);
            fs.rmSync(path, { recursive: true, force: true }); 
        }
        return true;
    },

    /**
     * @state finish
     * @example e.g. src: path/src/** dest: path/dest => src: path/ dest: path/dest/src/**
     * @descriptionCn 移动文件夹 (剪贴)
     * @descriptionEn Move files asynchronously from the source path to the destination path
     * @param {string} src A source directory path you want to move
     * @param {string} dest A destination directory path you need move to
     * @returns {Boolean} true: success false: failed -> path is not a directory
     */
    mvdir : function (src, dest, cover) {
        if (src == dest) {
            return false;
        }

        this.cpdir(src, dest, cover);
        this.rmdir(src);
    },

    /**
     * @state finish-tested
     * @example e.g. src: path/src/** dest: path/dest => src: path/src/** dest: path/dest/src/**
     * @descriptionCn 复制文件夹 (复制) 如果源文件夹非法则保证目的文件夹的构建
     * @descriptionEn Move files asynchronously from the source path to the destination path
     * @param {string} src A source directory path you want to move
     * @param {string} dest A destination directory path you need move to
     * @returns {Boolean} true: success | false: failed -> path is not a directory
     */
    cpdir : function (src, dest, cover) {
        if (src == dest) {
            return false;
        }

        // 如果不存在或者不为dir则先构建目的文件夹再退出
        if (this.isillegal(src)) {
            this.mkdir(dest);
            return false;
        }

        if (!cover) {
            cover = true;
        }

        let srcName = fspath.basename(src);
        dest = fspath.join(dest, srcName);

        let children = fs.readdirSync(src);
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            // child: path/src/element
            const child = fspath.join(src, element);
            const state = fs.statSync(child);
            if (state.isFile()) {
                if (!this.mkdir(dest)) {
                    return false;
                }
                // element is file under src, dest: path/dest/src
                const destPath = fspath.join(dest, element);
                try {
                    if (!fs.existsSync(child)) {
                        fs.copyFileSync(child, destPath);
                    } else {
                        if (cover) {
                            fs.copyFileSync(child, destPath);
                        }
                    }
                } 
                catch (error) {
                    this.log(error);
                }
            }
            if (state.isDirectory()) {
                this.cpdir(child, dest);
            }
        }
    },

    /**
     * @state finish-test
     * @descriptionCn 获取当前文件夹下的文件
     * @param {String} path 当前文件夹地址 
     * @param {Boolean} withParent 返回路径是否带有父级路径 
     * @param {Function} callback 单个路径处理的回调函数
     * @returns {Array} 返回当前文件夹下的文件的数组
     */
    readdir(path, withParent, callback) {
        // 如果不存在或者不为dir则直接退出
        if (this.isillegal(path)) {
            return false;
        }

        let output = [];
        let chilren = fs.readdirSync(path);
        for (let i = 0; i < chilren.length; i++) {
            let curPath = chilren[i]; // 不带父级路径
            
            if (withParent) {
                curPath = `${path}/${element}`;
            }

            if (callback) {
                curPath = callback(curPath);
            }

            output.push(curPath);
        }
        return output;
    },

    /**
     * @state finish
     * @descriptionCn 获取文件夹下的所有文件
     * @param {String} path  
     * @param {Array} output 
     * @returns 
     */
    readdirAll(path, output) {
        // 如果不存在或者不为dir则直接退出
        if (this.isillegal(path)) {
            return false;
        }

        let chilren = fs.readdirSync(path);
        for (let i = 0; i < chilren.length; i++) {
            const element = chilren[i];
            let curPath = fspath.join(path, element);
            let state = fs.statSync(curPath);
            if (!state.isDirectory()) {
                output.push(curPath);
            } else {
                this.readdirAll(curPath, output);
            }
        }
        return true;
    }
}
module.exports = dirOperation;