"use strict";

class monitor{
    constructor(opeParam) {
        this.opeParam = opeParam;

        this.srcPath = this.opeParam.prjStructure.HardwareSrc;
        this.simPath = this.opeParam.prjStructure.HardwareSim;
        this.prjPath = this.opeParam.prjStructure.prjPath;

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
}
module.exports = monitor;