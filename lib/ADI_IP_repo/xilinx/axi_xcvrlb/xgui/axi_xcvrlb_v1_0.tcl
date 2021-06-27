# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "CPLL_FBDIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_FBDIV_4_5" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "XCVR_TYPE" -parent ${Page_0}


}

proc update_PARAM_VALUE.CPLL_FBDIV { PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to update CPLL_FBDIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_FBDIV { PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to validate CPLL_FBDIV
	return true
}

proc update_PARAM_VALUE.CPLL_FBDIV_4_5 { PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to update CPLL_FBDIV_4_5 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_FBDIV_4_5 { PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to validate CPLL_FBDIV_4_5
	return true
}

proc update_PARAM_VALUE.NUM_OF_LANES { PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to update NUM_OF_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_LANES { PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to validate NUM_OF_LANES
	return true
}

proc update_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update XCVR_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to validate XCVR_TYPE
	return true
}


proc update_MODELPARAM_VALUE.CPLL_FBDIV { MODELPARAM_VALUE.CPLL_FBDIV PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_FBDIV}] ${MODELPARAM_VALUE.CPLL_FBDIV}
}

proc update_MODELPARAM_VALUE.CPLL_FBDIV_4_5 { MODELPARAM_VALUE.CPLL_FBDIV_4_5 PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_FBDIV_4_5}] ${MODELPARAM_VALUE.CPLL_FBDIV_4_5}
}

proc update_MODELPARAM_VALUE.NUM_OF_LANES { MODELPARAM_VALUE.NUM_OF_LANES PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_LANES}] ${MODELPARAM_VALUE.NUM_OF_LANES}
}

proc update_MODELPARAM_VALUE.XCVR_TYPE { MODELPARAM_VALUE.XCVR_TYPE PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.XCVR_TYPE}] ${MODELPARAM_VALUE.XCVR_TYPE}
}

