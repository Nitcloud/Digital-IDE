set_param general.maxThreads 6
variable current_Location [file normalize [info script]]

set found 0
set fp [open "./config.txt" r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 4 $data xc7z] == 1 } {
        set found 1
    }
}
close $fp

if {$found == 0 } {
    set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
} 

#run synth
reset_run synth_1 -quiet
launch_run synth_1 -quiet
wait_on_run synth_1 -quiet
exec python [file dirname $current_Location]/Script/Log.py -quiet
write_checkpoint -force ./prj/xilinx/template.runs/synth_1/TOP.dcp -quiet
#run impl
reset_run impl_1 -quiet
launch_run impl_1 -quiet
wait_on_run impl_1 -quiet
exec python [file dirname $current_Location]/Script/Log.py -quiet
open_run impl_1 -quiet
report_timing_summary -quiet

write_checkpoint -force ./prj/xilinx/template.runs/impl_1/TOP_routed.dcp -quiet
#Gen boot
if {$found == 0} {
	write_bitstream ./[current_project].bit -force -quiet -bin_file
} 

if {$found == 1} {
	write_bitstream ./[current_project].bit -force -quiet
    exec bootgen -arch zynq -image [file dirname $current_Location]/BOOT/output.bif -o ./BOOT.bin
} 
