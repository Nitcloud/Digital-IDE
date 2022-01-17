launch_runs impl_1 -to_step write_bitstream -jobs 4 
report_timing_summary 
source d:/project/Code/.prj/Plug/My_Plug/DIDE/resources/script/xilinx/bit.tcl -notrace
file delete d:/project/Code/.prj/Plug/My_Plug/DIDE/resources/script/xilinx/build.tcl -force
