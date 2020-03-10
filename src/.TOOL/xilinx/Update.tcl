#updata file

variable current_Location [file normalize [info script]]
set state [exec python [file dirname $current_Location]/Script/fileupdate.py -quiet]
#puts $state
set fp [open "./Makefile" r]

proc none_add {} {
	add_file ./user/src -quiet
	foreach bd_file [glob -nocomplain ./user/src/*.bd] {
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
	foreach bd_file [glob -nocomplain ./user/Hardware/src/*.bd] {
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
	set_property ip_repo_paths [file dirname $current_Location]/.LIB/Soc/Cortex_M3/Xilinx [current_project]
	file copy -force [file dirname $current_Location]/.LIB/Soc/Cortex_M3/Xilinx/Example/tri_io_buf.v ./user/Hardware/src
	file copy -force [file dirname $current_Location]/.LIB/Soc/Cortex_M3/Xilinx/Example/m3_for_xilinx.bd ./user/Hardware/src
	add_file ./user/Hardware/src/m3_for_xilinx.bd -force -quiet
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