set_param general.maxThreads 6
puts "---------which device you want to create---------"
puts "1) xc7z020clg400-2"
puts "2) xc7a35tftg256-1"
puts "3) exit"
gets stdin your_device;
switch $your_device {
    1 {create_project template ./prj/xilinx -part xc7z020clg400-2;}
    2 {create_project template ./prj/xilinx -part xc7a35tftg256-1;}
    3 {exit 1}
}
add_file ./.LIB/Hardware
add_file ./user/Hardware

variable current_Location [file normalize [info script]]

set_property top TOP [current_fileset]
add_files -fileset constrs_1 ./user/data
set_property SOURCE_SET sources_1 [get_filesets sim_1]
add_files -fileset sim_1 -norecurse ./user/Hardware/sim/testbench.v
update_compile_order -fileset sim_1
set_property top testbench [get_filesets sim_1]
set_property top_lib xil_defaultlib [get_filesets sim_1]
update_compile_order -fileset sim_1

#source ./.TOOL/xilinx/zynq_ps.tcl -notrace;
source [file dirname $current_Location]/run.tcl -notrace;