// let opeParam = require("./param");
const chokidar = require('chokidar');

class monitor{
    constructor(opeParam) {
        this.opeParam = opeParam;

        this.srcPath = this.opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = this.opeParam.prjInfo.ARCH.Hardware.sim;
        this.prjPath = this.opeParam.prjInfo.ARCH.PRJ_Path;

        // 监视器的公共配置
        this.config = {
            persistent: true,
            usePolling: false,
            ignoreInitial: true,
            // awaitWriteFinish: {   // ms
            //     stabilityThreshold: 2000,
            //     pollInterval: 100
            // }
        }

        this.watcherHDL = this.monitorHDL();
        this.watcherLOG = this.monitorLOG();
        this.watcherPPY = this.monitorPPY();
    }

    monitorPPY() {
        let watcherConfig = this.config;
        let watcherPath = `${this.opeParam.workspacePath}/**/property.json`;
        return chokidar.watch(watcherPath, watcherConfig);
    }

    monitorHDL() {
        let hdlConfig = this.config;
        // hdlConfig.ignored = prjPath;

        let svlogExt = 'v,V,sv,SV,vh,vl';
        let vhdlExt  = 'vhd,vhdl,vho,vht';

        let extList = `**/*{${svlogExt},${vhdlExt}}`;
        
        let watcherPath = [
            `${this.srcPath}/${extList}`,
            `${this.simPath}/${extList}`
        ];

        return chokidar.watch(watcherPath, hdlConfig);
    }

    monitorLOG() {
        let logConfig = this.config;

        let watcherPath = `${this.prjPath}/**/*.log`;
        return chokidar.watch(watcherPath, logConfig);
    }

    close() {
        
    }
}
module.exports = monitor;