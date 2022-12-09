const fs = require('fs');
const assert = require('assert');

const base = require('../../../src/HDLparser/base');
const util = require('../../../src/HDLparser/util');
const hdlPath = require('../../../src/HDLfilesys/operation/path');

const opeParam = require('../../../src/param');

const TEST_ROOT = hdlPath.resolve(__dirname, '../..');
const TEST_VLOG_FOLDER = hdlPath.join(TEST_ROOT, 'vlog/dependence_test');
const TEST_TOP_MODULE = {
    path : hdlPath.join(TEST_VLOG_FOLDER, 'parent.v'),
    name : 'Main'
};
const TEST_MODULE = {
    path : hdlPath.join(TEST_VLOG_FOLDER, 'child_1.v'),
    name : 'dependence_1'
};
const TOP_MODULES = [
    {
        path : hdlPath.join(TEST_VLOG_FOLDER, 'parent.v'),
        name : 'Main'
    },
    {
        path : hdlPath.join(TEST_VLOG_FOLDER, 'head_1.v'),
        name : 'dependence_1'
    }
];
const MODULE_NUM = 4;

const HdlParam = base.HdlParam;

// 手动给配置赋值
opeParam.prjInfo.ARCH.Hardware.sim = '';
opeParam.prjInfo.ARCH.Hardware.src = TEST_VLOG_FOLDER;

suite('HDLparser HdlParam Test Suite', () => {

    test('test HdlParam HdlParam.Initialize', () => {
        HdlParam.Initialize();
    });


    test('test HdlParam.getAllModules', () => {
        const allModules = HdlParam.getAllModules();
        assert.equal(allModules.length, MODULE_NUM);
    });


    test('test HdlParam.getAllTopModules', () => {
        const topModules = HdlParam.getAllTopModules();
        assert.equal(topModules.length, TOP_MODULES.length);
        for (const topModule of topModules) {
            let inTopModules = false;
            for (const realTopModule of TOP_MODULES) {
                if (realTopModule.name == topModule.name && realTopModule.path == topModule.path) {
                    inTopModules = true;
                    break;
                }
            }

            assert(inTopModules, 'have not search ' + topModule + ' in ' + TOP_MODULES);
        }
    });


    test('test HdlParam.isTopModule', () => {
        let isTop = HdlParam.isTopModule(TEST_TOP_MODULE.path, TEST_TOP_MODULE.name);
        assert(isTop);
    });


    test('test HdlParam.hasModule', () => {
        let has = HdlParam.hasModule(TEST_MODULE.path, TEST_MODULE.name);
        assert(has);
    });


    test('test HdlParam.findModule', () => {
        let targetModule = HdlParam.findModule(TEST_MODULE.path, TEST_MODULE.name);
        assert.equal(targetModule.name, TEST_MODULE.name);
        assert.equal(targetModule.path, TEST_MODULE.path);
    });


    test('test HdlParam.deleteModule', () => {
        HdlParam.deleteModule(TEST_MODULE.path, TEST_MODULE.name);
        assert(!HdlParam.hasModule(TEST_MODULE.path, TEST_MODULE.name));
        
        let target = HdlParam.getAllModules().filter(mod => mod.name == TEST_MODULE.name && mod.path == TEST_MODULE.path);
        assert.equal(target.length, 0);
    });

});