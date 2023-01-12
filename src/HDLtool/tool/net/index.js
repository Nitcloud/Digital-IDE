"use strict";

const vscode  = require("vscode");
const kernel  = require("../../../HDLkernel");
const fs = require("../../../HDLfilesys");
const fspath = require("path");
const opeParam = require("../../../param");
const HDLPath = require("../../../HDLfilesys/operation/path");
const HDLFile = require("../../../HDLfilesys/operation/files");
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
        const path = fs.paths.toSlash(uri.fsPath);
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
        this.synth.setMessageCallback((message, type) => {
            if (message != '') {
                this.outputCH.append(`[${type}]: ${message}\n`);
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
            console.log(message);
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
        const command = 'netlist';
        const netlist = this.synth.export({type: 'json'});
        this.panel.webview.postMessage({command, netlist});
    }

    getWebviewContent() {
        const netlistPath = HDLPath.join(opeParam.rootPath, 'resources', 'netlist')
        const htmlIndexPath = HDLPath.join(netlistPath, 'netlist_viewer.html');
        const html = fs.files.readFile(htmlIndexPath);
        return html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri
                        .file(fspath.resolve(netlistPath, $2))
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
                HDLFile.writeFile(path_full, svg);
                // fs.writeFileSync(path_full, svg, "utf-8");
                vscode.window.showInformationMessage(`Schematic saved in ${path_full}`);
            }
        });
    }
}
module.exports = showNetlist;