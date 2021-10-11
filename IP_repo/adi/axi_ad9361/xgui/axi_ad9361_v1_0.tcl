# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "ADC_DATAFORMAT_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ADC_DATAPATH_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ADC_DCFILTER_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ADC_INIT_DELAY" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ADC_IQCORRECTION_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ADC_USERPORTS_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CMOS_OR_LVDS_N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_CLK_EDGE_SEL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DATAPATH_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_CORDIC_DW" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_CORDIC_PHASE_DW" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_DDS_TYPE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_INIT_DELAY" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_IODELAY_ENABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_IQCORRECTION_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DAC_USERPORTS_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "DELAY_REFCLK_FREQUENCY" -parent ${Page_0}
  ipgui::add_param $IPINST -name "ID" -parent ${Page_0}
  ipgui::add_param $IPINST -name "IO_DELAY_GROUP" -parent ${Page_0}
  ipgui::add_param $IPINST -name "MIMO_ENABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "MODE_1R1T" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PPS_RECEIVER_ENABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TDD_DISABLE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "USE_SSI_CLK" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.ADC_DATAFORMAT_DISABLE { PARAM_VALUE.ADC_DATAFORMAT_DISABLE } {
	# Procedure called to update ADC_DATAFORMAT_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_DATAFORMAT_DISABLE { PARAM_VALUE.ADC_DATAFORMAT_DISABLE } {
	# Procedure called to validate ADC_DATAFORMAT_DISABLE
	return true
}

