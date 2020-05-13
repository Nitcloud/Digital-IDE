set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
set root_path   [file dirname $xilinx_path]
# get the project info
set soc           none
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

# synnth function
proc synth {} {
	global xilinx_path
	global enableShowlog

	reset_run   synth_1 -quiet
	launch_run  synth_1 -quiet
	wait_on_run synth_1 -quiet

	if {$enableShowlog == true} {
		exec python $xilinx_path/Script/Python/showlog.py [current_project]
	}
	set snyth_state [exec python $xilinx_path/Script/Python/Log.py synth [current_project]]
	return snyth_state
}

# impl function
proc impl {} {
	global xilinx_path
	global enableShowlog

	reset_run impl_1 -quiet
	launch_run impl_1 -quiet
	wait_on_run impl_1 -quiet

	if {$enableShowlog == true} {
		exec python $xilinx_path/Script/Python/showlog.py [current_project]
	}
	set impl_state [exec python $xilinx_path/Script/Python/Log.py impl [current_project]]
	return impl_state
}

# build function
proc build {} {
	global soc
	global Device
	if {[synth] == "none"} \
	{
		if { [impl] == "none"} \
		{
			open_run impl_1 -quiet
			report_timing_summary -quiet
		}
	}
	if { [string equal -length 4 $Device xc7z] == 1 } {
		set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
	} 
	#Gen bit/hdf file
	if {$soc != "none"} {
		write_hwdef -force -file ./user/Software/data/[current_project].hdf
		write_bitstream ./[current_project].bit -force -quiet -bin_file
	}
	else \
	{
		write_bitstream ./[current_project].bit -force -quiet
	}
}

puts $argv

# switch $argv {
# 	case "synth" { synth }
# 	case "impl"  { impl  }
# 	case "build" { build }
# 	default {}
# }
