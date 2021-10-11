# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "AVG_POW" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "INTERNAL_SYSMONE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PWM_FREQUENCY_HZ" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TACHO_T100" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TACHO_T25" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TACHO_T50" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TACHO_T75" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TACHO_TOL_PERCENT" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_00_H" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_00_L" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_25_H" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_25_L" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_50_H" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_50_L" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_75_H" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TEMP_75_L" -parent ${Page_0}


}

proc update_PARAM_VALUE.AVG_POW { PARAM_VALUE.AVG_POW } {
	# Procedure called to update AVG_POW when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AVG_POW { PARAM_VALUE.AVG_POW } {
	# Procedure called to validate AVG_POW
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.INTERNAL_SYSMONE { PARAM_VALUE.INTERNAL_SYSMONE } {
	# Procedure called to update INTERNAL_SYSMONE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.INTERNAL_SYSMONE { PARAM_VALUE.INTERNAL_SYSMONE } {
	# Procedure called to validate INTERNAL_SYSMONE
	return true
}

proc update_PARAM_VALUE.PWM_FREQUENCY_HZ { PARAM_VALUE.PWM_FREQUENCY_HZ } {
	# Procedure called to update PWM_FREQUENCY_HZ when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PWM_FREQUENCY_HZ { PARAM_VALUE.PWM_FREQUENCY_HZ } {
	# Procedure called to validate PWM_FREQUENCY_HZ
	return true
}

proc update_PARAM_VALUE.TACHO_T100 { PARAM_VALUE.TACHO_T100 } {
	# Procedure called to update TACHO_T100 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TACHO_T100 { PARAM_VALUE.TACHO_T100 } {
	# Procedure called to validate TACHO_T100
	return true
}

proc update_PARAM_VALUE.TACHO_T25 { PARAM_VALUE.TACHO_T25 } {
	# Procedure called to update TACHO_T25 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TACHO_T25 { PARAM_VALUE.TACHO_T25 } {
	# Procedure called to validate TACHO_T25
	return true
}

proc update_PARAM_VALUE.TACHO_T50 { PARAM_VALUE.TACHO_T50 } {
	# Procedure called to update TACHO_T50 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TACHO_T50 { PARAM_VALUE.TACHO_T50 } {
	# Procedure called to validate TACHO_T50
	return true
}

proc update_PARAM_VALUE.TACHO_T75 { PARAM_VALUE.TACHO_T75 } {
	# Procedure called to update TACHO_T75 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TACHO_T75 { PARAM_VALUE.TACHO_T75 } {
	# Procedure called to validate TACHO_T75
	return true
}

proc update_PARAM_VALUE.TACHO_TOL_PERCENT { PARAM_VALUE.TACHO_TOL_PERCENT } {
	# Procedure called to update TACHO_TOL_PERCENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TACHO_TOL_PERCENT { PARAM_VALUE.TACHO_TOL_PERCENT } {
	# Procedure called to validate TACHO_TOL_PERCENT
	return true
}

proc update_PARAM_VALUE.TEMP_00_H { PARAM_VALUE.TEMP_00_H } {
	# Procedure called to update TEMP_00_H when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_00_H { PARAM_VALUE.TEMP_00_H } {
	# Procedure called to validate TEMP_00_H
	return true
}

proc update_PARAM_VALUE.TEMP_00_L { PARAM_VALUE.TEMP_00_L } {
	# Procedure called to update TEMP_00_L when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_00_L { PARAM_VALUE.TEMP_00_L } {
	# Procedure called to validate TEMP_00_L
	return true
}

proc update_PARAM_VALUE.TEMP_25_H { PARAM_VALUE.TEMP_25_H } {
	# Procedure called to update TEMP_25_H when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_25_H { PARAM_VALUE.TEMP_25_H } {
	# Procedure called to validate TEMP_25_H
	return true
}

proc update_PARAM_VALUE.TEMP_25_L { PARAM_VALUE.TEMP_25_L } {
	# Procedure called to update TEMP_25_L when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_25_L { PARAM_VALUE.TEMP_25_L } {
	# Procedure called to validate TEMP_25_L
	return true
}

proc update_PARAM_VALUE.TEMP_50_H { PARAM_VALUE.TEMP_50_H } {
	# Procedure called to update TEMP_50_H when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_50_H { PARAM_VALUE.TEMP_50_H } {
	# Procedure called to validate TEMP_50_H
	return true
}

proc update_PARAM_VALUE.TEMP_50_L { PARAM_VALUE.TEMP_50_L } {
	# Procedure called to update TEMP_50_L when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_50_L { PARAM_VALUE.TEMP_50_L } {
	# Procedure called to validate TEMP_50_L
	return true
}

proc update_PARAM_VALUE.TEMP_75_H { PARAM_VALUE.TEMP_75_H } {
	# Procedure called to update TEMP_75_H when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_75_H { PARAM_VALUE.TEMP_75_H } {
	# Procedure called to validate TEMP_75_H
	return true
}

proc update_PARAM_VALUE.TEMP_75_L { PARAM_VALUE.TEMP_75_L } {
	# Procedure called to update TEMP_75_L when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TEMP_75_L { PARAM_VALUE.TEMP_75_L } {
	# Procedure called to validate TEMP_75_L
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.PWM_FREQUENCY_HZ { MODELPARAM_VALUE.PWM_FREQUENCY_HZ PARAM_VALUE.PWM_FREQUENCY_HZ } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PWM_FREQUENCY_HZ}] ${MODELPARAM_VALUE.PWM_FREQUENCY_HZ}
}