proc update_PARAM_VALUE.ADC_DATAPATH_DISABLE { PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to update ADC_DATAPATH_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_DATAPATH_DISABLE { PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to validate ADC_DATAPATH_DISABLE
	return true
}

proc update_PARAM_VALUE.ADC_DCFILTER_DISABLE { PARAM_VALUE.ADC_DCFILTER_DISABLE } {
	# Procedure called to update ADC_DCFILTER_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_DCFILTER_DISABLE { PARAM_VALUE.ADC_DCFILTER_DISABLE } {
	# Procedure called to validate ADC_DCFILTER_DISABLE
	return true
}

proc update_PARAM_VALUE.ADC_INIT_DELAY { PARAM_VALUE.ADC_INIT_DELAY } {
	# Procedure called to update ADC_INIT_DELAY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_INIT_DELAY { PARAM_VALUE.ADC_INIT_DELAY } {
	# Procedure called to validate ADC_INIT_DELAY
	return true
}

proc update_PARAM_VALUE.ADC_IQCORRECTION_DISABLE { PARAM_VALUE.ADC_IQCORRECTION_DISABLE } {
	# Procedure called to update ADC_IQCORRECTION_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_IQCORRECTION_DISABLE { PARAM_VALUE.ADC_IQCORRECTION_DISABLE } {
	# Procedure called to validate ADC_IQCORRECTION_DISABLE
	return true
}

proc update_PARAM_VALUE.ADC_USERPORTS_DISABLE { PARAM_VALUE.ADC_USERPORTS_DISABLE } {
	# Procedure called to update ADC_USERPORTS_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ADC_USERPORTS_DISABLE { PARAM_VALUE.ADC_USERPORTS_DISABLE } {
	# Procedure called to validate ADC_USERPORTS_DISABLE
	return true
}

proc update_PARAM_VALUE.CMOS_OR_LVDS_N { PARAM_VALUE.CMOS_OR_LVDS_N } {
	# Procedure called to update CMOS_OR_LVDS_N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CMOS_OR_LVDS_N { PARAM_VALUE.CMOS_OR_LVDS_N } {
	# Procedure called to validate CMOS_OR_LVDS_N
	return true
}

proc update_PARAM_VALUE.DAC_CLK_EDGE_SEL { PARAM_VALUE.DAC_CLK_EDGE_SEL } {
	# Procedure called to update DAC_CLK_EDGE_SEL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_CLK_EDGE_SEL { PARAM_VALUE.DAC_CLK_EDGE_SEL } {
	# Procedure called to validate DAC_CLK_EDGE_SEL
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

proc update_PARAM_VALUE.DAC_DDS_DISABLE { PARAM_VALUE.DAC_DDS_DISABLE } {
	# Procedure called to update DAC_DDS_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DDS_DISABLE { PARAM_VALUE.DAC_DDS_DISABLE } {
	# Procedure called to validate DAC_DDS_DISABLE
	return true
}

proc update_PARAM_VALUE.DAC_DDS_TYPE { PARAM_VALUE.DAC_DDS_TYPE } {
	# Procedure called to update DAC_DDS_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_DDS_TYPE { PARAM_VALUE.DAC_DDS_TYPE } {
	# Procedure called to validate DAC_DDS_TYPE
	return true
}

proc update_PARAM_VALUE.DAC_INIT_DELAY { PARAM_VALUE.DAC_INIT_DELAY } {
	# Procedure called to update DAC_INIT_DELAY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_INIT_DELAY { PARAM_VALUE.DAC_INIT_DELAY } {
	# Procedure called to validate DAC_INIT_DELAY
	return true
}

proc update_PARAM_VALUE.DAC_IODELAY_ENABLE { PARAM_VALUE.DAC_IODELAY_ENABLE } {
	# Procedure called to update DAC_IODELAY_ENABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_IODELAY_ENABLE { PARAM_VALUE.DAC_IODELAY_ENABLE } {
	# Procedure called to validate DAC_IODELAY_ENABLE
	return true
}

proc update_PARAM_VALUE.DAC_IQCORRECTION_DISABLE { PARAM_VALUE.DAC_IQCORRECTION_DISABLE } {
	# Procedure called to update DAC_IQCORRECTION_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_IQCORRECTION_DISABLE { PARAM_VALUE.DAC_IQCORRECTION_DISABLE } {
	# Procedure called to validate DAC_IQCORRECTION_DISABLE
	return true
}

proc update_PARAM_VALUE.DAC_USERPORTS_DISABLE { PARAM_VALUE.DAC_USERPORTS_DISABLE } {
	# Procedure called to update DAC_USERPORTS_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DAC_USERPORTS_DISABLE { PARAM_VALUE.DAC_USERPORTS_DISABLE } {
	# Procedure called to validate DAC_USERPORTS_DISABLE
	return true
}

proc update_PARAM_VALUE.DELAY_REFCLK_FREQUENCY { PARAM_VALUE.DELAY_REFCLK_FREQUENCY } {
	# Procedure called to update DELAY_REFCLK_FREQUENCY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DELAY_REFCLK_FREQUENCY { PARAM_VALUE.DELAY_REFCLK_FREQUENCY } {
	# Procedure called to validate DELAY_REFCLK_FREQUENCY
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

proc update_PARAM_VALUE.IO_DELAY_GROUP { PARAM_VALUE.IO_DELAY_GROUP } {
	# Procedure called to update IO_DELAY_GROUP when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IO_DELAY_GROUP { PARAM_VALUE.IO_DELAY_GROUP } {
	# Procedure called to validate IO_DELAY_GROUP
	return true
}

proc update_PARAM_VALUE.MIMO_ENABLE { PARAM_VALUE.MIMO_ENABLE } {
	# Procedure called to update MIMO_ENABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.MIMO_ENABLE { PARAM_VALUE.MIMO_ENABLE } {
	# Procedure called to validate MIMO_ENABLE
	return true
}

proc update_PARAM_VALUE.MODE_1R1T { PARAM_VALUE.MODE_1R1T } {
	# Procedure called to update MODE_1R1T when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.MODE_1R1T { PARAM_VALUE.MODE_1R1T } {
	# Procedure called to validate MODE_1R1T
	return true
}

proc update_PARAM_VALUE.PPS_RECEIVER_ENABLE { PARAM_VALUE.PPS_RECEIVER_ENABLE } {
	# Procedure called to update PPS_RECEIVER_ENABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PPS_RECEIVER_ENABLE { PARAM_VALUE.PPS_RECEIVER_ENABLE } {
	# Procedure called to validate PPS_RECEIVER_ENABLE
	return true
}

proc update_PARAM_VALUE.RX_NODPA { PARAM_VALUE.RX_NODPA } {
	# Procedure called to update RX_NODPA when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_NODPA { PARAM_VALUE.RX_NODPA } {
	# Procedure called to validate RX_NODPA
	return true
}

proc update_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to update SPEED_GRADE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SPEED_GRADE { PARAM_VALUE.SPEED_GRADE } {
	# Procedure called to validate SPEED_GRADE
	return true
}

proc update_PARAM_VALUE.TDD_DISABLE { PARAM_VALUE.TDD_DISABLE } {
	# Procedure called to update TDD_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TDD_DISABLE { PARAM_VALUE.TDD_DISABLE } {
	# Procedure called to validate TDD_DISABLE
	return true
}

proc update_PARAM_VALUE.USE_SSI_CLK { PARAM_VALUE.USE_SSI_CLK } {
	# Procedure called to update USE_SSI_CLK when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.USE_SSI_CLK { PARAM_VALUE.USE_SSI_CLK } {
	# Procedure called to validate USE_SSI_CLK
	return true
}


proc update_MODELPARAM_VALUE.ID { MODELPARAM_VALUE.ID PARAM_VALUE.ID } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ID}] ${MODELPARAM_VALUE.ID}
}

