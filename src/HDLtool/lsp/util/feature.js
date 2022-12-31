const vscode = require('vscode');

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


module.exports = {
    transferVlogNumber
};