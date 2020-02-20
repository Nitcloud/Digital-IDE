#updata file
set fp [open "./config.txt" r]
while { [gets $fp config_data] >= 0 } {
	if {[string equal -length 3 $config_data Soc] == 1} {
		gets $fp config_data
		if {[string equal -length 4 $config_data none] == 1} {
			add_file ./user/src -quiet
			#set top
			set_property top TOP [current_fileset]
			#add xdc
			add_files -fileset constrs_1 ./user/data -quiet
		} else {
			add_file ./user/Hardware/src -quiet
			#set top
			set_property top TOP [current_fileset]
			#add xdc
			add_files -fileset constrs_1 ./user/Hardware/data -quiet
		}
		break
	}
}
close $fp