const path = require('path');
const fs = require('fs');
const assert = require('assert');

const util = require('../../../src/HDLparser/util');
const hdlFile = require('../../../src/HDLfilesys/operation/files');
const hdlPath = require('../../../src/HDLfilesys/operation/path');

const TEST_ROOT = hdlPath.resolve(__dirname, '../..');
const TEST_FOLDER = hdlPath.join(TEST_ROOT, 'vlog');
const TEST_FILE = hdlPath.join(TEST_FOLDER, 'test.v');
const TEST_FOLDER_FILE_NUM = 12;


suite('HDLparser.util Test', () => {

    test('test util.makeModuleID', () => {
        const pathModuleString = util.makeModuleID('a/b/c', 'module');
        assert.equal(pathModuleString, 'module @ a/b/c');
    });

    test('test util.getAllFilesFromFolder', () => {
        const files = util.getAllFilesFromFolder(TEST_FOLDER);
        assert.equal(files.length, TEST_FOLDER_FILE_NUM);
    });

    test('test util.selectParserByLangID', () => {
        const langID = hdlFile.getLanguageId(TEST_FILE);
        const parser = util.selectParserByLangID(langID);
        assert.equal(parser, util.vlogParser);
    });
});