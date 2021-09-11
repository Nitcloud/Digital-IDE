"use strict";

let last_embed_svg;
let pan_zoom;
let last_svg = '';

function print(msg) {
    document.getElementById("output").innerHTML=msg;
}

function synthRun(command) {
    ccall('run', '', ['string'], [command]);
}

function synthSystemReadFile(path) {
    if (FS.findObject(`/${path}`) != null) {
        let content = FS.readFile(`/${path}`, { encoding: 'utf8' });
        return content;
    } else {
        print(`ERROR: The ${path} is not at this synth system.`);
    }
}

function getdirname(path) {
    let newpath = '';
    let list = path.split("/");
    let len = list.length - 1;
    for (let index = 0; index < len; index++) {
        const element = list[index];
        newpath = newpath + element;
        if (index != len - 1) {
            newpath = newpath + '/';
        }
    }
    return newpath;
}

function synthSystemMkdir(path) {
    if (FS.findObject(`/${path}`) != null) {
      return true;
    } else { 
        if (synthSystemMkdir(getdirname(path))) {
            FS.mkdir(`/${path}`);
        }
        return true;
    }
}

function synthSystemWriteFile(content, path) {
    let desDir  = getdirname(path);
    if (FS.findObject(`/${desDir}`) == null) {
        synthSystemMkdir(`/${desDir}`);
        FS.writeFile(`/${path}`, content, { encoding: 'utf8' });
    } else {
        FS.writeFile(`/${path}`, content, { encoding: 'utf8' });
    }
}

function synthSystemRemoveDir(path){
    let files = [];
    if(FS.findObject(`/${path}`) != null) {  
        files = FS.readdir(`/${path}`);
        for (let index = 2; index < files.length; index++) {
            const element = files[index];
            let curPath = PATH.join(`/${path}`,element).replace(/\\/g,"\/");
            let value = FS.isDir(FS.stat(curPath).mode);
            if(value) { 
                synthSystemRemoveDir(curPath);
            } else {    
                FS.unlink(curPath);    
            }
        }   
        FS.rmdir(`/${path}`); //清除文件夹
    }
}

function synthSystemRemoveFile(path) {
    FS.unlink(`/${path}`);
}

function handleLog(Log, type) {
    let newLog = '';
    if (type == "message") {
        newLog = Log.replace(/(\d+?\.)+?\s/, "<font color=#3884D9>[INFO]> </font> ") + "<br>";
    }
    else if (type == "error") {
        let index = Log.indexOf("ERROR:");
        newLog = "<font color=#D15036>[ERROR]> </font>" + 
                Log.substring(0, index) + 
                "<font color=#FFF594>ERROR:" + 
                "<font color=#A074C4>" + 
                Log.substring(index + 6, Log.length) + 
                "</font>" +
                "<br>";
        let output = document.getElementById("output").innerText + newLog;
        print(output);
    }
    return newLog;
}

function synthLoad(path) {
    ccall('run', '', ['string'], [`read_verilog /${path}`]);
}

function synth(cmd_select) {
    let cmd = [
        // Before Behavioral Synth
        "proc; write_json /output.json",
        // After Behavioral Synth
        "proc; opt_clean; write_json /output.json",
        // After RTL Synth
        "synth -run coarse; write_json /output.json",
        "hierarchy -auto-top; memory -nomap; dff2dffe; write_json /output.json",
        "synth -noalumacc -run coarse; write_json /output.json",
    ]
    synthRun(cmd[cmd_select]);
    print(TTY.message);
    let netlist = synthSystemReadFile("output.json");
    return netlist;
}

function set_svg_click(svg) {
    let countries = svg.childNodes;
    for (let i = 0; i < countries.length; i++) {
        countries[i].addEventListener('click', e => {
            let element = e.target;

            if (element.tagName === 'line') {
                let class_name = element.getAttribute("class");
                select_net(class_name);
            }
        });
    }
}

function select_net(class_name) {
    search_in_tree(last_embed_svg, 'line', class_name);
}

function search_in_tree(element, tag_name, class_name) {
    let match = undefined;
    function recursive_searchTree(element, tag_name) {
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
                result = recursive_searchTree(childs[i], tag_name, class_name);
                if (result !== null) {
                    break;
                }
            }
            return result;
        }
        return null;
    }
    recursive_searchTree(element, tag_name, class_name);
    return match;
}

function set_line_width() {
    let tag_name = 'line';
    let element = last_embed_svg;
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
    recursive_searchTree(element, tag_name);
    return match;
}

function normalize_netlist(netlist) {
    try {
        let norm_netlist = netlist;
        let modules = netlist.modules;
        // Obteniendo todas las claves del JSON
        for (let module in modules) {
            let cells_module = modules[module].cells;
            for (let cell in cells_module) {
                let cell_i = cells_module[cell];
                if (cell_i.type === '$dff') {
                    cell_i.type = 'D-Flip Flop';
                }
                else if (cell_i.type === '$adff') {
                    cell_i.type = 'D-Flip Flop areset';
                }
                else if (cell_i.type === '$eq') {
                    cell_i.type = 'equal';
                }
                else {
                    cell_i.type = cell_i.type.replace('$', '');
                }
                if (cell_i.port_directions === undefined) {
                    let tt = cell_i.connections;
                    cell_i.port_directions = {};
                    for (let port in cell_i.connections) {
                        cell_i.port_directions[port] = 'input';
                    }
                }
            }
        }
        norm_netlist.modules = modules;
        return norm_netlist;
    }
    catch (e) {
        return netlist;
    }
}

function refreshModel(synthPrjInfo) {
    let synthStyle = document.getElementById('synthStyle');
    TTY.callback = handleLog;
    TTY.message = '';
    
    let instFiles = synthPrjInfo.instInfo;
    let includeFiles = synthPrjInfo.includeInfo;
    synthRun("design -reset");
    synthSystemRemoveDir("prj");
    synthSystemWriteFile(synthPrjInfo.module.text, synthPrjInfo.module.path);
    for (let index = 0; index < includeFiles.length; index++) {
        const element = includeFiles[index];
        synthSystemWriteFile(element.text, element.path);
    }

    for (let index = 0; index < instFiles.length; index++) {
        const element = instFiles[index];
        synthSystemWriteFile(element.text, element.path);
        synthLoad(element.path);
        print(TTY.message);
    }

    synthLoad(synthPrjInfo.module.path);
    print(TTY.message);

    let netlist = synth(synthStyle.value);
    showNetlist(netlist);
}

function showNetlist(netlist) {
    let netlist_container = document.getElementById('netlist_container');
    netlist = JSON.parse(netlist);
    netlist = normalize_netlist(netlist);
    netlistsvg.render(0, netlist, function (e, svg) {
        //Create SVG element
        let embed_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        embed_svg.setAttribute('style', 'width: 100%; height: 100%');
        embed_svg.setAttribute('type', 'image/svg+xml');
        embed_svg.id = "svg_synth";
        last_svg = svg;
        //Add to container
        netlist_container = document.getElementById('netlist_container');
        netlist_container.innerHTML = '';
        netlist_container.appendChild(embed_svg);

        embed_svg.innerHTML = svg;
        set_svg_click(embed_svg);

        last_embed_svg = embed_svg;
        set_line_width();

        let pan_config = {
            zoomEnabled: true,
            controlIconsEnabled: true,
            maxZoom: 50,
            fit: true,
            center: true
        };
        pan_zoom = svgPanZoom(embed_svg, pan_config);
        pan_zoom.center();
        pan_zoom.resize();
    });
}