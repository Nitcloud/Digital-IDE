set hw_path   ./user/Software/data
set ws_path   ./user/Software/src

set current_Location [file normalize [info script]]
set root_path [file dirname [file dirname [file dirname [file dirname [file dirname $current_Location]]]]]

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
	if { [string equal -length 12 $data "SOC_MODE.app"] == 1 } {
		gets $fp app
		if {$app == "undefined"} {
			set app Hello World
		}
	}
	if { [string equal -length 11 $data "SOC_MODE.os"] == 1 } {
		gets $fp os
		if {$os == "undefined"} {
			set os standalone
		}
	}
}
close $fp

if { [getprojects -type bsp] == "" } {
	createbsp -name $bsp_name -hwproject $hw_name -proc $cpu -os $os
}

if { [getprojects -type app] != $app } {
	createapp -name $prj_name -hwproject $hw_name -bsp $bsp_name \
	-proc $cpu -os $os -lang C -app $app
}