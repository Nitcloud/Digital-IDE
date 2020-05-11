set Device    none
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 6 $data "Device"] == 1 } {
			gets $fp Device
	}
}
close $fp

open_hw -quiet
connect_hw_server -quiet
set found 0
foreach { hw_target } [get_hw_targets] \
{
    current_hw_target $hw_target
    open_hw_target -quiet
    foreach { hw_device } [get_hw_devices] \
	{
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
	set_property PROGRAM.FILE ./[current_project].bit [current_hw_device]
	program_hw_devices [current_hw_device] -quiet
	disconnect_hw_server -quiet
}


