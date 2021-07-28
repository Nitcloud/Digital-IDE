set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname $current_Location]]]
set root_path   [file dirname $xilinx_path]
# get the project info
set enableShowlog false

set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 13 $data "enableShowlog"] == 1 } {
		gets $fp enableShowlog
		if {$enableShowlog == "undefined"} {
			set enableShowlog false
		}
	}
}
close $fp

if {$enableShowlog == "true"} {
	reset_run   impl_1 
	launch_runs impl_1 -jobs 4 
	wait_on_run impl_1 
} else {
	reset_run   impl_1 -quiet
	launch_runs impl_1 -quiet -jobs 4
	wait_on_run impl_1 -quiet
}
