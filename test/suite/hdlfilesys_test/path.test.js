const assert = require('assert');

const hdlPath = require('../../../src/HDLfilesys/operation/path');
const TEST_ROOT = hdlPath.resolve(__dirname, '../..');

suite('HDLfilesys.path Test', () => {
    test('test hdlPath.resolve', () => {
        const root = hdlPath.resolve(__dirname, '../..');
        assert(!root.includes('\\'), "path shouldn't contain \\");
    });

    test('test hdlPath.join', () => {
        const targetPath = hdlPath.join(TEST_ROOT, 'vlog');
        assert(!targetPath.includes('\\'), "path shouldn't contain \\");
    });
});