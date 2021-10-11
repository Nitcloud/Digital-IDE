# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set AXI_Pulse_Generator [ipgui::add_page $IPINST -name "AXI Pulse Generator"]
  set ASYNC_CLK_EN [ipgui::add_param $IPINST -name "ASYNC_CLK_EN" -parent ${AXI_Pulse_Generator}]
  set_property tooltip {External clock for the counter} ${ASYNC_CLK_EN}
  set PULSE_WIDTH [ipgui::add_param $IPINST -name "PULSE_WIDTH" -parent ${AXI_Pulse_Generator}]
  set_property tooltip {Pulse width of the generated signal. The unit interval is the system or external clock period.} ${PULSE_WIDTH}
  set PULSE_PERIOD [ipgui::add_param $IPINST -name "PULSE_PERIOD" -parent ${AXI_Pulse_Generator}]
  set_property tooltip {Period of the generated signal. The unit interval is the system or external clock period.} ${PULSE_PERIOD}


}

proc update_PARAM_VALUE.ASYNC_CLK_EN { PARAM_VALUE.ASYNC_CLK_EN } {
	# Procedure called to update ASYNC_CLK_EN when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_CLK_EN { PARAM_VALUE.ASYNC_CLK_EN } {
	# Procedure called to validate ASYNC_CLK_EN
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
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


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.ASYNC_CLK_EN { MODELPARAM_VALUE.ASYNC_CLK_EN PARAM_VALUE.ASYNC_CLK_EN } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_CLK_EN}] ${MODELPARAM_VALUE.ASYNC_CLK_EN}
}

proc update_MODELPARAM_VALUE.PULSE_WIDTH { MODELPARAM_VALUE.PULSE_WIDTH PARAM_VALUE.PULSE_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PULSE_WIDTH}] ${MODELPARAM_VALUE.PULSE_WIDTH}
}

proc update_MODELPARAM_VALUE.PULSE_PERIOD { MODELPARAM_VALUE.PULSE_PERIOD PARAM_VALUE.PULSE_PERIOD } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PULSE_PERIOD}] ${MODELPARAM_VALUE.PULSE_PERIOD}
}

