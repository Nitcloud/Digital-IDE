set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

set current_Location [file normalize [info script]]
set root_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]

set hw_name  SDK_Platform
set prj_name test

set cpu cortexA9

setws  $ws_path

if { [glob -nocomplain $ws_path/SDK_Platform/*.hdf] == "" } {
	puts "there is no hdf file at here" 
	exit 1
} else {
	openhw $ws_path/[getprojects -type hw]/system.hdf 
}

#get project param
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } {
	if { [string equal -length 12 $data "PRJ_NAME.SOC"] == 1 } {
		gets $fp prj_name
		if {$prj_name == "undefined"} {
			set prj_name test
		}
	}
	if { [string equal -length 12 $data "SOC_MODE.soc"] == 1 } {
		gets $fp cpu
		if {$cpu == "undefined"} {
			set cpu ps7_cortexa9_0
		}
	}
}
close $fp

connect 

if { [string equal -length 12 $cpu "ps7_cortexa9"] == 1 } {
	set index [string range $cpu 13 13]
	targets -set -filter {name =~ "ARM*#$index"}
}

#System Reset
rst -system

# PS7 initialization
namespace eval xsdb { 
	source ./user/Software/src/$hw_name/ps7_init.tcl
	ps7_init
}

# Download the elf
dow ./user/Software/src/$prj_name/Debug/$prj_name.elf
con