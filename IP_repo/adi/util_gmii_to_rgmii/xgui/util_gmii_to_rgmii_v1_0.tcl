# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "IDELAY_VALUE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IODELAY_CTRL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IODELAY_GROUP" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PHY_AD" -parent ${Page_0}
  ipgui::add_param $IPINST -name "REFCLK_FREQUENCY" -parent ${Page_0}


}

proc update_PARAM_VALUE.IDELAY_VALUE { PARAM_VALUE.IDELAY_VALUE } {
	# Procedure called to update IDELAY_VALUE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IDELAY_VALUE { PARAM_VALUE.IDELAY_VALUE } {
	# Procedure called to validate IDELAY_VALUE
	return true
}

proc update_PARAM_VALUE.IODELAY_CTRL { PARAM_VALUE.IODELAY_CTRL } {
	# Procedure called to update IODELAY_CTRL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IODELAY_CTRL { PARAM_VALUE.IODELAY_CTRL } {
	# Procedure called to validate IODELAY_CTRL
	return true
}

proc update_PARAM_VALUE.IODELAY_GROUP { PARAM_VALUE.IODELAY_GROUP } {
	# Procedure called to update IODELAY_GROUP when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IODELAY_GROUP { PARAM_VALUE.IODELAY_GROUP } {
	# Procedure called to validate IODELAY_GROUP
	return true
}

proc update_PARAM_VALUE.PHY_AD { PARAM_VALUE.PHY_AD } {
	# Procedure called to update PHY_AD when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PHY_AD { PARAM_VALUE.PHY_AD } {
	# Procedure called to validate PHY_AD
	return true
}

proc update_PARAM_VALUE.REFCLK_FREQUENCY { PARAM_VALUE.REFCLK_FREQUENCY } {
	# Procedure called to update REFCLK_FREQUENCY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.REFCLK_FREQUENCY { PARAM_VALUE.REFCLK_FREQUENCY } {
	# Procedure called to validate REFCLK_FREQUENCY
	return true
}


proc update_MODELPARAM_VALUE.PHY_AD { MODELPARAM_VALUE.PHY_AD PARAM_VALUE.PHY_AD } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PHY_AD}] ${MODELPARAM_VALUE.PHY_AD}
}

proc update_MODELPARAM_VALUE.IODELAY_CTRL { MODELPARAM_VALUE.IODELAY_CTRL PARAM_VALUE.IODELAY_CTRL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IODELAY_CTRL}] ${MODELPARAM_VALUE.IODELAY_CTRL}
}

proc update_MODELPARAM_VALUE.IDELAY_VALUE { MODELPARAM_VALUE.IDELAY_VALUE PARAM_VALUE.IDELAY_VALUE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IDELAY_VALUE}] ${MODELPARAM_VALUE.IDELAY_VALUE}
}

proc update_MODELPARAM_VALUE.IODELAY_GROUP { MODELPARAM_VALUE.IODELAY_GROUP PARAM_VALUE.IODELAY_GROUP } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IODELAY_GROUP}] ${MODELPARAM_VALUE.IODELAY_GROUP}
}

proc update_MODELPARAM_VALUE.REFCLK_FREQUENCY { MODELPARAM_VALUE.REFCLK_FREQUENCY PARAM_VALUE.REFCLK_FREQUENCY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.REFCLK_FREQUENCY}] ${MODELPARAM_VALUE.REFCLK_FREQUENCY}
}

