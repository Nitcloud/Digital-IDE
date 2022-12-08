const parser = require("./util/kernel");

const fs = require("fs");

const vlog = new parser.vlog();
const vhdl = new parser.vhdl();

// const path = "D:/Project/Code/Javascript/HDLparser/test/vhdl/test.vhd";
const path = "D:/Project/Code/.prj/Extension/Owner/Digital-IDE/test/vlog/test.v";
// const path = "D:/Project/Code/Javascript/HDLparser/test/vlog/dependence_test/parent.v";
const code = fs.readFileSync(path, "utf-8");
const fast = vlog.parse(code);
const all  = vlog.symbol(code);
console.log(fast);
console.log(all);