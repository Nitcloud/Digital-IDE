"use strict";



function findMaxLength(arry) {
    let Max_len = 0;
    for (let i = 0; i < arry.length; i++) {
        if (arry[i].length > Max_len)
        Max_len = arry[i].length;
    }
    return Max_len;
}
exports.findMaxLength = findMaxLength;

function removeDuplicates(arry) {
    let r = [];
    for(var i = 0, l = arry.length; i < l; i++) {
        for(var j = i + 1; j < l; j++)
        if (arry[i] === arry[j]) j = ++i;
        r.push(arry[i]);
    }
    return r;
}
exports.removeDuplicates = removeDuplicates;