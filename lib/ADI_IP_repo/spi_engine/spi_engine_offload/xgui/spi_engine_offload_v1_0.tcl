# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set SPI_Engine_RX_offload [ipgui::add_page $IPINST -name "SPI Engine RX offload"]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${SPI_Engine_RX_offload}]
  set DATA_WIDTH [ipgui::add_param $IPINST -name "DATA_WIDTH" -parent ${General_Configuration}]
  set_property tooltip {[DATA_WIDTH] Define the data interface width} ${DATA_WIDTH}
  set NUM_OF_SDI [ipgui::add_param $IPINST -name "NUM_OF_SDI" -parent ${General_Configuration}]
  set_property tooltip {[NUM_OF_SDI] Define the number of MISO lines} ${NUM_OF_SDI}
  set ASYNC_SPI_CLK [ipgui::add_param $IPINST -name "ASYNC_SPI_CLK" -parent ${General_Configuration}]
  set_property tooltip {[ASYNC_SPI_CLK] Define the relationship between the core clock and the memory mapped interface clock} ${ASYNC_SPI_CLK}
  set ASYNC_TRIG [ipgui::add_param $IPINST -name "ASYNC_TRIG" -parent ${General_Configuration}]
  set_property tooltip {[ASYNC_TRIG] Set if the external trigger is asynchronous to the core clk} ${ASYNC_TRIG}

  #Adding Group
  set Command_stream_FIFO_configuration [ipgui::add_group $IPINST -name "Command stream FIFO configuration" -parent ${SPI_Engine_RX_offload}]
  set CMD_MEM_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "CMD_MEM_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[CMD_MEM_ADDRESS_WIDTH] Define the depth of the FIFO} ${CMD_MEM_ADDRESS_WIDTH}
  set SDO_MEM_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "SDO_MEM_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[SDO_MEM_ADDRESS_WIDTH] Define the depth of the FIFO} ${SDO_MEM_ADDRESS_WIDTH}



}

proc update_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to update ASYNC_SPI_CLK when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to validate ASYNC_SPI_CLK
	return true
}

proc update_PARAM_VALUE.ASYNC_TRIG { PARAM_VALUE.ASYNC_TRIG } {
	# Procedure called to update ASYNC_TRIG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_TRIG { PARAM_VALUE.ASYNC_TRIG } {
	# Procedure called to validate ASYNC_TRIG
	return true
}

proc update_PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to update CMD_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate CMD_MEM_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to update DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to validate DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to update NUM_OF_SDI when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to validate NUM_OF_SDI
	return true
}

proc update_PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to update SDO_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate SDO_MEM_ADDRESS_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.ASYNC_SPI_CLK { MODELPARAM_VALUE.ASYNC_SPI_CLK PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_SPI_CLK}] ${MODELPARAM_VALUE.ASYNC_SPI_CLK}
}

proc update_MODELPARAM_VALUE.ASYNC_TRIG { MODELPARAM_VALUE.ASYNC_TRIG PARAM_VALUE.ASYNC_TRIG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_TRIG}] ${MODELPARAM_VALUE.ASYNC_TRIG}
}

proc update_MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.DATA_WIDTH { MODELPARAM_VALUE.DATA_WIDTH PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATA_WIDTH}] ${MODELPARAM_VALUE.DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.NUM_OF_SDI { MODELPARAM_VALUE.NUM_OF_SDI PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_SDI}] ${MODELPARAM_VALUE.NUM_OF_SDI}
}

