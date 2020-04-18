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
# Connect to a remote hw_server
connect
# Select a target
targets 2
#System Reset
rst -system
# PS7 initialization
namespace eval xsdb \
{ 
	source ./user/Software/src/$hw_name/ps7_init.tcl
	ps7_init
}
# Download the elf
#dow ./user/Software/src/$prj_name/Debug/$prj_name.elf
