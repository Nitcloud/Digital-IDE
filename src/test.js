var fs      = require("fs");
var fspath  = require("path");
// init
var synth = require("./kernel"); // in fact it is kernel
console.log(synth);

async function testSynth() {
    let module = await synth();
    module.ccall('run', '', ['string'], ["help"]);
    console.log(module.FS);
    console.log(module.FS.readdir("/"));
    console.log(module.FS.readdir("/share"));
    module.FS.mkdir('/project');
	module.FS.mount(module.NODEFS, { root: 'D:/project/Code/Javascript/yosysjs' }, '/project');
    console.log(module.FS.readdir("/project"));
    console.log(module.FS.readdir("/project/examples"));
    module.ccall('run', '', ['string'], [`read_verilog /hostcwd/examples/basys3/example.v`]);
    console.log(module.FS.readdir("/"));
}

testSynth();
