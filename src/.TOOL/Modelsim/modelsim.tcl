vlib hash				        //建立库
vlog -work hash delay_tb.sv		//编译文件到库	
vsim -c hash.delay_tb		    //仿真
add wave/*			            //添加观测波形
vcd file 1.vcd			        //添加vcd文件
vcd add /*			            //添加vcd观测节点
run -all				        //运行
quit -sim				        //退出仿真


