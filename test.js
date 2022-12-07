const fs = require("./src/HDLfilesys");

let arr = [1, 2];
arr.push(2);

var HDLparam = {
    "/home/project/top.v" : {
        "languageId" : "verilog",
        "modules" : {
            "top" : {
                "instances" : [
                    {
                        "name": "instance name",        // 例化的名字
                        "type": "instance module",      // 例化的模块
                        "instModInfo": null
                    },
                    {
                        "name": "instance name",        // 例化的名字
                        "type": "instance module",      // 例化的模块
                        "instModInfo": null
                    }
                ]
            }, 
            "child1" : {
                "params" : {},  // {object} 见 ports & params Data Structure
            }
        }
    },
    "/home/project/child2.v" : {
        "languageId" : "verilog",
        "modules" : {
            "child2" : {
                "ports"  : {},  // {object} 见 ports & params Data Structure
            }
        }
    }
}

HDLparam["/home/project/top.v"].modules.top.instances[0].instModInfo = 
    HDLparam["/home/project/child2.v"].modules.child2;
HDLparam["/home/project/child2.v"].modules.child2 = null;
console.log(HDLparam["/home/project/top.v"].modules.top.instances[0].instModInfo);
delete HDLparam["/home/project/child2.v"];
console.log(HDLparam);
HDLparam["/home/project/child2.v"] = null;
console.log(HDLparam["/home/project/child2.v"]);
console.log(HDLparam["/home/project/top.v"].modules.top.instances[0].instModInfo);