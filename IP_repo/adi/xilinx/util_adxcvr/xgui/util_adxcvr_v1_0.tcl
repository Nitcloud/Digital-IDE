
# Loading additional proc with user specified bodies to compute parameter values.
source [file join [file dirname [file dirname [info script]]] gui/util_adxcvr_v1_0.gtcl]

# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "A_TXDIFFCTRL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CH_HSPMUX" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_CFG0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_CFG1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_CFG2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_CFG3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_FBDIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "CPLL_FBDIV_4_5" -parent ${Page_0}
  ipgui::add_param $IPINST -name "POR_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PPF0_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "PREIQ_FREQ_BST" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG1_G3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG2_G3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CFG4" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CP" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_CP_G3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_FBDIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_FBDIV_RATIO" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_LPF" -parent ${Page_0}
  ipgui::add_param $IPINST -name "QPLL_REFCLK_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RTX_BUF_CML_CTRL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG2_GEN2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG2_GEN4" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG3_GEN2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG3_GEN3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXCDR_CFG3_GEN4" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXPI_CFG0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RXPI_CFG1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_CDR_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_CLK25_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_DFE_LPM_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_LANE_INVERT" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_NUM_OF_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_OUT_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_PMA_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_WIDEMODE_CDR" -parent ${Page_0}
  ipgui::add_param $IPINST -name "RX_XMODE_SEL" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXDRV_FREQBAND" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXFE_CFG1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXFE_CFG2" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXFE_CFG3" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXPI_CFG" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXPI_CFG0" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TXPI_CFG1" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_CLK25_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_LANE_INVERT" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_NUM_OF_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_OUT_DIV" -parent ${Page_0}
  ipgui::add_param $IPINST -name "TX_PI_BIASSET" -parent ${Page_0}
  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "XCVR_TYPE" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.CH_HSPMUX { PARAM_VALUE.CH_HSPMUX PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update CH_HSPMUX when any of the dependent parameters in the arguments change
	
	set CH_HSPMUX ${PARAM_VALUE.CH_HSPMUX}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_CH_HSPMUX_VALUE $values(XCVR_TYPE)] $CH_HSPMUX
}

proc validate_PARAM_VALUE.CH_HSPMUX { PARAM_VALUE.CH_HSPMUX } {
	# Procedure called to validate CH_HSPMUX
	return true
}

proc update_PARAM_VALUE.PPF0_CFG { PARAM_VALUE.PPF0_CFG PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update PPF0_CFG when any of the dependent parameters in the arguments change
	
	set PPF0_CFG ${PARAM_VALUE.PPF0_CFG}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_PPF0_CFG_VALUE $values(XCVR_TYPE)] $PPF0_CFG
}

proc validate_PARAM_VALUE.PPF0_CFG { PARAM_VALUE.PPF0_CFG } {
	# Procedure called to validate PPF0_CFG
	return true
}

proc update_PARAM_VALUE.QPLL_LPF { PARAM_VALUE.QPLL_LPF PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update QPLL_LPF when any of the dependent parameters in the arguments change
	
	set QPLL_LPF ${PARAM_VALUE.QPLL_LPF}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_QPLL_LPF_VALUE $values(XCVR_TYPE)] $QPLL_LPF
}

proc validate_PARAM_VALUE.QPLL_LPF { PARAM_VALUE.QPLL_LPF } {
	# Procedure called to validate QPLL_LPF
	return true
}

proc update_PARAM_VALUE.RTX_BUF_CML_CTRL { PARAM_VALUE.RTX_BUF_CML_CTRL PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update RTX_BUF_CML_CTRL when any of the dependent parameters in the arguments change
	
	set RTX_BUF_CML_CTRL ${PARAM_VALUE.RTX_BUF_CML_CTRL}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_RTX_BUF_CML_CTRL_VALUE $values(XCVR_TYPE)] $RTX_BUF_CML_CTRL
}

proc validate_PARAM_VALUE.RTX_BUF_CML_CTRL { PARAM_VALUE.RTX_BUF_CML_CTRL } {
	# Procedure called to validate RTX_BUF_CML_CTRL
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG3_GEN2 { PARAM_VALUE.RXCDR_CFG3_GEN2 PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update RXCDR_CFG3_GEN2 when any of the dependent parameters in the arguments change
	
	set RXCDR_CFG3_GEN2 ${PARAM_VALUE.RXCDR_CFG3_GEN2}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_RXCDR_CFG3_GEN2_VALUE $values(XCVR_TYPE)] $RXCDR_CFG3_GEN2
}

