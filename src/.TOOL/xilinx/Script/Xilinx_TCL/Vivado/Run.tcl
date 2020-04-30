set_param general.maxThreads 6
variable current_Location [file normalize [info script]]

set update  "[file dirname $current_Location]/Update.tcl"
set sim     "[file dirname $current_Location]/Simulation.tcl"
set build   "[file dirname $current_Location]/Build.tcl"
set program "[file dirname $current_Location]/Program.tcl"
set debug   "[file dirname $current_Location]/Debug.tcl"

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

proc progarm {} {
	global progarm
	source $progarm -notrace
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
		puts "*** input e to exit ***"
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

open_project ./prj/Xilinx/template.xpr -quiet

update

ope


