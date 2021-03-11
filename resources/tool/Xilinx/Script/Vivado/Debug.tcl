set_param general.maxThreads 8
write_debug_probes -no_partial_ltxfile -quiet -force ./[current_project].ltx

set Device    none
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 6 $data "Device"] == 1 } {
			gets $fp Device
	}
}
close $fp

open_hw -quiet
connect_hw_server -quiet
set found 0
foreach hw_target [get_hw_targets] {
    current_hw_target $hw_target
    open_hw_target -quiet
    foreach hw_device [get_hw_devices] {
		if { [string equal -length 6 [get_property PART $hw_device] $Device] == 1 } {
			puts "------Successfully Found Hardware Target with a ${Device} device------ "
			current_hw_device $hw_device
			set found 1
		}
    }
    if {$found == 1} {break}
    close_hw_target
}   

#download the hw_targets
if {$found == 0 } {
    puts "******ERROR : Did not find any Hardware Target with a ${Device} device****** "
} else {
	set_property PROBES.FILE      ./[current_project].ltx [current_hw_device]
	set_property PROGRAM.FILE     ./[current_project].bit [current_hw_device]
	set_property FULL_PROBES.FILE ./[current_project].ltx [current_hw_device]
	program_hw_devices [current_hw_device] -quiet
	disconnect_hw_server -quiet
}

display_hw_ila_data [get_hw_ila_data hw_ila_data_1 -of_objects [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]]
run_hw_ila          [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]
wait_on_hw_ila      [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]
display_hw_ila_data [upload_hw_ila_data [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]]

start_gui