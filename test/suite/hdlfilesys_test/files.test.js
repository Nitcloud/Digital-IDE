const assert = require('assert');
const path = require('path');

const HDLFile = require('../../../src/HDLfilesys/operation/files');
const HDLPath = require('../../../src/HDLfilesys/operation/path');

const TEST_ROOT = HDLPath.resolve(__dirname, '../..');
const TEST_VLOG_FOLDER = HDLPath.join(TEST_ROOT, 'vlog');
const TEST_VHDL_FOLDER = HDLPath.join(TEST_ROOT, 'vhdl');


const TEST_VLOG_FILE = HDLPath.join(TEST_VLOG_FOLDER, 'test.v');
const TEST_VHDL_FILE = HDLPath.join(TEST_VHDL_FOLDER, 'test.vhd');

const TEST_VLOG_FOLDER_FILE_NUM = 12;

suite('HDLfilesys.files Test', () => {
    test('test HDLFile.getHDLFiles', () => {
        const files = HDLFile.getHDLFiles(TEST_VLOG_FOLDER);
        assert.equal(files.length, TEST_VLOG_FOLDER_FILE_NUM);
    });

    test('test HDLFile.getLanguageId', () => {
        let vlogLangID = HDLFile.getLanguageId(TEST_VLOG_FILE);
        assert.equal(vlogLangID, 'verilog');
        let vhdlLangID = HDLFile.getLanguageId(TEST_VHDL_FILE);
        assert.equal(vhdlLangID, 'vhdl');
    });
});