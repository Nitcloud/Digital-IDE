
# Loading additional proc with user specified bodies to compute parameter values.
source [file join [file dirname [file dirname [info script]]] gui/axi_spi_engine_v1_0.gtcl]

# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set AXI_SPI_Engine_soft-controller [ipgui::add_page $IPINST -name "AXI SPI Engine soft-controller"]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${AXI_SPI_Engine_soft-controller}]
  set ID [ipgui::add_param $IPINST -name "ID" -parent ${General_Configuration}]
  set_property tooltip {[ID] Core instance ID} ${ID}
  set DATA_WIDTH [ipgui::add_param $IPINST -name "DATA_WIDTH" -parent ${General_Configuration}]
  set_property tooltip {[DATA_WIDTH] Define the data interface width} ${DATA_WIDTH}
  set NUM_OF_SDI [ipgui::add_param $IPINST -name "NUM_OF_SDI" -parent ${General_Configuration}]
  set_property tooltip {[NUM_OF_SDI] Define the number of MISO lines} ${NUM_OF_SDI}
  set MM_IF_TYPE [ipgui::add_param $IPINST -name "MM_IF_TYPE" -parent ${General_Configuration}]
  set_property tooltip {[MM_IF_TYPE] Define the memory mapped interface type} ${MM_IF_TYPE}
  set ASYNC_SPI_CLK [ipgui::add_param $IPINST -name "ASYNC_SPI_CLK" -parent ${General_Configuration}]
  set_property tooltip {[ASYNC_SPI_CLK] Define the relationship between the core clock and the memory mapped interface clock} ${ASYNC_SPI_CLK}

  #Adding Group
  set Command_stream_FIFO_configuration [ipgui::add_group $IPINST -name "Command stream FIFO configuration" -parent ${AXI_SPI_Engine_soft-controller}]
  set CMD_FIFO_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "CMD_FIFO_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[CMD_FIFO_ADDRESS_WIDTH] Define the depth of the FIFO} ${CMD_FIFO_ADDRESS_WIDTH}
  set SYNC_FIFO_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "SYNC_FIFO_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[SYNC_FIFO_ADDRESS_WIDTH] Define the depth of the FIFO} ${SYNC_FIFO_ADDRESS_WIDTH}
  set SDO_FIFO_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "SDO_FIFO_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[SDO_FIFO_ADDRESS_WIDTH] Define the depth of the FIFO} ${SDO_FIFO_ADDRESS_WIDTH}
  set SDI_FIFO_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "SDI_FIFO_ADDRESS_WIDTH" -parent ${Command_stream_FIFO_configuration}]
  set_property tooltip {[SDI_FIFO_ADDRESS_WIDTH] Define the depth of the FIFO} ${SDI_FIFO_ADDRESS_WIDTH}

  #Adding Group
  set Offload_module_configuration [ipgui::add_group $IPINST -name "Offload module configuration" -parent ${AXI_SPI_Engine_soft-controller}]
  set NUM_OFFLOAD [ipgui::add_param $IPINST -name "NUM_OFFLOAD" -parent ${Offload_module_configuration}]
  set_property tooltip {[NUM_OFFLOAD] Number of offloads} ${NUM_OFFLOAD}
  set OFFLOAD0_CMD_MEM_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "OFFLOAD0_CMD_MEM_ADDRESS_WIDTH" -parent ${Offload_module_configuration}]
  set_property tooltip {[OFFLOAD0_CMD_MEM_ADDRESS_WIDTH] Define the depth of the FIFO} ${OFFLOAD0_CMD_MEM_ADDRESS_WIDTH}
  set OFFLOAD0_SDO_MEM_ADDRESS_WIDTH [ipgui::add_param $IPINST -name "OFFLOAD0_SDO_MEM_ADDRESS_WIDTH" -parent ${Offload_module_configuration}]
  set_property tooltip {[OFFLOAD0_SDO_MEM_ADDRESS_WIDTH] Define the depth of the FIFO} ${OFFLOAD0_SDO_MEM_ADDRESS_WIDTH}



}

