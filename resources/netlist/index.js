"use strict";
const vscode = acquireVsCodeApi();

// Handle the message inside the webview


class render{
    constructor() {
        this.netLists = [];
        this.curNetIndex = 0;
        this.container = document.getElementById('netlist_canvas');
        //Create SVG element
        this.embed_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.embed_svg.setAttribute('style', 'width: 100%; height: 100%');
        this.embed_svg.setAttribute('type', 'image/svg+xml');
        this.embed_svg.id = "svg_synth";
    }

    init(netlist) {
        this.netlist = netlist;
        this.netLists.push(netlist);

        var _this = this;
        document.getElementById("last").onclick = function () {
            if (_this.curNetIndex > 0) {
                _this.curNetIndex--;
                _this.showNetlist(_this.netLists[_this.curNetIndex]);        
            }
        };
        document.getElementById("next").onclick = function () {
            if (_this.curNetIndex < _this.netLists.length-1) {
                _this.curNetIndex++;
                _this.showNetlist(_this.netLists[_this.curNetIndex]);
            }
        }
    }

    async showNetlist(netList) {

        let netnode = this.showTreelist(netList);
        var setting = {};
        $(document).ready(function () {
            this.zTreeObj = $.fn.zTree.init($("#netTree"), setting, netnode);
        });

        // remove embed
        svgPanZoom(this.embed_svg).destroy();

        let svg = await netlistsvg.render(netlistsvg.digitalSkin, netList);
        //Add to container
        this.embed_svg.innerHTML = svg;
        
        this.container.appendChild(this.embed_svg);

        // 重新注册事件
        this.registerClickEvent();

        this.set_line_width();

        
        let pan_config = {
            zoomEnabled: true,
            controlIconsEnabled: true,
            minZoom: 0.01,
            maxZoom: 100,
            fit: false,
            center: true
        };
        let pan_zoom = svgPanZoom(this.embed_svg, pan_config);
        pan_zoom.zoom(2);
        pan_zoom.center();
        pan_zoom.resize();
    }

    showTreelist(netlist) {
        let flatModule = netlistsvg.parser(netlistsvg.digitalSkin, netlist);
        let netnode = [
            {
                name: flatModule.moduleName, 
                icon: `./img/icon/TOP.png`,
                open: true, 
                children: []
            }
        ];
        for (let index = 0; index < flatModule.nodes.length; index++) {
            const element = flatModule.nodes[index];
            let cells = {
                name: element.key,
                icon: `./img/icon/cells.png`
            }
            if(element.type == "$_inputExt_") {
                cells.name += "  (input)";
                cells.icon = `./img/icon/port.png`;
            }
            if(element.type == "$_outputExt_") {
                cells.name += "  (output)";
                cells.icon = `./img/icon/port.png`;
            }
            netnode[0].children.push(cells);
        }
        return netnode;
    }

    run() {

    }

    removeClickEvent() {
        function handleRemove() {
            console.log("ok");
        }
        let countries = this.embed_svg.childNodes;
        for (let i = 0; i < countries.length; i++) {
            countries[i].removeEventListener('click', handleRemove);
        }
    }

    registerClickEvent() {
        let countries = this.embed_svg.childNodes;
        for (let i = 0; i < countries.length; i++) {
            countries[i].addEventListener('click', e => {
                let element = e.target;

                if (element.tagName === 'line') {
                    let class_name = element.getAttribute("class");
                    this.handleLineEvent(class_name);
                }
                if (element.tagName === 'rect') {
                    let class_name = element.getAttribute("class");
                    class_name = class_name.replace("cell_", '');
                    this.handleGenericEvent(class_name);
                }
                if (element.tagName === 'path') {
                    let class_name = element.getAttribute("class");
                    class_name = class_name.replace("cell_", '');
                }
            });
        }
    }

    set_line_width() {
        let tag_name = 'line';
        let width = 2;
        let match = undefined;
        function recursive_searchTree(element, tag_name) {
            let type = element.tagName;
            if (type === tag_name) {
                element.style = `stroke:#000000;stroke-width:${width}`;
                match = element;
            }
            else if (element !== null) {
                let i;
                let result = null;
                let childs = element.childNodes;
                for (i = 0; result === null && i < childs.length; i++) {
                    result = recursive_searchTree(childs[i], tag_name);
                    if (result !== null) {
                        break;
                    }
                }
                return result;
            }
            return null;
        }
        recursive_searchTree(this.embed_svg, tag_name);
        return match;
    }

    handleLineEvent(class_name) {
        let match = undefined;
        function recursive_searchLine(element, tag_name) {
            let type = element.tagName;
            let class_name_i = undefined;
            try {
                class_name_i = element.getAttribute("class");
            }
            catch {
                class_name_i = '';
            }
    
            if (type === tag_name && class_name_i === class_name) {
                element.style = "stroke:#84da00;stroke-width:3";
                match = element;
            }
            else if (type === tag_name && class_name_i !== class_name) {
                element.style = "stroke:#000000;stroke-width:2";
            }
            else if (element !== null) {
                let i;
                let result = null;
                let childs = element.childNodes;
                for (i = 0; result === null && i < childs.length; i++) {
                    result = recursive_searchLine(childs[i], tag_name, class_name);
                    if (result !== null) {
                        break;
                    }
                }
                return result;
            }
            return null;
        }
        recursive_searchLine(this.embed_svg, "line", class_name);
        return match;
    }

    handleGenericEvent(class_name) {
        let newNetList = {
            "modules" : {}
        }
        for (const module in this.netlist.modules) {
            if (module.toLowerCase() === class_name.toLowerCase()) {
                newNetList.modules[class_name] = this.netlist.modules[module];
                break;
            }
        }
        this.curNetIndex++;
        this.netLists = this.netLists.slice(0,this.curNetIndex);
        this.netLists.push(newNetList);
        this.showNetlist(this.netLists[this.curNetIndex]);
    }
}