proc validate_PARAM_VALUE.RXCDR_CFG3_GEN2 { PARAM_VALUE.RXCDR_CFG3_GEN2 } {
	# Procedure called to validate RXCDR_CFG3_GEN2
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG3_GEN4 { PARAM_VALUE.RXCDR_CFG3_GEN4 PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update RXCDR_CFG3_GEN4 when any of the dependent parameters in the arguments change
	
	set RXCDR_CFG3_GEN4 ${PARAM_VALUE.RXCDR_CFG3_GEN4}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_RXCDR_CFG3_GEN4_VALUE $values(XCVR_TYPE)] $RXCDR_CFG3_GEN4
}

proc validate_PARAM_VALUE.RXCDR_CFG3_GEN4 { PARAM_VALUE.RXCDR_CFG3_GEN4 } {
	# Procedure called to validate RXCDR_CFG3_GEN4
	return true
}

proc update_PARAM_VALUE.RXPI_CFG0 { PARAM_VALUE.RXPI_CFG0 PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update RXPI_CFG0 when any of the dependent parameters in the arguments change
	
	set RXPI_CFG0 ${PARAM_VALUE.RXPI_CFG0}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_RXPI_CFG0_VALUE $values(XCVR_TYPE)] $RXPI_CFG0
}

proc validate_PARAM_VALUE.RXPI_CFG0 { PARAM_VALUE.RXPI_CFG0 } {
	# Procedure called to validate RXPI_CFG0
	return true
}

proc update_PARAM_VALUE.RXPI_CFG1 { PARAM_VALUE.RXPI_CFG1 PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update RXPI_CFG1 when any of the dependent parameters in the arguments change
	
	set RXPI_CFG1 ${PARAM_VALUE.RXPI_CFG1}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_RXPI_CFG1_VALUE $values(XCVR_TYPE)] $RXPI_CFG1
}

proc validate_PARAM_VALUE.RXPI_CFG1 { PARAM_VALUE.RXPI_CFG1 } {
	# Procedure called to validate RXPI_CFG1
	return true
}

proc update_PARAM_VALUE.TX_PI_BIASSET { PARAM_VALUE.TX_PI_BIASSET PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update TX_PI_BIASSET when any of the dependent parameters in the arguments change
	
	set TX_PI_BIASSET ${PARAM_VALUE.TX_PI_BIASSET}
	set XCVR_TYPE ${PARAM_VALUE.XCVR_TYPE}
	set values(XCVR_TYPE) [get_property value $XCVR_TYPE]
	set_property value [gen_USERPARAMETER_TX_PI_BIASSET_VALUE $values(XCVR_TYPE)] $TX_PI_BIASSET
}

proc validate_PARAM_VALUE.TX_PI_BIASSET { PARAM_VALUE.TX_PI_BIASSET } {
	# Procedure called to validate TX_PI_BIASSET
	return true
}

proc update_PARAM_VALUE.A_TXDIFFCTRL { PARAM_VALUE.A_TXDIFFCTRL } {
	# Procedure called to update A_TXDIFFCTRL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.A_TXDIFFCTRL { PARAM_VALUE.A_TXDIFFCTRL } {
	# Procedure called to validate A_TXDIFFCTRL
	return true
}

proc update_PARAM_VALUE.CPLL_CFG0 { PARAM_VALUE.CPLL_CFG0 } {
	# Procedure called to update CPLL_CFG0 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_CFG0 { PARAM_VALUE.CPLL_CFG0 } {
	# Procedure called to validate CPLL_CFG0
	return true
}

proc update_PARAM_VALUE.CPLL_CFG1 { PARAM_VALUE.CPLL_CFG1 } {
	# Procedure called to update CPLL_CFG1 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_CFG1 { PARAM_VALUE.CPLL_CFG1 } {
	# Procedure called to validate CPLL_CFG1
	return true
}

proc update_PARAM_VALUE.CPLL_CFG2 { PARAM_VALUE.CPLL_CFG2 } {
	# Procedure called to update CPLL_CFG2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_CFG2 { PARAM_VALUE.CPLL_CFG2 } {
	# Procedure called to validate CPLL_CFG2
	return true
}

proc update_PARAM_VALUE.CPLL_CFG3 { PARAM_VALUE.CPLL_CFG3 } {
	# Procedure called to update CPLL_CFG3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_CFG3 { PARAM_VALUE.CPLL_CFG3 } {
	# Procedure called to validate CPLL_CFG3
	return true
}

