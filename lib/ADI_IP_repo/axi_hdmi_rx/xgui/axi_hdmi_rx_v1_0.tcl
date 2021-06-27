# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IO_INTERFACE" -parent ${Page_0}


}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.IO_INTERFACE { PARAM_VALUE.IO_INTERFACE } {
	# Procedure called to update IO_INTERFACE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IO_INTERFACE { PARAM_VALUE.IO_INTERFACE } {
	# Procedure called to validate IO_INTERFACE
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.IO_INTERFACE { MODELPARAM_VALUE.IO_INTERFACE PARAM_VALUE.IO_INTERFACE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IO_INTERFACE}] ${MODELPARAM_VALUE.IO_INTERFACE}
}

