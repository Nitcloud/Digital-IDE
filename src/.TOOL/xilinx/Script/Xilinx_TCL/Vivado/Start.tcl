set_param general.maxThreads 6

set prj_name         template
set current_Location [file normalize [info script]]

proc choose_device {} {
	variable current_Location [file normalize [info script]]
	set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]

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
					set your_choice  a
				} else {
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
					puts   $fp $device_arr($your_choice)
					close  $fp
					return $device_arr($your_choice)
					break
				} else {
					puts "please input right choice"
					set your_choice a 
				}
			}
		}
	}
}

set fp [open "./Makefile" r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 6 $data Device] == 1 } {
		if { [gets $fp data] >= 0 } {
			create_project $prj_name ./prj/xilinx -part $data -force -quiet
		} else {
			create_project $prj_name ./prj/xilinx -part [choose_device] -force -quiet
		}
	}
}
close $fp

set_property SOURCE_SET sources_1   [get_filesets sim_1]
set_property top_lib xil_defaultlib [get_filesets sim_1]

update_compile_order -fileset sim_1 -quiet

close_project -quiet

source [file dirname $current_Location]/Run.tcl -notrace;