set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

set hw_name  SDK_Platform
set prj_name test

set cpu cortexA9

setws  $ws_path
openhw $ws_path/[getprojects -type hw]/system.hdf 

#get project param
set fp [open $root_path/CONFIG r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 12 $data "PRJ_NAME.SOC"] == 1 } {
			gets $fp prj_name
	}
	if { [string equal -length 12 $data "SOC_MODE.soc"] == 1 } {
			gets $fp cpu
	}
}
close $fp

connect
puts [targets]
puts "which one you want to connect"
gets stdin index;
targets $index

#System Reset
rst -system

# PS7 initialization
namespace eval xsdb \
{ 
	source ./user/Software/src/$hw_name/ps7_init.tcl
	ps7_init
}

# Download the elf
dow ./user/Software/src/$prj_name/Debug/$prj_name.elf
con