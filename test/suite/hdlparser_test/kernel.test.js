// 测试语法解析核心
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const HdlParser = require('../../../src/HDLparser');
const hdlPath = require('../../../src/HDLfilesys/operation/path');


const TEST_ROOT = hdlPath.resolve(__dirname, '../..');
const TEST_VHDL_FILE = hdlPath.join(TEST_ROOT, 'vhdl/test.vhd');
const TEST_VLOG_FILE = hdlPath.join(TEST_ROOT, 'vlog/test.v');

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

    
        for (const property of NECE_PROPERTY) {
            test('vhdl.parse -> ensure parse result has ' + '"' + property + '"', () => {
                assert(result.parse_result[property]);
            });
        }


        for (const property of NECE_MODULE_PROPERTY) {
            test('vhdl.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    const properties = Object.keys(mod);
                    assert(properties.includes(property), "module should have " + '"' + property + '"');
                }
            });
        }
        

        for (const property of NECE_INSTANCE_PROPERTY) {
            test('vhdl.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const instance of mod.instances) {
                        const properties = Object.keys(instance);
                        assert(properties.includes(property), "instance should have " + '"' + property + '"');
                    }
                }
            });
        }
        

        for (const property of NECE_PARAM_PROPERTY) {
            test('vhdl.parse -> ensure each param has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const param of mod.params) {
                        const properties = Object.keys(param);
                        assert(properties.includes(property), "param should have " + '"' + property + '"');
                    }
                }
            });
        }


        for (const property of NECE_PORT_PROPERTY) {
            test('vhdl.parse -> ensure each port has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const port of mod.ports) {
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

        for (const property of NECE_PROPERTY) {
            test('vlog.parse -> ensure parse result has ' + '"' + property + '"', () => {
                assert(result.parse_result[property]);
            });
        }


        for (const property of NECE_MODULE_PROPERTY) {
            test('vlog.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    const properties = Object.keys(mod);
                    assert(properties.includes(property), "module should have " + '"' + property + '"');
                }
            });
        }
        
        test('vlog.parse -> ensure macro.includes is Array<string>', () => {
            const includes = result.parse_result.marco.includes;
            for (const include of includes) {
                const includeType = typeof(include);
                assert.equal(includeType, 'string', 'expect includes element is string, but receive ' + includeType);
            }
        });

        for (const property of NECE_INSTANCE_PROPERTY) {
            test('vlog.parse -> ensure each module has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const instance of mod.instances) {
                        const properties = Object.keys(instance);
                        assert(properties.includes(property), "instance should have " + '"' + property + '"');
                    }
                }
            });
        }

        for (const property of NECE_PARAM_PROPERTY) {
            test('vhdl.parse -> ensure each param has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const param of mod.params) {
                        const properties = Object.keys(param);
                        assert(properties.includes(property), "param should have " + '"' + property + '"');
                    }
                }
            });
        }


        for (const property of NECE_PORT_PROPERTY) {
            test('vhdl.parse -> ensure each port has ' + '"' + property + '"', () => {
                for (const mod of Object.values(result.parse_result.modules)) {
                    for (const port of mod.ports) {
                        const properties = Object.keys(port);
                        assert(properties.includes(property), "port should have " + '"' + property + '"');
                    }
                }
            });
        }


    });

});