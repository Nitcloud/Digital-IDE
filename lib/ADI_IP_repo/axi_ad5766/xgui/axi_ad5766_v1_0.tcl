# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ASYNC_SPI_CLK" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CMD_MEM_ADDRESS_WIDTH" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SDO_MEM_ADDRESS_WIDTH" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to update ASYNC_SPI_CLK when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ASYNC_SPI_CLK { PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to validate ASYNC_SPI_CLK
	return true
}

proc update_PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to update CMD_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate CMD_MEM_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.DEV_PACKAGE { PARAM_VALUE.DEV_PACKAGE } {
	# Procedure called to update DEV_PACKAGE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEV_PACKAGE { PARAM_VALUE.DEV_PACKAGE } {
	# Procedure called to validate DEV_PACKAGE
	return true
}

proc update_PARAM_VALUE.FPGA_FAMILY { PARAM_VALUE.FPGA_FAMILY } {
	# Procedure called to update FPGA_FAMILY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.FPGA_FAMILY { PARAM_VALUE.FPGA_FAMILY } {
	# Procedure called to validate FPGA_FAMILY
	return true
}

proc update_PARAM_VALUE.FPGA_TECHNOLOGY { PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to update FPGA_TECHNOLOGY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.FPGA_TECHNOLOGY { PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to validate FPGA_TECHNOLOGY
	return true
}

proc update_PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to update SDO_MEM_ADDRESS_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to validate SDO_MEM_ADDRESS_WIDTH
	return true
}

proc update_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to update SPEED_GRADE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to validate SPEED_GRADE
	return true
}


proc update_MODELPARAM_VALUE.FPGA_TECHNOLOGY { MODELPARAM_VALUE.FPGA_TECHNOLOGY PARAM_VALUE.FPGA_TECHNOLOGY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.FPGA_TECHNOLOGY}] ${MODELPARAM_VALUE.FPGA_TECHNOLOGY}
}

proc update_MODELPARAM_VALUE.FPGA_FAMILY { MODELPARAM_VALUE.FPGA_FAMILY PARAM_VALUE.FPGA_FAMILY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.FPGA_FAMILY}] ${MODELPARAM_VALUE.FPGA_FAMILY}
}

proc update_MODELPARAM_VALUE.SPEED_GRADE { MODELPARAM_VALUE.SPEED_GRADE PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SPEED_GRADE}] ${MODELPARAM_VALUE.SPEED_GRADE}
}

proc update_MODELPARAM_VALUE.DEV_PACKAGE { MODELPARAM_VALUE.DEV_PACKAGE PARAM_VALUE.DEV_PACKAGE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DEV_PACKAGE}] ${MODELPARAM_VALUE.DEV_PACKAGE}
}

proc update_MODELPARAM_VALUE.ASYNC_SPI_CLK { MODELPARAM_VALUE.ASYNC_SPI_CLK PARAM_VALUE.ASYNC_SPI_CLK } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ASYNC_SPI_CLK}] ${MODELPARAM_VALUE.ASYNC_SPI_CLK}
}

proc update_MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CMD_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.CMD_MEM_ADDRESS_WIDTH}
}

proc update_MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH { MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SDO_MEM_ADDRESS_WIDTH}] ${MODELPARAM_VALUE.SDO_MEM_ADDRESS_WIDTH}
}

