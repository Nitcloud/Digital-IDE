# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "CS_PIN" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IDLE_TIMEOUT" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_CS" -parent ${Page_0}


}

proc update_PARAM_VALUE.CS_PIN { PARAM_VALUE.CS_PIN } {
	# Procedure called to update CS_PIN when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CS_PIN { PARAM_VALUE.CS_PIN } {
	# Procedure called to validate CS_PIN
	return true
}

proc update_PARAM_VALUE.IDLE_TIMEOUT { PARAM_VALUE.IDLE_TIMEOUT } {
	# Procedure called to update IDLE_TIMEOUT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IDLE_TIMEOUT { PARAM_VALUE.IDLE_TIMEOUT } {
	# Procedure called to validate IDLE_TIMEOUT
	return true
}

proc update_PARAM_VALUE.NUM_OF_CS { PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to update NUM_OF_CS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_CS { PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to validate NUM_OF_CS
	return true
}


proc update_MODELPARAM_VALUE.NUM_OF_CS { MODELPARAM_VALUE.NUM_OF_CS PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_CS}] ${MODELPARAM_VALUE.NUM_OF_CS}
}

proc update_MODELPARAM_VALUE.CS_PIN { MODELPARAM_VALUE.CS_PIN PARAM_VALUE.CS_PIN } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CS_PIN}] ${MODELPARAM_VALUE.CS_PIN}
}

proc update_MODELPARAM_VALUE.IDLE_TIMEOUT { MODELPARAM_VALUE.IDLE_TIMEOUT PARAM_VALUE.IDLE_TIMEOUT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IDLE_TIMEOUT}] ${MODELPARAM_VALUE.IDLE_TIMEOUT}
}

