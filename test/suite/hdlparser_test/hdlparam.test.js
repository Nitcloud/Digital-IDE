const fs = require('fs');
const assert = require('assert');

const base = require('../../../src/HDLparser/base');
const util = require('../../../src/HDLparser/util');
const HDLPath = require('../../../src/HDLfilesys/operation/path');

const HDLtool = require('../../../src/HDLtool');

const opeParam = require('../../../src/param');

const TEST_ROOT = HDLPath.resolve(__dirname, '../..');
const TEST_VLOG_FOLDER = HDLPath.join(TEST_ROOT, 'vlog/dependence_test');
const TEST_TOP_MODULE = {
    path : HDLPath.join(TEST_VLOG_FOLDER, 'parent.v'),
    name : 'Main'
};
const TEST_MODULE = {
    path : HDLPath.join(TEST_VLOG_FOLDER, 'child_1.v'),
    name : 'dependence_1'
};
const TOP_MODULES = [
    {
        path : HDLPath.join(TEST_VLOG_FOLDER, 'parent.v'),
        name : 'Main'
    },
    {
        path : HDLPath.join(TEST_VLOG_FOLDER, 'head_1.v'),
        name : 'dependence_1'
    },
    {
        path : HDLPath.join(TEST_VLOG_FOLDER, 'head_1.v'),
        name : 'test_1'
    }
];

const DELETE_DEP_TEST = {
    path : HDLPath.join(TEST_VLOG_FOLDER, 'parent.v'),
    name : 'Main',
    includeModules: [
        {
            path : HDLPath.join(TEST_VLOG_FOLDER, 'child_1.v'),
            name : 'dependence_1'
        },
        {
            path : HDLPath.join(TEST_VLOG_FOLDER, 'child_2.v'),
            name : 'dependence_2'
        }
    ]
}
const MODULE_NUM = 5;

const HDLParam = base.HDLParam;

// 手动给配置赋值
const TEST_HDL_FILES = [
    HDLPath.join(TEST_VLOG_FOLDER, 'child_1.v'),
    HDLPath.join(TEST_VLOG_FOLDER, 'child_2.v'),
    HDLPath.join(TEST_VLOG_FOLDER, 'head_1.v'),
    HDLPath.join(TEST_VLOG_FOLDER, 'parent.v')
]

suite('HDLparser HDLParam Test Suite', () => {
    test('test HDLParam HDLParam.Initialize', () => {
        HDLParam.Initialize(TEST_HDL_FILES);
    });

    test('test HDLParam.getAllModules', () => {
        const allModules = HDLParam.getAllModules();
        assert.equal(allModules.length, MODULE_NUM);
    });


    test('test HDLParam.getAllTopModules', () => {
        const topModules = HDLParam.getAllTopModules();
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


    test('test HDLParam.isTopModule', () => {
        let isTop = HDLParam.isTopModule(TEST_TOP_MODULE.path, TEST_TOP_MODULE.name);
        assert(isTop);
    });


    test('test HDLParam.hasModule', () => {
        let has = HDLParam.hasModule(TEST_MODULE.path, TEST_MODULE.name);
        assert(has);
    });


    test('test HDLParam.findModule', () => {
        let targetModule = HDLParam.findModule(TEST_MODULE.path, TEST_MODULE.name);
        assert.equal(targetModule.name, TEST_MODULE.name);
        assert.equal(targetModule.path, TEST_MODULE.path);
    });

    test('test HDLParam.getAllDependences', () => {
        const dependencies = HDLParam.getAllDependences(TEST_TOP_MODULE.path, TEST_TOP_MODULE.name);
        assert.equal(dependencies.current.length, 0);
        assert.equal(dependencies.include.length, 1);
        assert.equal(dependencies.others.length, 1);
        assert.equal(dependencies.include[0], HDLPath.join(TEST_VLOG_FOLDER, 'child_1.v'));
        assert.equal(dependencies.others[0], HDLPath.join(TEST_VLOG_FOLDER, 'child_2.v'));
    });

    test('test HDLParam.deleteModule', () => {
        HDLParam.deleteModule(DELETE_DEP_TEST.path, DELETE_DEP_TEST.name);
        // test not in module
        assert(!HDLParam.hasModule(DELETE_DEP_TEST.path, DELETE_DEP_TEST.name));
        assert(!HDLParam.isTopModule(DELETE_DEP_TEST.path, DELETE_DEP_TEST.name));

        // test used module become top module
        for (const includeMod of DELETE_DEP_TEST.includeModules) {
            assert(HDLParam.isTopModule(includeMod.path, includeMod.name));
        }
    });

});