const path = require('path');
const fs = require('fs');
const assert = require('assert');

const util = require('../../../src/HDLparser/util');
const HDLFile = require('../../../src/HDLfilesys/operation/files');
const HDLPath = require('../../../src/HDLfilesys/operation/path');

const TEST_ROOT = HDLPath.resolve(__dirname, '../..');
const TEST_FOLDER = HDLPath.join(TEST_ROOT, 'vlog');
const TEST_FILE = HDLPath.join(TEST_FOLDER, 'test.v');
const TEST_FOLDER_FILE_NUM = 12;


suite('HDLparser.util Test', () => {

    test('test util.makeModuleID', () => {
        const pathModuleString = util.makeModuleID('a/b/c', 'module');
        assert.equal(pathModuleString, 'module @ a/b/c');
    });

    test('test util.getAllFilesFromFolder', () => {
        const files = util.getAllFilesFromFolder(TEST_FOLDER);
        // assert.equal(files.length, TEST_FOLDER_FILE_NUM);
    });

    test('test util.selectParserByLangID', () => {
        const langID = HDLFile.getLanguageId(TEST_FILE);
        const parser = util.selectParserByLangID(langID);
        assert.equal(parser, util.vlogParser);
    });
});