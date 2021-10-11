# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "PULSE_PERIOD" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PULSE_WIDTH" -parent ${Page_0}


}

proc update_PARAM_VALUE.PULSE_PERIOD { PARAM_VALUE.PULSE_PERIOD } {
	# Procedure called to update PULSE_PERIOD when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PULSE_PERIOD { PARAM_VALUE.PULSE_PERIOD } {
	# Procedure called to validate PULSE_PERIOD
	return true
}

proc update_PARAM_VALUE.PULSE_WIDTH { PARAM_VALUE.PULSE_WIDTH } {
	# Procedure called to update PULSE_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PULSE_WIDTH { PARAM_VALUE.PULSE_WIDTH } {
	# Procedure called to validate PULSE_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.PULSE_WIDTH { MODELPARAM_VALUE.PULSE_WIDTH PARAM_VALUE.PULSE_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PULSE_WIDTH}] ${MODELPARAM_VALUE.PULSE_WIDTH}
}

proc update_MODELPARAM_VALUE.PULSE_PERIOD { MODELPARAM_VALUE.PULSE_PERIOD PARAM_VALUE.PULSE_PERIOD } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PULSE_PERIOD}] ${MODELPARAM_VALUE.PULSE_PERIOD}
}

