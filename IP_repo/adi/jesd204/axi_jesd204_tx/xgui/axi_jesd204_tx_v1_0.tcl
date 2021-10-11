# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "LINK_MODE" -parent ${Page_0} -widget comboBox
  ipgui::add_param $IPINST -name "ENABLE_LINK_STATS" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_LINKS" -parent ${Page_0}


}

proc update_PARAM_VALUE.ENABLE_LINK_STATS { PARAM_VALUE.ENABLE_LINK_STATS } {
	# Procedure called to update ENABLE_LINK_STATS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ENABLE_LINK_STATS { PARAM_VALUE.ENABLE_LINK_STATS } {
	# Procedure called to validate ENABLE_LINK_STATS
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.LINK_MODE { PARAM_VALUE.LINK_MODE } {
	# Procedure called to update LINK_MODE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.LINK_MODE { PARAM_VALUE.LINK_MODE } {
	# Procedure called to validate LINK_MODE
	return true
}

proc update_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to update NUM_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to validate NUM_LANES
	return true
}

proc update_PARAM_VALUE.NUM_LINKS { PARAM_VALUE.NUM_LINKS } {
	# Procedure called to update NUM_LINKS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_LINKS { PARAM_VALUE.NUM_LINKS } {
	# Procedure called to validate NUM_LINKS
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.NUM_LANES { MODELPARAM_VALUE.NUM_LANES PARAM_VALUE.NUM_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_LANES}] ${MODELPARAM_VALUE.NUM_LANES}
}

proc update_MODELPARAM_VALUE.NUM_LINKS { MODELPARAM_VALUE.NUM_LINKS PARAM_VALUE.NUM_LINKS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_LINKS}] ${MODELPARAM_VALUE.NUM_LINKS}
}

proc update_MODELPARAM_VALUE.LINK_MODE { MODELPARAM_VALUE.LINK_MODE PARAM_VALUE.LINK_MODE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.LINK_MODE}] ${MODELPARAM_VALUE.LINK_MODE}
}

proc update_MODELPARAM_VALUE.ENABLE_LINK_STATS { MODELPARAM_VALUE.ENABLE_LINK_STATS PARAM_VALUE.ENABLE_LINK_STATS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ENABLE_LINK_STATS}] ${MODELPARAM_VALUE.ENABLE_LINK_STATS}
}

