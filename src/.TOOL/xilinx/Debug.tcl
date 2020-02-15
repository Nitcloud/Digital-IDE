open_hw
connect_hw_server
open_hw_target
set_property PROGRAM.FILE {./TOP.bit} [get_hw_devices xc7z020_1]
set_property PROBES.FILE {./TOP.ltx} [get_hw_devices xc7z020_1]
set_property FULL_PROBES.FILE {./TOP.ltx} [get_hw_devices xc7z020_1]
current_hw_device [get_hw_devices xc7z020_1]
refresh_hw_device [lindex [get_hw_devices xc7z020_1] 0]
program_hw_devices [get_hw_devices xc7z020_1]
refresh_hw_device [lindex [get_hw_devices xc7z020_1] 0]
display_hw_ila_data [ get_hw_ila_data hw_ila_data_1 -of_objects [get_hw_ilas -of_objects [get_hw_devices xc7z020_1] -filter {CELL_NAME=~"u_ila_0"}]]
run_hw_ila [get_hw_ilas -of_objects [get_hw_devices xc7z020_1] -filter {CELL_NAME=~"u_ila_0"}]
wait_on_hw_ila [get_hw_ilas -of_objects [get_hw_devices xc7z020_1] -filter {CELL_NAME=~"u_ila_0"}]
display_hw_ila_data [upload_hw_ila_data [get_hw_ilas -of_objects [get_hw_devices xc7z020_1] -filter {CELL_NAME=~"u_ila_0"}]]
