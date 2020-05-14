set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
set root_path   [file dirname $xilinx_path]
# get the project info
set Device        none
set enableShowlog false

set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 6 $data "Device"] == 1 } {
			gets $fp Device
	}
	if { [string equal -length 12 $data "SOC_MODE.soc"] == 1 } {
			gets $fp soc
			if {$soc == "undefined"} {
				set soc none
			}
	}
	if { [string equal -length 13 $data "enableShowlog"] == 1 } {
			gets $fp enableShowlog
			if {$enableShowlog == "undefined"} {
				set enableShowlog false
			}
	}
}
close $fp

reset_run   synth_1 -quiet
launch_run  synth_1 -quiet
wait_on_run synth_1 -quiet

if {$enableShowlog == true} {
	exec python $xilinx_path/Script/Python/showlog.py [current_project]
}
set  snyth_state [exec python $xilinx_path/Script/Python/Log.py synth [current_project]]
puts snyth_state