set hw_path  ./user/Software/data

set prj_name test

set cpu cortexA9
set os  standalone
set app HelloWorld

connect
puts [targets]
puts "which one you want to connect"
gets stdin index;
targets $index

#get project param
set fp [open "./Makefile" r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 3 $data Soc] == 1 } {
		if { [gets $fp data] >= 0 } {
        	scan $data "%s -prj_name %s -os %s -app %s" cpu prj_name os app
    	}
    }
}
close $fp

#System Reset
rst -system

# PS7 initialization
namespace eval xsdb \
{ 
	global hw_name
	source ./user/Software/src/$hw_name/ps7_init.tcl
	ps7_init
}

# Download the elf
dow ./user/Software/src/$prj_name/Debug/$prj_name.elf
con