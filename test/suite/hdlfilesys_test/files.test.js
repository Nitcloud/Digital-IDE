const assert = require('assert');
const path = require('path');

const hdlFile = require('../../../src/HDLfilesys/operation/files');
const hdlPath = require('../../../src/HDLfilesys/operation/path');

const TEST_ROOT = hdlPath.resolve(__dirname, '../..');
const TEST_VLOG_FOLDER = hdlPath.join(TEST_ROOT, 'vlog');
const TEST_VHDL_FOLDER = hdlPath.join(TEST_ROOT, 'vhdl');


const TEST_VLOG_FILE = hdlPath.join(TEST_VLOG_FOLDER, 'test.v');
const TEST_VHDL_FILE = hdlPath.join(TEST_VHDL_FOLDER, 'test.vhd');

const TEST_VLOG_FOLDER_FILE_NUM = 11;

suite('HDLfilesys.files Test', () => {
    test('test hdlFile.getHDLFiles', () => {
        const files = [];
        hdlFile.getHDLFiles(TEST_VLOG_FOLDER, files);
        assert.equal(files.length, TEST_VLOG_FOLDER_FILE_NUM);
    });

    test('test hdlFile.getLanguageId', () => {
        let vlogLangID = hdlFile.getLanguageId(TEST_VLOG_FILE);
        assert.equal(vlogLangID, 'verilog');
        let vhdlLangID = hdlFile.getLanguageId(TEST_VHDL_FILE);
        assert.equal(vhdlLangID, 'vhdl');
    });
});