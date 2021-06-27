
# Loading additional proc with user specified bodies to compute parameter values.
source [file join [file dirname [file dirname [info script]]] gui/ad_ip_jesd204_tpl_dac_v1_0.gtcl]

# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "ID" -parent ${General_Configuration}

  #Adding Group
  set JESD204_Framer_Configuration [ipgui::add_group $IPINST -name "JESD204 Framer Configuration" -parent ${Page_0} -display_name {JESD204 Framer Cofiguration}]
  ipgui::add_param $IPINST -name "NUM_LANES" -parent ${JESD204_Framer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "NUM_CHANNELS" -parent ${JESD204_Framer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "BITS_PER_SAMPLE" -parent ${JESD204_Framer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "CONVERTER_RESOLUTION" -parent ${JESD204_Framer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "SAMPLES_PER_FRAME" -parent ${JESD204_Framer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "OCTETS_PER_BEAT" -parent ${JESD204_Framer_Configuration} -widget comboBox

  #Adding Group
  set Datapath_Configuration [ipgui::add_group $IPINST -name "Datapath Configuration" -parent ${Page_0} -display_name {Datapath Cofiguration}]
  ipgui::add_param $IPINST -name "DATAPATH_DISABLE" -parent ${Datapath_Configuration} -widget checkBox
  ipgui::add_param $IPINST -name "EXT_SYNC" -parent ${Datapath_Configuration} -widget checkBox
  ipgui::add_param $IPINST -name "IQCORRECTION_DISABLE" -parent ${Datapath_Configuration} -widget checkBox
  ipgui::add_param $IPINST -name "DDS_TYPE" -parent ${Datapath_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "DDS_CORDIC_DW" -parent ${Datapath_Configuration}
  ipgui::add_param $IPINST -name "DDS_CORDIC_PHASE_DW" -parent ${Datapath_Configuration}

  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



}

proc update_PARAM_VALUE.DDS_CORDIC_DW { PARAM_VALUE.DDS_CORDIC_DW PARAM_VALUE.DATAPATH_DISABLE PARAM_VALUE.DDS_TYPE } {
	# Procedure called to update DDS_CORDIC_DW when any of the dependent parameters in the arguments change
	
	set DDS_CORDIC_DW ${PARAM_VALUE.DDS_CORDIC_DW}
	set DATAPATH_DISABLE ${PARAM_VALUE.DATAPATH_DISABLE}
	set DDS_TYPE ${PARAM_VALUE.DDS_TYPE}
	set values(DATAPATH_DISABLE) [get_property value $DATAPATH_DISABLE]
	set values(DDS_TYPE) [get_property value $DDS_TYPE]
	if { [gen_USERPARAMETER_DDS_CORDIC_DW_ENABLEMENT $values(DATAPATH_DISABLE) $values(DDS_TYPE)] } {
		set_property enabled true $DDS_CORDIC_DW
	} else {
		set_property enabled false $DDS_CORDIC_DW
	}
}

proc validate_PARAM_VALUE.DDS_CORDIC_DW { PARAM_VALUE.DDS_CORDIC_DW } {
	# Procedure called to validate DDS_CORDIC_DW
	return true
}

proc update_PARAM_VALUE.DDS_CORDIC_PHASE_DW { PARAM_VALUE.DDS_CORDIC_PHASE_DW PARAM_VALUE.DATAPATH_DISABLE PARAM_VALUE.DDS_TYPE } {
	# Procedure called to update DDS_CORDIC_PHASE_DW when any of the dependent parameters in the arguments change
	
	set DDS_CORDIC_PHASE_DW ${PARAM_VALUE.DDS_CORDIC_PHASE_DW}
	set DATAPATH_DISABLE ${PARAM_VALUE.DATAPATH_DISABLE}
	set DDS_TYPE ${PARAM_VALUE.DDS_TYPE}
	set values(DATAPATH_DISABLE) [get_property value $DATAPATH_DISABLE]
	set values(DDS_TYPE) [get_property value $DDS_TYPE]
	if { [gen_USERPARAMETER_DDS_CORDIC_PHASE_DW_ENABLEMENT $values(DATAPATH_DISABLE) $values(DDS_TYPE)] } {
		set_property enabled true $DDS_CORDIC_PHASE_DW
	} else {
		set_property enabled false $DDS_CORDIC_PHASE_DW
	}
}

proc validate_PARAM_VALUE.DDS_CORDIC_PHASE_DW { PARAM_VALUE.DDS_CORDIC_PHASE_DW } {
	# Procedure called to validate DDS_CORDIC_PHASE_DW
	return true
}

proc update_PARAM_VALUE.DDS_TYPE { PARAM_VALUE.DDS_TYPE PARAM_VALUE.DATAPATH_DISABLE } {
	# Procedure called to update DDS_TYPE when any of the dependent parameters in the arguments change
	
	set DDS_TYPE ${PARAM_VALUE.DDS_TYPE}
	set DATAPATH_DISABLE ${PARAM_VALUE.DATAPATH_DISABLE}
	set values(DATAPATH_DISABLE) [get_property value $DATAPATH_DISABLE]
	if { [gen_USERPARAMETER_DDS_TYPE_ENABLEMENT $values(DATAPATH_DISABLE)] } {
		set_property enabled true $DDS_TYPE
	} else {
		set_property enabled false $DDS_TYPE
	}
}

proc validate_PARAM_VALUE.DDS_TYPE { PARAM_VALUE.DDS_TYPE } {
	# Procedure called to validate DDS_TYPE
	return true
}

proc update_PARAM_VALUE.BITS_PER_SAMPLE { PARAM_VALUE.BITS_PER_SAMPLE } {
	# Procedure called to update BITS_PER_SAMPLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BITS_PER_SAMPLE { PARAM_VALUE.BITS_PER_SAMPLE } {
	# Procedure called to validate BITS_PER_SAMPLE
	return true
}

proc update_PARAM_VALUE.CONVERTER_RESOLUTION { PARAM_VALUE.CONVERTER_RESOLUTION } {
	# Procedure called to update CONVERTER_RESOLUTION when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.CONVERTER_RESOLUTION { PARAM_VALUE.CONVERTER_RESOLUTION } {
	# Procedure called to validate CONVERTER_RESOLUTION
	return true
}

proc update_PARAM_VALUE.DATAPATH_DISABLE { PARAM_VALUE.DATAPATH_DISABLE } {
	# Procedure called to update DATAPATH_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DATAPATH_DISABLE { PARAM_VALUE.DATAPATH_DISABLE } {
	# Procedure called to validate DATAPATH_DISABLE
	return true
}

proc update_PARAM_VALUE.DEV_PACKAGE { PARAM_VALUE.DEV_PACKAGE } {
	# Procedure called to update DEV_PACKAGE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEV_PACKAGE { PARAM_VALUE.DEV_PACKAGE } {
	# Procedure called to validate DEV_PACKAGE
	return true
}

proc update_PARAM_VALUE.EXT_SYNC { PARAM_VALUE.EXT_SYNC } {
	# Procedure called to update EXT_SYNC when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.EXT_SYNC { PARAM_VALUE.EXT_SYNC } {
	# Procedure called to validate EXT_SYNC
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

proc update_PARAM_VALUE.IQCORRECTION_DISABLE { PARAM_VALUE.IQCORRECTION_DISABLE } {
	# Procedure called to update IQCORRECTION_DISABLE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.IQCORRECTION_DISABLE { PARAM_VALUE.IQCORRECTION_DISABLE } {
	# Procedure called to validate IQCORRECTION_DISABLE
	return true
}

proc update_PARAM_VALUE.NUM_CHANNELS { PARAM_VALUE.NUM_CHANNELS } {
	# Procedure called to update NUM_CHANNELS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_CHANNELS { PARAM_VALUE.NUM_CHANNELS } {
	# Procedure called to validate NUM_CHANNELS
	return true
}

proc update_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to update NUM_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to validate NUM_LANES
	return true
}

proc update_PARAM_VALUE.OCTETS_PER_BEAT { PARAM_VALUE.OCTETS_PER_BEAT } {
	# Procedure called to update OCTETS_PER_BEAT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.OCTETS_PER_BEAT { PARAM_VALUE.OCTETS_PER_BEAT } {
	# Procedure called to validate OCTETS_PER_BEAT
	return true
}

proc update_PARAM_VALUE.SAMPLES_PER_FRAME { PARAM_VALUE.SAMPLES_PER_FRAME } {
	# Procedure called to update SAMPLES_PER_FRAME when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SAMPLES_PER_FRAME { PARAM_VALUE.SAMPLES_PER_FRAME } {
	# Procedure called to validate SAMPLES_PER_FRAME
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

proc update_MODELPARAM_VALUE.NUM_LANES { MODELPARAM_VALUE.NUM_LANES PARAM_VALUE.NUM_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_LANES}] ${MODELPARAM_VALUE.NUM_LANES}
}

proc update_MODELPARAM_VALUE.NUM_CHANNELS { MODELPARAM_VALUE.NUM_CHANNELS PARAM_VALUE.NUM_CHANNELS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_CHANNELS}] ${MODELPARAM_VALUE.NUM_CHANNELS}
}

proc update_MODELPARAM_VALUE.SAMPLES_PER_FRAME { MODELPARAM_VALUE.SAMPLES_PER_FRAME PARAM_VALUE.SAMPLES_PER_FRAME } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SAMPLES_PER_FRAME}] ${MODELPARAM_VALUE.SAMPLES_PER_FRAME}
}

