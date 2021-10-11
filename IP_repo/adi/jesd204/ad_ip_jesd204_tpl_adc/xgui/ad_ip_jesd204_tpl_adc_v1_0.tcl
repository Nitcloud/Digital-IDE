# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  #Adding Group
  set General_Configuration [ipgui::add_group $IPINST -name "General Configuration" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "ID" -parent ${General_Configuration}

  #Adding Group
  set JESD204_Deframer_Configuration [ipgui::add_group $IPINST -name "JESD204 Deframer Configuration" -parent ${Page_0} -display_name {JESD204 Deframer Cofiguration}]
  ipgui::add_param $IPINST -name "NUM_LANES" -parent ${JESD204_Deframer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "NUM_CHANNELS" -parent ${JESD204_Deframer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "BITS_PER_SAMPLE" -parent ${JESD204_Deframer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "CONVERTER_RESOLUTION" -parent ${JESD204_Deframer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "SAMPLES_PER_FRAME" -parent ${JESD204_Deframer_Configuration} -widget comboBox
  ipgui::add_param $IPINST -name "OCTETS_PER_BEAT" -parent ${JESD204_Deframer_Configuration} -widget comboBox

  #Adding Group
  set Datapath_Configuration [ipgui::add_group $IPINST -name "Datapath Configuration" -parent ${Page_0} -display_name {Datapath Cofiguration}]
  ipgui::add_param $IPINST -name "TWOS_COMPLEMENT" -parent ${Datapath_Configuration} -widget checkBox

  #Adding Group
  set FPGA_info [ipgui::add_group $IPINST -name "FPGA info" -parent ${Page_0}]
  ipgui::add_param $IPINST -name "FPGA_TECHNOLOGY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "FPGA_FAMILY" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "SPEED_GRADE" -parent ${FPGA_info} -widget comboBox
  ipgui::add_param $IPINST -name "DEV_PACKAGE" -parent ${FPGA_info} -widget comboBox



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

proc update_PARAM_VALUE.TWOS_COMPLEMENT { PARAM_VALUE.TWOS_COMPLEMENT } {
	# Procedure called to update TWOS_COMPLEMENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.TWOS_COMPLEMENT { PARAM_VALUE.TWOS_COMPLEMENT } {
	# Procedure called to validate TWOS_COMPLEMENT
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

proc update_MODELPARAM_VALUE.TWOS_COMPLEMENT { MODELPARAM_VALUE.TWOS_COMPLEMENT PARAM_VALUE.TWOS_COMPLEMENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TWOS_COMPLEMENT}] ${MODELPARAM_VALUE.TWOS_COMPLEMENT}
}

