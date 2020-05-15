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

reset_run   impl_1 
launch_run  impl_1 
wait_on_run impl_1 

if {$enableShowlog == true} {
	exec python $xilinx_path/Script/Python/showlog.py [current_project]
}
set    impl_state [exec python $xilinx_path/Script/Python/Log.py impl [current_project]]
return $impl_state