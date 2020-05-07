set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

set hw_name  SDK_Platform
set bsp_name BSP_package
set prj_name test

set cpu cortexA9
set os  standalone
set app HelloWorld

setws $ws_path

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
			if { $cpu == "cortexA9" } {
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