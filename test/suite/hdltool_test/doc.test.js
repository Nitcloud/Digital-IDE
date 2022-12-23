const fs = require('fs');
const assert = require('assert');

const showdown = require('showdown');

const HDLPath = require('../../../src/HDLfilesys/operation/path');
const { makeWaveDromSVG } = require('../../../src/HDLtool/doc/common');
const { makeMarkdownFromFile, getDocsFromFile } = require('../../../src/HDLtool/doc/markdown');
const { HDLParam } = require('../../../src/HDLparser');

const TEST_ROOT = HDLPath.resolve(__dirname);
const TEST_SHOWDOWN_FILE = HDLPath.join(TEST_ROOT, 'data/showdown.test.md');
const EXPECT_TAGS_SHOWDOWN = ['h2', 'h3', 'ul', 'li', 'table', 'thead', 'tr', 'th'];
const TEST_WAVEDROM_FILE = HDLPath.join(TEST_ROOT, 'data/wavedrom.test.json');
const TEST_WAVEDROM_WRONG_FILE = HDLPath.join(TEST_ROOT, 'data/wavedrom.wrong.json');

suite('HDLTool.doc Test Suite', () => {

    test('test showdown -> Simple Run', () => {
        const converter = new showdown.Converter({tables : true});
        const markdownString = fs.readFileSync(TEST_SHOWDOWN_FILE, 'utf-8');
        const html = converter.makeHtml(markdownString);
        for (const tag of EXPECT_TAGS_SHOWDOWN) {
            assert(html.includes(tag));
        }
    });

    test('test wavedrom -> Simple Run', () => {
        const rawJson = fs.readFileSync(TEST_WAVEDROM_FILE, "utf-8");
        const svgString = makeWaveDromSVG(rawJson, 'dark');
        assert(svgString != undefined, 'parse result of wavedrom should not be undefined');
    });

    test('test wavedrom -> Should return undefined to illegal comment', () => {
        const rawJson = fs.readFileSync(TEST_WAVEDROM_WRONG_FILE, 'utf-8');
        const svgString = makeWaveDromSVG(rawJson, 'dark');
        assert.equal(svgString, undefined);
    })


    test('test makeMarkdownFromFile -> Simple Run', () => {
        for (const moduleFile of HDLParam.getAllModuleFiles()) {
            const markdownString = makeMarkdownFromFile(moduleFile.path);
        }
    });


    test('test getDocsFromFile -> Simple Run', () => {
        for (const moduleFile of HDLParam.getAllModuleFiles()) {
            const docs = getDocsFromFile(moduleFile.path);
        }
    });
});