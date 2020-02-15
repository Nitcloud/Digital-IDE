gets stdin yorn
set device $yorn
open_hw
connect_hw_server
set found 0
foreach { hw_target } [get_hw_targets] {
    current_hw_target $hw_target
    open_hw_target
    foreach { hw_device } [get_hw_devices] {
    if { [string first [get_property PART $hw_device] $device] == 0 } {
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
program_hw_devices [current_hw_device]
disconnect_hw_server