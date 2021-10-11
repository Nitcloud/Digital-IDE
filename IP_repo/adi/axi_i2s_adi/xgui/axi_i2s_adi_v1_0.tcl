# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  #Adding Group
  set I2S_Configuration [ipgui::add_group $IPINST -name "I2S Configuration" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "SLOT_WIDTH" -parent ${I2S_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "LRCLK_POL" -parent ${I2S_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "BCLK_POL" -parent ${I2S_Configuration} -widget comboBox

  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "HAS_RX" -parent ${General_Configuration} -widget checkBox
  ipgui::add_param $IPINST -name "HAS_TX" -parent ${General_Configuration} -widget checkBox
  ipgui::add_param $IPINST -name "DMA_TYPE" -parent ${General_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "NUM_OF_CHANNEL" -parent ${General_Configuration}
  ipgui::add_param $IPINST -name "S_AXI_ADDRESS_WIDTH" -parent ${General_Configuration}



}

proc update_PARAM_VALUE.BCLK_POL { PARAM_VALUE.BCLK_POL } {
	# Procedure called to update BCLK_POL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BCLK_POL { PARAM_VALUE.BCLK_POL } {
	# Procedure called to validate BCLK_POL
	return true
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

proc update_PARAM_VALUE.HAS_RX { PARAM_VALUE.HAS_RX } {
	# Procedure called to update HAS_RX when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.HAS_RX { PARAM_VALUE.HAS_RX } {
	# Procedure called to validate HAS_RX
	return true
}

proc update_PARAM_VALUE.HAS_TX { PARAM_VALUE.HAS_TX } {
	# Procedure called to update HAS_TX when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.HAS_TX { PARAM_VALUE.HAS_TX } {
	# Procedure called to validate HAS_TX
	return true
}

proc update_PARAM_VALUE.LRCLK_POL { PARAM_VALUE.LRCLK_POL } {
	# Procedure called to update LRCLK_POL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.LRCLK_POL { PARAM_VALUE.LRCLK_POL } {
	# Procedure called to validate LRCLK_POL
	return true
}

proc update_PARAM_VALUE.NUM_OF_CHANNEL { PARAM_VALUE.NUM_OF_CHANNEL } {
	# Procedure called to update NUM_OF_CHANNEL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_CHANNEL { PARAM_VALUE.NUM_OF_CHANNEL } {
	# Procedure called to validate NUM_OF_CHANNEL
	return true
}

proc update_PARAM_VALUE.SLOT_WIDTH { PARAM_VALUE.SLOT_WIDTH } {
	# Procedure called to update SLOT_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SLOT_WIDTH { PARAM_VALUE.SLOT_WIDTH } {
	# Procedure called to validate SLOT_WIDTH
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


proc update_MODELPARAM_VALUE.SLOT_WIDTH { MODELPARAM_VALUE.SLOT_WIDTH PARAM_VALUE.SLOT_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SLOT_WIDTH}] ${MODELPARAM_VALUE.SLOT_WIDTH}
}

proc update_MODELPARAM_VALUE.LRCLK_POL { MODELPARAM_VALUE.LRCLK_POL PARAM_VALUE.LRCLK_POL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.LRCLK_POL}] ${MODELPARAM_VALUE.LRCLK_POL}
}

proc update_MODELPARAM_VALUE.BCLK_POL { MODELPARAM_VALUE.BCLK_POL PARAM_VALUE.BCLK_POL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BCLK_POL}] ${MODELPARAM_VALUE.BCLK_POL}
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

proc update_MODELPARAM_VALUE.NUM_OF_CHANNEL { MODELPARAM_VALUE.NUM_OF_CHANNEL PARAM_VALUE.NUM_OF_CHANNEL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_CHANNEL}] ${MODELPARAM_VALUE.NUM_OF_CHANNEL}
}

proc update_MODELPARAM_VALUE.HAS_TX { MODELPARAM_VALUE.HAS_TX PARAM_VALUE.HAS_TX } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.HAS_TX}] ${MODELPARAM_VALUE.HAS_TX}
}

proc update_MODELPARAM_VALUE.HAS_RX { MODELPARAM_VALUE.HAS_RX PARAM_VALUE.HAS_RX } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.HAS_RX}] ${MODELPARAM_VALUE.HAS_RX}
}

