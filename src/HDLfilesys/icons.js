const opeParam = require('../param');

function getIconPath(type, iconName) {
    return `${opeParam.rootPath}/images/svg/${type}/` + iconName + ".svg";
}

function getIconConfig(iconName) {
    return {
        light: getIconPath('light', iconName),
        dark: getIconPath('dark', iconName)
    };
}

module.exports = {
    getIconPath,
    getIconConfig
}