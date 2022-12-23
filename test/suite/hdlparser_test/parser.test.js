const fs = require("fs");
const parser = require("../../../src/HDLparser/parser/parser");

// const path = "/home/workspace/HDLparser/test/Verilog/parser_stuck.v"
const path = "D:/Project/Code/Javascript/HDLparser/test/vlog/dependence_test/parent.v";
parser().then((Module) => {
    console.time('test');
    const code = fs.readFileSync(path, "utf-8");
    Module.FS.writeFile(`/home/code.v`, code, { encoding: 'utf8' });
    console.log(Module.FS.readdir(`/`));
    const symbol = Module.ccall('all', 'string', ['string'], ['/home/code.v']); // symbol
    const fast = Module.ccall('fast', 'string', ['string'], ['/home/code.v']); // symbol
    console.log(symbol);
    console.log(fast);
    console.timeEnd('test');
})