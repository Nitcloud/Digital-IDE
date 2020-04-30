#updata file

# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

variable current_Location [file normalize [info script]]

set state       [exec python [file dirname $xilinx_path]/.Script/fileupdate.py -quiet]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
#puts $state
set fp [open "./Makefile" r]

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
	update_bd ./prj/xilinx/template.srcs/sources_1/bd/*
	update_ip ./prj/xilinx/template.srcs/sources_1/ip/*
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
	update_bd ./prj/xilinx/template.srcs/sources_1/bd/*
	update_ip ./prj/xilinx/template.srcs/sources_1/ip/*
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
	file mkdir ./user/Hardware/bd/m3_xIP_default
	file copy  -force $current_Location/IP/Example_bd/m3_xIP_default.bd ./user/Hardware/bd/m3_xIP_default
	add_file   ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd -force -quiet
}

proc cortexA9_IP_add { current_Location } {
	set_property ip_repo_paths $current_Location/IP [current_project]
	file mkdir ./user/Hardware/bd/zynq_default
	file copy  -force $current_Location/IP/Example_bd/zynq_default.bd ./user/Hardware/bd/zynq_default
	add_file   ./user/Hardware/bd/zynq_default/zynq_default.bd -force -quiet
}

while { [gets $fp config_data] >= 0 } \
{
	if {[string equal -length 3 $config_data Soc] == 1} \
    {
		gets $fp config_data
		remove_files -quiet [get_files]
        #puts $state
		if {[string equal -length 6 $state changed] == 1} \
        {
			scan $config_data "%s" cpu
			switch $cpu \
			{
				cortexM3 {cortexM3_IP_add $xilinx_path}
				cortexA9 {cortexA9_IP_add $xilinx_path}
			}
		}
		if {[string equal -length 4 $config_data none] == 1} {
			none_add
		} else {
			soc_add
		}
		break
	}
}

close $fp