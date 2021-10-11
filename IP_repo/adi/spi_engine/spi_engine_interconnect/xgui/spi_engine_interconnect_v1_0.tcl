# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set SPI_Engine_interconnect [ipgui::add_page $IPINST -name "SPI Engine interconnect"]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${SPI_Engine_interconnect}]
  set DATA_WIDTH [ipgui::add_param $IPINST -name "DATA_WIDTH" -parent ${General_Configuration}]
  set_property tooltip {[DATA_WIDTH] Define the data interface width} ${DATA_WIDTH}
  set NUM_OF_SDI [ipgui::add_param $IPINST -name "NUM_OF_SDI" -parent ${General_Configuration}]
  set_property tooltip {[NUM_OF_SDI] Define the number of MISO lines} ${NUM_OF_SDI}



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


proc update_MODELPARAM_VALUE.DATA_WIDTH { MODELPARAM_VALUE.DATA_WIDTH PARAM_VALUE.DATA_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATA_WIDTH}] ${MODELPARAM_VALUE.DATA_WIDTH}
}

proc update_MODELPARAM_VALUE.NUM_OF_SDI { MODELPARAM_VALUE.NUM_OF_SDI PARAM_VALUE.NUM_OF_SDI } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_SDI}] ${MODELPARAM_VALUE.NUM_OF_SDI}
}

