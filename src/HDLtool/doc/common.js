const assert = require('assert');
const vscode = require('vscode');
const showdown = require('showdown');
const fs = require('fs');
const json5 = require('json5');

const renderAny = require('wavedrom/lib/render-any');
const onmlStringify = require('onml/stringify.js');
const darkSkin = require('wavedrom/skins/dark');
const lightSkin = require('wavedrom/skins/default');

const Global = {
    svgMakeTimes : 0
};

const converter = new showdown.Converter({
    tables : true,
    literalMidWordUnderscores : true,
    strikethrough : true,
    simpleLineBreaks : true
});

const MarkdownTag = {
    Title : '#',
    Quote : '>',
    Bold : '**',
    Italic : '*',
    InlineCode : '`',
    UnorderedList : '-'
};

const MarkdownAlign = {
    Left : 'Left',
    Center : 'Center',
    Right : 'Right'    
};

const RenderType = {
    Wavedrom : 'Wavedrom',
    Markdown : 'Markdown'
}

const MarkdownAlignSpliter = {
    Left : ':---',
    Center : ':---:',
    Right : '---:'
};

/**
 * @description join string with a space gap
 * @param  {...string} strings 
 * @returns {string}
 */
function joinString(...strings) {
    return strings.join(' ');
}

/**
 * @description join strings directly
 * @param  {...string} strings 
 * @returns {string}
 */
function catString(...strings) {
    return strings.join('');
}

function getThemeColorKind() {
    const currentColorKind = vscode.window.activeColorTheme.kind;
    if (currentColorKind == vscode.ColorThemeKind.Dark || currentColorKind == vscode.ColorThemeKind.HighContrast) {
        return 'dark';
    } else {
        return 'light';
    }
}

class BaseDoc {
    constructor(value) {
        this.value = value;
    }
};


class Text extends BaseDoc {
    constructor(value) {
        super();
        this.value = value;
    }
};

class Title extends BaseDoc {
    /**
     * @description title, tag # in markdown
     * @param {string} value title
     * @param {number} level level of title, support 1 to 5
     */
    constructor(value, level) {
        super();
        this.level = level;
        const prefix = MarkdownTag.Title.repeat(level);
        this.value = joinString(prefix, value);
    }
};


class UnorderedList {
    constructor(values) {
        this.value = '';
        for (const v of values) {
            this.value += joinString(MarkdownTag.UnorderedList, v, '\n');
        }
    }
};

class OrderedList {
    constructor(values) {
        let id = 1;
        this.values = '';
        for (const v of values) {
            this.value += joinString(id + '.', v, '\n');
        }
    }
};

class Quote extends BaseDoc {
    /**
     * @description quote, tag > in markdown
     * @param {string} value 
     */
    constructor(value) {
        super();
        this.value = joinString(MarkdownTag.Quote, value);   
    }
};

class Bold extends BaseDoc {
    constructor(value) {
        super();
        this.value = catString(MarkdownTag.Bold, value, MarkdownTag.Bold);
    }
};

class Italic extends BaseDoc {
    constructor(value) {
        super();
        this.value = catString(MarkdownTag.Italic, value, MarkdownTag.Italic);
    }
};

class InlineCode extends BaseDoc {
    constructor(value) {
        super();
        this.value = catString(MarkdownTag.InlineCode, value, MarkdownTag.InlineCode);
    }
}

class Split extends BaseDoc {
    constructor() {
        super();
        this.value = '---';
    }
};

class Table extends BaseDoc {
    /**
     * @description table
     * @param {Array<string>} fieldNames head of table
     * @param {Array<Array<string>>} rows data in the table
     * @param {string} align              align of data in table, must be in MarkdownAlign
     */
    constructor(fieldNames, rows, align=MarkdownAlign.Left) {
        super();
        const colNum = fieldNames.length;
        const rowNum = rows.length;
        const alignString = MarkdownAlignSpliter[align];

        let value = catString('| ', fieldNames.join(' | '), ' |', '\n');
        const alignUnit = catString('| ', alignString, ' ');
        value += catString(alignUnit.repeat(colNum), '|', '\n');
        for (let row = 0; row < rowNum; ++ row) {
            const data = rows[row];
            value += catString('| ', data.join(' | '), '|');
            if (row < rowNum - 1) {
                value += '\n';
            }
        }
        this.value = value;
    }
};

