set_param general.maxThreads 6
variable current_Location [file normalize [info script]]
source [file dirname $current_Location]/Update.tcl -notrace;

while {1} {
    puts "---------what do you want to do next---------"
    puts "1) Update_file"
    puts "2) Build"
    puts "3) program"
    puts "4) Debug"
    puts "5) GUI"
    puts "6) exit"
    gets stdin your_choice;
	switch $your_choice {
        1 {source [file dirname $current_Location]/Update.tcl -notrace;}
        2 {source [file dirname $current_Location]/Build.tcl -notrace;}
        3 {source [file dirname $current_Location]/Program.tcl -notrace;}
		4 {source [file dirname $current_Location]/Debug.tcl -notrace;}
		5 {break;}
		6 {exit 1;}
		default {puts "please input right choice"}
    }
}
if {$your_choice == 5} {
    start_gui -quiet
}
