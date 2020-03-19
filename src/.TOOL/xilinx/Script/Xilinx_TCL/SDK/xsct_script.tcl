# Set SDK workspace
setws ./
# Create a HW project
createhw -name hw1 -hwspec /tmp/system.hdf
# Create a BSP project
createbsp -name bsp1 -hwproject hw1 -proc ps7_cortexa9_0 -os standalone
# Create application project
createapp -name hello -hwproject hw1 -bsp bsp1 -proc ps7_cortexa9_0 -os standalone \
-lang C -app {Hello World}
# Build all projects
projects -build
# Connect to a remote hw_server
connect -host raptor-host
# Select a target
targets -set -nocase -filter {name =~ “ARM* #0}
# System Reset
rst -system
# PS7 initialization
namespace eval xsdb {source /tmp/workspace/hw1/ps7_init.tcl; ps7_init}
# Download the elf
dow /tmp/workspace/hello/Debug/hello.elf
# Insert a breakpoint @ main
bpadd -addr &main
# Continue execution until the target is suspended
con -block -timeout 500
# Print the target registers
puts [rrd]
# Resume the target
con