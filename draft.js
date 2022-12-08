const parser = require("./src/HDLparser/util/kernel");
const path = require('path');
const fs = require('fs');

TEST_VLOG_FILE = path.join(__dirname, 'test/vlog/test.v');

const vlog = new parser.vlog();
const vhdl = new parser.vhdl();

let code = fs.readFileSync(TEST_VLOG_FILE, 'utf-8');
console.log(code);
let parse_result = vlog.parse(code);
let symbol_result = vlog.symbol(code);

console.log('parse_result', parse_result);
// console.log('symbol_result', symbol_result);