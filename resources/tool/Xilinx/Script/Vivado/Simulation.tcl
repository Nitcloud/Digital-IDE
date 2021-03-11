set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname $current_Location]]]

if {[current_sim] != ""} {
	relaunch_sim -quiet
} else {
	launch_simulation -quiet
}

set fd [open $root_path/THREAD r] 
set newfd [open $root_path/THREAD.tmp w] 
while {[gets $fd line] >= 0} { 
    if { [string equal -length 4 $line "simulate"] == 1 } {
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

if {$sim_state == "none"} {
	set curr_wave [current_wave_config]
	if { [string length $curr_wave] == 0 } {
		if { [llength [get_objects]] > 0} {
			add_wave /
			set_property needs_save false [current_wave_config]
		} else {
			send_msg_id Add_Wave-1 WARNING "No top level signals found. Simulator will start without a wave window. If you want to open a wave window go to 'File->New Waveform Configuration' or type 'create_wave_config' in the TCL console."
		}
	}
	run 1us
}
start_gui -quiet