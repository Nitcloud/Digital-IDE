launch_runs impl_1 -to_step write_bitstream -jobs 6 -quiet
write_checkpoint -force ./prj/xilinx/template.runs/synth_1/TOP.dcp -quiet
write_checkpoint -force ./prj/xilinx/template.runs/impl_1/TOP_routed.dcp -quiet
bootgen -arch zynq -image ./user/data/BOOT/output.bif -o ./BOOT.bin -quiet
