#non-project mode: synth_design, report_timing_summary, write_checkpoint;
reset_run synth_1
launch_run synth_1 
wait_on_run synth_1
write_checkpoint -force ./prj/xilinx/template.runs/synth_1/TOP.dcp -quiet
#report_timing_summary
