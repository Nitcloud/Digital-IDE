remove_files -quiet [get_files]
set xip_repo_paths {}
set_property ip_repo_paths $xip_repo_paths [current_project] -quiet
update_ip_catalog -quiet
add_files -fileset constrs_1 d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/data -quiet
file delete d:/Project/Code/.prj/Extension/Owner/Digital-IDE/resources/script/xilinx/refresh.tcl -force
