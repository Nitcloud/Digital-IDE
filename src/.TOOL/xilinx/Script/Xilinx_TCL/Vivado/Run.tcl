set_param general.maxThreads 6

set current_Location [file normalize [info script]]
set root_path [file dirname [file dirname [file dirname [file dirname [file dirname $current_Location]]]]]

set update  "[file dirname $current_Location]/Update.tcl"
set sim     "[file dirname $current_Location]/Simulation.tcl"
set snyth   "[file dirname $current_Location]/Snyth.tcl"
set impl    "[file dirname $current_Location]/Impl.tcl"
set build   "[file dirname $current_Location]/Build.tcl"
set program "[file dirname $current_Location]/Program.tcl"
set debug   "[file dirname $current_Location]/Debug.tcl"

# get the project info
set Device    none
set prj_name  template
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

proc snyth {} {
	global snyth
	source $snyth -notrace
}

proc impl {} {
	global impl
	source $impl -notrace
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
		puts "*** input e to break , ee to exit ***"
		puts "1) Update_file"
		puts "2) Simulation"
		puts "3) Build"
		puts "4) program"
		puts "5) Debug"
		puts "6) GUI"
		gets stdin your_choice;
		switch $your_choice \
		{
			1  {update }
			2  {sim    }
			3  {build  }
			4  {program}
			5  {debug  }
			6  {break  }
			e  {break  }
			ee {exit 1 }
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

puts breakpiont

update

# ope