proc update_PARAM_VALUE.CPLL_FBDIV { PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to update CPLL_FBDIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_FBDIV { PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to validate CPLL_FBDIV
	return true
}

proc update_PARAM_VALUE.CPLL_FBDIV_4_5 { PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to update CPLL_FBDIV_4_5 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CPLL_FBDIV_4_5 { PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to validate CPLL_FBDIV_4_5
	return true
}

proc update_PARAM_VALUE.POR_CFG { PARAM_VALUE.POR_CFG } {
	# Procedure called to update POR_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.POR_CFG { PARAM_VALUE.POR_CFG } {
	# Procedure called to validate POR_CFG
	return true
}

proc update_PARAM_VALUE.PREIQ_FREQ_BST { PARAM_VALUE.PREIQ_FREQ_BST } {
	# Procedure called to update PREIQ_FREQ_BST when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.PREIQ_FREQ_BST { PARAM_VALUE.PREIQ_FREQ_BST } {
	# Procedure called to validate PREIQ_FREQ_BST
	return true
}

proc update_PARAM_VALUE.QPLL_CFG { PARAM_VALUE.QPLL_CFG } {
	# Procedure called to update QPLL_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG { PARAM_VALUE.QPLL_CFG } {
	# Procedure called to validate QPLL_CFG
	return true
}

proc update_PARAM_VALUE.QPLL_CFG0 { PARAM_VALUE.QPLL_CFG0 } {
	# Procedure called to update QPLL_CFG0 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG0 { PARAM_VALUE.QPLL_CFG0 } {
	# Procedure called to validate QPLL_CFG0
	return true
}

proc update_PARAM_VALUE.QPLL_CFG1 { PARAM_VALUE.QPLL_CFG1 } {
	# Procedure called to update QPLL_CFG1 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG1 { PARAM_VALUE.QPLL_CFG1 } {
	# Procedure called to validate QPLL_CFG1
	return true
}

proc update_PARAM_VALUE.QPLL_CFG1_G3 { PARAM_VALUE.QPLL_CFG1_G3 } {
	# Procedure called to update QPLL_CFG1_G3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG1_G3 { PARAM_VALUE.QPLL_CFG1_G3 } {
	# Procedure called to validate QPLL_CFG1_G3
	return true
}

proc update_PARAM_VALUE.QPLL_CFG2 { PARAM_VALUE.QPLL_CFG2 } {
	# Procedure called to update QPLL_CFG2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG2 { PARAM_VALUE.QPLL_CFG2 } {
	# Procedure called to validate QPLL_CFG2
	return true
}

proc update_PARAM_VALUE.QPLL_CFG2_G3 { PARAM_VALUE.QPLL_CFG2_G3 } {
	# Procedure called to update QPLL_CFG2_G3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG2_G3 { PARAM_VALUE.QPLL_CFG2_G3 } {
	# Procedure called to validate QPLL_CFG2_G3
	return true
}

proc update_PARAM_VALUE.QPLL_CFG3 { PARAM_VALUE.QPLL_CFG3 } {
	# Procedure called to update QPLL_CFG3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG3 { PARAM_VALUE.QPLL_CFG3 } {
	# Procedure called to validate QPLL_CFG3
	return true
}

proc update_PARAM_VALUE.QPLL_CFG4 { PARAM_VALUE.QPLL_CFG4 } {
	# Procedure called to update QPLL_CFG4 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CFG4 { PARAM_VALUE.QPLL_CFG4 } {
	# Procedure called to validate QPLL_CFG4
	return true
}

proc update_PARAM_VALUE.QPLL_CP { PARAM_VALUE.QPLL_CP } {
	# Procedure called to update QPLL_CP when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CP { PARAM_VALUE.QPLL_CP } {
	# Procedure called to validate QPLL_CP
	return true
}

proc update_PARAM_VALUE.QPLL_CP_G3 { PARAM_VALUE.QPLL_CP_G3 } {
	# Procedure called to update QPLL_CP_G3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_CP_G3 { PARAM_VALUE.QPLL_CP_G3 } {
	# Procedure called to validate QPLL_CP_G3
	return true
}

proc update_PARAM_VALUE.QPLL_FBDIV { PARAM_VALUE.QPLL_FBDIV } {
	# Procedure called to update QPLL_FBDIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_FBDIV { PARAM_VALUE.QPLL_FBDIV } {
	# Procedure called to validate QPLL_FBDIV
	return true
}

proc update_PARAM_VALUE.QPLL_FBDIV_RATIO { PARAM_VALUE.QPLL_FBDIV_RATIO } {
	# Procedure called to update QPLL_FBDIV_RATIO when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_FBDIV_RATIO { PARAM_VALUE.QPLL_FBDIV_RATIO } {
	# Procedure called to validate QPLL_FBDIV_RATIO
	return true
}

proc update_PARAM_VALUE.QPLL_REFCLK_DIV { PARAM_VALUE.QPLL_REFCLK_DIV } {
	# Procedure called to update QPLL_REFCLK_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.QPLL_REFCLK_DIV { PARAM_VALUE.QPLL_REFCLK_DIV } {
	# Procedure called to validate QPLL_REFCLK_DIV
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG0 { PARAM_VALUE.RXCDR_CFG0 } {
	# Procedure called to update RXCDR_CFG0 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG0 { PARAM_VALUE.RXCDR_CFG0 } {
	# Procedure called to validate RXCDR_CFG0
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG2 { PARAM_VALUE.RXCDR_CFG2 } {
	# Procedure called to update RXCDR_CFG2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG2 { PARAM_VALUE.RXCDR_CFG2 } {
	# Procedure called to validate RXCDR_CFG2
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG2_GEN2 { PARAM_VALUE.RXCDR_CFG2_GEN2 } {
	# Procedure called to update RXCDR_CFG2_GEN2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG2_GEN2 { PARAM_VALUE.RXCDR_CFG2_GEN2 } {
	# Procedure called to validate RXCDR_CFG2_GEN2
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG2_GEN4 { PARAM_VALUE.RXCDR_CFG2_GEN4 } {
	# Procedure called to update RXCDR_CFG2_GEN4 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG2_GEN4 { PARAM_VALUE.RXCDR_CFG2_GEN4 } {
	# Procedure called to validate RXCDR_CFG2_GEN4
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG3 { PARAM_VALUE.RXCDR_CFG3 } {
	# Procedure called to update RXCDR_CFG3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG3 { PARAM_VALUE.RXCDR_CFG3 } {
	# Procedure called to validate RXCDR_CFG3
	return true
}

proc update_PARAM_VALUE.RXCDR_CFG3_GEN3 { PARAM_VALUE.RXCDR_CFG3_GEN3 } {
	# Procedure called to update RXCDR_CFG3_GEN3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RXCDR_CFG3_GEN3 { PARAM_VALUE.RXCDR_CFG3_GEN3 } {
	# Procedure called to validate RXCDR_CFG3_GEN3
	return true
}

proc update_PARAM_VALUE.RX_CDR_CFG { PARAM_VALUE.RX_CDR_CFG } {
	# Procedure called to update RX_CDR_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_CDR_CFG { PARAM_VALUE.RX_CDR_CFG } {
	# Procedure called to validate RX_CDR_CFG
	return true
}

proc update_PARAM_VALUE.RX_CLK25_DIV { PARAM_VALUE.RX_CLK25_DIV } {
	# Procedure called to update RX_CLK25_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_CLK25_DIV { PARAM_VALUE.RX_CLK25_DIV } {
	# Procedure called to validate RX_CLK25_DIV
	return true
}

proc update_PARAM_VALUE.RX_DFE_LPM_CFG { PARAM_VALUE.RX_DFE_LPM_CFG } {
	# Procedure called to update RX_DFE_LPM_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_DFE_LPM_CFG { PARAM_VALUE.RX_DFE_LPM_CFG } {
	# Procedure called to validate RX_DFE_LPM_CFG
	return true
}

proc update_PARAM_VALUE.RX_LANE_INVERT { PARAM_VALUE.RX_LANE_INVERT } {
	# Procedure called to update RX_LANE_INVERT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_LANE_INVERT { PARAM_VALUE.RX_LANE_INVERT } {
	# Procedure called to validate RX_LANE_INVERT
	return true
}

proc update_PARAM_VALUE.RX_NUM_OF_LANES { PARAM_VALUE.RX_NUM_OF_LANES } {
	# Procedure called to update RX_NUM_OF_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_NUM_OF_LANES { PARAM_VALUE.RX_NUM_OF_LANES } {
	# Procedure called to validate RX_NUM_OF_LANES
	return true
}

proc update_PARAM_VALUE.RX_OUT_DIV { PARAM_VALUE.RX_OUT_DIV } {
	# Procedure called to update RX_OUT_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_OUT_DIV { PARAM_VALUE.RX_OUT_DIV } {
	# Procedure called to validate RX_OUT_DIV
	return true
}

proc update_PARAM_VALUE.RX_PMA_CFG { PARAM_VALUE.RX_PMA_CFG } {
	# Procedure called to update RX_PMA_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_PMA_CFG { PARAM_VALUE.RX_PMA_CFG } {
	# Procedure called to validate RX_PMA_CFG
	return true
}

proc update_PARAM_VALUE.RX_WIDEMODE_CDR { PARAM_VALUE.RX_WIDEMODE_CDR } {
	# Procedure called to update RX_WIDEMODE_CDR when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_WIDEMODE_CDR { PARAM_VALUE.RX_WIDEMODE_CDR } {
	# Procedure called to validate RX_WIDEMODE_CDR
	return true
}

proc update_PARAM_VALUE.RX_XMODE_SEL { PARAM_VALUE.RX_XMODE_SEL } {
	# Procedure called to update RX_XMODE_SEL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.RX_XMODE_SEL { PARAM_VALUE.RX_XMODE_SEL } {
	# Procedure called to validate RX_XMODE_SEL
	return true
}

proc update_PARAM_VALUE.TXDRV_FREQBAND { PARAM_VALUE.TXDRV_FREQBAND } {
	# Procedure called to update TXDRV_FREQBAND when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXDRV_FREQBAND { PARAM_VALUE.TXDRV_FREQBAND } {
	# Procedure called to validate TXDRV_FREQBAND
	return true
}

proc update_PARAM_VALUE.TXFE_CFG1 { PARAM_VALUE.TXFE_CFG1 } {
	# Procedure called to update TXFE_CFG1 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXFE_CFG1 { PARAM_VALUE.TXFE_CFG1 } {
	# Procedure called to validate TXFE_CFG1
	return true
}

proc update_PARAM_VALUE.TXFE_CFG2 { PARAM_VALUE.TXFE_CFG2 } {
	# Procedure called to update TXFE_CFG2 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXFE_CFG2 { PARAM_VALUE.TXFE_CFG2 } {
	# Procedure called to validate TXFE_CFG2
	return true
}

proc update_PARAM_VALUE.TXFE_CFG3 { PARAM_VALUE.TXFE_CFG3 } {
	# Procedure called to update TXFE_CFG3 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXFE_CFG3 { PARAM_VALUE.TXFE_CFG3 } {
	# Procedure called to validate TXFE_CFG3
	return true
}

proc update_PARAM_VALUE.TXPI_CFG { PARAM_VALUE.TXPI_CFG } {
	# Procedure called to update TXPI_CFG when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXPI_CFG { PARAM_VALUE.TXPI_CFG } {
	# Procedure called to validate TXPI_CFG
	return true
}

proc update_PARAM_VALUE.TXPI_CFG0 { PARAM_VALUE.TXPI_CFG0 } {
	# Procedure called to update TXPI_CFG0 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXPI_CFG0 { PARAM_VALUE.TXPI_CFG0 } {
	# Procedure called to validate TXPI_CFG0
	return true
}

proc update_PARAM_VALUE.TXPI_CFG1 { PARAM_VALUE.TXPI_CFG1 } {
	# Procedure called to update TXPI_CFG1 when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TXPI_CFG1 { PARAM_VALUE.TXPI_CFG1 } {
	# Procedure called to validate TXPI_CFG1
	return true
}

proc update_PARAM_VALUE.TX_CLK25_DIV { PARAM_VALUE.TX_CLK25_DIV } {
	# Procedure called to update TX_CLK25_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_CLK25_DIV { PARAM_VALUE.TX_CLK25_DIV } {
	# Procedure called to validate TX_CLK25_DIV
	return true
}

proc update_PARAM_VALUE.TX_LANE_INVERT { PARAM_VALUE.TX_LANE_INVERT } {
	# Procedure called to update TX_LANE_INVERT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_LANE_INVERT { PARAM_VALUE.TX_LANE_INVERT } {
	# Procedure called to validate TX_LANE_INVERT
	return true
}

proc update_PARAM_VALUE.TX_NUM_OF_LANES { PARAM_VALUE.TX_NUM_OF_LANES } {
	# Procedure called to update TX_NUM_OF_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_NUM_OF_LANES { PARAM_VALUE.TX_NUM_OF_LANES } {
	# Procedure called to validate TX_NUM_OF_LANES
	return true
}

proc update_PARAM_VALUE.TX_OUT_DIV { PARAM_VALUE.TX_OUT_DIV } {
	# Procedure called to update TX_OUT_DIV when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TX_OUT_DIV { PARAM_VALUE.TX_OUT_DIV } {
	# Procedure called to validate TX_OUT_DIV
	return true
}

proc update_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to update XCVR_TYPE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.XCVR_TYPE { PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to validate XCVR_TYPE
	return true
}


proc update_MODELPARAM_VALUE.XCVR_TYPE { MODELPARAM_VALUE.XCVR_TYPE PARAM_VALUE.XCVR_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.XCVR_TYPE}] ${MODELPARAM_VALUE.XCVR_TYPE}
}

proc update_MODELPARAM_VALUE.QPLL_REFCLK_DIV { MODELPARAM_VALUE.QPLL_REFCLK_DIV PARAM_VALUE.QPLL_REFCLK_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_REFCLK_DIV}] ${MODELPARAM_VALUE.QPLL_REFCLK_DIV}
}

proc update_MODELPARAM_VALUE.QPLL_FBDIV_RATIO { MODELPARAM_VALUE.QPLL_FBDIV_RATIO PARAM_VALUE.QPLL_FBDIV_RATIO } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_FBDIV_RATIO}] ${MODELPARAM_VALUE.QPLL_FBDIV_RATIO}
}

