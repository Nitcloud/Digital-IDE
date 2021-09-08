
function synthRun(command) {
    ccall('run', '', ['string'], [command]);
}

function synthSystemReadFile(path) {
    if (FS.findObject(`/${path}`) != null) {
        let content = FS.readFile(`/${path}`, { encoding: 'utf8' });
        return content;
    } else {
        console.log(`ERROR: The ${path} is not at this synth system.`);
    }
}

function synthSystemRemoveFile(path) {
    FS.unlink(`/${path}`);
}

function handleLog(Log) {
    let newLog = Log.replace(/(\d+?\.)+?\s/, "[INFO]> ")
                    .replace("ERROR:", "[ERROR]> ") + "\n";
    return newLog;
}

function synthLoadFromCode(code) {
    TTY.message = "";
    FS.writeFile(`/code.v`, code, { encoding: 'utf8' });
    ccall('run', '', ['string'], [`design -reset; read_verilog /code.v`]);
}

function synthSimple(code) {
    let textarea = document.getElementById('synthTerminal');
    TTY.callback = handleLog;
    synthLoadFromCode(code);
    textarea.value = TTY.message;
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
    synthRun(cmd[2]);
    textarea.value = TTY.message;
    let netlist = synthSystemReadFile("output.json");
    return netlist;
}