
setws d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/Software/src
if { [getprojects -type hw] == "" } {
    createhw -name SDK_Platform -hwspec d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/Software/src/
} else {
    openhw d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/Software/src/[getprojects -type hw]/system.hdf 
}

if { [getprojects -type bsp] == "" } {
    createbsp -name BSP_package \
                -hwproject SDK_Platform \
                -proc ps7_cortexa9_0 \
                -os standalone
}

if { [getprojects -type app] == "" } {
    createapp -name template \
                -hwproject SDK_Platform \
                -bsp BSP_package \
                -proc ps7_cortexa9_0 \
                -os standalone \
                -lang C \
                -app {Hello World}
}
file delete d:/Project/Code/.prj/Extension/Owner/Digital-IDE/resources/script/xilinx/soft/launch.tcl -force