proc update_MODELPARAM_VALUE.POR_CFG { MODELPARAM_VALUE.POR_CFG PARAM_VALUE.POR_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.POR_CFG}] ${MODELPARAM_VALUE.POR_CFG}
}

proc update_MODELPARAM_VALUE.PPF0_CFG { MODELPARAM_VALUE.PPF0_CFG PARAM_VALUE.PPF0_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PPF0_CFG}] ${MODELPARAM_VALUE.PPF0_CFG}
}

proc update_MODELPARAM_VALUE.QPLL_CFG { MODELPARAM_VALUE.QPLL_CFG PARAM_VALUE.QPLL_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG}] ${MODELPARAM_VALUE.QPLL_CFG}
}

proc update_MODELPARAM_VALUE.QPLL_FBDIV { MODELPARAM_VALUE.QPLL_FBDIV PARAM_VALUE.QPLL_FBDIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_FBDIV}] ${MODELPARAM_VALUE.QPLL_FBDIV}
}

proc update_MODELPARAM_VALUE.QPLL_CFG0 { MODELPARAM_VALUE.QPLL_CFG0 PARAM_VALUE.QPLL_CFG0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG0}] ${MODELPARAM_VALUE.QPLL_CFG0}
}

proc update_MODELPARAM_VALUE.QPLL_CFG1 { MODELPARAM_VALUE.QPLL_CFG1 PARAM_VALUE.QPLL_CFG1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG1}] ${MODELPARAM_VALUE.QPLL_CFG1}
}

