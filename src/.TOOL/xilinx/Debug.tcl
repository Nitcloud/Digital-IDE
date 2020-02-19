set device "xc"
open_hw
connect_hw_server
set found 0
foreach { hw_target } [get_hw_targets] {
    current_hw_target $hw_target
    open_hw_target
    foreach { hw_device } [get_hw_devices] {
	puts [get_property PART $hw_device]
    if { [string equal -length 2 [get_property PART $hw_device] $device] == 0 } {
        puts "------Successfully Found Hardware Target with a ${device} device------ "
        current_hw_device $hw_device
        set found 1
    }
    }
    if {$found == 1} {break}
    close_hw_target
}   
if {$found == 0 } {
    puts "******ERROR : Did not find any Hardware Target with a ${device} device****** "
    exit 1
} 

set_property PROGRAM.FILE ./[current_project].bit [current_hw_device]
set_property PROBES.FILE ./[current_project].ltx [current_hw_device]
set_property FULL_PROBES.FILE ./[current_project].ltx [current_hw_device]
program_hw_devices [current_hw_device]

display_hw_ila_data [ get_hw_ila_data hw_ila_data_1 -of_objects [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]]
run_hw_ila [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]
wait_on_hw_ila [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]
display_hw_ila_data [upload_hw_ila_data [get_hw_ilas -of_objects [current_hw_device] -filter {CELL_NAME=~"u_ila_0"}]]
