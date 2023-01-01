const hoverProvider = require('./hover');
const definitionProvider = require('./definition');
const docSymbolProvider = require('./docSymbol');
const completionProvider = require('./completion');
const formatterProvider = require('./formatter');
const linterProvider = require("./linter");
const translateProvider = require("./translate");

module.exports = {
    hoverProvider,
    definitionProvider,
    docSymbolProvider,
    completionProvider,
    formatterProvider,
    linterProvider,
    translateProvider
};