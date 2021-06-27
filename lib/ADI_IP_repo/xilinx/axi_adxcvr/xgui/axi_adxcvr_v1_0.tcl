# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "LPM_OR_DFE_N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_OF_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "OUT_CLK_SEL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_ENABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RATE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SYS_CLK_SEL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_DIFFCTRL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_OR_RX_N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_POSTCURSOR" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_PRECURSOR" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "XCVR_TYPE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_VOLTAGE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



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

proc update_PARAM_VALUE.FPGA_VOLTAGE { PARAM_VALUE.FPGA_VOLTAGE } {
	# Procedure called to update FPGA_VOLTAGE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.FPGA_VOLTAGE { PARAM_VALUE.FPGA_VOLTAGE } {
	# Procedure called to validate FPGA_VOLTAGE
	return true
}

proc update_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to update ID when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ID { PARAM_VALUE.ID } {
	# Procedure called to validate ID
	return true
}

proc update_PARAM_VALUE.LPM_OR_DFE_N { PARAM_VALUE.LPM_OR_DFE_N } {
	# Procedure called to update LPM_OR_DFE_N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.LPM_OR_DFE_N { PARAM_VALUE.LPM_OR_DFE_N } {
	# Procedure called to validate LPM_OR_DFE_N
	return true
}

proc update_PARAM_VALUE.NUM_OF_LANES { PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to update NUM_OF_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_OF_LANES { PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to validate NUM_OF_LANES
	return true
}

proc update_PARAM_VALUE.OUT_CLK_SEL { PARAM_VALUE.OUT_CLK_SEL } {
	# Procedure called to update OUT_CLK_SEL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.OUT_CLK_SEL { PARAM_VALUE.OUT_CLK_SEL } {
	# Procedure called to validate OUT_CLK_SEL
	return true
}

proc update_PARAM_VALUE.QPLL_ENABLE { PARAM_VALUE.QPLL_ENABLE } {
	# Procedure called to update QPLL_ENABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_ENABLE { PARAM_VALUE.QPLL_ENABLE } {
	# Procedure called to validate QPLL_ENABLE
	return true
}

proc update_PARAM_VALUE.RATE { PARAM_VALUE.RATE } {
	# Procedure called to update RATE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RATE { PARAM_VALUE.RATE } {
	# Procedure called to validate RATE
	return true
}

proc update_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to update SPEED_GRADE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to validate SPEED_GRADE
	return true
}

proc update_PARAM_VALUE.SYS_CLK_SEL { PARAM_VALUE.SYS_CLK_SEL } {
	# Procedure called to update SYS_CLK_SEL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SYS_CLK_SEL { PARAM_VALUE.SYS_CLK_SEL } {
	# Procedure called to validate SYS_CLK_SEL
	return true
}

proc update_PARAM_VALUE.TX_DIFFCTRL { PARAM_VALUE.TX_DIFFCTRL } {
	# Procedure called to update TX_DIFFCTRL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_DIFFCTRL { PARAM_VALUE.TX_DIFFCTRL } {
	# Procedure called to validate TX_DIFFCTRL
	return true
}

proc update_PARAM_VALUE.TX_OR_RX_N { PARAM_VALUE.TX_OR_RX_N } {
	# Procedure called to update TX_OR_RX_N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_OR_RX_N { PARAM_VALUE.TX_OR_RX_N } {
	# Procedure called to validate TX_OR_RX_N
	return true
}

proc update_PARAM_VALUE.TX_POSTCURSOR { PARAM_VALUE.TX_POSTCURSOR } {
	# Procedure called to update TX_POSTCURSOR when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_POSTCURSOR { PARAM_VALUE.TX_POSTCURSOR } {
	# Procedure called to validate TX_POSTCURSOR
	return true
}

proc update_PARAM_VALUE.TX_PRECURSOR { PARAM_VALUE.TX_PRECURSOR } {
	# Procedure called to update TX_PRECURSOR when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_PRECURSOR { PARAM_VALUE.TX_PRECURSOR } {
	# Procedure called to validate TX_PRECURSOR
	return true
}

proc update_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update XCVR_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to validate XCVR_TYPE
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.NUM_OF_LANES { MODELPARAM_VALUE.NUM_OF_LANES PARAM_VALUE.NUM_OF_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_OF_LANES}] ${MODELPARAM_VALUE.NUM_OF_LANES}
}

proc update_MODELPARAM_VALUE.XCVR_TYPE { MODELPARAM_VALUE.XCVR_TYPE PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.XCVR_TYPE}] ${MODELPARAM_VALUE.XCVR_TYPE}
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

proc update_MODELPARAM_VALUE.FPGA_VOLTAGE { MODELPARAM_VALUE.FPGA_VOLTAGE PARAM_VALUE.FPGA_VOLTAGE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.FPGA_VOLTAGE}] ${MODELPARAM_VALUE.FPGA_VOLTAGE}
}

proc update_MODELPARAM_VALUE.TX_OR_RX_N { MODELPARAM_VALUE.TX_OR_RX_N PARAM_VALUE.TX_OR_RX_N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_OR_RX_N}] ${MODELPARAM_VALUE.TX_OR_RX_N}
}

proc update_MODELPARAM_VALUE.QPLL_ENABLE { MODELPARAM_VALUE.QPLL_ENABLE PARAM_VALUE.QPLL_ENABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_ENABLE}] ${MODELPARAM_VALUE.QPLL_ENABLE}
}

proc update_MODELPARAM_VALUE.LPM_OR_DFE_N { MODELPARAM_VALUE.LPM_OR_DFE_N PARAM_VALUE.LPM_OR_DFE_N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.LPM_OR_DFE_N}] ${MODELPARAM_VALUE.LPM_OR_DFE_N}
}

proc update_MODELPARAM_VALUE.RATE { MODELPARAM_VALUE.RATE PARAM_VALUE.RATE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RATE}] ${MODELPARAM_VALUE.RATE}
}

proc update_MODELPARAM_VALUE.TX_DIFFCTRL { MODELPARAM_VALUE.TX_DIFFCTRL PARAM_VALUE.TX_DIFFCTRL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_DIFFCTRL}] ${MODELPARAM_VALUE.TX_DIFFCTRL}
}

proc update_MODELPARAM_VALUE.TX_POSTCURSOR { MODELPARAM_VALUE.TX_POSTCURSOR PARAM_VALUE.TX_POSTCURSOR } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_POSTCURSOR}] ${MODELPARAM_VALUE.TX_POSTCURSOR}
}

proc update_MODELPARAM_VALUE.TX_PRECURSOR { MODELPARAM_VALUE.TX_PRECURSOR PARAM_VALUE.TX_PRECURSOR } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_PRECURSOR}] ${MODELPARAM_VALUE.TX_PRECURSOR}
}

proc update_MODELPARAM_VALUE.SYS_CLK_SEL { MODELPARAM_VALUE.SYS_CLK_SEL PARAM_VALUE.SYS_CLK_SEL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SYS_CLK_SEL}] ${MODELPARAM_VALUE.SYS_CLK_SEL}
}

proc update_MODELPARAM_VALUE.OUT_CLK_SEL { MODELPARAM_VALUE.OUT_CLK_SEL PARAM_VALUE.OUT_CLK_SEL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OUT_CLK_SEL}] ${MODELPARAM_VALUE.OUT_CLK_SEL}
}

