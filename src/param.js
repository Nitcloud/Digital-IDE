
const defaultPrjInfo = {
    TOOL_CHAIN: "xilinx",       // 当前使用的第三方工具链，一般为xilinx, intel 或者 自定义

    PRJ_NAME: {
        PL: "template",       // 编程逻辑设计部分即之前的FPGA
        PS: "template"        // 处理系统设计部分即之前的SOC
    },

    ARCH: {                 // 自定义工程结构
        PRJ_Path: "",       // project路径，存放中间文件
        Hardware: {         // 存放定义硬件得目录
            src: "",      // HDL的源文件目录路径
            sim: "",      // 仿真文件，testBench目录路径
            data: ""      // 数据文件夹
        },
        Software: {
            src: "",      // 源文件
            data: ""      // 数据文件夹
        }
    },

    library: {
        state: "",          // 库的类型， local 或者 remote
        Hardware: {         // common 和 custom 都是路径列表，代表
            common: [],
            custom: []
        }
    },

    IP_REPO: [],

    // 当设计时用到PL+PS即为SOC开发
    SOC: {
        core: "none",
        bd: "",
        os: "",
        app: ""
    },

    enableShowlog: false,
    Device: "none"
};

const opeParam = {
    os: "",               // 当前运行的系统类型
    rootPath: "",         // 插件所在的根路径
    workspacePath: "",    // 当前打开的工作区的路径

    srcTopModule: {      // 当前设计的顶层模块名
        name: '',
        path: ''
    },
    simTopModule: {      // 当前仿真的顶层模块名
        name: '',
        path: ''
    },

    prjInfo: defaultPrjInfo,        // 用户配置的参数
    liboperation: null,             // library操作类
    prjInitParam: "",               // 初始配置文件的路径
    propertyPath: ""                // 用户配置文件的路径
};


module.exports = opeParam;