1. 解决 EPERM: operation not permitted, open 'C:/cookie.json' 问题

目前已知:
- 只要工作区路径包含 D:/project/Code 时即会触发该错误
- 当Tree-sitter相关内容，代码全部删除时才不会报错，此外若是直接注释，即不使用Tree-sitter相关内容时依旧会报错
- 之前是使用断点调试定位到 ./src/extension.js 文件中的 parse.getParser("verilog") 方法，当运行到该方法时触发错误。之后进行调试的时候直接触发错误，即运行debug后就触发。

2. 解决 DocumentSymbolProvider 问题

问题复现： 去除 node_modules/HDLparser/parser_TreeSitter/verilog_parser.js 文件下的
get_generics(tree, lines, parent, HDLSymbol, document, ignore_title) 
方法中的
// let symbolInfo = HDLSymbol.setSymbolInformationWithTreeSitter(item, parent, document);
// HDLSymbol.symbols.push(symbolInfo);
注释，之后再运行sim_test测试工程，打开test.v即会出现如下情况
![param参数出错.png](https://i.loli.net/2021/07/01/8RHPZtBcfWxzCIF.png)

只要是涉及到参数的地方都会出现类似的错误，但是单步debug的时候传入的数据是正确的，当出现该错误的时候悬停提醒等LSP功能均不能使用。

3. 解决 webassembly 工具的文件读写问题，即在生成wasm文件和胶水js文件后如何继续使用内部指令