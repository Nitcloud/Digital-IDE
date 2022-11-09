let prjStructure = {        
    prjPath : "",
    HardwareSim  : "",
    HardwareSrc  : "",
    HardwareData : "",
    SoftwareSrc  : "",
    SoftwareData : ""
};
let x = parseInt('11111111', 2);
function eval_signed(str, num, opt) {
    let pow = Math.pow(opt, str.length);
    let x1 = num;
    if (num >= pow >> 1) {
        x1 = num - pow;
    }
    return x1;
}

eval_signed('11111111', x, 2);
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

for (const key in prjStructure) {
    let element = prjStructure[key]
    element = "new";
}

console.log(prjStructure);

console.log(HDLparam);
console.log(HDLparam["/home/project/top.v"].modules[top]);