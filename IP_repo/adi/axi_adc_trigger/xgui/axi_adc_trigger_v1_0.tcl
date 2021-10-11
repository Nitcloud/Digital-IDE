# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "OUT_PIN_HOLD_N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SIGN_BITS" -parent ${Page_0}


}

proc update_PARAM_VALUE.OUT_PIN_HOLD_N { PARAM_VALUE.OUT_PIN_HOLD_N } {
	# Procedure called to update OUT_PIN_HOLD_N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.OUT_PIN_HOLD_N { PARAM_VALUE.OUT_PIN_HOLD_N } {
	# Procedure called to validate OUT_PIN_HOLD_N
	return true
}

proc update_PARAM_VALUE.SIGN_BITS { PARAM_VALUE.SIGN_BITS } {
	# Procedure called to update SIGN_BITS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SIGN_BITS { PARAM_VALUE.SIGN_BITS } {
	# Procedure called to validate SIGN_BITS
	return true
}


proc update_MODELPARAM_VALUE.SIGN_BITS { MODELPARAM_VALUE.SIGN_BITS PARAM_VALUE.SIGN_BITS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SIGN_BITS}] ${MODELPARAM_VALUE.SIGN_BITS}
}

proc update_MODELPARAM_VALUE.OUT_PIN_HOLD_N { MODELPARAM_VALUE.OUT_PIN_HOLD_N PARAM_VALUE.OUT_PIN_HOLD_N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OUT_PIN_HOLD_N}] ${MODELPARAM_VALUE.OUT_PIN_HOLD_N}
}

