#non-project mode: opt_design, write_checkpoint, place_design, write_checkpoint, route_design, report_timing_summary, write_checkpoint
reset_run impl_1
launch_run impl_1
wait_on_run impl_1
open_run impl_1
report_timing_summary
write_checkpoint -force ./prj/xilinx/template.runs/impl_1/TOP_routed.dcp -quiet