proc update_PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH PARAM_VALUE.NUM_OFFLOAD } {
	# Procedure called to update OFFLOAD0_CMD_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
	
	set OFFLOAD0_CMD_MEM_ADDRESS_WIDTH ${PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH}
	set NUM_OFFLOAD ${PARAM_VALUE.NUM_OFFLOAD}
	set values(NUM_OFFLOAD) [get_property value $NUM_OFFLOAD]
	if { [gen_USERPARAMETER_OFFLOAD0_CMD_MEM_ADDRESS_WIDTH_ENABLEMENT $values(NUM_OFFLOAD)] } {
		set_property enabled true $OFFLOAD0_CMD_MEM_ADDRESS_WIDTH
	} else {
		set_property enabled false $OFFLOAD0_CMD_MEM_ADDRESS_WIDTH
	}
}

proc validate_PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate OFFLOAD0_CMD_MEM_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH PARAM_VALUE.NUM_OFFLOAD } {
	# Procedure called to update OFFLOAD0_SDO_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
	
	set OFFLOAD0_SDO_MEM_ADDRESS_WIDTH ${PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH}
	set NUM_OFFLOAD ${PARAM_VALUE.NUM_OFFLOAD}
	set values(NUM_OFFLOAD) [get_property value $NUM_OFFLOAD]
	if { [gen_USERPARAMETER_OFFLOAD0_SDO_MEM_ADDRESS_WIDTH_ENABLEMENT $values(NUM_OFFLOAD)] } {
		set_property enabled true $OFFLOAD0_SDO_MEM_ADDRESS_WIDTH
	} else {
		set_property enabled false $OFFLOAD0_SDO_MEM_ADDRESS_WIDTH
	}
}

proc validate_PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate OFFLOAD0_SDO_MEM_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to update ASYNC_SPI_CLK when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to validate ASYNC_SPI_CLK
	return true
}

proc update_PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH { PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH } {
	# Procedure called to update CMD_FIFO_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH { PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH } {
	# Procedure called to validate CMD_FIFO_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to update DATA_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DATA_WIDTH { PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to validate DATA_WIDTH
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.MM_IF_TYPE { PARAM_VALUE.MM_IF_TYPE } {
	# Procedure called to update MM_IF_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.MM_IF_TYPE { PARAM_VALUE.MM_IF_TYPE } {
	# Procedure called to validate MM_IF_TYPE
	return true
}

proc update_PARAM_VALUE.NUM_OFFLOAD { PARAM_VALUE.NUM_OFFLOAD } {
	# Procedure called to update NUM_OFFLOAD when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OFFLOAD { PARAM_VALUE.NUM_OFFLOAD } {
	# Procedure called to validate NUM_OFFLOAD
	return true
}

proc update_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to update NUM_OF_SDI when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_SDI { PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to validate NUM_OF_SDI
	return true
}

proc update_PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH } {
	# Procedure called to update SDI_FIFO_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH } {
	# Procedure called to validate SDI_FIFO_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH } {
	# Procedure called to update SDO_FIFO_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH } {
	# Procedure called to validate SDO_FIFO_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH } {
	# Procedure called to update SYNC_FIFO_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH { PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH } {
	# Procedure called to validate SYNC_FIFO_ADDRESS_WIDTH
	return true
}


proc update_MODELPARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH { MODELPARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.CMD_FIFO_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH { MODELPARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.SYNC_FIFO_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH { MODELPARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.SDO_FIFO_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH { MODELPARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.SDI_FIFO_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.MM_IF_TYPE { MODELPARAM_VALUE.MM_IF_TYPE PARAM_VALUE.MM_IF_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.MM_IF_TYPE}] ${MODELPARAM_VALUE.MM_IF_TYPE}
}

proc update_MODELPARAM_VALUE.ASYNC_SPI_CLK { MODELPARAM_VALUE.ASYNC_SPI_CLK PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_SPI_CLK}] ${MODELPARAM_VALUE.ASYNC_SPI_CLK}
}

proc update_MODELPARAM_VALUE.NUM_OFFLOAD { MODELPARAM_VALUE.NUM_OFFLOAD PARAM_VALUE.NUM_OFFLOAD } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OFFLOAD}] ${MODELPARAM_VALUE.NUM_OFFLOAD}
}

proc update_MODELPARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.OFFLOAD0_CMD_MEM_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.OFFLOAD0_SDO_MEM_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.DATA_WIDTH { MODELPARAM_VALUE.DATA_WIDTH PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATA_WIDTH}] ${MODELPARAM_VALUE.DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.NUM_OF_SDI { MODELPARAM_VALUE.NUM_OF_SDI PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_SDI}] ${MODELPARAM_VALUE.NUM_OF_SDI}
}

