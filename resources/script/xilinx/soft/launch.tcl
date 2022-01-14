set hw_path   ./user/Software/data
set ws_path   ./user/Software/src

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

if { [getprojects -type bsp] == "" } {
	createbsp -name $bsp_name -hwproject $hw_name -proc $cpu -os $os
}

if { [getprojects -type app] != $app } {
	createapp -name $prj_name -hwproject $hw_name -bsp $bsp_name \
	-proc $cpu -os $os -lang C -app $app
}