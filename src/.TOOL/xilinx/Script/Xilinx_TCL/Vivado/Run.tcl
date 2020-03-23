set_param general.maxThreads 6
variable current_Location [file normalize [info script]]

set update  "[file dirname $current_Location]/Update.tcl"
set build   "[file dirname $current_Location]/Build.tcl"
set program "[file dirname $current_Location]/Program.tcl"
set debug   "[file dirname $current_Location]/Debug.tcl"

open_project ./prj/Xilinx/template.xpr -quiet

source $update -notrace;

while {1} \
{
    puts "---------what do you want to do next---------"
    puts "1) Update_file"
    puts "2) Build"
    puts "3) program"
    puts "4) Debug"
    puts "5) GUI"
    puts "6) exit"
    gets stdin your_choice;
	switch $your_choice \
    {
        1 {source $update  -notrace;}
        2 {source $build   -notrace;}
        3 {source $program -notrace;}
		4 {source $debug   -notrace;}
		5 {break;}
		6 {exit 1;}
		default {puts "please input right choice"}
    }
}
if {$your_choice == 5} {
    start_gui -quiet
	
	# foreach bd_file_list [glob -nocomplain ./prj/xilinx/template.srcs/sources_1/bd/*] {
	# 	file copy -force $bd_file_list ./user/Hardware/bd
	# }
	# foreach IP_file_list [glob -nocomplain ./prj/xilinx/template.srcs/sources_1/ip/*] {
	# 	file copy -force $IP_file_list ./user/Hardware/IP
	# }
	# file delete -force ./prj/xilinx/template.src/source1
}
