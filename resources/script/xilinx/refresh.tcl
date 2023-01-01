remove_files -quiet [get_files]
set xip_repo_paths {}
set_property ip_repo_paths $xip_repo_paths [current_project] -quiet
update_ip_catalog -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/sim/test.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/sim/testbench.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/dependence_test/child_1.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/dependence_test/child_2.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/dependence_test/head_1.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/dependence_test/parent.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/formatter_test.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/fsm_test.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/netlist_test.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/parse_test/Cordic.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/parse_test/instance_test.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/parse_test/mult_module.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/Verilog/pl_led_stream_7035.v -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/based.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/bigfile.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/clk.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/counters.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/dsp.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/expr.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/fifo.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/forgen.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/forloop.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/formatter_vhdl.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/genericmap.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/ifchain.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/ifchain2.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/mem.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/operators.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/partselect.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/Scientific.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/signextend.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/test.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/todo.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/wbit1.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/whileloop.vhd -quiet
add_files d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/src/VHDL/withselect.vhd -quiet
add_files -fileset constrs_1 d:/Project/FPGA/Design/TCL_project/Test/Extension_test/user/data -quiet
file delete d:/Project/Code/.prj/Extension/Owner/Digital-IDE/resources/script/xilinx/refresh.tcl -force
