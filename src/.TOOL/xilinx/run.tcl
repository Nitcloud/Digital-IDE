set_param general.maxThreads 6
variable current_Location [file normalize [info script]]
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
    if {$your_choose == 1} {source [file dirname $current_Location]/synth.tcl -notrace;}
    if {$your_choose == 2} {source [file dirname $current_Location]/impl.tcl -notrace;}
    if {$your_choose == 3} {source [file dirname $current_Location]/bits.tcl -notrace;}
    if {$your_choose == 4} {source [file dirname $current_Location]/sim.tcl -notrace;}
    if {$your_choose == 5} {source [file dirname $current_Location]/progarm.tcl -notrace;}
    if {$your_choose == 6} {source [file dirname $current_Location]/Debug.tcl -notrace;}
    if {$your_choose == 7} {break;}
    if {$your_choose == 8} {break;}
}
if {$your_choose == 7} {
    start_gui
}
