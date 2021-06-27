# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ADC_DATAPATH_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DATAPATH_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_CORDIC_DW" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_CORDIC_PHASE_DW" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_TYPE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.ADC_DATAPATH_DISABLE { PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to update ADC_DATAPATH_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_DATAPATH_DISABLE { PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to validate ADC_DATAPATH_DISABLE
	return true
}

proc update_PARAM_VALUE.DAC_DATAPATH_DISABLE { PARAM_VALUE.DAC_DATAPATH_DISABLE } {
	# Procedure called to update DAC_DATAPATH_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DATAPATH_DISABLE { PARAM_VALUE.DAC_DATAPATH_DISABLE } {
	# Procedure called to validate DAC_DATAPATH_DISABLE
	return true
}

proc update_PARAM_VALUE.DAC_DDS_CORDIC_DW { PARAM_VALUE.DAC_DDS_CORDIC_DW } {
	# Procedure called to update DAC_DDS_CORDIC_DW when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DDS_CORDIC_DW { PARAM_VALUE.DAC_DDS_CORDIC_DW } {
	# Procedure called to validate DAC_DDS_CORDIC_DW
	return true
}

proc update_PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW { PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW } {
	# Procedure called to update DAC_DDS_CORDIC_PHASE_DW when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW { PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW } {
	# Procedure called to validate DAC_DDS_CORDIC_PHASE_DW
	return true
}

proc update_PARAM_VALUE.DAC_DDS_TYPE { PARAM_VALUE.DAC_DDS_TYPE } {
	# Procedure called to update DAC_DDS_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DDS_TYPE { PARAM_VALUE.DAC_DDS_TYPE } {
	# Procedure called to validate DAC_DDS_TYPE
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

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to update SPEED_GRADE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to validate SPEED_GRADE
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
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

proc update_MODELPARAM_VALUE.DAC_DDS_TYPE { MODELPARAM_VALUE.DAC_DDS_TYPE PARAM_VALUE.DAC_DDS_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DDS_TYPE}] ${MODELPARAM_VALUE.DAC_DDS_TYPE}
}

proc update_MODELPARAM_VALUE.DAC_DDS_CORDIC_DW { MODELPARAM_VALUE.DAC_DDS_CORDIC_DW PARAM_VALUE.DAC_DDS_CORDIC_DW } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DDS_CORDIC_DW}] ${MODELPARAM_VALUE.DAC_DDS_CORDIC_DW}
}

proc update_MODELPARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW { MODELPARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW}] ${MODELPARAM_VALUE.DAC_DDS_CORDIC_PHASE_DW}
}

proc update_MODELPARAM_VALUE.DAC_DATAPATH_DISABLE { MODELPARAM_VALUE.DAC_DATAPATH_DISABLE PARAM_VALUE.DAC_DATAPATH_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DATAPATH_DISABLE}] ${MODELPARAM_VALUE.DAC_DATAPATH_DISABLE}
}

proc update_MODELPARAM_VALUE.ADC_DATAPATH_DISABLE { MODELPARAM_VALUE.ADC_DATAPATH_DISABLE PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_DATAPATH_DISABLE}] ${MODELPARAM_VALUE.ADC_DATAPATH_DISABLE}
}

