const fs = require('fs');
const vscode = require('vscode');
const readline = require('readline');
const json5 = require('json5');


const renderAny = require('wavedrom/lib/render-any');
const onmlStringify = require('onml/stringify.js');
const darkSkin = require('wavedrom/skins/dark');
const lightSkin = require('wavedrom/skins/default');

const Style = {
    light : lightSkin,
    dark : darkSkin
};

const Global = {
    makeTimes : 0
}

function getThemeColorKind() {
    const currentColorKind = vscode.window.activeColorTheme.kind;
    if (currentColorKind == vscode.ColorThemeKind.Dark || currentColorKind == vscode.ColorThemeKind.HighContrast) {
        return 'dark';
    } else {
        return 'light';
    }
}

class WavedromString {
    constructor(line) {
        this.line = line;
        this.value = '';
    }
    add(text) {
        this.value += text;
    }
    render() {
        const style = getThemeColorKind();
        return makeWaveDromSVG(this.value, style);
    }
}

/**
 * @description make svg according to the input wavedrom-style json
 * @param {string} wavedromComment
 * @param {string} style light, dark
 * @returns {string} 
 */
function makeWaveDromSVG(wavedromComment, style) {
    try {
        const json = json5.parse(wavedromComment);
        const index = Global.makeTimes;
        const skin = Style[style];
        const renderObj = renderAny(Global.makeTimes, json, skin);
        const svgString = onmlStringify(renderObj);
        Global.makeTimes += 1;
        return "<br>" + svgString + "<br>";
    } catch (error) {
        console.log(error);
        return undefined;
    }
}


/**
 * @description make object of wavedroms according to a HDL file
 * @param {string} path 
 * @returns {Array<WavedromString>}
 */
function getWavedromsFromFile(path) {
    let lineID = 0;
    let findWavedrom = false;
    const wavedroms = [];

    const text = fs.readFileSync(path, 'utf-8');
    // TODO : parse it line by line 
    for (const line of text.split('\n')) {
        lineID += 1;
        if (findWavedrom) {
            if (/\*\//g.test(line)) {
                findWavedrom = false;
            } else {
                const currentWav = wavedroms[wavedroms.length - 1];
                currentWav.add(line.trim());
            }
        } else {
            if (/\/\*[\s\S]*(@wavedrom)/g.test(line)) {
                findWavedrom = true;
                const newWavedrom = new WavedromString(lineID);
                wavedroms.push(newWavedrom);
            }
        }
    }

    return wavedroms;
}

module.exports = {
    WavedromString,
    makeWaveDromSVG,
    getWavedromsFromFile
};