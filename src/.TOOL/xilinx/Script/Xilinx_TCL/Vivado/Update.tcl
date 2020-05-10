#updata file

set_param general.maxThreads 6

# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

set current_Location [file normalize [info script]]
set xilinx_path      [file dirname [file dirname [file dirname [file dirname $current_Location]]]]

set cpu         none
set bd_example  default

proc update_ip {IP_path} {
	foreach IP_file [glob -nocomplain $IP_path] {
        foreach xci_file [glob -nocomplain $IP_file/*.xci] {
            #puts $xci_file
            add_file $xci_file -quiet
        }
	}
}
proc update_bd {bd_path} {
	foreach bd_file_list [glob -nocomplain $bd_path] {
		foreach bd_file [glob -nocomplain $bd_file_list/*.bd] {
            #puts $bd_file
			add_file $bd_file -quiet
        }
	}
}
proc none_add {} {
	add_file  ./user/src -quiet
	update_bd ./user/bd/*
	update_ip ./user/IP/*
	update_bd ./prj/xilinx/[current_project].srcs/sources_1/bd/*
	update_ip ./prj/xilinx/[current_project].srcs/sources_1/ip/*
	#set top
	add_file ./user/TOP.v -quiet
	set_property top TOP [current_fileset]
	#add xdc
	add_files -fileset constrs_1 ./user/data -quiet
	#add sim
	add_files -fileset sim_1 ./user/sim -force -quiet
	set_property top testbench [get_filesets sim_1]
}
proc soc_add {} {
	add_file  ./user/Hardware/src -quiet
	update_bd ./user/Hardware/bd/*
	update_ip ./user/Hardware/IP/*
	update_bd ./prj/xilinx/[current_project].srcs/sources_1/bd/*
	update_ip ./prj/xilinx/[current_project].srcs/sources_1/ip/*
	#set top
	add_file ./user/Hardware/TOP.v -quiet
	set_property top TOP [current_fileset]
	#add xdc
	add_files -fileset constrs_1 ./user/Hardware/data -quiet
	#add sim
	add_files -fileset sim_1 ./user/Hardware/sim -force -quiet
	set_property top testbench [get_filesets sim_1]
}
proc cortexM3_IP_add { current_Location } {
	set_property ip_repo_paths $current_Location/IP [current_project]

	if {[glob -nocomplain ./user/Hardware/bd/*] == ""} {		
		file mkdir ./user/Hardware/bd/m3_xIP_default
		file copy  -force $current_Location/IP/Example_bd/m3_xIP_default.bd ./user/Hardware/bd/m3_xIP_default
		add_file   ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd] -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd] -top -quiet
	}
}

proc cortexA9_IP_add { current_Location } {
	if {[glob -nocomplain ./user/Hardware/bd/*] == ""} {		
		file mkdir ./user/Hardware/bd/zynq_default
		file copy  -force $current_Location/IP/Example_bd/zynq_default.bd ./user/Hardware/bd/zynq_default
		add_file   ./user/Hardware/bd/zynq_default/zynq_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/m3_xIP_default/zynq_default.bd] -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/m3_xIP_default/zynq_default.bd] -top -quiet
	}
}

proc MicroBlaze_IP_add { current_Location } {
	if {[glob -nocomplain ./user/Hardware/bd/*] == ""} {		
		file mkdir ./user/Hardware/bd/MicroBlaze_default
		file copy  -force $current_Location/IP/Example_bd/MicroBlaze_default.bd ./user/Hardware/bd/MicroBlaze_default
		add_file   ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd]  -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd] -top -quiet
	}
}

set fp [open "./Makefile" r]
while { [gets $fp config_data] >= 0 } \
{
	if {[string equal -length 3 $config_data Soc] == 1} \
    {
		gets $fp config_data
		remove_files -quiet [get_files]

		if {[string equal -length 4 $config_data none] == 1} {
			none_add
		} else {
			scan $config_data "%s -hw %s" cpu bd_example
			if {$bd_example != "none"} {				
				switch $cpu \
				{
					cortexM3   {cortexM3_IP_add   $xilinx_path}
					cortexA9   {cortexA9_IP_add   $xilinx_path}
					MicroBlaze {MicroBlaze_IP_add $xilinx_path}
				}
			}
			soc_add
		}
		break
	}
}

close $fp