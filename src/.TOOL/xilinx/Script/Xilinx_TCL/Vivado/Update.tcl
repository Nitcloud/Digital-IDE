#updata file

# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

variable current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
set state [exec python [file dirname $xilinx_path]/Script/fileupdate.py -quiet]
#puts $state
set makefile_path $xilinx_path/Makefile
set fp [open $makefile_path r]

proc none_add {} {
	add_file ./user/src -quiet
	foreach bd_file [glob -nocomplain ./user/bd/*.bd] {
		add_file $bd_file -quiet
	}
	#set top
	add_file ./user/TOP.v -quiet
	set_property top TOP [current_fileset]
	#add xdc
	add_files -fileset constrs_1 ./user/data -quiet
	#add sim
	add_files -fileset sim_1 -norecurse ./user/sim -force -quiet
	set_property top testbench [get_filesets sim_1]
}

proc soc_add {} {
	add_file ./user/Hardware/src -quiet
	foreach bd_file [glob -nocomplain ./user/Hardware/bd/*.bd] {
		add_file $bd_file -quiet
	}
	#set top
	add_file ./user/Hardware/TOP.v -quiet
	set_property top TOP [current_fileset]
	#add xdc
	add_files -fileset constrs_1 ./user/Hardware/data -quiet
	#add sim
	add_files -fileset sim_1 -norecurse ./user/Hardware/sim -force -quiet
	set_property top testbench [get_filesets sim_1]
}

proc cortexM3_IP_add { current_Location } {
	set_property ip_repo_paths $xilinx_path/IP [current_project]
	file copy -force $xilinx_path/IP/Example_bd/m3_for_xilinx.bd ./user/Hardware/bd
	add_file ./user/Hardware/bd/m3_for_xilinx.bd -force -quiet
}

while { [gets $fp config_data] >= 0 } {
	if {[string equal -length 3 $config_data Soc] == 1} {
		gets $fp config_data
		remove_files [get_files]
		if {[string equal -length 6 $state changed] == 1} {
			switch $config_data {
				cortexM3 {
					cortexM3_IP_add $current_Location
				}
				default {}
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