proc update_MODELPARAM_VALUE.QPLL_CFG1_G3 { MODELPARAM_VALUE.QPLL_CFG1_G3 PARAM_VALUE.QPLL_CFG1_G3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG1_G3}] ${MODELPARAM_VALUE.QPLL_CFG1_G3}
}

proc update_MODELPARAM_VALUE.QPLL_CFG2 { MODELPARAM_VALUE.QPLL_CFG2 PARAM_VALUE.QPLL_CFG2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG2}] ${MODELPARAM_VALUE.QPLL_CFG2}
}

proc update_MODELPARAM_VALUE.QPLL_CFG2_G3 { MODELPARAM_VALUE.QPLL_CFG2_G3 PARAM_VALUE.QPLL_CFG2_G3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG2_G3}] ${MODELPARAM_VALUE.QPLL_CFG2_G3}
}

proc update_MODELPARAM_VALUE.QPLL_CFG3 { MODELPARAM_VALUE.QPLL_CFG3 PARAM_VALUE.QPLL_CFG3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG3}] ${MODELPARAM_VALUE.QPLL_CFG3}
}

proc update_MODELPARAM_VALUE.QPLL_CFG4 { MODELPARAM_VALUE.QPLL_CFG4 PARAM_VALUE.QPLL_CFG4 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CFG4}] ${MODELPARAM_VALUE.QPLL_CFG4}
}

