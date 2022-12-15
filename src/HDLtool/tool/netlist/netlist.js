"use strict";

const fs = require("fs");
const fspath  = require("path");
const vscode  = require("vscode");
const parser  = require("HDLparser");
const kernel  = require("HDLkernel");
const filesys = require("HDLfilesys");

class showNetlist {
    constructor(context, indexer) {
        this.panel = null;
        this.context = context;
        this.indexer = indexer;
        this.outputCH = vscode.window.createOutputChannel("kernel");
    }

    open_viewer(uri, opeParam) {
        let docPath = uri.fsPath.replace(/\\/g, "\/").replace("//", "/");
        if (filesys.files.isHasAttr(uri, "name")) {
            if (uri.name != null) {
                this.getPrjNetlist({
                    name: uri.name,
                    path: docPath
                }, opeParam);
            }
        } else {
            // 获取当前文件的模块名和模块数 选择要仿真的模块
            parser.utils.selectCurrentFileModule(
                this.indexer.HDLparam, 
                docPath
            ).then((selectModule) => {
                if (selectModule != null) {
                    this.getPrjNetlist({
                        name: selectModule.moduleName,
                        path: selectModule.modulePath
                    }, opeParam);
                }
            });
        }
    }

    createViewer(opeParam) {
        // Create panel
        this.panel = vscode.window.createWebviewPanel(
            'netlist_viewer',
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
                    this.export_as(message.type, message.svg);
                break;
                case 'exec':
                    this.sendPrjNetlist(message.mode, opeParam);
                break;
            }
        }, undefined, this.context.subscriptions);
        let previewHtml = this.getWebviewContent(opeParam);
        this.panel.webview.html = previewHtml;
    }

    async getPrjNetlist(module, opeParam) {
        // 获取工程依赖
        let dependenceFilePathList = parser.utils.getModuleDependence(this.indexer.HDLparam, module);

        // 向内核中导入工程
        this.synth = await kernel.launch();

        // 将执行过程中的日志输出到webview
        var _this = this;
        this.synth.ope.setMessageCallback((message, type) => {
            if (message != '') {
                // console.log(`[${type}]: ${message}`);
                _this.outputCH.append(`[${type}]: ${message}\n`);
            }
            if (type == "error") {
                vscode.window.showErrorMessage(`${type} : ${message}`);
            }
        });

        // 将需要综合的文件进行导入内核 (kernel直接支持include)
        this.synth.ope.loadFile(dependenceFilePathList.inst);
        this.synth.ope.loadFile([module.path]);

        this.createViewer(opeParam);
    }

    sendPrjNetlist(mode, opeParam) {
        // 导出模块的netlist  
        let isSpecified = null;
        if (opeParam.prjInfo) {
            isSpecified = opeParam.prjInfo.TOOL_CHAIN
        }
        this.outputCH.show(true);
        let netlist = this.synth.ope.exportJson(mode, isSpecified);
        this.panel.webview.postMessage({ command: "netlist", netlist: netlist });
    }

    getWebviewContent(opeParam) {
        const path_regExp = /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g;
        const src_path = `${opeParam.rootPath}/resources/netlist`;
        const html_path = src_path + '/netlist_viewer.html';
        let html = fs.readFileSync(html_path, 'utf-8');
        html = html.replace(path_regExp, (m, $1, $2) => {
            return $1 + vscode.Uri.file(fspath.resolve(src_path, $2))
                        .with({ scheme: 'vscode-resource' })
                        .toString() + '"';
        });
        return html;
    }

    export_as(type, svg) {
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