# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "BUF_ENABLE_0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_4" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_5" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_6" -parent ${Page_0}
  ipgui::add_param $IPINST -name "BUF_ENABLE_7" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_CLK_MONS" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_IO" -parent ${Page_0}


}

proc update_PARAM_VALUE.BUF_ENABLE_0 { PARAM_VALUE.BUF_ENABLE_0 } {
	# Procedure called to update BUF_ENABLE_0 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_0 { PARAM_VALUE.BUF_ENABLE_0 } {
	# Procedure called to validate BUF_ENABLE_0
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_1 { PARAM_VALUE.BUF_ENABLE_1 } {
	# Procedure called to update BUF_ENABLE_1 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_1 { PARAM_VALUE.BUF_ENABLE_1 } {
	# Procedure called to validate BUF_ENABLE_1
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_2 { PARAM_VALUE.BUF_ENABLE_2 } {
	# Procedure called to update BUF_ENABLE_2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_2 { PARAM_VALUE.BUF_ENABLE_2 } {
	# Procedure called to validate BUF_ENABLE_2
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_3 { PARAM_VALUE.BUF_ENABLE_3 } {
	# Procedure called to update BUF_ENABLE_3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_3 { PARAM_VALUE.BUF_ENABLE_3 } {
	# Procedure called to validate BUF_ENABLE_3
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_4 { PARAM_VALUE.BUF_ENABLE_4 } {
	# Procedure called to update BUF_ENABLE_4 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_4 { PARAM_VALUE.BUF_ENABLE_4 } {
	# Procedure called to validate BUF_ENABLE_4
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_5 { PARAM_VALUE.BUF_ENABLE_5 } {
	# Procedure called to update BUF_ENABLE_5 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_5 { PARAM_VALUE.BUF_ENABLE_5 } {
	# Procedure called to validate BUF_ENABLE_5
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_6 { PARAM_VALUE.BUF_ENABLE_6 } {
	# Procedure called to update BUF_ENABLE_6 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_6 { PARAM_VALUE.BUF_ENABLE_6 } {
	# Procedure called to validate BUF_ENABLE_6
	return true
}

proc update_PARAM_VALUE.BUF_ENABLE_7 { PARAM_VALUE.BUF_ENABLE_7 } {
	# Procedure called to update BUF_ENABLE_7 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BUF_ENABLE_7 { PARAM_VALUE.BUF_ENABLE_7 } {
	# Procedure called to validate BUF_ENABLE_7
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.NUM_OF_CLK_MONS { PARAM_VALUE.NUM_OF_CLK_MONS } {
	# Procedure called to update NUM_OF_CLK_MONS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_CLK_MONS { PARAM_VALUE.NUM_OF_CLK_MONS } {
	# Procedure called to validate NUM_OF_CLK_MONS
	return true
}

proc update_PARAM_VALUE.NUM_OF_IO { PARAM_VALUE.NUM_OF_IO } {
	# Procedure called to update NUM_OF_IO when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_IO { PARAM_VALUE.NUM_OF_IO } {
	# Procedure called to validate NUM_OF_IO
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.NUM_OF_IO { MODELPARAM_VALUE.NUM_OF_IO PARAM_VALUE.NUM_OF_IO } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_IO}] ${MODELPARAM_VALUE.NUM_OF_IO}
}

proc update_MODELPARAM_VALUE.NUM_OF_CLK_MONS { MODELPARAM_VALUE.NUM_OF_CLK_MONS PARAM_VALUE.NUM_OF_CLK_MONS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_CLK_MONS}] ${MODELPARAM_VALUE.NUM_OF_CLK_MONS}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_0 { MODELPARAM_VALUE.BUF_ENABLE_0 PARAM_VALUE.BUF_ENABLE_0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_0}] ${MODELPARAM_VALUE.BUF_ENABLE_0}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_1 { MODELPARAM_VALUE.BUF_ENABLE_1 PARAM_VALUE.BUF_ENABLE_1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_1}] ${MODELPARAM_VALUE.BUF_ENABLE_1}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_2 { MODELPARAM_VALUE.BUF_ENABLE_2 PARAM_VALUE.BUF_ENABLE_2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_2}] ${MODELPARAM_VALUE.BUF_ENABLE_2}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_3 { MODELPARAM_VALUE.BUF_ENABLE_3 PARAM_VALUE.BUF_ENABLE_3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_3}] ${MODELPARAM_VALUE.BUF_ENABLE_3}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_4 { MODELPARAM_VALUE.BUF_ENABLE_4 PARAM_VALUE.BUF_ENABLE_4 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_4}] ${MODELPARAM_VALUE.BUF_ENABLE_4}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_5 { MODELPARAM_VALUE.BUF_ENABLE_5 PARAM_VALUE.BUF_ENABLE_5 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_5}] ${MODELPARAM_VALUE.BUF_ENABLE_5}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_6 { MODELPARAM_VALUE.BUF_ENABLE_6 PARAM_VALUE.BUF_ENABLE_6 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_6}] ${MODELPARAM_VALUE.BUF_ENABLE_6}
}

proc update_MODELPARAM_VALUE.BUF_ENABLE_7 { MODELPARAM_VALUE.BUF_ENABLE_7 PARAM_VALUE.BUF_ENABLE_7 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BUF_ENABLE_7}] ${MODELPARAM_VALUE.BUF_ENABLE_7}
}

