#updata file

variable current_Location [file normalize [info script]]
exec python [file dirname $current_Location]/Script/fileupdate.py -quiet

set fp [open "./Makefile" r]

while { [gets $fp config_data] >= 0 } {
	if {[string equal -length 3 $config_data Soc] == 1} {
		gets $fp config_data
		if {[string equal -length 4 $config_data none] == 1} {
			add_file ./user/src -quiet
			remove_files ./user/Hardware/src/[file tail [glob ./user/src/*]] -quiet

			#set top
			add_file ./user/TOP.v -quiet
			remove_files ./user/Hardware/TOP.v -quiet
			set_property top TOP [current_fileset]

			#add xdc
			add_files -fileset constrs_1 ./user/data -quiet
			remove_files -fileset constrs_1 ./user/Hardware/data/[file tail [glob ./user/data/*]] -quiet

			#add sim
			add_files -fileset sim_1 -norecurse ./user/sim -force -quiet
			remove_files -fileset sim_1 ./user/Hardware/sim/[file tail [glob ./user/sim/*]] -quiet
			set_property top testbench [get_filesets sim_1]
		} else {
			add_file ./user/Hardware/src -quiet
			remove_files ./user/src/[file tail [glob ./user/Hardware/src/*]] -quiet

			#set top
			add_file ./user/Hardware/TOP.v -quiet
			remove_files ./user/TOP.v -quiet
			set_property top TOP [current_fileset]

			#add xdc
			add_files -fileset constrs_1 ./user/Hardware/data -quiet
			remove_files -fileset constrs_1 ./user/data/[file tail [glob ./user/Hardware/data/*]] -quiet

			#add sim
			add_files -fileset sim_1 -norecurse ./user/Hardware/sim -force -quiet
			remove_files -fileset sim_1 ./user/sim/[file tail [glob ./user/Hardware/sim/*]] -quiet
			set_property top testbench [get_filesets sim_1]

			if {[string equal -length 8 $config_data cortexM3] == 1} {
				set_property  ip_repo_paths  [file dirname $current_Location]/.LIB/Soc/Cortex_M3/Xilinx [current_project]
			}
		}
		break
	}
}
close $fp