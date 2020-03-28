set_param general.maxThreads 6
# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"
set xsim_path ./prj/xilinx/template.sim/sim_1/behav/xsim

reset_simulation -quiet

# foreach wdb_file [glob -nocomplain $xsim_path/*.wdb] {
# 	if {$wdb_file == } {
		
# 	} 
# }

launch_simulation -quiet
set state [exec python $xilinx_path/Script/Python/Log.py sim]

proc wcfg_Gen {} {
	set wcfgfd [open "testbench_behav.wcfg" w]
	puts $wcfgfd "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
	puts $wcfgfd "<wave_config>"
	puts $wcfgfd "   <wave_state>"
	puts $wcfgfd "   </wave_state>"
	puts $wcfgfd "   <db_ref_list>"
	puts $wcfgfd "      <db_ref path=\"testbench_behav.wdb\" id=\"1\">"
	puts $wcfgfd "         <top_modules>"
	puts $wcfgfd "            <top_module name=\"glbl\" />"
	puts $wcfgfd "            <top_module name=\"testbench\" />"
	puts $wcfgfd "         </top_modules>"
	puts $wcfgfd "      </db_ref>"
	puts $wcfgfd "   </db_ref_list>"
	puts $wcfgfd "   <zoom_setting>"
	puts $wcfgfd "      <ZoomStartTime time=\"0fs\"></ZoomStartTime>"
	puts $wcfgfd "      <ZoomEndTime time=\"8981fs\"></ZoomEndTime>"
	puts $wcfgfd "      <Cursor1Time time=\"0fs\"></Cursor1Time>"
	puts $wcfgfd "   </zoom_setting>"
	puts $wcfgfd "   <column_width_setting>"
	puts $wcfgfd "      <NameColumnWidth column_width=\"175\"></NameColumnWidth>"
	puts $wcfgfd "      <ValueColumnWidth column_width=\"135\"></ValueColumnWidth>"
	puts $wcfgfd "   </column_width_setting>"
	puts $wcfgfd "   <WVObjectSize size=\"0\" />"
	puts $wcfgfd "</wave_config>"
	close $wcfgfd
}

if { $state == "none" }  {
	cd $xsim_path
	wcfg_Gen
	exec xsim testbench_behav -gui -wdb testbench_behav.wdb -view testbench_behav.wcfg
	cd ../../../../../../
}