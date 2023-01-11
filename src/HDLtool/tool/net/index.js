"use strict";

const vscode  = require("vscode");
const kernel  = require("../../../HDLkernel");
const fs = require("../../../HDLfilesys");
const fspath = require("path");
const opeParam = require("../../../param");
const HDLParam = require("../../../HDLparser").HDLParam;

class showNetlist {
    constructor(context) {
        this.panel = null;
        this.context = context;
        this.outputCH = vscode.window.createOutputChannel("kernel");
    }

    async open(uri) {
        // 获取工程依赖
        let files = [];
        const path = fs.paths.toSlash(uri.fsPath)
        if (uri.name) {
            files = HDLParam.getAllDependences(
                path,
                uri.name
            ).others;
        } else {
            const modules = HDLParam.findModuleByPath(path);
            for (const module of modules) {
                files = files.concat(HDLParam.getAllDependences(
                    module.path,
                    module.name
                ).others)
            }
        }

        files.push(path);

        // 向内核中导入工程
        this.synth = new kernel();
        await this.synth.launch();

        // 将执行过程中的日志输出到webview
        var _this = this;
        this.synth.setMessageCallback((message, type) => {
            if (message != '') {
                // console.log(`[${type}]: ${message}`);
                _this.outputCH.append(`[${type}]: ${message}\n`);
            }
            if (type == "error") {
                vscode.window.showErrorMessage(`${type} : ${message}`);
            }
        });

        // 将需要综合的文件进行导入内核 (kernel直接支持include)
        this.synth.load(files);
        this.create();
    }

    create() {
        // Create panel
        this.panel = vscode.window.createWebviewPanel(
            'netlist',
            'Schematic viewer',
            vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this.panel.onDidDispose(() => {
            // When the panel is closed, cancel any future updates to the webview content
            this.panel = null;
            this.synth = null;
        }, null, this.context.subscriptions);

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'export':
                    this.export(message.type, message.svg);
                break;
                case 'exec':
                    this.send(message.mode);
                break;
            }
        }, undefined, this.context.subscriptions);

        const previewHtml = this.getWebviewContent();
        this.panel.webview.html = previewHtml;
    }
    

    send(mode) {
        // 导出模块的netlist  
        this.outputCH.show(true);
        this.panel.webview.postMessage({ 
            command: "netlist", 
            netlist: this.synth.export({
                'type' : "json"
            })
        });
    }

    getWebviewContent() {
        const path_regExp = /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g;
        const src_path = `${opeParam.rootPath}/resources/netlist`;
        const html_path = src_path + '/netlist_viewer.html';
        const html = fs.files.readFile(html_path);
        return html.replace(path_regExp, (m, $1, $2) => {
            return $1 + vscode.Uri
                        .file(fspath.resolve(src_path, $2))
                        .with({ scheme: 'vscode-resource' })
                        .toString() + '"';
        });
    }

    export(type, svg) {
        switch (type) {
            case "svg":
                this.export_svg(svg);
            break;
        
            default: break;
        }
    }

    export_svg(svg) {
        let filter = { 'svg': ['svg'] };
        vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
            let path_full = fileInfos === null || fileInfos === void 0 ? void 0 : fileInfos.path;
            if (path_full !== undefined) {
                if (path_full[0] === '/' && require('os').platform() === 'win32') {
                    path_full = path_full.substring(1);
                }
                fs.writeFileSync(path_full, `${svg}`, "utf-8");
                vscode.window.showInformationMessage(`Schematic saved in ${path_full}`);
            }
        });
    }
}
module.exports = showNetlist;