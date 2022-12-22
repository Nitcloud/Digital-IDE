const assert = require('assert');

const HDLPath = require('../../../src/HDLfilesys/operation/path');
const TEST_ROOT = HDLPath.resolve(__dirname, '../..');

suite('HDLfilesys.path Test', () => {
    test('test HDLPath.resolve', () => {
        const root = HDLPath.resolve(__dirname, '../..');
        assert(!root.includes('\\'), "path shouldn't contain \\");
    });

    test('test HDLPath.join', () => {
        const targetPath = HDLPath.join(TEST_ROOT, 'vlog');
        assert(!targetPath.includes('\\'), "path shouldn't contain \\");
    });
});