proc update_MODELPARAM_VALUE.MODE_1R1T { MODELPARAM_VALUE.MODE_1R1T PARAM_VALUE.MODE_1R1T } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.MODE_1R1T}] ${MODELPARAM_VALUE.MODE_1R1T}
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

proc update_MODELPARAM_VALUE.TDD_DISABLE { MODELPARAM_VALUE.TDD_DISABLE PARAM_VALUE.TDD_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TDD_DISABLE}] ${MODELPARAM_VALUE.TDD_DISABLE}
}

proc update_MODELPARAM_VALUE.PPS_RECEIVER_ENABLE { MODELPARAM_VALUE.PPS_RECEIVER_ENABLE PARAM_VALUE.PPS_RECEIVER_ENABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PPS_RECEIVER_ENABLE}] ${MODELPARAM_VALUE.PPS_RECEIVER_ENABLE}
}

proc update_MODELPARAM_VALUE.CMOS_OR_LVDS_N { MODELPARAM_VALUE.CMOS_OR_LVDS_N PARAM_VALUE.CMOS_OR_LVDS_N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CMOS_OR_LVDS_N}] ${MODELPARAM_VALUE.CMOS_OR_LVDS_N}
}

proc update_MODELPARAM_VALUE.ADC_INIT_DELAY { MODELPARAM_VALUE.ADC_INIT_DELAY PARAM_VALUE.ADC_INIT_DELAY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_INIT_DELAY}] ${MODELPARAM_VALUE.ADC_INIT_DELAY}
}

proc update_MODELPARAM_VALUE.ADC_DATAPATH_DISABLE { MODELPARAM_VALUE.ADC_DATAPATH_DISABLE PARAM_VALUE.ADC_DATAPATH_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_DATAPATH_DISABLE}] ${MODELPARAM_VALUE.ADC_DATAPATH_DISABLE}
}

proc update_MODELPARAM_VALUE.ADC_USERPORTS_DISABLE { MODELPARAM_VALUE.ADC_USERPORTS_DISABLE PARAM_VALUE.ADC_USERPORTS_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_USERPORTS_DISABLE}] ${MODELPARAM_VALUE.ADC_USERPORTS_DISABLE}
}

proc update_MODELPARAM_VALUE.ADC_DATAFORMAT_DISABLE { MODELPARAM_VALUE.ADC_DATAFORMAT_DISABLE PARAM_VALUE.ADC_DATAFORMAT_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_DATAFORMAT_DISABLE}] ${MODELPARAM_VALUE.ADC_DATAFORMAT_DISABLE}
}

proc update_MODELPARAM_VALUE.ADC_DCFILTER_DISABLE { MODELPARAM_VALUE.ADC_DCFILTER_DISABLE PARAM_VALUE.ADC_DCFILTER_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_DCFILTER_DISABLE}] ${MODELPARAM_VALUE.ADC_DCFILTER_DISABLE}
}

