# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IF_TYPE" -parent ${Page_0}


}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.IF_TYPE { PARAM_VALUE.IF_TYPE } {
	# Procedure called to update IF_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IF_TYPE { PARAM_VALUE.IF_TYPE } {
	# Procedure called to validate IF_TYPE
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.IF_TYPE { MODELPARAM_VALUE.IF_TYPE PARAM_VALUE.IF_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IF_TYPE}] ${MODELPARAM_VALUE.IF_TYPE}
}

