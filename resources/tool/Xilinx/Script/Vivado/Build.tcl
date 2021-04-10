set_param general.maxThreads 8

set current_Location [file normalize [info script]]
set xilinx_path [file dirname [file dirname [file dirname $current_Location]]]
set root_path   [file dirname $xilinx_path]
# get the project info
set Device        none
set soc           none
set enableShowlog false

set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 6 $data "Device"] == 1 } {
		gets $fp Device
	}
	if { [string equal -length 12 $data "SOC_MODE.soc"] == 1 } {
		gets $fp soc
		if {$soc == "undefined"} {
			set soc none
		}
	}
	if { [string equal -length 13 $data "enableShowlog"] == 1 } {
		gets $fp enableShowlog
		if {$enableShowlog == "undefined"} {
			set enableShowlog false
		}
	}
}
close $fp

set synth "[file dirname $current_Location]/synth.tcl"
set impl  "[file dirname $current_Location]/Impl.tcl"

# build function
source $synth -notrace
source $impl  -notrace
if {$enableShowlog == "false"} {			
    open_run impl_1		  -quiet	
    report_timing_summary -quiet
} else {
    open_run impl_1		  
    report_timing_summary 
}
#Gen bit/hdf file
if { [string equal -length 4 $Device xc7z] == 0 } {
	set_property STEPS.WRITE_BITSTREAM.ARGS.BIN_FILE true [get_runs impl_1]
} 
if {$soc != "none"} {
    write_hwdef -force -file ./user/Software/data/[current_project].hdf
    write_bitstream ./[current_project].bit -force -quiet
} else {
    write_bitstream ./[current_project].bit -force -quiet -bin_file
}


