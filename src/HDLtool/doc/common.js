const assert = require('assert');
const showdown = require('showdown');

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

class Svg extends BaseDoc {
    constructor(uri) {
        super();
        this.uri;
    }
};


class MarkdownString {
    /**
     * @param {number} line start line number of module in the file 
     */
    constructor(line) {
        this.line = line
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


module.exports = {
    converter,
    BaseDoc,
    MarkdownString
};