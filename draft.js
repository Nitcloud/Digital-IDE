const util = require('./src/HDLparser/util');
const path = require('path');
const fs = require('fs');

TEST_VLOG_FILE = path.join(__dirname, 'test/vlog/test.v');

const vlog = new util.VlogParser();
let code = fs.readFileSync(TEST_VLOG_FILE, 'utf-8');

let parse_result = vlog.parse(code);
let symbol_result = vlog.symbol(code);

console.log('parse_result', parse_result);
// console.log('symbol_result', symbol_result);