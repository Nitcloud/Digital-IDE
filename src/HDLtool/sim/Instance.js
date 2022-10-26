"use strict";

let vscode  = require("vscode");
let parser  = require("HDLparser");

function instantiateModuleInteract(indexer, workspacePath) {
    var doc = vscode.window.activeTextEditor.document;
    parser.utils.selectModuleFromAll(indexer.HDLparam, workspacePath).then(selectModule => {
        if (selectModule != null) {
            let instContent = null;
            switch (doc.languageId) {
                case "systemverilog":
                case "verilog":   
                    instContent = instantiateVlogModule(selectModule);
                break;
                case "vhdl":   
                    instContent = instantiateVhdlModule(selectModule);
                break;
                default: break;
            }
            selectInsert(instContent);
        }
    })
}
exports.instantiateModuleInteract = instantiateModuleInteract;

function selectInsert(content) {
    let editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }
    let selections = editor.selections;
    editor.edit((editBuilder) => {
        selections.forEach((selection) => {
            editBuilder.insert(selection.active, content);
        });
    });
}
exports.selectInsert = selectInsert;

function instantiateVlogModule(module) {
    // module 2001 style
    let initPortMax_len = 0;
    let initPort = '';

    for (let i = 0; i < module.ports.length; i++) {
        if (module.ports[i].type == "output") {
            if (module.ports[i].portWidth.length > initPortMax_len) {
                initPortMax_len = module.ports[i].portWidth.length;
            }
        }
    }

    for (let i = 0; i < module.ports.length; i++) {
        if (module.ports[i].type == "output") {
            let widthElement = module.ports[i].portWidth;
            let padding = initPortMax_len - widthElement.length + 1;
            if (module.languageId == "vhdl") {
                widthElement = widthElement.replace('(','[').replace(')',']');
                widthElement = widthElement.replace(/downto/mgi,':') + ' '.repeat(padding);
            }
            initPort += `wire ${widthElement}\t${module.ports[i].portName};\n`;
        }
    }

    let paramString = '';
    if (module.params.length > 0) {
        paramString = `#(\n${instantiateVlogParam(module.params)})\n`;
    }
    let portString = '';
    portString = instantiateVlogPort(module.ports);

    let instContent = initPort + "\n";
    instContent += module.moduleName;
    instContent += " ";
    instContent += paramString;
    instContent += `u_${module.moduleName}(\n`;
    instContent += portString;
    instContent += ');\n';

    return instContent;
}
exports.instantiateVlogModule = instantiateVlogModule;

function instantiateVhdlModule(module) {
    // module 2001 style
    let paramString = ``;
    if (module.params.length > 0) {
        paramString = `generic map(\n${instantiateVhdlParam(module.params)})\n`;
    }
    let portString = ``;
    portString = `port map(\n${instantiateVhdlPort(module.ports)})`;

    // let instContent = initPort + "\n";
    let instContent = `u_${module.moduleName} : ${module.moduleName}\n`;
    instContent += paramString;
    instContent += portString;
    instContent += ';\n';

    return instContent;
}
exports.instantiateVhdlModule = instantiateVhdlModule;

function instantiateVlogPort(ports) {
    let port = '';
    let max_len = 0;
    for (let index = 0; index < ports.length; index++) {
        if (ports[index].portName.length > max_len) {
            max_len = ports[index].portName.length;
        }
    }
    // .NAME(NAME)
    port += `\t//ports\n`;
    for (let i = 0; i < ports.length; i++) {
        let nameElement = ports[i].portName;
        let padding = max_len - nameElement.length + 1;
        nameElement = nameElement + ' '.repeat(padding);
        port += `\t.${nameElement}\t\t( ${nameElement}\t\t)`;
        if (i != ports.length - 1) {
            port += ',';
        }
        port += '\n';
    }
    
    return port;
}

function instantiateVlogParam(params) {
    let param = '';
    let nameMax_len = 0;
    let initMax_len = 0;
    for (let i = 0; i < params.length; i++) {
        if (params[i].paramName.length > nameMax_len) {
            nameMax_len = params[i].paramName.length;
        }
    }

    for (let i = 0; i < params.length; i++) {
        params[i].paramInit = params[i].paramInit.replace(',','');
        if (params[i].paramInit.length > initMax_len) {
            initMax_len = params[i].paramInit.length;
        }
    }
    // .NAME  ( INIT  ),
    for (let i = 0; i < params.length; i++) {
        let elementName = params[i].paramName;
        let elementInit = params[i].paramInit;

        let namePadding = nameMax_len - elementName.length + 1;
        let initPadding = initMax_len - elementInit.length + 1;

        elementName = elementName + ' '.repeat(namePadding);
        elementInit = elementInit + ' '.repeat(initPadding);

        param += `\t.${elementName}\t\t( ${elementInit}\t\t)`;
        if (i !== params.length - 1) {
            param += ',';
            param += '\n';
        }
    }
    return param;
}

function instantiateVhdlPort(ports) {
    let port = '';
    let max_len = 0;
    for (let index = 0; index < ports.length; index++) {
        if (ports[index].portName.length > max_len) {
            max_len = ports[index].portName.length;
        }
    }
    // NAME => NAME,
    port += `\n\t-- ports\n`;
    for (let i = 0; i < ports.length; i++) {
        let nameElement = ports[i].portName;
        let padding = max_len - nameElement.length + 1;
        nameElement = nameElement + ' '.repeat(padding);
        port += `\t${nameElement} => ${ports[i].portName}`;
        if (i !== ports.length - 1) {
            port += ',';
        }
        port += '\n';
    }
    return port;
}

function instantiateVhdlParam(params) {
    let param = '';
    let nameMax_len = 0;
    // let initMax_len = 0;
    for (let i = 0; i < params.length; i++) {
        if (params[i].paramName.length > nameMax_len) {
            nameMax_len = params[i].paramName.length;
        }
    }

    // for (let i = 0; i < params.length; i++) {
    //     params[i].paramInit = params[i].paramInit.replace(',','');
    //     if (params[i].paramInit.length > initMax_len) {
    //         initMax_len = params[i].paramInit.length;
    //     }
    // }
    // NAME => NAME,
    for (let i = 0; i < params.length; i++) {
        let elementName = params[i].paramName;
        let elementInit = params[i].paramInit;

        let namePadding = nameMax_len - elementName.length + 1;
        // let initPadding = initMax_len - elementInit.length + 1;

        elementName = elementName + ' '.repeat(namePadding);
        // elementInit = elementInit + ' '.repeat(initPadding);

        param += `\t${elementName} => ${elementInit}`;
        if (i !== params.length - 1) {
            param += ',';
            param += '\n';
        }
    }
    return param;
}
