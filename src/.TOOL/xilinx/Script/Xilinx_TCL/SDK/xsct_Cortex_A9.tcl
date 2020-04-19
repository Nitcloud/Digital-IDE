set hw_name  zynq_wrapper
set bsp_name BSP_package
set prj_name test
# Set SDK workspace
setws ./user/Software/src
# Create a HW project
createhw -name $hw_name -hwspec ./user/Software/data/zynq_wrapper.hdf
# Create a BSP project
createbsp -name $bsp_name -hwproject $hw_name -proc ps7_cortexa9_0 -os standalone
# Create application project
createapp -name $prj_name -hwproject $hw_name -bsp $bsp_name -proc ps7_cortexa9_0 -os standalone \
-lang C -app {Hello World}
# Build all projects
projects -build

proc software_down {} {
	connect -url tcp:127.0.0.1:3121
	source ./src/zynq_wrapper/ps7_init.tcl
	targets -set -nocase -filter {name =~"APU*" && jtag_cable_name =~ "Digilent JTAG-HS2 201706300081"} -index 0
	loadhw -hw D:/project/FPGA/My_FPGA/TCL_project/Test/Soc_A9_test/user/Software/src/zynq_wrapper/system.hdf -mem-ranges [list {0x40000000 0xbfffffff}]
	configparams force-mem-access 1
	targets -set -nocase -filter {name =~"APU*" && jtag_cable_name =~ "Digilent JTAG-HS2 201706300081"} -index 0
	stop
	ps7_init
	ps7_post_config
	targets -set -nocase -filter {name =~ "ARM*#0" && jtag_cable_name =~ "Digilent JTAG-HS2 201706300081"} -index 0
	rst -processor
	targets -set -nocase -filter {name =~ "ARM*#0" && jtag_cable_name =~ "Digilent JTAG-HS2 201706300081"} -index 0
	dow D:/project/FPGA/My_FPGA/TCL_project/Test/Soc_A9_test/user/Software/src/test/Debug/test.elf
	configparams force-mem-access 0
	targets -set -nocase -filter {name =~ "ARM*#0" && jtag_cable_name =~ "Digilent JTAG-HS2 201706300081"} -index 0
	con
}