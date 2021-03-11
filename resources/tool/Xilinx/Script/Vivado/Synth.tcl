set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname $current_Location]]]
set root_path   [file dirname $xilinx_path]
# get the project info
set Device        none
set enableShowlog false

set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 6 $data "Device"] == 1 } {
		gets $fp Device
	}
	if { [string equal -length 13 $data "enableShowlog"] == 1 } {
		gets $fp enableShowlog
		if {$enableShowlog == "undefined"} {
			set enableShowlog false
		}
	}
}
close $fp

if {$enableShowlog == "true"} {
	reset_run   synth_1
	launch_run  synth_1
	wait_on_run synth_1
} else {
	reset_run   synth_1 -quiet
	launch_run  synth_1 -quiet
	wait_on_run synth_1 -quiet
}

set fd [open $root_path/THREAD r] 
set newfd [open $root_path/THREAD.tmp w] 
while {[gets $fd line] >= 0} { 
    if { [string equal -length 4 $line "synth"] == 1 } {
		puts $newfd $line 
		puts $newfd "true"
        gets $fd    $line
	} else {
        puts $newfd $line
    }
} 
close $fd 
close $newfd 
file rename -force $root_path/THREAD.tmp $root_path/THREAD