proc update_MODELPARAM_VALUE.ADC_IQCORRECTION_DISABLE { MODELPARAM_VALUE.ADC_IQCORRECTION_DISABLE PARAM_VALUE.ADC_IQCORRECTION_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ADC_IQCORRECTION_DISABLE}] ${MODELPARAM_VALUE.ADC_IQCORRECTION_DISABLE}
}

proc update_MODELPARAM_VALUE.DAC_INIT_DELAY { MODELPARAM_VALUE.DAC_INIT_DELAY PARAM_VALUE.DAC_INIT_DELAY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_INIT_DELAY}] ${MODELPARAM_VALUE.DAC_INIT_DELAY}
}

proc update_MODELPARAM_VALUE.DAC_CLK_EDGE_SEL { MODELPARAM_VALUE.DAC_CLK_EDGE_SEL PARAM_VALUE.DAC_CLK_EDGE_SEL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_CLK_EDGE_SEL}] ${MODELPARAM_VALUE.DAC_CLK_EDGE_SEL}
}

proc update_MODELPARAM_VALUE.DAC_IODELAY_ENABLE { MODELPARAM_VALUE.DAC_IODELAY_ENABLE PARAM_VALUE.DAC_IODELAY_ENABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_IODELAY_ENABLE}] ${MODELPARAM_VALUE.DAC_IODELAY_ENABLE}
}

proc update_MODELPARAM_VALUE.DAC_DATAPATH_DISABLE { MODELPARAM_VALUE.DAC_DATAPATH_DISABLE PARAM_VALUE.DAC_DATAPATH_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DATAPATH_DISABLE}] ${MODELPARAM_VALUE.DAC_DATAPATH_DISABLE}
}

proc update_MODELPARAM_VALUE.DAC_DDS_DISABLE { MODELPARAM_VALUE.DAC_DDS_DISABLE PARAM_VALUE.DAC_DDS_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_DDS_DISABLE}] ${MODELPARAM_VALUE.DAC_DDS_DISABLE}
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

proc update_MODELPARAM_VALUE.DAC_USERPORTS_DISABLE { MODELPARAM_VALUE.DAC_USERPORTS_DISABLE PARAM_VALUE.DAC_USERPORTS_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_USERPORTS_DISABLE}] ${MODELPARAM_VALUE.DAC_USERPORTS_DISABLE}
}

proc update_MODELPARAM_VALUE.DAC_IQCORRECTION_DISABLE { MODELPARAM_VALUE.DAC_IQCORRECTION_DISABLE PARAM_VALUE.DAC_IQCORRECTION_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DAC_IQCORRECTION_DISABLE}] ${MODELPARAM_VALUE.DAC_IQCORRECTION_DISABLE}
}

proc update_MODELPARAM_VALUE.IO_DELAY_GROUP { MODELPARAM_VALUE.IO_DELAY_GROUP PARAM_VALUE.IO_DELAY_GROUP } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IO_DELAY_GROUP}] ${MODELPARAM_VALUE.IO_DELAY_GROUP}
}

proc update_MODELPARAM_VALUE.MIMO_ENABLE { MODELPARAM_VALUE.MIMO_ENABLE PARAM_VALUE.MIMO_ENABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.MIMO_ENABLE}] ${MODELPARAM_VALUE.MIMO_ENABLE}
}

proc update_MODELPARAM_VALUE.USE_SSI_CLK { MODELPARAM_VALUE.USE_SSI_CLK PARAM_VALUE.USE_SSI_CLK } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.USE_SSI_CLK}] ${MODELPARAM_VALUE.USE_SSI_CLK}
}

proc update_MODELPARAM_VALUE.DELAY_REFCLK_FREQUENCY { MODELPARAM_VALUE.DELAY_REFCLK_FREQUENCY PARAM_VALUE.DELAY_REFCLK_FREQUENCY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DELAY_REFCLK_FREQUENCY}] ${MODELPARAM_VALUE.DELAY_REFCLK_FREQUENCY}
}

proc update_MODELPARAM_VALUE.RX_NODPA { MODELPARAM_VALUE.RX_NODPA PARAM_VALUE.RX_NODPA } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_NODPA}] ${MODELPARAM_VALUE.RX_NODPA}
}

