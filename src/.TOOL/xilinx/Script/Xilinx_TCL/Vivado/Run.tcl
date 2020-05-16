set_param general.maxThreads 6

set current_Location [file normalize [info script]]
set root_path [file dirname [file dirname [file dirname [file dirname [file dirname $current_Location]]]]]

set update  "[file dirname $current_Location]/Update.tcl"
set sim     "[file dirname $current_Location]/Simulation.tcl"
set synth   "[file dirname $current_Location]/synth.tcl"
set impl    "[file dirname $current_Location]/Impl.tcl"
set build   "[file dirname $current_Location]/Build.tcl"
set program "[file dirname $current_Location]/Program.tcl"
set debug   "[file dirname $current_Location]/Debug.tcl"

# get the project info
set soc           none
set Device        none
set prj_name      template
set enableShowlog false
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 13 $data "PRJ_NAME.FPGA"] == 1 } {
		gets $fp prj_name
		if {$prj_name == "undefined"} {
			set prj_name template
		}
	}
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

proc update {} {
	global update
	source $update -notrace
}

proc sim {} {
	global sim
	source $sim -notrace
}

proc build {} {
	global build
	source $build -notrace 
}

proc synth {} {
	global synth
	source $synth -notrace
}

proc impl {} {
	global impl
	source $impl -notrace
}

proc bits {} {
	global enableShowlog
	global Device
	global soc
	if {$enableShowlog == "false"} {			
		open_run impl_1		  -quiet	
		report_timing_summary -quiet
	} else {
		open_run impl_1		  
		report_timing_summary 
	}
	#Gen bit/hdf file
	if { [string equal -length 4 $Device xc7z] == 1 } {
		set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
	} 
	if {$soc != "none"} {
		write_hwdef -force -file ./user/Software/data/[current_project].hdf
		write_bitstream ./[current_project].bit -force -quiet
	} else \
	{
		write_bitstream ./[current_project].bit -force -quiet -bin_file
	}
}

proc program {} {
	global program
	source $program -notrace
}

proc debug {} {
	global debug
	source $debug -notrace
}

proc gui {} {
	start_gui -quiet
}

proc ope {} {	
	while {1} \
	{
		puts "---------what do you want to do next---------"
		puts "*** Input e to break ***"
		puts "1) Update_file"
		puts "2) Simulation"
		puts "3) Build"
		puts "4) program"
		puts "5) Debug"
		puts "6) GUI"
		gets stdin your_choice;
		switch $your_choice \
		{
			1  {update   }
			2  {sim;break}
			3  {build    }
			4  {program  }
			5  {debug    }
			6  {break    }
			e  {break    }
			default {puts "please input right choice"}
		}
	}
	if {$your_choice == 6 || $your_choice == 2} {
    	start_gui -quiet
	}
}

# create or open the project
set prj_folder ./prj/xilinx
set prj_path [glob -nocomplain $prj_folder/*.xpr]
if { $prj_path == "" } {
	create_project $prj_name ./prj/xilinx -part $Device -force -quiet
	set_property SOURCE_SET sources_1   [get_filesets sim_1]
	set_property top_lib xil_defaultlib [get_filesets sim_1]
	update_compile_order -fileset sim_1 -quiet
} else \
{
	open_project $prj_path -quiet
}

update

# ope


