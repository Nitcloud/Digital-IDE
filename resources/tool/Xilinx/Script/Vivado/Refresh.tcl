#updata file

set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname $current_Location]]]
set root_path   [file dirname $xilinx_path]

set soc           none
set bd_file       none
set xip_repo_path default

proc update_ip   {IP_path}   {
	foreach IP_file [glob -nocomplain $IP_path] {
        foreach xci_file [glob -nocomplain $IP_file/*.xci] {
            #puts $xci_file
            add_file $xci_file -quiet
        }
	}
}
proc update_bd   {bd_path}   {
	foreach bd_file_list [glob -nocomplain $bd_path] {
		foreach bd_file [glob -nocomplain $bd_file_list/*.bd] {
            #puts $bd_file
			add_file $bd_file -quiet
            add_file $bd_file_list/hdl -quiet
        }
	}
}
proc update_file {file_path} {
    get_property top [current_fileset]
	set fp [open $file_path w]
	foreach file [get_files] {
        puts $fp $file
	}
    close $fp
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

proc generatebdPrj {bd_path} {
    foreach bd_folder [glob -nocomplain $bd_path] {
        if { [file isdirectory $bd_folder] == 1 } {
            set bd_name [file tail $bd_folder]
            if { [string equal -length 12 $bd_folder "mref"] == 1 } {
                foreach ip_folder [glob -nocomplain ./user/Hardware/bd/mref/*] {
                    foreach script [glob -nocomplain ./user/Hardware/bd/mref/$ip_folder/xgui/*.tcl] {
                        source ./user/Hardware/bd/mref/$ip_folder/xgui/$script
                    }
                }
            }       
            if { [file exists ./user/Hardware/bd/$bd_name/$bd_name.bd] == 1} {
                add_file ./user/Hardware/bd/$bd_name/$bd_name.bd -quiet
                generate_target all [get_files ./user/Hardware/bd/$bd_name/$bd_name.bd] -quiet
		        make_wrapper -files [get_files ./user/Hardware/bd/$bd_name/$bd_name.bd] -top -quiet
                open_bd_design ./user/Hardware/bd/$bd_name/$bd_name.bd -quiet
            }
        }
    }
}

# 获取配置信息
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
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
    if { [string equal -length 12 $data "xip_repo_path"] == 1 } {
		gets $fp xip_repo_path
	}
}
close $fp

remove_files -quiet [get_files]

if {[string equal -length 4 $soc none] == 1} {
    # reset ip_repo_paths
    if { [file isdirectory ./user/IP/lib] == 1 } {        
        set ip_lib_paths {./user/IP/lib}
        lappend ip_lib_paths $root_path/../../lib/Xilinx_lib/ip
    } else {
        set ip_lib_paths {}
        lappend ip_lib_paths $root_path/../../lib/Xilinx_lib/ip
    }
    if {$xip_repo_path != ""} {
        lappend ip_lib_paths $xip_repo_path
    }
    set_property ip_repo_paths $ip_lib_paths [current_project] -quiet
    update_ip_catalog -quiet
    # add file list
	none_add
} else {
    # reset ip_repo_paths
    if { [file isdirectory ./user/Hardware/IP/lib] == 1 } {        
        set ip_lib_paths {./user/Hardware/IP/lib}
        lappend ip_lib_paths $root_path/../../lib/Xilinx_lib/ip
    } else {
        set ip_lib_paths {}
        lappend ip_lib_paths $root_path/../../lib/Xilinx_lib/ip
    }
    if {$xip_repo_path != ""} {
        lappend ip_lib_paths $xip_repo_path
    }
    set_property ip_repo_paths $ip_lib_paths [current_project] -quiet
    update_ip_catalog -quiet
    # add BD Design
	
    if {$bd_file != "none"} {
        set ensureExsit 0
        if { [file exists ./user/Hardware/bd/$bd_file/$bd_file.bd] == 1} {
            set ensureExsit 1
        }
        if { $ensureExsit == 0 } {	
            file mkdir ./user/Hardware/bd/$bd_file
            file copy  -force $root_path/../../lib/Xilinx_lib/bd/$bd_file.bd ./user/Hardware/bd/$bd_file
        }
    }
    generatebdPrj ./user/Hardware/bd/*
    # add file list
	soc_add
}

if { [file exists $root_path/library.tcl] == 1 } {
    source        $root_path/library.tcl
    file   delete $root_path/library.tcl -force
}
# update_file $root_path/FILES
