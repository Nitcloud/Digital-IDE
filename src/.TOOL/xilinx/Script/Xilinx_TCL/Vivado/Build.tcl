set_param general.maxThreads 8

variable current_Location [file normalize [info script]]
variable xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]



if {$boot_state == "none"} {
	puts "ERROR: The ./user/BOOT folder exists, but there are no elf files in it"
} else \
{
	if {$boot_state != "one"} {
		puts $boot_state
		gets stdin Index
		puts [exec python $xilinx_path/Script/Python/MakeBoot.py $Index [current_project]]
	}
	set found     0
	set showlog   0
	set soc_exsit 1
	set fp [open "./Makefile" r]
	while { [gets $fp data] >= 0 } \
	{
		if { [string equal -length 3 $data soc] == 1 } {
			gets $fp data
			if { [string equal -length 4 $data none] == 1 } {
				set soc_exsit 0
			}
		}
		if { [string equal -length 6 $data Showlog] == 1 } {
			gets $fp data
			if { [string equal -length 3 $data yes] == 1 } {
				set showlog 1
			}
		}
		if { [string equal -length 4 $data xc7z] == 1 } {
			set found 1
		}
	}
	close $fp

	if {$found == 0 } {
		set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
	} 

	#run synth
	reset_run synth_1 -quiet
	launch_run synth_1 -quiet
	wait_on_run synth_1 -quiet
	if {$showlog == 1} {
		exec python $xilinx_path/Script/Python/showlog.py [current_project]
	}

	set snyth_state [exec python $xilinx_path/Script/Python/Log.py synth [current_project]]
	if {$snyth_state == "none"} {
		write_checkpoint -force ./prj/xilinx/[current_project].runs/synth_1/TOP.dcp -quiet
		#run impl
		reset_run impl_1 -quiet
		launch_run impl_1 -quiet
		wait_on_run impl_1 -quiet
		if {$showlog == 1} {
			exec python $xilinx_path/Script/Python/showlog.py [current_project]
		}
		set impl_state [exec python $xilinx_path/Script/Python/Log.py impl [current_project]]
		if {$impl_state == "none"} {
			open_run impl_1 -quiet
			report_timing_summary -quiet

			write_checkpoint -force ./prj/xilinx/[current_project].runs/impl_1/TOP_routed.dcp -quiet
			#Gen hdf file
			if {$soc_exsit == 1} {
				write_hwdef -force -file ./user/Software/data/[current_project].hdf
			}
			#Gen boot
			if {$found == 0} {
				write_bitstream ./[current_project].bit -force -quiet -bin_file
			} 

			if {$found == 1} {
				write_bitstream ./[current_project].bit -force -quiet
			}
		}
	}
}