proc update_MODELPARAM_VALUE.QPLL_CP_G3 { MODELPARAM_VALUE.QPLL_CP_G3 PARAM_VALUE.QPLL_CP_G3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CP_G3}] ${MODELPARAM_VALUE.QPLL_CP_G3}
}

proc update_MODELPARAM_VALUE.QPLL_LPF { MODELPARAM_VALUE.QPLL_LPF PARAM_VALUE.QPLL_LPF } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_LPF}] ${MODELPARAM_VALUE.QPLL_LPF}
}

proc update_MODELPARAM_VALUE.QPLL_CP { MODELPARAM_VALUE.QPLL_CP PARAM_VALUE.QPLL_CP } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.QPLL_CP}] ${MODELPARAM_VALUE.QPLL_CP}
}

proc update_MODELPARAM_VALUE.CPLL_FBDIV { MODELPARAM_VALUE.CPLL_FBDIV PARAM_VALUE.CPLL_FBDIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_FBDIV}] ${MODELPARAM_VALUE.CPLL_FBDIV}
}

proc update_MODELPARAM_VALUE.CPLL_FBDIV_4_5 { MODELPARAM_VALUE.CPLL_FBDIV_4_5 PARAM_VALUE.CPLL_FBDIV_4_5 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_FBDIV_4_5}] ${MODELPARAM_VALUE.CPLL_FBDIV_4_5}
}

proc update_MODELPARAM_VALUE.CPLL_CFG0 { MODELPARAM_VALUE.CPLL_CFG0 PARAM_VALUE.CPLL_CFG0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_CFG0}] ${MODELPARAM_VALUE.CPLL_CFG0}
}

proc update_MODELPARAM_VALUE.CPLL_CFG1 { MODELPARAM_VALUE.CPLL_CFG1 PARAM_VALUE.CPLL_CFG1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_CFG1}] ${MODELPARAM_VALUE.CPLL_CFG1}
}

proc update_MODELPARAM_VALUE.CPLL_CFG2 { MODELPARAM_VALUE.CPLL_CFG2 PARAM_VALUE.CPLL_CFG2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_CFG2}] ${MODELPARAM_VALUE.CPLL_CFG2}
}

proc update_MODELPARAM_VALUE.CPLL_CFG3 { MODELPARAM_VALUE.CPLL_CFG3 PARAM_VALUE.CPLL_CFG3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CPLL_CFG3}] ${MODELPARAM_VALUE.CPLL_CFG3}
}

proc update_MODELPARAM_VALUE.CH_HSPMUX { MODELPARAM_VALUE.CH_HSPMUX PARAM_VALUE.CH_HSPMUX } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CH_HSPMUX}] ${MODELPARAM_VALUE.CH_HSPMUX}
}

