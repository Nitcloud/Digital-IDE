# 建立库
vlib hash				        
# 编译文件到库	
vlog -work hash delay_tb.sv		
# 仿真
vsim -c hash.delay_tb		    
# 添加观测波形
add wave/*			            
# 添加vcd文件
vcd file 1.vcd			        
# 添加vcd观测节点
vcd add /*			            
# 运行
run -all				        
# 退出仿真
quit -sim				        


