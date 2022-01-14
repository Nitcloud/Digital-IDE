set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

setws  $ws_path

if { [glob -nocomplain $ws_path/SDK_Platform/*.hdf] == "" } {
	puts "there is no hdf file at here" 
	exit 1
} else {
	openhw $ws_path/[getprojects -type hw]/system.hdf 
}

projects -build