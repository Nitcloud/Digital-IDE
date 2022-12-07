# 项目测试

## 运行测试
该项目中使用了vscode的插件测试进行单位测试。我们已经在`.vscode/launch.json`中写入了对应的启动配置，如果没有，请在目标的configure中加入：

```json
{
    "name": "Extension Tests",
    "type": "extensionHost",
    "request": "launch",
    "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
        "--extensionTestsPath=${workspaceFolder}/test/suite/index"
    ]
}
```

然后在vscode的左侧栏的“运行和调试”中选择Extension Tests，然后按下F5进入调试界面。届时，请看“调试控制台”而非“终端”查看信息。


## 编写测试文件
所有的测试文件都在`test/suite`下。除了index.js外，所有的`**.test.js`文件或者文件夹下的`**.test.js`文件都是会被运行的文件。