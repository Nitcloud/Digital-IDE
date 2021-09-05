var fs     = require("fs");
var fspath = require("path");
// init
var synth  = require("./synth");
exports.synth = synth;

/*
    add                  add objects to the design
    aigmap               map logic to and-inverter-graph circuit
    alumacc              extract ALU and MACC cells
    anlogic_eqn          Anlogic: Calculate equations for luts
    anlogic_fixcarry     Anlogic: fix carry chain
    assertpmux           adds asserts for parallel muxes
    async2sync           convert async FF inputs to sync circuits
    attrmap              renaming attributes
    attrmvcp             move or copy attributes from wires to driving cells
    autoname             automatically assign names to objects
    blackbox             convert modules into blackbox modules
    cd                   a shortcut for 'select -module <name>'
    check                check for obvious problems in the design
    chformal             change formal constraints of the design
    chparam              re-evaluate modules with new parameters
    chtype               change type of cells in the design
    clean                remove unused cells and wires
    clk2fflogic          convert clocked FFs to generic $ff cells
    clkbufmap            insert clock buffers on clock networks
    connect              create or remove connections
    connwrappers         match width of input-output port pairs
    coolrunner2_fixup    insert necessary buffer cells for CoolRunner-II architecture
    coolrunner2_sop      break $sop cells into ANDTERM/ORTERM cells
    copy                 copy modules in the design
    cover                print code coverage counters
    cutpoint             adds formal cut points to the design
    debug                run command with debug log messages enabled
    delete               delete objects in the design
    deminout             demote inout ports to input or output
    design               save, restore and reset current design
    dffinit              set INIT param on FF cells
    dfflegalize          convert FFs to types supported by the target
    dfflibmap            technology mapping of flip-flops
    dffunmap             unmap clock enable and synchronous reset from FFs
    dump                 print parts of the design in RTLIL format
    echo                 turning echoing back of commands on and off
    ecp5_gsr             ECP5: handle GSR
    edgetypes            list all types of edges in selection
    efinix_fixcarry      Efinix: fix carry chain
    equiv_add            add a $equiv cell
    equiv_induct         proving $equiv cells using temporal induction
    equiv_make           prepare a circuit for equivalence checking
    equiv_mark           mark equivalence checking regions
    equiv_miter          extract miter from equiv circuit
    equiv_opt            prove equivalence for optimized circuit
    equiv_purge          purge equivalence checking module
    equiv_remove         remove $equiv cells
    equiv_simple         try proving simple $equiv instances
    equiv_status         print status of equivalent checking module
    equiv_struct         structural equivalence checking
    eval                 evaluate the circuit given an input
    expose               convert internal signals to module ports
    extract              find subcircuits and replace them with cells
    extract_counter      Extract GreenPak4 counter cells
    extract_fa           find and extract full/half adders
    extract_reduce       converts gate chains into $reduce_* cells
    extractinv           extract explicit inverter cells for invertible cell pins
    flatten              flatten design
    flowmap              pack LUTs with FlowMap
    fmcombine            combine two instances of a cell into one
    fminit               set init values/sequences for formal
    freduce              perform functional reduction
    fsm                  extract and optimize finite state machines
    fsm_detect           finding FSMs in design
    fsm_expand           expand FSM cells by merging logic into it
    fsm_export           exporting FSMs to KISS2 files
    fsm_extract          extracting FSMs in design
    fsm_info             print information on finite state machines
    fsm_map              mapping FSMs to basic logic
    fsm_opt              optimize finite state machines
    fsm_recode           recoding finite state machines
    greenpak4_dffinv     merge greenpak4 inverters and DFF/latches
    help                 display help messages
    hierarchy            check, expand and clean up design hierarchy
    hilomap              technology mapping of constant hi- and/or lo-drivers
    ice40_braminit       iCE40: perform SB_RAM40_4K initialization from file
    ice40_dsp            iCE40: map multipliers
    ice40_opt            iCE40: perform simple optimizations
    ice40_wrapcarry      iCE40: wrap carries
    insbuf               insert buffer cells for connected wires
    iopadmap             technology mapping of i/o pads (or buffers)
    json                 write design in JSON format
    log                  print text and log files
    logger               set logger properties
    ls                   list modules or objects in modules
    ltp                  print longest topological path
    lut2mux              convert $lut to $_MUX_
    maccmap              mapping macc cells
    memory               translate memories to basic cells
    memory_bram          map memories to block rams
    memory_collect       creating multi-port memory cells
    memory_dff           merge input/output DFFs into memory read ports
    memory_map           translate multiport memories to basic cells
    memory_memx          emulate vlog sim behavior for mem ports
    memory_nordff        extract read port FFs from memories
    memory_share         consolidate memory ports
    memory_unpack        unpack multi-port memory cells
    miter                automatically create a miter circuit
    mutate               generate or apply design mutations
    muxcover             cover trees of MUX cells with wider MUXes
    muxpack              $mux/$pmux cascades to $pmux
    nlutmap              map to LUTs of different sizes
    onehot               optimize $eq cells for onehot signals
    opt                  perform simple optimizations
    opt_clean            remove unused cells and wires
    opt_demorgan         Optimize reductions with DeMorgan equivalents
    opt_dff              perform DFF optimizations
    opt_expr             perform const folding and simple expression rewriting
    opt_lut              optimize LUT cells
    opt_lut_ins          discard unused LUT inputs
    opt_mem              optimize memories
    opt_merge            consolidate identical cells
    opt_muxtree          eliminate dead trees in multiplexer trees
    opt_reduce           simplify large MUXes and AND/OR gates
    opt_share            merge mutually exclusive cells of the same type that share an input signal
    paramap              renaming cell parameters
    peepopt              collection of peephole optimizers
    plugin               load and list loaded plugins
    pmux2shiftx          transform $pmux cells to $shiftx cells
    pmuxtree             transform $pmux cells to trees of $mux cells
    portlist             list (top-level) ports
    prep                 generic synthesis script
    printattrs           print attributes of selected objects
    proc                 translate processes to netlists
    proc_arst            detect asynchronous resets
    proc_clean           remove empty parts of processes
    proc_dff             extract flip-flops from processes
    proc_dlatch          extract latches from processes
    proc_init            convert initial block to init attributes
    proc_memwr           extract memory writes from processes
    proc_mux             convert decision trees to multiplexers
    proc_prune           remove redundant assignments
    proc_rmdead          eliminate dead trees in decision trees
    qwp                  quadratic wirelength placer
    read                 load HDL designs
    read_aiger           read AIGER file
    read_blif            read BLIF file
    read_ilang           (deprecated) alias of read_rtlil
    read_json            read JSON file
    read_liberty         read cells from liberty file
    read_rtlil           read modules from RTLIL file
    read_verilog         read modules from Verilog file
    rename               rename object in the design
    rmports              remove module ports with no connections
    sat                  solve a SAT problem in the circuit
    scatter              add additional intermediate nets
    scc                  detect strongly connected components (logic loops)
    scratchpad           get/set values in the scratchpad
    script               execute commands from file or wire
    select               modify and view the list of selected objects
    setattr              set/unset attributes on objects
    setparam             set/unset parameters on objects
    setundef             replace undef values with defined constants
    share                perform sat-based resource sharing
    shell                enter interactive command mode
    show                 generate schematics using graphviz
    shregmap             map shift registers
    sim                  simulate the circuit
    simplemap            mapping simple coarse-grain cells
    splice               create explicit splicing cells
    splitnets            split up multi-bit nets
    stat                 print some statistics
    submod               moving part of a module to a new submodule
    supercover           add hi/lo cover cells for each wire bit
    synth                generic synthesis script
    synth_achronix       synthesis for Acrhonix Speedster22i FPGAs.
    synth_anlogic        synthesis for Anlogic FPGAs
    synth_coolrunner2    synthesis for Xilinx Coolrunner-II CPLDs
    synth_easic          synthesis for eASIC platform
    synth_ecp5           synthesis for ECP5 FPGAs
    synth_efinix         synthesis for Efinix FPGAs
    synth_gowin          synthesis for Gowin FPGAs
    synth_greenpak4      synthesis for GreenPAK4 FPGAs
    synth_ice40          synthesis for iCE40 FPGAs
    synth_intel          synthesis for Intel (Altera) FPGAs.
    synth_intel_alm      synthesis for ALM-based Intel (Altera) FPGAs.
    synth_machxo2        synthesis for MachXO2 FPGAs. This work is experimental.
    synth_nexus          synthesis for Lattice Nexus FPGAs
    synth_quicklogic     Synthesis for QuickLogic FPGAs
    synth_sf2            synthesis for SmartFusion2 and IGLOO2 FPGAs
    synth_xilinx         synthesis for Xilinx FPGAs
    techmap              generic technology mapper
    tee                  redirect command output to file
    test_abcloop         automatically test handling of loops in abc command
    test_autotb          generate simple test benches
    test_cell            automatically test the implementation of a cell type
    test_pmgen           test pass for pmgen
    torder               print cells in topological order
    trace                redirect command output to file
    tribuf               infer tri-state buffers
    uniquify             create unique copies of modules
    verific              load Verilog and VHDL designs using Verific
    verilog_defaults     set default options for read_verilog
    verilog_defines      define and undefine verilog defines
    wbflip               flip the whitebox attribute
    wreduce              reduce the word size of operations if possible
    write_aiger          write design to AIGER file
    write_blif           write design to BLIF file
    write_btor           write design to BTOR file
    write_cxxrtl         convert design to C++ RTL simulation
    write_edif           write design to EDIF netlist file
    write_file           write a text to a file
    write_firrtl         write design to a FIRRTL file
    write_ilang          (deprecated) alias of write_rtlil
    write_intersynth     write design to InterSynth netlist file
    write_json           write design to a JSON file
    write_rtlil          write design to RTLIL file
    write_simplec        convert design to simple C code
    write_smt2           write design to SMT-LIBv2 file
    write_smv            write design to SMV file
    write_spice          write design to SPICE netlist file
    write_table          write design as connectivity table
    write_verilog        write design to Verilog file
    write_xaiger         write design to XAIGER file
    xilinx_dffopt        Xilinx: optimize FF control signal usage
    xilinx_dsp           Xilinx: pack resources into DSPs
    xilinx_srl           Xilinx shift register extraction
    zinit                add inverters so all FF are zero-initialized
*/
function showSynthHelpLog() {
    synth.TTY.message = "";
    synth.ccall('run', '', ['string'], ["help"]);
    return synth.TTY.message;
}
exports.showSynthHelpLog = showSynthHelpLog;

