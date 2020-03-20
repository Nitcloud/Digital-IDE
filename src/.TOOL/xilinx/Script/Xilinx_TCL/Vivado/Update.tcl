#updata file

# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

variable current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
set state [exec python [file dirname $xilinx_path]/.Script/fileupdate.py -quiet]
#puts $state
set fp [open "./Makefile" r]

proc none_add {} {
	add_file ./user/src -quiet
	foreach bd_file [glob -nocomplain ./user/bd/*.bd] {
        #puts $bd_file
		add_file $bd_file -quiet
	}
    foreach IP_file [glob -nocomplain ./user/IP/*] {
        foreach xci_file [glob -nocomplain $IP_file/*.xci] {
            #puts $xci_file
            add_file $xci_file -quiet
        }
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
        #puts $bd_file
		add_file $bd_file -quiet
	}
    foreach IP_file [glob -nocomplain ./user/Hardware/IP/*] {
        foreach xci_file [glob -nocomplain $IP_file/*.xci] {
            #puts $xci_file
            add_file $xci_file -quiet
        }
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
	set_property ip_repo_paths $current_Location/IP [current_project]
	file copy -force $current_Location/IP/Example_bd/m3_for_xilinx.bd ./user/Hardware/bd
	add_file ./user/Hardware/bd/m3_for_xilinx.bd -force -quiet
}

while { [gets $fp config_data] >= 0 } \
{
	if {[string equal -length 3 $config_data Soc] == 1} \
    {
		gets $fp config_data
		remove_files -quiet [get_files]
        puts $state
		if {[string equal -length 6 $state changed] == 1} \
        {
			switch $config_data \
            {
				cortexM3 \
                {
					cortexM3_IP_add $xilinx_path
				}
				default {}
			}
		}
		if {[string equal -length 4 $config_data none] == 1} \
        {
			none_add
		} else \
        {
			soc_add
		}
		break
	}
}

close $fp