proc update_MODELPARAM_VALUE.INTERNAL_SYSMONE { MODELPARAM_VALUE.INTERNAL_SYSMONE PARAM_VALUE.INTERNAL_SYSMONE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.INTERNAL_SYSMONE}] ${MODELPARAM_VALUE.INTERNAL_SYSMONE}
}

proc update_MODELPARAM_VALUE.AVG_POW { MODELPARAM_VALUE.AVG_POW PARAM_VALUE.AVG_POW } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AVG_POW}] ${MODELPARAM_VALUE.AVG_POW}
}

proc update_MODELPARAM_VALUE.TACHO_TOL_PERCENT { MODELPARAM_VALUE.TACHO_TOL_PERCENT PARAM_VALUE.TACHO_TOL_PERCENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TACHO_TOL_PERCENT}] ${MODELPARAM_VALUE.TACHO_TOL_PERCENT}
}

proc update_MODELPARAM_VALUE.TACHO_T25 { MODELPARAM_VALUE.TACHO_T25 PARAM_VALUE.TACHO_T25 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TACHO_T25}] ${MODELPARAM_VALUE.TACHO_T25}
}

proc update_MODELPARAM_VALUE.TACHO_T50 { MODELPARAM_VALUE.TACHO_T50 PARAM_VALUE.TACHO_T50 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TACHO_T50}] ${MODELPARAM_VALUE.TACHO_T50}
}

proc update_MODELPARAM_VALUE.TACHO_T75 { MODELPARAM_VALUE.TACHO_T75 PARAM_VALUE.TACHO_T75 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TACHO_T75}] ${MODELPARAM_VALUE.TACHO_T75}
}

proc update_MODELPARAM_VALUE.TACHO_T100 { MODELPARAM_VALUE.TACHO_T100 PARAM_VALUE.TACHO_T100 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TACHO_T100}] ${MODELPARAM_VALUE.TACHO_T100}
}

proc update_MODELPARAM_VALUE.TEMP_00_H { MODELPARAM_VALUE.TEMP_00_H PARAM_VALUE.TEMP_00_H } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_00_H}] ${MODELPARAM_VALUE.TEMP_00_H}
}

proc update_MODELPARAM_VALUE.TEMP_25_L { MODELPARAM_VALUE.TEMP_25_L PARAM_VALUE.TEMP_25_L } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_25_L}] ${MODELPARAM_VALUE.TEMP_25_L}
}

proc update_MODELPARAM_VALUE.TEMP_25_H { MODELPARAM_VALUE.TEMP_25_H PARAM_VALUE.TEMP_25_H } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_25_H}] ${MODELPARAM_VALUE.TEMP_25_H}
}

proc update_MODELPARAM_VALUE.TEMP_50_L { MODELPARAM_VALUE.TEMP_50_L PARAM_VALUE.TEMP_50_L } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_50_L}] ${MODELPARAM_VALUE.TEMP_50_L}
}

proc update_MODELPARAM_VALUE.TEMP_50_H { MODELPARAM_VALUE.TEMP_50_H PARAM_VALUE.TEMP_50_H } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_50_H}] ${MODELPARAM_VALUE.TEMP_50_H}
}

proc update_MODELPARAM_VALUE.TEMP_75_L { MODELPARAM_VALUE.TEMP_75_L PARAM_VALUE.TEMP_75_L } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_75_L}] ${MODELPARAM_VALUE.TEMP_75_L}
}

proc update_MODELPARAM_VALUE.TEMP_75_H { MODELPARAM_VALUE.TEMP_75_H PARAM_VALUE.TEMP_75_H } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_75_H}] ${MODELPARAM_VALUE.TEMP_75_H}
}

proc update_MODELPARAM_VALUE.TEMP_00_L { MODELPARAM_VALUE.TEMP_00_L PARAM_VALUE.TEMP_00_L } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TEMP_00_L}] ${MODELPARAM_VALUE.TEMP_00_L}
}

