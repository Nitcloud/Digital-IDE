const path = require('path');
const fs = require('fs');
const assert = require('assert');

const util = require('../../src/util');


suite('HdlParam Util Test Suite', () => {
    const JsonDir = path.join(path.dirname(__dirname), 'json');

    test('test util.readJSON', () => {
        for (const file of fs.readdirSync(JsonDir)) {
            const filePath = path.join(JsonDir, file);
            const hdl_param = util.readJSON(filePath);

            assert(hdl_param.languageId, 'parsed hdlparam does not have languageId');
            assert(hdl_param.marco, 'parsed hdlparam does not have marco');
            assert(hdl_param.modules, 'parsed hdlparam does not have modules');
        }
    })

    test('test util.makeModuleID', () => {
        const pathModuleString = util.makeModuleID('a/b/c', 'module');
        assert.equal(pathModuleString, 'module @ a/b/c');
    })
});