"use strict";

const fspath = require("path");

const hdlPath = {
    log : console.log,

    /**
     * @state finish-test
     * @descriptionCn 相对路径转绝对路径
     * @descriptionEn turn relative path to absolute path
     * @param {string} curPath current file path
     * @param {string} path the path which is included in the current file
     * @returns {string} absolute path
     */
    rel2abs(curPath, path) {
        // check whether it is absolute
        if (fspath.isAbsolute(path)) {
            return path;
        }
        let parent = fspath.dirname(curPath);
        let absPath = fspath.resolve(parent, path);
        return this.toSlash(absPath);
    },

    /**
     * @state finish-test
     * @descriptionCn 将反斜杠路径转斜杠路径
     * @param {string} path 反斜杠路径 (win下的路径标准)
     * @returns 斜杠路径 (linux下的路径标准)
     */
    toSlash(path) {
        return path.replace(/\\/g,"\/");
    },


    /**
     * @descriptionCn 使用 / 拼接路径
     * @param  {...string} paths
     * @returns {string}
     */
    join(...paths) {
        return paths.join('/');
    },


    /**
     * @descriptionCn 使用 / 返回绝对路径
     * @param  {...any} paths 
     * @returns {string}
     */
    resolve(...paths) {
        const absPath = fspath.resolve(...paths);
        return this.toSlash(absPath);
    },

    /**
     * @state finish-test
     * @descriptionCn 获取文件的后缀
     * @descriptionEn get the extname of path
     * @param {string} path the path which is included in the current file
     * @returns the extname of path e.g. : ".txt"
     */
    extname(path) {
        return fspath.extname(path).toLowerCase();
    },

    /**
     * @state finish-test
     * @descriptionCn 获取文件名(不包含后缀)
     * @descriptionEn get the basename of path
     * @param {string} path the path which is included in the current file
     * @returns the basename of path e.g. : "file.txt" -> "file"
     */
    basename(path) {
        return fspath.basename(path, this.extname(path));
    },
    
    /**
     * @state finish-test
     * @descriptionCn 往上进行指定次数的父级路径查找
     * @descriptionEn Multiple times return the directory name of a path.
     * @param {string} path  初始文件路径
     * @param {number} times 往上查找的次数，省缺时指定为一次
     * @returns {string} 返回对应的父级路径
     */
    dirname(path, times) {
        let dirPath = path;

        if (!times) {
            dirPath = fspath.dirname(dirPath);
            return dirPath;
        }

        for (let i = 0; i < times; i++) {
            dirPath = fspath.dirname(dirPath);
        }

        return dirPath;
    },

    /**
     * @state finish-test
     * @descriptionCn 将输入路径中的关键词进行替换
     * @param {string} str  需要替换的关键词
     * @param {string} path 带关键词的路径
     * @return {string} 替换好的路径
     */
    replace(str, path) {
        // 先做反斜杠保护
        path = this.toSlash(path);
        return path.replace(str, path);
    }
}
module.exports = hdlPath;