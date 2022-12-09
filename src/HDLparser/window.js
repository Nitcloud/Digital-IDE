const vscode = require('vscode');
const base = require('./base');

const HdlParam = base.HdlParam;

class ModuleInfoItem {
    /**
     * @description 具体请看 vscode.QuickPickItem 接口
     * @param {string} label 
     * @param {string} description 
     */
    constructor(label, description, detail, mod) {
        this.label = label;
        this.description = description;
        this.detail = detail;
        this.mod = mod;
    }
}


/**
 * @description 调用vscode的窗体，让用户从所有的Module中选择模块（为后续的例化准备）
 * @returns {base.Module}
 */
async function selectModuleFromAll() {
    const option = {
        placeHolder: 'Select a Module'
    };

    // make ModuleInfoList
    const items = [];
    for (const mod of HdlParam.getAllModules()) {
        let label = mod.name;
        let desc = 'path ' + mod.path;
        let detail = mod.params.length + ' Param, ' + mod.ports.length + ' Port';
        items.push(new ModuleInfoItem(label, desc, detail, mod));
    }

    const selectModuleInfo = await vscode.window.showQuickPick(items, option);
    if (selectModuleInfo) {
        return selectModuleInfo.mod;
    } else {
        return null;
    }
}

