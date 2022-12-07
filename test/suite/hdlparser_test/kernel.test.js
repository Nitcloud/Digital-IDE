// 测试语法解析核心
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const HdlParser = require('../../../src/HDLparser');

const TEST_ROOT = path.dirname(path.dirname(__dirname));
const TEST_VHDL_FILE = path.join(TEST_ROOT, 'vhdl/test.vhd');
const TEST_VLOG_FILE = path.join(TEST_ROOT, 'vlog/test.v');

suite('Parse Kernel Test', () => {
    
    test('test vhdl parser', () => {
        const vhdl = new HdlParser.VhdlParser();
        let code = fs.readFileSync(TEST_VHDL_FILE, 'utf-8');
        
        let parse_result = vhdl.parse(code);
        let symbol_result = vhdl.symbol(code);

        console.log('parse_result', parse_result);
        console.log('symbol_result', symbol_result);

        debugger;
    });

    test('test vlog parser', () => {
        const vlog = new HdlParser.VlogParser();
        let code = fs.readFileSync(TEST_VLOG_FILE);

        let parse_result = vlog.parse(code);
        let symbol_result = vlog.symbol(code);

        console.log('parse_result', parse_result);
        console.log('symbol_result', symbol_result);
    });
});