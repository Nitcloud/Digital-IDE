# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "DATA_WIDTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_STAGES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SEQ" -parent ${Page_0}
  ipgui::add_param $IPINST -name "STAGE_WIDTH" -parent ${Page_0}


}

proc update_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to update DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to validate DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.NUM_STAGES { PARAM_VALUE.NUM_STAGES } {
	# Procedure called to update NUM_STAGES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_STAGES { PARAM_VALUE.NUM_STAGES } {
	# Procedure called to validate NUM_STAGES
	return true
}

proc update_PARAM_VALUE.SEQ { PARAM_VALUE.SEQ } {
	# Procedure called to update SEQ when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SEQ { PARAM_VALUE.SEQ } {
	# Procedure called to validate SEQ
	return true
}

proc update_PARAM_VALUE.STAGE_WIDTH { PARAM_VALUE.STAGE_WIDTH } {
	# Procedure called to update STAGE_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.STAGE_WIDTH { PARAM_VALUE.STAGE_WIDTH } {
	# Procedure called to validate STAGE_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.DATA_WIDTH { MODELPARAM_VALUE.DATA_WIDTH PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATA_WIDTH}] ${MODELPARAM_VALUE.DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.SEQ { MODELPARAM_VALUE.SEQ PARAM_VALUE.SEQ } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SEQ}] ${MODELPARAM_VALUE.SEQ}
}

proc update_MODELPARAM_VALUE.STAGE_WIDTH { MODELPARAM_VALUE.STAGE_WIDTH PARAM_VALUE.STAGE_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.STAGE_WIDTH}] ${MODELPARAM_VALUE.STAGE_WIDTH}
}

proc update_MODELPARAM_VALUE.NUM_STAGES { MODELPARAM_VALUE.NUM_STAGES PARAM_VALUE.NUM_STAGES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_STAGES}] ${MODELPARAM_VALUE.NUM_STAGES}
}

