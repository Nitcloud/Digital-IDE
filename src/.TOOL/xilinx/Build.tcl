set_param general.maxThreads 6

variable current_Location [file normalize [info script]]
#run synth
reset_run synth_1
launch_run synth_1 
wait_on_run synth_1
write_checkpoint -force ./prj/xilinx/template.runs/synth_1/TOP.dcp -quiet
#run impl
reset_run impl_1
launch_run impl_1
wait_on_run impl_1
open_run impl_1
report_timing_summary
write_checkpoint -force ./prj/xilinx/template.runs/impl_1/TOP_routed.dcp -quiet
#Gen boot
write_bitstream ./[current_project].bit -force -quiet
exec bootgen -arch zynq -image [file dirname $current_Location]/BOOT/output.bif -o ./BOOT.bin
