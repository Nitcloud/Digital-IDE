#updata file
set fp [open "./Makefile" r]
exec python [file dirname $current_Location]/Script/fileupdate.py -quiet
while { [gets $fp config_data] >= 0 } {
	if {[string equal -length 3 $config_data Soc] == 1} {
		gets $fp config_data
		if {[string equal -length 4 $config_data none] == 1} {
			add_file ./user/src -quiet
			remove_files ./user/Hardware/src -quiet

			#set top
			set_property top TOP [current_fileset]

			#add xdc
			remove_files -fileset constrs_1 ./user/Hardware/data/ -quiet
			add_files -fileset constrs_1 ./user/data -quiet

			#add sim
			add_files -fileset sim_1 -norecurse ./user/sim/testbench.v -force -quiet
			remove_files -fileset sim_1 ./user/Hardware/sim/testbench.v -quiet
			set_property top testbench [get_filesets sim_1]
		} else {
			add_file ./user/Hardware/src -quiet
			remove_files  ./user/src -quiet

			#set top
			set_property top TOP [current_fileset]

			#add xdc
			add_files -fileset constrs_1 ./user/Hardware/data -quiet
			remove_files  ./user/data -quiet

			#add sim
			add_files -fileset sim_1 -norecurse ./user/Hardware/sim/testbench.v -force -quiet
			remove_files -fileset sim_1 ./user/sim/testbench.v -quiet
			set_property top testbench [get_filesets sim_1]
		}
		break
	}
}
close $fp