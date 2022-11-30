const parser = require("./src/kernel");
const fs = require("fs");

const vlog = new parser.vlog();
const vhdl = new parser.vhdl();

const path = "D:/Project/Code/Javascript/HDLparser/test/vhdl/test.vhd";
// const path = "D:/Project/Code/Javascript/HDLparser/test/vlog/parse_test/Cordic.v";
// const path = "D:/Project/Code/Javascript/HDLparser/test/vlog/dependence_test/parent.v";
const code = fs.readFileSync(path, "utf-8");
console.log(code[-1]);
const fast = vhdl.parse(code);
const all  = vhdl.symbol(code);
console.log(fast);
console.log(all);