proc update_MODELPARAM_VALUE.PREIQ_FREQ_BST { MODELPARAM_VALUE.PREIQ_FREQ_BST PARAM_VALUE.PREIQ_FREQ_BST } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.PREIQ_FREQ_BST}] ${MODELPARAM_VALUE.PREIQ_FREQ_BST}
}

proc update_MODELPARAM_VALUE.RXPI_CFG0 { MODELPARAM_VALUE.RXPI_CFG0 PARAM_VALUE.RXPI_CFG0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXPI_CFG0}] ${MODELPARAM_VALUE.RXPI_CFG0}
}

proc update_MODELPARAM_VALUE.RXPI_CFG1 { MODELPARAM_VALUE.RXPI_CFG1 PARAM_VALUE.RXPI_CFG1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXPI_CFG1}] ${MODELPARAM_VALUE.RXPI_CFG1}
}

proc update_MODELPARAM_VALUE.RTX_BUF_CML_CTRL { MODELPARAM_VALUE.RTX_BUF_CML_CTRL PARAM_VALUE.RTX_BUF_CML_CTRL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RTX_BUF_CML_CTRL}] ${MODELPARAM_VALUE.RTX_BUF_CML_CTRL}
}

proc update_MODELPARAM_VALUE.TX_NUM_OF_LANES { MODELPARAM_VALUE.TX_NUM_OF_LANES PARAM_VALUE.TX_NUM_OF_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_NUM_OF_LANES}] ${MODELPARAM_VALUE.TX_NUM_OF_LANES}
}

proc update_MODELPARAM_VALUE.TX_OUT_DIV { MODELPARAM_VALUE.TX_OUT_DIV PARAM_VALUE.TX_OUT_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_OUT_DIV}] ${MODELPARAM_VALUE.TX_OUT_DIV}
}

proc update_MODELPARAM_VALUE.TX_CLK25_DIV { MODELPARAM_VALUE.TX_CLK25_DIV PARAM_VALUE.TX_CLK25_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_CLK25_DIV}] ${MODELPARAM_VALUE.TX_CLK25_DIV}
}

proc update_MODELPARAM_VALUE.TX_LANE_INVERT { MODELPARAM_VALUE.TX_LANE_INVERT PARAM_VALUE.TX_LANE_INVERT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_LANE_INVERT}] ${MODELPARAM_VALUE.TX_LANE_INVERT}
}

proc update_MODELPARAM_VALUE.TX_PI_BIASSET { MODELPARAM_VALUE.TX_PI_BIASSET PARAM_VALUE.TX_PI_BIASSET } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TX_PI_BIASSET}] ${MODELPARAM_VALUE.TX_PI_BIASSET}
}

proc update_MODELPARAM_VALUE.TXPI_CFG { MODELPARAM_VALUE.TXPI_CFG PARAM_VALUE.TXPI_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXPI_CFG}] ${MODELPARAM_VALUE.TXPI_CFG}
}

proc update_MODELPARAM_VALUE.A_TXDIFFCTRL { MODELPARAM_VALUE.A_TXDIFFCTRL PARAM_VALUE.A_TXDIFFCTRL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.A_TXDIFFCTRL}] ${MODELPARAM_VALUE.A_TXDIFFCTRL}
}

proc update_MODELPARAM_VALUE.RX_NUM_OF_LANES { MODELPARAM_VALUE.RX_NUM_OF_LANES PARAM_VALUE.RX_NUM_OF_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_NUM_OF_LANES}] ${MODELPARAM_VALUE.RX_NUM_OF_LANES}
}

proc update_MODELPARAM_VALUE.RX_OUT_DIV { MODELPARAM_VALUE.RX_OUT_DIV PARAM_VALUE.RX_OUT_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_OUT_DIV}] ${MODELPARAM_VALUE.RX_OUT_DIV}
}

proc update_MODELPARAM_VALUE.RX_CLK25_DIV { MODELPARAM_VALUE.RX_CLK25_DIV PARAM_VALUE.RX_CLK25_DIV } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_CLK25_DIV}] ${MODELPARAM_VALUE.RX_CLK25_DIV}
}

proc update_MODELPARAM_VALUE.RX_DFE_LPM_CFG { MODELPARAM_VALUE.RX_DFE_LPM_CFG PARAM_VALUE.RX_DFE_LPM_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_DFE_LPM_CFG}] ${MODELPARAM_VALUE.RX_DFE_LPM_CFG}
}

proc update_MODELPARAM_VALUE.RX_PMA_CFG { MODELPARAM_VALUE.RX_PMA_CFG PARAM_VALUE.RX_PMA_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_PMA_CFG}] ${MODELPARAM_VALUE.RX_PMA_CFG}
}

