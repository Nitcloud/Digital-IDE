while {1} {
    puts "---------what do you want to do next---------"
    puts "1] synth"
    puts "2] impl"
    puts "3] bits"
    puts "4) sim"
    puts "5) progarm"
    puts "6) Debug"
    puts "7) GUI"
    puts "8) exit"
    gets stdin your_choose;
    if {$your_choose == 1} {source ./.TOOL/xilinx/synth.tcl -notrace;}
    if {$your_choose == 2} {source ./.TOOL/xilinx/impl.tcl -notrace;}
    if {$your_choose == 3} {source ./.TOOL/xilinx/bits.tcl -notrace;}
    if {$your_choose == 4} {source ./.TOOL/xilinx/sim.tcl -notrace;}
    if {$your_choose == 5} {source ./.TOOL/xilinx/progarm.tcl -notrace;}
    if {$your_choose == 6} {source ./.TOOL/xilinx/Debug.tcl -notrace;}
    if {$your_choose == 7} {break;}
    if {$your_choose == 8} {break;}
}
if {$your_choose == 7} {
    start_gui
}
