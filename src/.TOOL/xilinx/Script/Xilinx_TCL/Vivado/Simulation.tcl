set_param general.maxThreads 8

# unset ::env(PYTHONPATH)
# unset ::env(PYTHONHOME)

# set ::env(PYTHONPATH) "C:/Program Files/Python38/python38.zip:C:/Program Files/Python38/DLLs:C:/Program Files/Python38/lib:C:/Program Files/Python38:C:/Program Files/Python38/lib/site-packages"
# set ::env(PYTHONHOME) "C:/Program Files/Python38"

set xilinx_path [file dirname [file dirname [file dirname [file dirname $current_Location]]]]

if {[current_sim] != ""} \
{
	relaunch_sim -quiet
	set sim_state [exec python $xilinx_path/Script/Python/Log.py sim [current_project]]
} else \
{
	launch_simulation -quiet
	set sim_state [exec python $xilinx_path/Script/Python/Log.py sim [current_project]]
}

if {$sim_state == "none"} {
	set curr_wave [current_wave_config]
	if { [string length $curr_wave] == 0 } \
	{
		if { [llength [get_objects]] > 0} \
		{
			add_wave /
			set_property needs_save false [current_wave_config]
		} else \
		{
			send_msg_id Add_Wave-1 WARNING "No top level signals found. Simulator will start without a wave window. If you want to open a wave window go to 'File->New Waveform Configuration' or type 'create_wave_config' in the TCL console."
		}
	}
	run 1us
	break
}
