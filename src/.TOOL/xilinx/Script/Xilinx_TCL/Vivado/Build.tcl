set_param general.maxThreads 8

variable current_Location [file normalize [info script]]
variable xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]

set found     0
set showlog   0
set soc_exsit 1

proc synth {args} {
	reset_run synth_1 -quiet
	launch_run synth_1 -quiet
	wait_on_run synth_1 -quiet
	if {$showlog == 1} {
		exec python $xilinx_path/Script/Python/showlog.py [current_project]
	}
	set snyth_state [exec python $xilinx_path/Script/Python/Log.py synth [current_project]]
	return snyth_state
}

proc impl {args} {
	write_checkpoint -force ./prj/xilinx/[current_project].runs/synth_1/TOP.dcp -quiet
	#run impl
	reset_run impl_1 -quiet
	launch_run impl_1 -quiet
	wait_on_run impl_1 -quiet
	if {$showlog == 1} {
		exec python $xilinx_path/Script/Python/showlog.py [current_project]
	}
	set impl_state [exec python $xilinx_path/Script/Python/Log.py impl [current_project]]
	return impl_state
}

if {$found == 0 } {
	set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
} 

if {$snyth_state == "none"} {
	if {$impl_state == "none"} {
		open_run impl_1 -quiet
		report_timing_summary -quiet
		write_checkpoint -force ./prj/xilinx/[current_project].runs/impl_1/TOP_routed.dcp -quiet

	}
}

#Gen hdf file
if {$soc_exsit == 1} {
	write_hwdef -force -file ./user/Software/data/[current_project].hdf
}
#Gen bit
if {$found == 0} {
	write_bitstream ./[current_project].bit -force -quiet -bin_file
} else \
{
	write_bitstream ./[current_project].bit -force -quiet
}
