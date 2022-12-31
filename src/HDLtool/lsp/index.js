const hoverProvider = require('./hover');
const definitionProvider = require('./definition');
const docSymbolProvider = require('./docSymbol');
const completionProvider = require('./completion');

module.exports = {
    hoverProvider,
    definitionProvider,
    docSymbolProvider,
    completionProvider
};