class RenderString {
    /**
     * @param {number} line start line id of the render 
     * @param {string} type type, must be in RenderType 
     */
    constructor(line, type) {
        this.line = line;
        this.type = type;
    }
    /**
     * @description render to the target html string
     * @returns {string}
     */
    render() {}
}

class MarkdownString extends RenderString {
    /**
     * @param {number} line start line number of module in the file 
     */
    constructor(line) {
        super(line, RenderType.Markdown);
        this.values = [];
    }
    addText(value, end='\n') {
        const tag = new Text(value);
        this.values.push({tag, end});
    }
    addTitle(value, level, end='\n') {
        const tag = new Title(value, level);
        this.values.push({tag, end});
    }
    addQuote(value, end='\n') {
        const tag = new Quote(value);
        this.values.push({tag, end});
    }
    addBold(value, end='\n') {
        const tag = new Bold(value);
        this.values.push({tag, end});
    }
    addEnter() {
        const tag = {value : ''};
        const end = '\n';
        this.values.push({tag, end});
    }
    addItalic(value, end='\n') {
        const tag = new Italic(value);
        this.values.push({tag, end});
    }
    addInlineCode(value, end='\n') {
        const tag = new InlineCode(value);
        this.values.push({tag, end});
    }
    addUnorderedList(values) {
        const end = '';
        const tag = new UnorderedList(values);
        this.values.push({tag, end});
    }
    addOrderedList(values) {
        const end = '';
        const tag = new OrderedList(values);
        this.values.push({tag, end});
    }
    addSplit(value) {
        const end = '\n';
        const tag = new Split();
        this.values.push({tag, end});
    }
    addTable(fieldNames, rows, align=MarkdownAlign.Left, end='\n') {
        const tag = new Table(fieldNames, rows, align);
        this.values.push({tag, end});
    }
    renderMarkdown() {
        let markdown = '';
        for (const md of this.values) {
            markdown += md.tag.value + md.end;
        }
        return markdown;
    }
    render() {
        const rawMD = this.renderMarkdown();
        return converter.makeHtml(rawMD);
    }
};


const SvgStyle = {
    light : lightSkin,
    dark : darkSkin
};

class WavedromString extends RenderString {
    constructor(line) {
        super(line, RenderType.Wavedrom);
        this.value = '';
    }
    add(text) {
        this.value += text;
    }
    render() {
        const style = getThemeColorKind();
        return makeWaveDromSVG(this.value, style);
    }
};

/**
 * @description make svg according to the input wavedrom-style json
 * @param {string} wavedromComment
 * @param {string} style light, dark
 * @returns {string} 
 */
function makeWaveDromSVG(wavedromComment, style) {
    try {
        const json = json5.parse(wavedromComment);
        const index = Global.svgMakeTimes;
        const skin = SvgStyle[style];
        const renderObj = renderAny(Global.svgMakeTimes, json, skin);
        const svgString = onmlStringify(renderObj);
        Global.svgMakeTimes += 1;
        return "<br>" + svgString + "<br>";
    } catch (error) {
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


/**
 * @description merge sort by line
 * @param {Array<MarkdownString>} docs
 * @param {Array<WavedromString>} svgs 
 * @returns {Array<RenderString>}
 */
 function mergeSortByLine(docs, svgs) {
    const renderList = [];
    let i = 0, j = 0;
    while (i < docs.length && j < svgs.length) {
        if (docs[i].line < svgs[j].line) {
            renderList.push(docs[i]);
            i ++;
        } else {
            renderList.push(svgs[j]);
            j ++;
        }
    }
    while (i < docs.length) {
        renderList.push(docs[i]);
        i ++;
    }
    while (j < svgs.length) {
        renderList.push(svgs[j]);
        j ++;
    }
    return renderList;
}



module.exports = {
    converter,
    mergeSortByLine,
    RenderType,
    BaseDoc,
    MarkdownString,
    WavedromString,
    RenderString,
    makeWaveDromSVG,
    getWavedromsFromFile
};