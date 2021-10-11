# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "AXI_ADDRESS" -parent ${Page_0}
  ipgui::add_param $IPINST -name "AXI_ADDRESS_LIMIT" -parent ${Page_0}
  ipgui::add_param $IPINST -name "AXI_DATA_WIDTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "AXI_LENGTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "AXI_SIZE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DATA_WIDTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DMA_DATA_WIDTH" -parent ${Page_0}


}

proc update_PARAM_VALUE.AXI_ADDRESS { PARAM_VALUE.AXI_ADDRESS } {
	# Procedure called to update AXI_ADDRESS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AXI_ADDRESS { PARAM_VALUE.AXI_ADDRESS } {
	# Procedure called to validate AXI_ADDRESS
	return true
}

proc update_PARAM_VALUE.AXI_ADDRESS_LIMIT { PARAM_VALUE.AXI_ADDRESS_LIMIT } {
	# Procedure called to update AXI_ADDRESS_LIMIT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AXI_ADDRESS_LIMIT { PARAM_VALUE.AXI_ADDRESS_LIMIT } {
	# Procedure called to validate AXI_ADDRESS_LIMIT
	return true
}

proc update_PARAM_VALUE.AXI_DATA_WIDTH { PARAM_VALUE.AXI_DATA_WIDTH } {
	# Procedure called to update AXI_DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AXI_DATA_WIDTH { PARAM_VALUE.AXI_DATA_WIDTH } {
	# Procedure called to validate AXI_DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.AXI_LENGTH { PARAM_VALUE.AXI_LENGTH } {
	# Procedure called to update AXI_LENGTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AXI_LENGTH { PARAM_VALUE.AXI_LENGTH } {
	# Procedure called to validate AXI_LENGTH
	return true
}

proc update_PARAM_VALUE.AXI_SIZE { PARAM_VALUE.AXI_SIZE } {
	# Procedure called to update AXI_SIZE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AXI_SIZE { PARAM_VALUE.AXI_SIZE } {
	# Procedure called to validate AXI_SIZE
	return true
}

proc update_PARAM_VALUE.DAC_DATA_WIDTH { PARAM_VALUE.DAC_DATA_WIDTH } {
	# Procedure called to update DAC_DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DATA_WIDTH { PARAM_VALUE.DAC_DATA_WIDTH } {
	# Procedure called to validate DAC_DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.DMA_DATA_WIDTH { PARAM_VALUE.DMA_DATA_WIDTH } {
	# Procedure called to update DMA_DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DMA_DATA_WIDTH { PARAM_VALUE.DMA_DATA_WIDTH } {
	# Procedure called to validate DMA_DATA_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.DAC_DATA_WIDTH { MODELPARAM_VALUE.DAC_DATA_WIDTH PARAM_VALUE.DAC_DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DATA_WIDTH}] ${MODELPARAM_VALUE.DAC_DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.DMA_DATA_WIDTH { MODELPARAM_VALUE.DMA_DATA_WIDTH PARAM_VALUE.DMA_DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DMA_DATA_WIDTH}] ${MODELPARAM_VALUE.DMA_DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.AXI_DATA_WIDTH { MODELPARAM_VALUE.AXI_DATA_WIDTH PARAM_VALUE.AXI_DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AXI_DATA_WIDTH}] ${MODELPARAM_VALUE.AXI_DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.AXI_SIZE { MODELPARAM_VALUE.AXI_SIZE PARAM_VALUE.AXI_SIZE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AXI_SIZE}] ${MODELPARAM_VALUE.AXI_SIZE}
}

proc update_MODELPARAM_VALUE.AXI_LENGTH { MODELPARAM_VALUE.AXI_LENGTH PARAM_VALUE.AXI_LENGTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AXI_LENGTH}] ${MODELPARAM_VALUE.AXI_LENGTH}
}

proc update_MODELPARAM_VALUE.AXI_ADDRESS { MODELPARAM_VALUE.AXI_ADDRESS PARAM_VALUE.AXI_ADDRESS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AXI_ADDRESS}] ${MODELPARAM_VALUE.AXI_ADDRESS}
}

proc update_MODELPARAM_VALUE.AXI_ADDRESS_LIMIT { MODELPARAM_VALUE.AXI_ADDRESS_LIMIT PARAM_VALUE.AXI_ADDRESS_LIMIT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AXI_ADDRESS_LIMIT}] ${MODELPARAM_VALUE.AXI_ADDRESS_LIMIT}
}

