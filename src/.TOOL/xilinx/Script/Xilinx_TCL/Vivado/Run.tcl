set_param general.maxThreads 6
variable current_Location [file normalize [info script]]

set update  "[file dirname $current_Location]/Update.tcl"
set sim     "[file dirname $current_Location]/Simulation.tcl"
set build   "[file dirname $current_Location]/Build.tcl"
set program "[file dirname $current_Location]/Program.tcl"
set debug   "[file dirname $current_Location]/Debug.tcl"

open_project ./prj/Xilinx/template.xpr -quiet

source $update -notrace;

while {1} \
{
    puts "---------what do you want to do next---------"
	puts "*** input e to exit ***"
	puts "1) Update_file"
	puts "2) Simulation"
	puts "3) Build"
	puts "4) program"
	puts "5) Debug"
	puts "6) GUI"
	gets stdin your_choice;
	switch $your_choice \
    {
        1 {source $update  -notrace;}
		2 {source $sim     -notrace;}
        3 {source $build   -notrace;}
        4 {source $program -notrace;}
		5 {source $debug   -notrace;}
		6 {break;}
		e {exit 1;}
		default {puts "please input right choice"}
    }
}
if {$your_choice == 6 || $your_choice == 2} {
    start_gui -quiet
}
