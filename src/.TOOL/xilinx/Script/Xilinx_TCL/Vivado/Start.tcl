set_param general.maxThreads 8
variable current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]
# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

set device_file     "$xilinx_path/Device.txt"
set device_file_tmp "$xilinx_path/Device.txt.tmp"

set device_num      0
set add_param       1

set device_num      0
set fp [open $device_file r]
while { [gets $fp data] >= 0 } \
{
	set device_num [expr $device_num + $add_param]
	set device_arr($device_num) $data
}
close $fp

#creat project
set your_choice  a
while {$your_choice == "a" || $your_choice == "d"} \
{
    puts "---------which device you want to create---------"
    puts "#note:input the number to choose the device"
    puts "#     input the a to Add the device"
    puts "#     input the b to Delete the device"
    puts "#     input the e to exit"
	for {set device_index 1} {$device_index <= $device_num} {incr device_index} {
		puts "$device_index) $device_arr($device_index)"
	}
    puts "---------please input your choice---------"
    gets stdin your_choice
    switch $your_choice \
    {
        a \
        {
            puts "please input the name of device"
            gets stdin Device
			if {$Device == "e"} {
				exit 1
			}
			for {set index 1} {$index <= $device_num} {incr index} {
				if {$Device == $device_arr($index)} {
					puts "The device already exists."
					set index 0
					break
				}
			}
			if { $index != 0 } {
				set fp [open $device_file a+]
				puts $fp $Device
				close $fp
				set device_num      0
				set fp [open $device_file r]
				while { [gets $fp data] >= 0 } \
				{
					set device_num [expr $device_num + $add_param]
					set device_arr($device_num) $data
				}
				close $fp
			}
        }
        d \
        {
            puts "please input the number of device"
            gets stdin Delete_num
			while {1} \
			{
				if {$Delete_num>=1 && $Delete_num<=$device_num || $Delete_num == "e"} {
					break
				}
				puts "please input right choice"
				gets stdin Delete_num
			}
			if {$Delete_num != "e"} {
				set fd [open $device_file r]
				set newfd [open $device_file_tmp w]
				while {[gets $fd line] >= 0} \
				{
					if {[string compare $line $device_arr($Delete_num)] != 0} {
						set newline $line
						puts $newfd $newline
					}
				}
				close $fd
				close $newfd
				file rename -force $device_file_tmp $device_file
				set device_num      0
				set fp [open $device_file r]
				while { [gets $fp data] >= 0 } \
				{
					set device_num [expr $device_num + $add_param]
					set device_arr($device_num) $data
				}
				close $fp
			}
        }
        e {exit 1;}
		default \
		{
			if { $your_choice>=1 && $your_choice<=$device_num } {
				set fp [open "./Makefile" a+]
				puts $fp $device_arr($your_choice)
				close $fp
				create_project template ./prj/xilinx -part $device_arr($your_choice) -force -quiet
				break
			} else {
				puts "please input right choice"
				set your_choice a 
			}
		}
    }
}

set_property SOURCE_SET sources_1 [get_filesets sim_1]
set_property top_lib xil_defaultlib [get_filesets sim_1]
update_compile_order -fileset sim_1 -quiet

# exec python [file dirname $xilinx_path]/.Script/fileupdate.py -quiet
# #add file
# set fp [open "./Makefile" r]
# while { [gets $fp config_data] >= 0 } \
# {
# 	if {[string equal -length 3 $config_data Soc] == 1} {
# 		gets $fp config_data
# 		if {[string equal -length 4 $config_data none] == 1} {
# 			add_file ./.LIB -force -quiet
# 			add_file ./user/src -force -quiet
# 			add_file ./user/TOP.v -force -quiet

# 			#set top
# 			set_property top TOP [current_fileset]

# 			#add xdc
# 			add_files -fileset constrs_1 ./user/data -force -quiet

# 			#set sim
# 			set_property SOURCE_SET sources_1 [get_filesets sim_1]
# 			add_files -fileset sim_1 -norecurse ./user/sim/testbench.v -force -quiet
# 			set_property top testbench [get_filesets sim_1]
# 			set_property top_lib xil_defaultlib [get_filesets sim_1]
# 			update_compile_order -fileset sim_1 -quiet
# 		} else \
#         {
# 			#add IP
# 			if {[string equal -length 8 $config_data cortexM3] == 1} {
# 				set_property ip_repo_paths $xilinx_path/IP [current_project]
# 				file copy -force $xilinx_path/IP/Example_bd/m3_for_xilinx.bd ./user/Hardware/bd
# 	            add_file ./user/Hardware/bd/m3_for_xilinx.bd -force -quiet
# 			}

# 			#add src
# 			add_file ./user/Hardware/src -force -quiet
# 			add_file ./user/Hardware/TOP.v -force -quiet

# 			#set top
# 			set_property top TOP [current_fileset]

# 			#add xdc	
# 			add_files -fileset constrs_1 ./user/Hardware/data/ -quiet

# 			#set sim
# 			set_property SOURCE_SET sources_1 [get_filesets sim_1]
# 			add_files -fileset sim_1 -norecurse ./user/Hardware/sim/testbench.v -force -quiet
# 			update_compile_order -fileset sim_1
# 			set_property top testbench [get_filesets sim_1]
# 			set_property top_lib xil_defaultlib [get_filesets sim_1]
# 			update_compile_order -fileset sim_1
# 		}
# 		break
# 	}
# }
# close $fp

#source ./.TOOL/xilinx/zynq_ps.tcl -notrace;
source [file dirname $current_Location]/Run.tcl -notrace;