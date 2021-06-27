# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "SEL_0_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SEL_1_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SIM_DEVICE" -parent ${Page_0}


}

proc update_PARAM_VALUE.SEL_0_DIV { PARAM_VALUE.SEL_0_DIV } {
	# Procedure called to update SEL_0_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SEL_0_DIV { PARAM_VALUE.SEL_0_DIV } {
	# Procedure called to validate SEL_0_DIV
	return true
}

proc update_PARAM_VALUE.SEL_1_DIV { PARAM_VALUE.SEL_1_DIV } {
	# Procedure called to update SEL_1_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SEL_1_DIV { PARAM_VALUE.SEL_1_DIV } {
	# Procedure called to validate SEL_1_DIV
	return true
}

proc update_PARAM_VALUE.SIM_DEVICE { PARAM_VALUE.SIM_DEVICE } {
	# Procedure called to update SIM_DEVICE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SIM_DEVICE { PARAM_VALUE.SIM_DEVICE } {
	# Procedure called to validate SIM_DEVICE
	return true
}


proc update_MODELPARAM_VALUE.SIM_DEVICE { MODELPARAM_VALUE.SIM_DEVICE PARAM_VALUE.SIM_DEVICE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SIM_DEVICE}] ${MODELPARAM_VALUE.SIM_DEVICE}
}

proc update_MODELPARAM_VALUE.SEL_0_DIV { MODELPARAM_VALUE.SEL_0_DIV PARAM_VALUE.SEL_0_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SEL_0_DIV}] ${MODELPARAM_VALUE.SEL_0_DIV}
}

proc update_MODELPARAM_VALUE.SEL_1_DIV { MODELPARAM_VALUE.SEL_1_DIV PARAM_VALUE.SEL_1_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SEL_1_DIV}] ${MODELPARAM_VALUE.SEL_1_DIV}
}