/**
 * 在虚拟文件系统中创建文件夹
 * @param {*} path 
 * @returns 
 */
function synthSystemMkdir(path) {
    if (synth.FS.findObject(`/${path}`) != null) {
      return true;
    } else { 
        if (synthSystemMkdir(fspath.dirname(path))) {
            synth.FS.mkdir(`/${path}`);
        }
        return true;
    }
}
exports.synthSystemMkdir = synthSystemMkdir;

function synthSystemWriteFile(src, des) {
    let desDir  = fspath.dirname(des);
    let content = fs.readFileSync(src, "utf-8");
    if (synth.FS.findObject(`/${desDir}`) != null) {
        synth.FS.writeFile(`/${des}`, content, { encoding: 'utf8' });
    } else {
        synthSystemMkdir(`/${desDir}`);
        synth.FS.writeFile(`/${des}`, content, { encoding: 'utf8' });
    }
}
exports.synthSystemWriteFile = synthSystemWriteFile;

function synthSystemReadFile(path) {
    if (synth.FS.findObject(`/${path}`) != null) {
        let content = synth.FS.readFile(`/${path}`, { encoding: 'utf8' });
        return content;
    } else {
        console.log(`ERROR: The ${path} is not at this synth system.`);
    }
}
exports.synthSystemReadFile = synthSystemReadFile;

