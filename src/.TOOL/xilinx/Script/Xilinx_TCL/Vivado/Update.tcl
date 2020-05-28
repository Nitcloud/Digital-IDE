#updata file

set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
set root_path   [file dirname $xilinx_path]

set soc     none
set bd_file default

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
	#add xdc
	add_files -fileset constrs_1 ./user/Hardware/data -quiet
	#add sim
	add_files -fileset sim_1 ./user/Hardware/sim -force -quiet
	set_property top testbench [get_filesets sim_1]
}

proc cortexM3_IP_add { current_Location } {
	set_property ip_repo_paths $current_Location/IP [current_project]

	set ensureExsit 0
	foreach bd_folder_list [glob -nocomplain ./user/Hardware/bd/*] {
		if { $bd_folder_list == "m3_xIP_default"} \
		{
            puts ensureExsit 1
        }
	}
	if { $ensureExsit == 0 } {			
		file mkdir ./user/Hardware/bd/m3_xIP_default
		file copy  -force $current_Location/IP/Example_bd/m3_xIP_default.bd ./user/Hardware/bd/m3_xIP_default
		add_file   ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd] -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/m3_xIP_default/m3_xIP_default.bd] -top -quiet
	}
}

proc cortexA9_IP_add { current_Location } {
	set ensureExsit 0
	foreach bd_folder_list [glob -nocomplain ./user/Hardware/bd/*] {
		if {$bd_folder_list == "zynq_default"} {
            puts ensureExsit 1
        }
	}
	if { $ensureExsit == 0 } {		
		file mkdir ./user/Hardware/bd/zynq_default
		file copy  -force $current_Location/IP/Example_bd/zynq_default.bd ./user/Hardware/bd/zynq_default
		add_file   ./user/Hardware/bd/zynq_default/zynq_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/zynq_default/zynq_default.bd] -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/zynq_default/zynq_default.bd] -top -quiet
	}
}

proc MicroBlaze_IP_add { current_Location } {
	set ensureExsit 0
	foreach bd_folder_list [glob -nocomplain ./user/Hardware/bd/*] {
		if { $bd_folder_list == "MicroBlaze_default" } {
            puts ensureExsit 1
        }
	}
	if { $ensureExsit == 0 } {		
		file mkdir ./user/Hardware/bd/MicroBlaze_default
		file copy  -force $current_Location/IP/Example_bd/MicroBlaze_default.bd ./user/Hardware/bd/MicroBlaze_default
		add_file   ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd -force -quiet
		generate_target all [get_files ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd]  -quiet
		make_wrapper -files [get_files ./user/Hardware/bd/MicroBlaze_default/MicroBlaze_default.bd] -top -quiet
	}
}

remove_files -quiet [get_files]

set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 12 $data "SOC_MODE.soc"] == 1 } {
		gets $fp soc
		if {$soc == "undefined"} {
			set soc none
		}
	}
	if { [string equal -length 16 $data "SOC_MODE.bd_file"] == 1 } {
		gets $fp bd_file
		if {$bd_file == "undefined"} {
			set bd_file none
		}
	}
}
close $fp

if {[string equal -length 4 $soc none] == 1} {
	none_add
} else {
	if {$bd_file == "default"} {				
		switch $soc \
		{
			cortexM3       {cortexM3_IP_add   $xilinx_path}
			microblaze     {MicroBlaze_IP_add $xilinx_path}
			ps7_cortexa9_0 {cortexA9_IP_add   $xilinx_path}
			ps7_cortexa9_1 {cortexA9_IP_add   $xilinx_path}
		}
	} else {
		if {$bd_file != "none"} {			
			set ensureExsit 0
			foreach bd_folder_list [glob -nocomplain ./user/Hardware/bd/*] {
				if { $bd_folder_list == $bd_file } {
					puts ensureExsit 1
				}
			}
			if { $ensureExsit == 0 } {	
				file mkdir ./user/Hardware/bd/$bd_file
				file copy  -force $xilinx_path/IP/Example_bd/$bd_file.bd ./user/Hardware/bd/$bd_file
				add_file   ./user/Hardware/bd/$bd_file/$bd_file.bd -force -quiet
				generate_target all [get_files ./user/Hardware/bd/$bd_file/$bd_file.bd] -quiet
				make_wrapper -files [get_files ./user/Hardware/bd/$bd_file/$bd_file.bd] -top -quiet
			}
		}
	}
	soc_add
}