// 测试语法解析核心
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const HdlParser = require('../../../src/HDLparser');
const HDLPath = require('../../../src/HDLfilesys/operation/path');


const TEST_ROOT = HDLPath.resolve(__dirname, '../..');
const TEST_VHDL_FILE = HDLPath.join(TEST_ROOT, 'vhdl/test.vhd');
const TEST_VLOG_FILE = HDLPath.join(TEST_ROOT, 'vlog/test.v');

const NECE_PROPERTY = ['languageId', 'marco', 'modules'];
const NECE_MODULE_PROPERTY = ['instances', 'params', 'ports', 'start', 'end'];
const NECE_INSTANCE_PROPERTY = ['instparams', 'instports', 'name', 'type'];
const NECE_PORT_PROPERTY = ['start', 'end', 'name', 'width', 'type'];
const NECE_PARAM_PROPERTY = ['start', 'end', 'name', 'init', 'type'];

suite('HDLparser.parser Test', () => {

    
    suite('test vhdl parser', () => {
        let code = fs.readFileSync(TEST_VHDL_FILE, 'utf-8');
        const result = {'symbol_result' : null, 'parse_result' : null};

        test('vhdl.symbol -> Simple Run', () => {
            result.symbol_result = HdlParser.vhdlParser.symbol(code);
        });

        test('vhdl.parse -> Simple Run', () => {
            result.parse_result = HdlParser.vhdlParser.parse(code);
        });

        test('vhdl.parse -> languageId', () => {
            assert.equal(result.parse_result.languageId, 'vhdl');
        });
    
        for (const property of NECE_PROPERTY) {
            test('vhdl.parse -> ensure parse result has ' + '"' + property + '"', () => {
                assert(result.parse_result[property]);
            });
        }


        for (const property of NECE_MODULE_PROPERTY) {
            test('vhdl.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    const properties = Object.keys(module);
                    assert(properties.includes(property), "module should have " + '"' + property + '"');
                }
            });
        }
        

        for (const property of NECE_INSTANCE_PROPERTY) {
            test('vhdl.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const instance of module.instances) {
                        const properties = Object.keys(instance);
                        assert(properties.includes(property), "instance should have " + '"' + property + '"');
                    }
                }
            });
        }
        

        for (const property of NECE_PARAM_PROPERTY) {
            test('vhdl.parse -> ensure each param has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const param of module.params) {
                        const properties = Object.keys(param);
                        assert(properties.includes(property), "param should have " + '"' + property + '"');
                    }
                }
            });
        }


        for (const property of NECE_PORT_PROPERTY) {
            test('vhdl.parse -> ensure each port has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const port of module.ports) {
                        const properties = Object.keys(port);
                        assert(properties.includes(property), "port should have " + '"' + property + '"');
                    }
                }
            });
        }
    });

    suite('test vlog parser', () => {
        let code = fs.readFileSync(TEST_VLOG_FILE, 'utf-8');
        const result = {'symbol_result' : null, 'parse_result' : null};

        test('vlog.symbol -> Simple Run', () => {
            result.symbol_result = HdlParser.vlogParser.symbol(code);    
        });

        test('vlog.parse -> Simple Run', () => {
            result.parse_result = HdlParser.vlogParser.parse(code);
        });

        test('vlog.parse -> languageId', () => {
            assert.equal(result.parse_result.languageId, 'verilog');
        });

        for (const property of NECE_PROPERTY) {
            test('vlog.parse -> ensure parse result has ' + '"' + property + '"', () => {
                assert(result.parse_result[property]);
            });
        }


        for (const property of NECE_MODULE_PROPERTY) {
            test('vlog.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    const properties = Object.keys(module);
                    assert(properties.includes(property), "module should have " + '"' + property + '"');
                }
            });
        }
        
        test('vlog.parse -> ensure macro.includes is {string : range}', () => {
            const includes = result.parse_result.marco.includes;
            for (const path of Object.keys(includes)) {
                const range = includes[path];
                assert.equal(typeof(path), 'string', 'keys of includes must be string');
                assert(range.start, 'value of includes must have start');
                assert(range.end, 'value of includes must have end');
            }
        });

        for (const property of NECE_INSTANCE_PROPERTY) {
            test('vlog.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const instance of module.instances) {
                        const properties = Object.keys(instance);
                        assert(properties.includes(property), "instance should have " + '"' + property + '"');
                    }
                }
            });
        }

        for (const property of NECE_PARAM_PROPERTY) {
            test('vlog.parse -> ensure each param has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const param of module.params) {
                        const properties = Object.keys(param);
                        assert(properties.includes(property), "param should have " + '"' + property + '"');
                    }
                }
            });
        }


        for (const property of NECE_PORT_PROPERTY) {
            test('vlog.parse -> ensure each port has ' + '"' + property + '"', () => {
                for (const module of Object.values(result.parse_result.modules)) {
                    for (const port of module.ports) {
                        const properties = Object.keys(port);
                        assert(properties.includes(property), "port should have " + '"' + property + '"');
                    }
                }
            });
        }


    });

});