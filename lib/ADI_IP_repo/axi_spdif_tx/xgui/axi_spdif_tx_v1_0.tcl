# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "DEVICE_FAMILY" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DMA_TYPE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "S_AXI_ADDRESS_WIDTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "S_AXI_DATA_WIDTH" -parent ${Page_0}


}

proc update_PARAM_VALUE.DEVICE_FAMILY { PARAM_VALUE.DEVICE_FAMILY } {
	# Procedure called to update DEVICE_FAMILY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEVICE_FAMILY { PARAM_VALUE.DEVICE_FAMILY } {
	# Procedure called to validate DEVICE_FAMILY
	return true
}

proc update_PARAM_VALUE.DMA_TYPE { PARAM_VALUE.DMA_TYPE } {
	# Procedure called to update DMA_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DMA_TYPE { PARAM_VALUE.DMA_TYPE } {
	# Procedure called to validate DMA_TYPE
	return true
}

proc update_PARAM_VALUE.S_AXI_ADDRESS_WIDTH { PARAM_VALUE.S_AXI_ADDRESS_WIDTH } {
	# Procedure called to update S_AXI_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.S_AXI_ADDRESS_WIDTH { PARAM_VALUE.S_AXI_ADDRESS_WIDTH } {
	# Procedure called to validate S_AXI_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.S_AXI_DATA_WIDTH { PARAM_VALUE.S_AXI_DATA_WIDTH } {
	# Procedure called to update S_AXI_DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.S_AXI_DATA_WIDTH { PARAM_VALUE.S_AXI_DATA_WIDTH } {
	# Procedure called to validate S_AXI_DATA_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.S_AXI_DATA_WIDTH { MODELPARAM_VALUE.S_AXI_DATA_WIDTH PARAM_VALUE.S_AXI_DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.S_AXI_DATA_WIDTH}] ${MODELPARAM_VALUE.S_AXI_DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.S_AXI_ADDRESS_WIDTH { MODELPARAM_VALUE.S_AXI_ADDRESS_WIDTH PARAM_VALUE.S_AXI_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.S_AXI_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.S_AXI_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.DEVICE_FAMILY { MODELPARAM_VALUE.DEVICE_FAMILY PARAM_VALUE.DEVICE_FAMILY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DEVICE_FAMILY}] ${MODELPARAM_VALUE.DEVICE_FAMILY}
}

proc update_MODELPARAM_VALUE.DMA_TYPE { MODELPARAM_VALUE.DMA_TYPE PARAM_VALUE.DMA_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DMA_TYPE}] ${MODELPARAM_VALUE.DMA_TYPE}
}

