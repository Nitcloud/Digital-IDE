# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set SPI_Engine_execution [ipgui::add_page $IPINST -name "SPI Engine execution" -display_name {AXI SPI Engine execution}]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${SPI_Engine_execution}]
  set DATA_WIDTH [ipgui::add_param $IPINST -name "DATA_WIDTH" -parent ${General_Configuration}]
  set_property tooltip {[DATA_WIDTH] Define the data interface width} ${DATA_WIDTH}
  set NUM_OF_CS [ipgui::add_param $IPINST -name "NUM_OF_CS" -parent ${General_Configuration}]
  set_property tooltip {[NUM_OF_CS] Define the number of chip select lines} ${NUM_OF_CS}
  set NUM_OF_SDI [ipgui::add_param $IPINST -name "NUM_OF_SDI" -parent ${General_Configuration}]
  set_property tooltip {[NUM_OF_SDI] Define the number of MISO lines} ${NUM_OF_SDI}

  #Adding Group
  set SPI_Configuration [ipgui::add_group $IPINST -name "SPI Configuration" -parent ${SPI_Engine_execution}]
  set DEFAULT_SPI_CFG [ipgui::add_param $IPINST -name "DEFAULT_SPI_CFG" -parent ${SPI_Configuration} -widget comboBox]
  set_property tooltip {[DEFAULT_SPI_CFG] Define the default SPI configuration, bit 1 defines CPOL, bit 0 defines CPHA} ${DEFAULT_SPI_CFG}
  set DEFAULT_CLK_DIV [ipgui::add_param $IPINST -name "DEFAULT_CLK_DIV" -parent ${SPI_Configuration}]
  set_property tooltip {[DEFAULT_CLK_DIV] Define the default SCLK divider, fSCLK = fCoreClk / DEFAULT_CLK_DIV + 1} ${DEFAULT_CLK_DIV}

  #Adding Group
  set MOSI/MISO_Configuration [ipgui::add_group $IPINST -name "MOSI/MISO Configuration" -parent ${SPI_Engine_execution}]
  set SDI_DELAY [ipgui::add_param $IPINST -name "SDI_DELAY" -parent ${MOSI/MISO_Configuration}]
  set_property tooltip {[SDI_DELAY] Delay the MISO latching to the next consecutive SCLK edge} ${SDI_DELAY}
  set SDO_DEFAULT [ipgui::add_param $IPINST -name "SDO_DEFAULT" -parent ${MOSI/MISO_Configuration} -widget comboBox]
  set_property tooltip {[SDO_DEFAULT] Define the default voltage level on MOSI} ${SDO_DEFAULT}



}

proc update_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to update DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to validate DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.DEFAULT_CLK_DIV { PARAM_VALUE.DEFAULT_CLK_DIV } {
	# Procedure called to update DEFAULT_CLK_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEFAULT_CLK_DIV { PARAM_VALUE.DEFAULT_CLK_DIV } {
	# Procedure called to validate DEFAULT_CLK_DIV
	return true
}

proc update_PARAM_VALUE.DEFAULT_SPI_CFG { PARAM_VALUE.DEFAULT_SPI_CFG } {
	# Procedure called to update DEFAULT_SPI_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEFAULT_SPI_CFG { PARAM_VALUE.DEFAULT_SPI_CFG } {
	# Procedure called to validate DEFAULT_SPI_CFG
	return true
}

proc update_PARAM_VALUE.NUM_OF_CS { PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to update NUM_OF_CS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_CS { PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to validate NUM_OF_CS
	return true
}

proc update_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to update NUM_OF_SDI when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to validate NUM_OF_SDI
	return true
}

proc update_PARAM_VALUE.SDI_DELAY { PARAM_VALUE.SDI_DELAY } {
	# Procedure called to update SDI_DELAY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDI_DELAY { PARAM_VALUE.SDI_DELAY } {
	# Procedure called to validate SDI_DELAY
	return true
}

proc update_PARAM_VALUE.SDO_DEFAULT { PARAM_VALUE.SDO_DEFAULT } {
	# Procedure called to update SDO_DEFAULT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDO_DEFAULT { PARAM_VALUE.SDO_DEFAULT } {
	# Procedure called to validate SDO_DEFAULT
	return true
}


proc update_MODELPARAM_VALUE.NUM_OF_CS { MODELPARAM_VALUE.NUM_OF_CS PARAM_VALUE.NUM_OF_CS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_CS}] ${MODELPARAM_VALUE.NUM_OF_CS}
}

proc update_MODELPARAM_VALUE.DEFAULT_SPI_CFG { MODELPARAM_VALUE.DEFAULT_SPI_CFG PARAM_VALUE.DEFAULT_SPI_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DEFAULT_SPI_CFG}] ${MODELPARAM_VALUE.DEFAULT_SPI_CFG}
}

proc update_MODELPARAM_VALUE.DEFAULT_CLK_DIV { MODELPARAM_VALUE.DEFAULT_CLK_DIV PARAM_VALUE.DEFAULT_CLK_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DEFAULT_CLK_DIV}] ${MODELPARAM_VALUE.DEFAULT_CLK_DIV}
}

proc update_MODELPARAM_VALUE.DATA_WIDTH { MODELPARAM_VALUE.DATA_WIDTH PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATA_WIDTH}] ${MODELPARAM_VALUE.DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.NUM_OF_SDI { MODELPARAM_VALUE.NUM_OF_SDI PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_SDI}] ${MODELPARAM_VALUE.NUM_OF_SDI}
}

proc update_MODELPARAM_VALUE.SDO_DEFAULT { MODELPARAM_VALUE.SDO_DEFAULT PARAM_VALUE.SDO_DEFAULT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDO_DEFAULT}] ${MODELPARAM_VALUE.SDO_DEFAULT}
}

proc update_MODELPARAM_VALUE.SDI_DELAY { MODELPARAM_VALUE.SDI_DELAY PARAM_VALUE.SDI_DELAY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDI_DELAY}] ${MODELPARAM_VALUE.SDI_DELAY}
}

