set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

set hw_name  SDK_Platform
set bsp_name BSP_package
set prj_name test

set cpu cortexA9
set os  standalone
set app HelloWorld

setws $ws_path

proc software_down {prj_name} {
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
}

# find the hdf file 
if { [glob -nocomplain $hw_path/*.hdf] == "" } {
	puts "there is no hdf file at here" 
	exit 1
} else {
	set hw_file [glob -nocomplain $hw_path/*.hdf]
}

if { [getprojects -type hw] == "" } {
	createhw -name $hw_name -hwspec $hw_file
} else {
	openhw $ws_path/[getprojects -type hw]/system.hdf 
}

#get project param
set fp [open "./Makefile" r]
while { [gets $fp data] >= 0 } \
{
	if { [string equal -length 3 $data Soc] == 1 } {
		if { [gets $fp data] >= 0 } {
        	scan $data "%s -prj_name %s -os %s -app %s" cpu prj_name os app
			if { $cpu == "cortexA9" } \
			{
				set cpu "ps7_cortexa9_0"
			}
			if { $app == "HelloWorld" } {
				set app "Hello World"
			}
    	}
    }
}
close $fp

if { [getprojects -type bsp] == "" } {
	createbsp -name $bsp_name -hwproject $hw_name -proc $cpu -os $os
}

if { [getprojects -type app] == "" } {
	createapp -name $prj_name -hwproject $hw_name -bsp $bsp_name \
	-proc $cpu -os $os -lang C -app $app
}

proc ope {} {
	while {1} \
	{
		puts "---------what do you want to do next---------"
		puts "*** input e to exit ***"
		puts "1) Build"
		puts "2) targets"
		puts "3) Down"
		# puts "3) fpga"
		puts "4) GUI"
		gets stdin your_choice;
		switch $your_choice \
		{
			1 \
			{
				projects -build
			}
			2 \
			{
				connect
				targets
				puts "which one you want to connect"
				gets stdin index;
				targets $index
			}
			3 \
			{
				software_down [getprojects -type app]
			}
			4 \
			{
				xsdk
			}
			e {break}
			default {puts "please input right choice"}
		}
	}
}

ope