function synthSystemRemoveFile(path) {
    synth.FS.unlink(`/${path}`);
}
exports.synthSystemRemoveFile = synthSystemRemoveFile;


function synthRun(command) {
    synth.ccall('run', '', ['string'], [command]);
}
exports.synthRun = synthRun;

function synthSimulate(vcd_path) {
    synth.ccall('run', '', ['string'], ["sim -vcd /simulation.vcd -clock sys_clk -reset sys_rst -zinit -n 10000"]);
    fs.writeFileSync(vcd_path, synthSystemReadFile("simulation.vcd"), "utf-8");
}
exports.synthSimulate = synthSimulate;

/*
default : do not use MUXF[78] resources to implement LUTs larger than LUT6s
    -top <module>
        use the specified module as top module

    -family {xcup|xcu|xc7|xc6s}
        run synthesis for the specified Xilinx architecture
        generate the synthesis netlist for the specified family.
        default: xc7

    -edif <file>
        write the design to the specified edif file. writing of an output file
        is omitted if this parameter is not specified.

    -blif <file>
        write the design to the specified BLIF file. writing of an output file
        is omitted if this parameter is not specified.

    -vpr
        generate an output netlist (and BLIF file) suitable for VPR
        (this feature is experimental and incomplete)

    -nobram
        disable inference of block rams

    -nodram
        disable inference of distributed rams

    -nosrl
        disable inference of shift registers

    -nocarry
        do not use XORCY/MUXCY/CARRY4 cells in output netlist

    -run <from_label>:<to_label>
        only run the commands between the labels (see below). an empty
        from label is synonymous to 'begin', and empty to label is
        synonymous to the end of the command list.

    -flatten
        flatten design before synthesis 
*/
function synthXilinx(arg, edif_path, blif_path) {
    if (edif_path != undefined) {
        arg = arg + ` -edif /TOP.edif`;
    }
    if (blif_path != undefined) {
        arg = arg + ` -blif /TOP.blif`;
    }
    synth.ccall('run', '', ['string'], [`synth_xilinx -nowidelut ${arg}`]);
    if (edif_path != undefined) {
        fs.writeFileSync(edif_path, synthSystemReadFile("/TOP.edif"), "utf-8");
    }
    if (blif_path != undefined) {
        fs.writeFileSync(edif_path, synthSystemReadFile("/TOP.blif"), "utf-8");
    }
}
exports.synthXilinx = synthXilinx;

/**
 * 向synth工程中导入verilog设计文件
 * @param {*} verilogFilePath   输入verilog文件的路径
 * @param {*} parent            对应的父级路径
 * @returns synth.TTY(.message) 导入之后自动将TTY.message清空。
 */
function synthLoadFromFile(verilogFilePath, parent) {
    synth.TTY.message = "";
    const synthSysPath = verilogFilePath.replace(parent, "");
    synthSystemWriteFile(verilogFilePath, synthSysPath);
    synth.ccall('run', '', ['string'], [`read_verilog /${synthSysPath}`]);
    return synth.TTY;
}
exports.synthLoadFromFile = synthLoadFromFile;

function synthLoadFromCode(code) {
    synth.TTY.message = "";
    synth.FS.writeFile(`/code.v`, code, { encoding: 'utf8' });
    synth.ccall('run', '', ['string'], [`design -reset; read_verilog /code.v`]);
    return synth.TTY;
}
exports.synthLoadFromCode = synthLoadFromCode;

function synthSimple(code) {
    synthLoadFromCode(code);
    synthRun("proc; opt; write_json output.json");
    let netlist = synthSystemReadFile("output.json");
    return netlist;
}
exports.synthSimple = synthSimple;
