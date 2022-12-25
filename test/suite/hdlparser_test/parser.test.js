const fs = require("fs");

const HDLPath = require("../../../src/HDLfilesys/operation/path");
const parser = require("../../../src/HDLparser/parser/parser");

// const path = "/home/workspace/HDLparser/test/Verilog/parser_stuck.v"
const TEST_ROOT = HDLPath.resolve(__dirname, '../..');
const TEST_VLOG_FILE = HDLPath.join(TEST_ROOT, 'vlog/dependence_test/parent.v');


// parser().then(Module => {
//     suite('test wasm parser', () => {
//         test('test Module', () => {    
//             const code = fs.readFileSync(TEST_VLOG_FILE, "utf-8");
//             Module.FS.writeFile(`/home/code.v`, code, { encoding: 'utf8' });
//             console.log(Module.FS.readdir(`/`));
//             const symbol = Module.ccall('all', 'string', ['string'], ['/home/code.v']); // symbol
//             const fast = Module.ccall('fast', 'string', ['string'], ['/home/code.v']); // symbol
//             // console.log(symbol);
//             console.log(fast);
//         });
//     });
// });