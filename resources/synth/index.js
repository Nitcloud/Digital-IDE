"use strict";

class render{
    constructor(netlist) {
        this.netlist = netlist;
        this.currNetList = netlist;

        this.container = document.getElementById('netlist_container');
        //Create SVG element
        this.embed_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.embed_svg.setAttribute('style', 'width: 100%; height: 100%');
        this.embed_svg.setAttribute('type', 'image/svg+xml');
        this.embed_svg.id = "svg_synth";
        
    }

    async showNetlist() {
        this.embed_svg.innerHTML = null;
        let svg = await netlistsvg.render(netlistsvg.digitalSkin, this.currNetList);
        //Add to container
        this.embed_svg.innerHTML = svg;

        this.container.innerHTML = null;
        this.container.appendChild(this.embed_svg);

        // 重新注册事件
        this.registerClickEvent();

        this.set_line_width();

        let pan_config = {
            zoomEnabled: true,
            controlIconsEnabled: true,
            maxZoom: 50,
            fit: true,
            center: true
        };
        let pan_zoom = svgPanZoom(this.embed_svg, pan_config);
        pan_zoom.center();
        pan_zoom.resize();
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
        this.currNetList = newNetList;
        this.showNetlist();
    }
}
