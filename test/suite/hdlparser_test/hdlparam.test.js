const fs = require('fs');
const path = require('path');
const assert = require('assert');

const base = require('../../../src/HDLparser/base');
const util = require('../../../src/HDLparser/util');

const HdlParam = base.HdlParam;

suite('HdlParam Test Suite', () => {
    // 为了测试的全局配置
    const MOCK_PATH = {
        'child_1.json': '/test/child_1.v',
        'child_2.json': '/test/child_2.v',
        'head_1.json': '/test/head_1.v',
        'parent.json': '/test/parent.v',
    };
    const TOP_MODULE_NUM = 2;
    const TEST_TOP_MODULE = {
        path: '/test/parent.v',
        name: 'Main'
    };
    const TEST_MODULE = {
        path: '/test/child_1.v',
        name: 'dependence_1'
    };

    // 默认拿../json下的所有解析文件
    const JsonDir = path.join(path.dirname(__dirname), 'json');


    // test('check prepare data', () => {
    //     assert(fs.readdirSync(JsonDir).length == Object.keys(MOCK_PATH).length);
    //     const allVlogPath = new Set(Object.values(MOCK_PATH));

    //     for (const file of fs.readdirSync(JsonDir)) {
    //         const filePath = path.join(JsonDir, file);
    //         const structure = util.readJSON(filePath);
    //         for (const moduleName of Object.keys(structure.modules)) {
    //             const instances = structure.modules[moduleName].instances;
    //             for (const inst of instances) {
    //                 const vlogPath = inst.instModPath;
    //                 assert(allVlogPath.has(vlogPath),
    //                     'instance ' + inst.name + 'in file ' + file + 'does not have instModPath');
    //             }
    //         }
    //     }
    // });


    // test('test HdlParam.InitByWasmJSON', () => {
    //     for (const file of fs.readdirSync(JsonDir)) {
    //         const filePath = path.join(JsonDir, file);
    //         const structure = util.readJSON(filePath);

    //         let vlogPath = MOCK_PATH[file];
    //         HdlParam.InitByWasmJSON(vlogPath, structure);
    //     }
    // });


    // test('test HdlParam.getAllModules', () => {
    //     const allModules = HdlParam.getAllModules();
    //     let MockLength = Object.keys(MOCK_PATH).length;
    //     assert.equal(allModules.length, MockLength);
    // });


    // test('test HdlParam.getAllTopModules', () => {
    //     const topModules = HdlParam.getAllTopModules();
    //     assert.equal(topModules.length, TOP_MODULE_NUM);
    // });


    // test('test HdlParam.isTopModule', () => {
    //     let isTop = HdlParam.isTopModule(TEST_TOP_MODULE.path, TEST_TOP_MODULE.name);
    //     assert(isTop);
    // });


    // test('test HdlParam.hasModule', () => {
    //     let has = HdlParam.hasModule(TEST_MODULE.path, TEST_MODULE.name);
    //     assert(has);
    // });


    // test('test HdlParam.findModule', () => {
    //     let targetModule = HdlParam.findModule(TEST_MODULE.path, TEST_MODULE.name);
    //     assert.equal(targetModule.name, TEST_MODULE.name);
    //     assert.equal(targetModule.path, TEST_MODULE.path);
    // });


    // test('test HdlParam.deleteModule', () => {
    //     HdlParam.deleteModule(TEST_MODULE.path, TEST_MODULE.name);
    //     assert(!HdlParam.hasModule(TEST_MODULE.path, TEST_MODULE.name));
        
    //     let target = HdlParam.getAllModules().filter(mod => mod.name == TEST_MODULE.name && mod.path == TEST_MODULE.path);
    //     assert.equal(target.length, 0);
    // });

});