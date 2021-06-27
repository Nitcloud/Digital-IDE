# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ASYNC_CLK" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_BITS" -parent ${Page_0}


}

proc update_PARAM_VALUE.ASYNC_CLK { PARAM_VALUE.ASYNC_CLK } {
	# Procedure called to update ASYNC_CLK when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_CLK { PARAM_VALUE.ASYNC_CLK } {
	# Procedure called to validate ASYNC_CLK
	return true
}

proc update_PARAM_VALUE.NUM_OF_BITS { PARAM_VALUE.NUM_OF_BITS } {
	# Procedure called to update NUM_OF_BITS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_BITS { PARAM_VALUE.NUM_OF_BITS } {
	# Procedure called to validate NUM_OF_BITS
	return true
}


proc update_MODELPARAM_VALUE.NUM_OF_BITS { MODELPARAM_VALUE.NUM_OF_BITS PARAM_VALUE.NUM_OF_BITS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_BITS}] ${MODELPARAM_VALUE.NUM_OF_BITS}
}

proc update_MODELPARAM_VALUE.ASYNC_CLK { MODELPARAM_VALUE.ASYNC_CLK PARAM_VALUE.ASYNC_CLK } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_CLK}] ${MODELPARAM_VALUE.ASYNC_CLK}
}

