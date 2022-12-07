"use strict";

class instance {

    /**
     * @descriptionCn verilog模式下生成整个例化的内容
     * @param {Object} module 模块信息
     * @returns {String} 整个例化的内容
     */
    vlog(module) {
        let port = this.vlogPort(module.ports);
        let param = this.vlogParam(module.params);

        let instContent = '';
        instContent += port.wireStr;
        instContent += module.name + ' ';

        if (param !== '') {
            instContent += `#(\n${param})\n`;
        }

        instContent += `u_${module.name}(\n`;
        instContent += port.portStr;
        instContent += ');\n';

        return instContent;
    }

    /**
     * @descriptionCn vhdl模式下生成整个例化的内容
     * @param {Object} module 模块信息
     * @returns {String} 整个例化的内容
     */
    vhdl(module) {
        // module 2001 style
        let port = this.vhdlPort(module.ports);
        let param = this.vhdlParam(module.params);

        let instContent = `u_${module.moduleName} : ${module.moduleName}\n`;

        if (param !== '') {
            instContent += `generic map(\n${param})\n`;
        }

        instContent += `port map(\n${port});\n`;

        return instContent;
    }
    
    /**
     * @descriptionCn verilog模式下对端口信息生成要例化的内容
     * @param {Array} ports 端口信息列表
     * @returns {Object} {
     *      "wireStr" : wireStr, // output wire 声明
     *      "portStr" : portStr, // 端口例化
     *  }
     */
    vlogPort(ports) {
        let nmax = this.getlmax(ports, 'name');
        let wmax = this.getlmax(ports, 'width');

        let portStr = `\t// ports\n`;
        let wireStr = '// outports wire\n';
        for (let i = 0; i < ports.length; i++) {
            const port = ports[i];

            if (port.type === 'output') {
                let width = port.width;
                let wpadding = wmax - width.length + 1;
                width += ' '.repeat(wpadding);
                // TODO: vhdl type
                wireStr += `wire ${width}\t${port.name};\n`;
            }

            let name = port.name;
            let npadding = nmax - name.length + 1;
            name += ' '.repeat(npadding);
            portStr += `\t.${name}\t\t( ${name}\t\t)`;
            if (i != ports.length - 1) {
                portStr += ',';
            }
            portStr += '\n';
        }
        
        return {
            "wireStr" : wireStr,
            "portStr" : portStr,
        };

    }

    /**
     * @descriptionCn verilog模式下对参数信息生成要例化的内容
     * @param {Array} params 参数信息列表
     * @returns {String} 对参数信息生成要例化的内容
     */
    vlogParam(params) {
        let paramStr = '';
        let nmax = this.getlmax(params, 'name');
        let imax = this.getlmax(params, 'init');

        // .NAME  ( INIT  ),
        for (let i = 0; i < params.length; i++) {
            let name = params[i].paramName;
            let init = params[i].paramInit;
    
            let namePadding = nmax - name.length + 1;
            let initPadding = imax - init.length + 1;
    
            name +=' '.repeat(namePadding);
            init +=' '.repeat(initPadding);
    
            paramStr += `\t.${name}\t\t( ${init}\t\t)`;
            if (i !== (params.length - 1)) {
                paramStr += ',';
                paramStr += '\n';
            }
        }

        return paramStr;
    }

    /**
     * @descriptionCn vhdl模式下对端口信息生成要例化的内容
     * @param {Array} ports 端口信息列表
     * @returns {String} 对端口信息生成要例化的内容
     */
    vhdlPort(ports) {
        let nmax = this.getlmax(ports, 'name');
        
        // NAME => NAME,
        let portStr = `\n\t-- ports\n`;
        for (let i = 0; i < ports.length; i++) {
            const name = ports[i].name;
            let padding = nmax - name.length + 1;
            name += ' '.repeat(padding);
            portStr += `\t${name} => ${name}`;
            if (i !== (ports.length - 1)) {
                portStr += ',';
            }
            portStr += '\n';
        }
        return portStr;
    }

    /**
     * @descriptionCn vhdl模式下对参数信息生成要例化的内容
     * @param {Array} params 参数信息列表
     * @returns {String} 对参数信息生成要例化的内容
     */
    vhdlParam(params) {
        let paramStr = '';
        let nmax = this.getlmax(params, 'name');

        // NAME => NAME,
        for (let i = 0; i < params.length; i++) {
            const name = params[i].name;
            const init = params[i].init;

            let npadding = nmax - name.length + 1;
            name += ' '.repeat(npadding);
    
            paramStr += `\t${name} => ${init}`;
            if (i !== (params.length - 1)) {
                paramStr += ',';
                paramStr += '\n';
            }
        }
        return paramStr;
    }

    /**
     * @descriptionCn 在arr中找到pro属性的最大字符长度
     * @param {Array}  arr 待查找的数组
     * @param {String} pro 指定属性
     * @returns {Number} 该数组中的pro属性的最大字符长度
     */
    getlmax(arr, pro) {
        let lmax = 0;
        for (let i = 0; i < arr.length; i++) {
            const len = arr[i][pro].length;
            if (len <= lmax) {
                continue;
            }
            lmax = len;
        }
        return lmax;
    }

    /**
     * @descriptionCn 向光标处插入内容
     * @param {String} content 需要插入的内容
     * @param {Class}  editor  vscode.window.activeTextEditor
     * @returns {Boolean} true : success | false : faild
     */
    selectInsert(content, editor) {
        if (editor === undefined) {
            return false;
        }
        let selections = editor.selections;
        editor.edit((editBuilder) => {
            selections.forEach((selection) => {
                // position, content
                editBuilder.insert(selection.active, content);
            });
        });
        return true
    }
}
module.exports = instance;
