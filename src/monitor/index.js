const chokidar = require('chokidar');
const opeParam = require('../param');
const HDLPath = require('../HDLfilesys/operation/path');
const HDLEventActions = require('./hdlparam');
const PPYEventActions = require('./property');

const Event = {
    Add: 'add',                 // emit when add file
    AddDir: 'addDir',           // emit when add folder
    Unlink: 'unlink',           // emit when delete file
    UnlinkDir: 'unlinkDir',     // emit when delete folder
    Change: 'change',           // emit when file changed
    All: 'all',                 // all the change above

    Ready: 'ready',
    Raw: 'raw',
    Error: 'error'
};

/**
 * @description implement detailed op when monitored HDL event happens
 * @param {chokidar.FSWatcher} monitor 
 */
function monitorHDL(monitor) {
    monitor.on(Event.Change, HDLEventActions.change);
    monitor.on(Event.Add, HDLEventActions.add);
    monitor.on(Event.Unlink, HDLEventActions.unlink);
}

/**
 * @description implement detailed op when property.json changes
 * @param {chokidar.FSWatcher} monitor 
 */
function monitorPPY(monitor) {
    monitor.on(Event.Change, PPYEventActions.change);
    monitor.on(Event.Add, PPYEventActions.add);
    monitor.on(Event.Unlink, PPYEventActions.unlink);
}

class HDLMonitor{
    constructor() {
        // public config for monitor
        this.monitorConfig = {
            persistent: true,
            usePolling: false,
            ignoreInitial: true,
        };

    }

    /**
     * @description get monitor
     * @param {string | string[]} paths
     * @param {object} config
     * @returns {chokidar.FSWatcher} 
     */
    getMonitor(paths, config) {
        if (!config) {
            config = this.monitorConfig;
        }
        return chokidar.watch(paths, config);
    }

    /**
     * @description get monitor for property.json
     * @returns {chokidar.FSWatcher}
     */
    getPPYMonitor() {
        const watcherPath = HDLPath.join(opeParam.workspacePath, '.vscode', 'property.json');
        return this.getMonitor(watcherPath);
    }

    /**
     * @description get monitor for HDLParam update
     * @returns {chokidar.FSWatcher}
     */
    getHDLMonitor() {
        const svlogExts = ['v', 'V', 'sv', 'SV', 'vh', 'vl'];
        const vhdlExts = ['vhd', 'vhdl', 'vho', 'vht'];
        const HDLExts = svlogExts.concat(vhdlExts);
        const HDLGlobExts = `**/*.{${HDLExts.join(',')}}`;
        
        const srcWatcherPath = HDLPath.join(this.srcPath, HDLGlobExts);
        const simWatcherPath = HDLPath.join(this.simPath, HDLGlobExts);
        
        let watcherPaths = null;
        if (srcWatcherPath == simWatcherPath) {
            watcherPaths = srcWatcherPath;
        } else {
            watcherPaths = [
                HDLPath.join(this.srcPath, HDLGlobExts),
                HDLPath.join(this.simPath, HDLGlobExts)
            ];
        }
        
        return this.getMonitor(watcherPaths);
    }


    /**
     * @description get monitor for logger
     * @returns {chokidar.FSWatcher}
     */
    getLOGMonitor() {
        const watcherPath = this.prjPath + '/**/*.log';
        return this.getMonitor(watcherPath);
    }

    close() {
        this.HDLMonitor.close();
        this.LOGMonitor.close();
        this.PPYMonitor.close();
    }

    start() {
        this.srcPath = opeParam.prjInfo.ARCH.Hardware.src;
        this.simPath = opeParam.prjInfo.ARCH.Hardware.sim;
        this.prjPath = opeParam.prjInfo.ARCH.PRJ_Path;

        // make monitor
        this.HDLMonitor = this.getHDLMonitor();
        this.LOGMonitor = this.getLOGMonitor();
        this.PPYMonitor = this.getPPYMonitor();

        monitorHDL(this.HDLMonitor);
        monitorPPY(this.PPYMonitor);
        
    }
};


const monitor = new HDLMonitor();
module.exports = monitor;