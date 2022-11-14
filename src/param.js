var opeParam = {
    os             : "",    // 当前运行的系统类型
    rootPath       : "",    // 插件所在的根路径
    workspacePath  : "",    // 当前打开的工作区的路径

    srcTopModule   : {      // 当前设计的顶层模块名
        name: '',
        path: ''
    },
    simTopModule   : {      // 当前仿真的顶层模块名
        name: '',
        path: ''
    },
    
    prjInfo        : null,  // 用户配置的参数
    prjInitParam   : "",    // 初始配置文件的路径
    propertyPath   : ""     // 用户配置文件的路径
};
module.exports = opeParam;