proc update_MODELPARAM_VALUE.CONVERTER_RESOLUTION { MODELPARAM_VALUE.CONVERTER_RESOLUTION PARAM_VALUE.CONVERTER_RESOLUTION } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.CONVERTER_RESOLUTION}] ${MODELPARAM_VALUE.CONVERTER_RESOLUTION}
}

proc update_MODELPARAM_VALUE.BITS_PER_SAMPLE { MODELPARAM_VALUE.BITS_PER_SAMPLE PARAM_VALUE.BITS_PER_SAMPLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BITS_PER_SAMPLE}] ${MODELPARAM_VALUE.BITS_PER_SAMPLE}
}

proc update_MODELPARAM_VALUE.OCTETS_PER_BEAT { MODELPARAM_VALUE.OCTETS_PER_BEAT PARAM_VALUE.OCTETS_PER_BEAT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OCTETS_PER_BEAT}] ${MODELPARAM_VALUE.OCTETS_PER_BEAT}
}

proc update_MODELPARAM_VALUE.DDS_TYPE { MODELPARAM_VALUE.DDS_TYPE PARAM_VALUE.DDS_TYPE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DDS_TYPE}] ${MODELPARAM_VALUE.DDS_TYPE}
}

proc update_MODELPARAM_VALUE.DDS_CORDIC_DW { MODELPARAM_VALUE.DDS_CORDIC_DW PARAM_VALUE.DDS_CORDIC_DW } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DDS_CORDIC_DW}] ${MODELPARAM_VALUE.DDS_CORDIC_DW}
}

proc update_MODELPARAM_VALUE.DDS_CORDIC_PHASE_DW { MODELPARAM_VALUE.DDS_CORDIC_PHASE_DW PARAM_VALUE.DDS_CORDIC_PHASE_DW } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DDS_CORDIC_PHASE_DW}] ${MODELPARAM_VALUE.DDS_CORDIC_PHASE_DW}
}

proc update_MODELPARAM_VALUE.DATAPATH_DISABLE { MODELPARAM_VALUE.DATAPATH_DISABLE PARAM_VALUE.DATAPATH_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DATAPATH_DISABLE}] ${MODELPARAM_VALUE.DATAPATH_DISABLE}
}

proc update_MODELPARAM_VALUE.IQCORRECTION_DISABLE { MODELPARAM_VALUE.IQCORRECTION_DISABLE PARAM_VALUE.IQCORRECTION_DISABLE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.IQCORRECTION_DISABLE}] ${MODELPARAM_VALUE.IQCORRECTION_DISABLE}
}

proc update_MODELPARAM_VALUE.EXT_SYNC { MODELPARAM_VALUE.EXT_SYNC PARAM_VALUE.EXT_SYNC } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.EXT_SYNC}] ${MODELPARAM_VALUE.EXT_SYNC}
}

