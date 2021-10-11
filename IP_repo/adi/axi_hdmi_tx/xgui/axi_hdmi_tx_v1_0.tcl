# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "CR_CB_N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "INTERFACE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "OUT_CLK_POLARITY" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.CR_CB_N { PARAM_VALUE.CR_CB_N } {
	# Procedure called to update CR_CB_N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CR_CB_N { PARAM_VALUE.CR_CB_N } {
	# Procedure called to validate CR_CB_N
	return true
}

proc update_PARAM_VALUE.FPGA_TECHNOLOGY { PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to update FPGA_TECHNOLOGY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.FPGA_TECHNOLOGY { PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to validate FPGA_TECHNOLOGY
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.INTERFACE { PARAM_VALUE.INTERFACE } {
	# Procedure called to update INTERFACE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.INTERFACE { PARAM_VALUE.INTERFACE } {
	# Procedure called to validate INTERFACE
	return true
}

proc update_PARAM_VALUE.OUT_CLK_POLARITY { PARAM_VALUE.OUT_CLK_POLARITY } {
	# Procedure called to update OUT_CLK_POLARITY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.OUT_CLK_POLARITY { PARAM_VALUE.OUT_CLK_POLARITY } {
	# Procedure called to validate OUT_CLK_POLARITY
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.CR_CB_N { MODELPARAM_VALUE.CR_CB_N PARAM_VALUE.CR_CB_N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CR_CB_N}] ${MODELPARAM_VALUE.CR_CB_N}
}

proc update_MODELPARAM_VALUE.FPGA_TECHNOLOGY { MODELPARAM_VALUE.FPGA_TECHNOLOGY PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.FPGA_TECHNOLOGY}] ${MODELPARAM_VALUE.FPGA_TECHNOLOGY}
}

proc update_MODELPARAM_VALUE.INTERFACE { MODELPARAM_VALUE.INTERFACE PARAM_VALUE.INTERFACE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.INTERFACE}] ${MODELPARAM_VALUE.INTERFACE}
}

proc update_MODELPARAM_VALUE.OUT_CLK_POLARITY { MODELPARAM_VALUE.OUT_CLK_POLARITY PARAM_VALUE.OUT_CLK_POLARITY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OUT_CLK_POLARITY}] ${MODELPARAM_VALUE.OUT_CLK_POLARITY}
}

