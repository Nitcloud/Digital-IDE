const assert = require('assert');
const lspUtil = require('../../../src/HDLtool/lsp/util');

const TEST_getLastSingleWord = [
    {
        input : "hello.world",
        output: "world"
    },
    {
        input : "  const a = hel",
        output: "hel"
    },
    {
        input : " ",
        output: ""
    },
    {
        input : "this.awdad ss",
        output: "ss"
    }
];


const TEST_getSingleWordAtCurrentPosition = [
    {
        input : ['module dependence_1 (', 10],
        output: 'dependence_1'
    },
    {
        input : ['this is the word', 13],
        output: 'word'
    }
];


suite('HDLTool.lsp.util Test Suite', () => {
    test('test getLastSingleWord', () => {
        for (const t of TEST_getLastSingleWord) {
            const output = lspUtil.getLastSingleWord(t.input);
            assert.equal(output, t.output);
        }
    });


    test('test getSingleWordAtCurrentPosition', () => {
        for (const t of TEST_getSingleWordAtCurrentPosition) {
            const output = lspUtil.getSingleWordAtCurrentPosition(...t.input);
            assert.equal(output, t.output);
        }
    });
});