proc update_MODELPARAM_VALUE.RX_CDR_CFG { MODELPARAM_VALUE.RX_CDR_CFG PARAM_VALUE.RX_CDR_CFG } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_CDR_CFG}] ${MODELPARAM_VALUE.RX_CDR_CFG}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG0 { MODELPARAM_VALUE.RXCDR_CFG0 PARAM_VALUE.RXCDR_CFG0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG0}] ${MODELPARAM_VALUE.RXCDR_CFG0}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG2 { MODELPARAM_VALUE.RXCDR_CFG2 PARAM_VALUE.RXCDR_CFG2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG2}] ${MODELPARAM_VALUE.RXCDR_CFG2}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG2_GEN2 { MODELPARAM_VALUE.RXCDR_CFG2_GEN2 PARAM_VALUE.RXCDR_CFG2_GEN2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG2_GEN2}] ${MODELPARAM_VALUE.RXCDR_CFG2_GEN2}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG2_GEN4 { MODELPARAM_VALUE.RXCDR_CFG2_GEN4 PARAM_VALUE.RXCDR_CFG2_GEN4 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG2_GEN4}] ${MODELPARAM_VALUE.RXCDR_CFG2_GEN4}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG3 { MODELPARAM_VALUE.RXCDR_CFG3 PARAM_VALUE.RXCDR_CFG3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG3}] ${MODELPARAM_VALUE.RXCDR_CFG3}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG3_GEN2 { MODELPARAM_VALUE.RXCDR_CFG3_GEN2 PARAM_VALUE.RXCDR_CFG3_GEN2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG3_GEN2}] ${MODELPARAM_VALUE.RXCDR_CFG3_GEN2}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG3_GEN3 { MODELPARAM_VALUE.RXCDR_CFG3_GEN3 PARAM_VALUE.RXCDR_CFG3_GEN3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG3_GEN3}] ${MODELPARAM_VALUE.RXCDR_CFG3_GEN3}
}

proc update_MODELPARAM_VALUE.RXCDR_CFG3_GEN4 { MODELPARAM_VALUE.RXCDR_CFG3_GEN4 PARAM_VALUE.RXCDR_CFG3_GEN4 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RXCDR_CFG3_GEN4}] ${MODELPARAM_VALUE.RXCDR_CFG3_GEN4}
}

proc update_MODELPARAM_VALUE.RX_WIDEMODE_CDR { MODELPARAM_VALUE.RX_WIDEMODE_CDR PARAM_VALUE.RX_WIDEMODE_CDR } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_WIDEMODE_CDR}] ${MODELPARAM_VALUE.RX_WIDEMODE_CDR}
}

proc update_MODELPARAM_VALUE.RX_XMODE_SEL { MODELPARAM_VALUE.RX_XMODE_SEL PARAM_VALUE.RX_XMODE_SEL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_XMODE_SEL}] ${MODELPARAM_VALUE.RX_XMODE_SEL}
}

proc update_MODELPARAM_VALUE.TXDRV_FREQBAND { MODELPARAM_VALUE.TXDRV_FREQBAND PARAM_VALUE.TXDRV_FREQBAND } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXDRV_FREQBAND}] ${MODELPARAM_VALUE.TXDRV_FREQBAND}
}

proc update_MODELPARAM_VALUE.TXFE_CFG1 { MODELPARAM_VALUE.TXFE_CFG1 PARAM_VALUE.TXFE_CFG1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXFE_CFG1}] ${MODELPARAM_VALUE.TXFE_CFG1}
}

proc update_MODELPARAM_VALUE.TXFE_CFG2 { MODELPARAM_VALUE.TXFE_CFG2 PARAM_VALUE.TXFE_CFG2 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXFE_CFG2}] ${MODELPARAM_VALUE.TXFE_CFG2}
}

proc update_MODELPARAM_VALUE.TXFE_CFG3 { MODELPARAM_VALUE.TXFE_CFG3 PARAM_VALUE.TXFE_CFG3 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXFE_CFG3}] ${MODELPARAM_VALUE.TXFE_CFG3}
}

proc update_MODELPARAM_VALUE.TXPI_CFG0 { MODELPARAM_VALUE.TXPI_CFG0 PARAM_VALUE.TXPI_CFG0 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXPI_CFG0}] ${MODELPARAM_VALUE.TXPI_CFG0}
}

proc update_MODELPARAM_VALUE.TXPI_CFG1 { MODELPARAM_VALUE.TXPI_CFG1 PARAM_VALUE.TXPI_CFG1 } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TXPI_CFG1}] ${MODELPARAM_VALUE.TXPI_CFG1}
}

proc update_MODELPARAM_VALUE.RX_LANE_INVERT { MODELPARAM_VALUE.RX_LANE_INVERT PARAM_VALUE.RX_LANE_INVERT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.RX_LANE_INVERT}] ${MODELPARAM_VALUE.RX_LANE_INVERT}
}

