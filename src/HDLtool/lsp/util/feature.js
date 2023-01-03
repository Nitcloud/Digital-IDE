const vscode = require('vscode');
const HDLFile = require('../../../HDLfilesys/operation/files');
const HDLPath = require('../../../HDLfilesys/operation/path');
const { Range } = require('../../../HDLparser');

const vlogNumberReg = {
    'h' : /[0-9]+?'h([0-9a-fA-F_]+)/g,
    'b' : /[0-9]+?'b([0-1_]+)/g,
    'o' : /[0-9]+?'o([0-7_]+)/g,
};

const vhdlNumberReg = {
    'h' : /x"([0-9a-fA-F_]+)"/g,
    'b' : /([0-1_]+)"/g,
};


/**
 * @description recognize and transfer number
 * @param {string} lineText 
 * @param {number} character
 * @returns {{unsigned: number, signed: number}} 
 */
async function transferVlogNumber(lineText, character) {
    let numberReg = /[0-9]/;
    let opt = null;
    let numberString = null;

    if (numberReg.test(lineText[character])) {
        const leftPart = [];
        const rightPart = [];
        const length = lineText.length;
        for (let i = character - 1; i >= 0; -- i) {
            const ch = lineText[i];
            if (numberReg.test(ch)) {
                leftPart.push(ch);
            } else if (Object.keys(vlogNumberReg).includes(ch)) {
                if (i == 0) {
                    return null;
                } else if (lineText[i - 1] == "'") {
                    opt = ch;
                    break;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        for (let i = character + 1; i < length; ++ i) {
            const ch = lineText[i];
            if (numberReg.test(ch)) {
                rightPart.push(ch);
            } else {
                break;
            }
        }

        const leftWord = leftPart.reverse().join('');
        const rightWord = rightPart.join('');
        numberString = leftWord + lineText[character] + rightWord;
    } else {
        return null;
    }

    if (opt && numberString) {
        return string2num(numberString, opt);
    } else {
        return null;
    }
}

/**
 * @descriptionCn 将数字字符串转数字(包括有符号与无符号)
 * @param {String} str 数字字符串
 * @param {String} opt 需要转换的进制 hex | bin | oct
 * @returns {{unsigned: number, signed: number}} {
 *      'unsigned' : unsigned, // 有符号数
 *      'signed' : signed,     // 无符号数
 *  }
 */
function string2num(str, opt) {
    switch (opt) {
        case 'h':
            opt = 16;
        break;
        case 'b':
            opt = 2;
        break;
        case 'o':
            opt = 8;
        break;
        default: break;
    }

    let unsigned = parseInt(str, opt);
    let pow = Math.pow(opt, str.length);

    let signed = unsigned;
    if (unsigned >= pow >> 1) {
        signed = unsigned - pow;
    }

    return {
        'unsigned' : unsigned,
        'signed' : signed,
    };
}

/**
 * @descriptionCn 将二进制字符串转浮点数
 * @param {String} bin 
 * @param {Number} exp 
 * @param {Number} fra 
 * @returns {Number}
 */
function bin2float(bin, exp, fra) {
    if (bin.length < exp + fra +1) {
        return null;
    } else {
        const bais = Math.pow(2, (exp-1))-1;
        exp = exp - bais;
        
    }
}

async function getFullSymbolInfo(document, range, nonblank, l_comment_symbol, l_comment_regExp, needDefinition=true) {
    const comments = [];
    if (needDefinition) {
        const definitionString = document.getText(new vscode.Range(range.start, range.end));    
        comments.push(definitionString);
    }

    let content = '';
    let is_b_comment = false;
    let line = range.start.line + 1;
    
    while (line) {
        line--;
        content = document.lineAt(line).text;
        // 首先判断该行是否是空白
        let isblank = content.match(nonblank);
        if (!isblank) {
            continue; 
        }

        if (is_b_comment) {
            let b_comment_begin_index = content.indexOf('/*');
            if (b_comment_begin_index == -1) {
                comments.push(content + '\n');
                continue;
            }
            comments.push(content.slice(b_comment_begin_index, content.length) + '\n');
            is_b_comment = false;
            content = content.slice(0, b_comment_begin_index);
            if (content.match(nonblank)) {
                break;
            }
            continue;
        }

        // 判断该行是否存在行注释
        let l_comment_index = content.indexOf(l_comment_symbol);
        if (l_comment_index >= 0) {
            let before_l_comment = content.slice(0, l_comment_index);
            before_l_comment = del_comments(before_l_comment, this.b_comment);
            if (before_l_comment.match(nonblank)) {
                // 如果去除块注释之后还有字符则认为该注释不属于所要的
                if (line == range.start.line) {
                    // let b_comment_last_index = content.lastIndexOf('*/');
                    // b_comment_last_index = (b_comment_last_index == -1) ? 0 : (b_comment_last_index + 2);
                    // comments.push(content.slice(b_comment_last_index, l_comment_index) + '\n');
                    comments.push(content.slice(l_comment_index, content.length) + '\n');
                    continue;
                }
                break; 
            }

            // 否则该行全为该定义的注释
            comments.push(content + '\n');
            continue;
        }

        // 判断该行是否存在块注释
        let b_comment_end_index = content.indexOf('*/');
        if (b_comment_end_index >= 0) {
            b_comment_end_index += 2; 
            let behind_b_comment = content.slice(b_comment_end_index, content.length);
            behind_b_comment = del_comments(behind_b_comment, l_comment_regExp);
            if (behind_b_comment.match(nonblank)) {
                // 如果去除块注释之后还有字符则认为该注释不属于所要的
                if (line == range.start.line) {
                    comments.push(content.slice(0, b_comment_end_index) + '\n');
                    is_b_comment = true;
                    continue;
                }
                break; 
            }

            comments.push(content + '\n');
            is_b_comment = true;
            continue;
        }

        // 说明既不是块注释又不是行注释所以就是到了代码块
        if (line != range.start.line) {
            break;
        }
    }

    return comments.reverse().join('');
}

/**
 * @descriptionCn  get definition and comment of a range
 * @param {string} path
 * @param {Range} range
 * @returns {string}
 */
async function getSymbolComment(path, range) {
    let languageId = HDLFile.getLanguageId(path);
    const uri = vscode.Uri.file(path);
    const documentPromise = vscode.workspace.openTextDocument(uri);

    // get comment reg util
    const nonblank = /\S+/g;
    const l_comment = getCommentUtilByLanguageId(languageId);
    let l_comment_symbol = l_comment.l_comment_symbol;
    let l_comment_regExp = l_comment.l_comment_regExp;

    // add definition first
    const document = await documentPromise;
    return await getFullSymbolInfo(document, range, nonblank, l_comment_symbol, l_comment_regExp);
}

/**
 * @descriptionCn  get definition and comment of a range
 * @param {string} path
 * @param {Array<Range>} ranges
 * @returns {Promise<Array<string>>}
 */
async function getSymbolComments(path, ranges) {
    let languageId = HDLFile.getLanguageId(path);
    const uri = vscode.Uri.file(path);
    const documentPromise = vscode.workspace.openTextDocument(uri);

    // get comment reg util
    const nonblank = /\S+/g;
    const l_comment = getCommentUtilByLanguageId(languageId);
    let l_comment_symbol = l_comment.l_comment_symbol;
    let l_comment_regExp = l_comment.l_comment_regExp;

    // add definition first
    const document = await documentPromise;
    const commentPromises = [];
    const comments = [];
    for (const range of ranges) {
        const commentP = getFullSymbolInfo(document, range, nonblank, l_comment_symbol, l_comment_regExp, false);
        commentPromises.push(commentP);
    }

    for (const cp of commentPromises) {
        comments.push(await cp);
    }
    return comments;
}

/**
 * 
 * @param {string} languageId 
 * @returns {{l_comment_symbol: string, l_comment_regExp: RegExp}}
 */
function getCommentUtilByLanguageId(languageId) {
    switch (languageId) {
        case "verilog":
        case "systemverilog":
            return {
                l_comment_symbol: '//',
                l_comment_regExp:  /\/\/.*/g
            };
        case "vhdl":
            return {
                l_comment_symbol: '--',
                l_comment_regExp:  /--.*/g
            };
        default: return null;
    }
}

/**
 * @state finish - tested
 * @descriptionCn 仅将文本中的块注释全部去掉
 * @descriptionEn delete all comment form verilog code
 * @param {string} text Verilog code input
 * @returns Verilog code output after deleting all comment content
 */
function del_comments(text, regExp) {
    let match = text.match(regExp);
    if (match != null) {
        for (let i = 0; i < match.length; i++) {
            const element = match[i];
            const newElement = ' '.repeat(element.length);
            text = text.replace(element,newElement);
        }
    }
    return text;
}

/**
 * @descriptionCn 将大于spacingNum的空格进行缩减删除
 * @param {string} content    待处理的文本   
 * @param {number} spacingNum 无需缩减的最大空格数
 * @returns 缩减删除之后的内容
 */
function del_spacing(content, spacingNum) {
    let newContent = '';
    let i = 0;
    for (let index = 0; index < content.length; index++) {
        const element = content[index];
        if (element == ' ') {
            i++;
        }
        if (((element != ' ') && (element != '\t')) || (i <= spacingNum)) {
            newContent = newContent + element;
            if (i > spacingNum) {
                i = 0;
            }
        }
    }
    return newContent;
}

module.exports = {
    transferVlogNumber,
    getSymbolComment,
    getSymbolComments
}