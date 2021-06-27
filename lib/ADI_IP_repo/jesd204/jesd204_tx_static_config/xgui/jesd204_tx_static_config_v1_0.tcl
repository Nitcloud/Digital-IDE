# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Page_0 [ipgui::add_page $IPINST -name "Page 0"]
  ipgui::add_param $IPINST -name "FRAMES_PER_MULTIFRAME" -parent ${Page_0}
  ipgui::add_param $IPINST -name "HIGH_DENSITY" -parent ${Page_0}
  ipgui::add_param $IPINST -name "LINK_MODE" -parent ${Page_0}
  ipgui::add_param $IPINST -name "N" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NP" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_CONVERTERS" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_LANES" -parent ${Page_0}
  ipgui::add_param $IPINST -name "NUM_LINKS" -parent ${Page_0}
  ipgui::add_param $IPINST -name "OCTETS_PER_FRAME" -parent ${Page_0}
  ipgui::add_param $IPINST -name "SCR" -parent ${Page_0}


}

proc update_PARAM_VALUE.FRAMES_PER_MULTIFRAME { PARAM_VALUE.FRAMES_PER_MULTIFRAME } {
	# Procedure called to update FRAMES_PER_MULTIFRAME when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.FRAMES_PER_MULTIFRAME { PARAM_VALUE.FRAMES_PER_MULTIFRAME } {
	# Procedure called to validate FRAMES_PER_MULTIFRAME
	return true
}

proc update_PARAM_VALUE.HIGH_DENSITY { PARAM_VALUE.HIGH_DENSITY } {
	# Procedure called to update HIGH_DENSITY when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.HIGH_DENSITY { PARAM_VALUE.HIGH_DENSITY } {
	# Procedure called to validate HIGH_DENSITY
	return true
}

proc update_PARAM_VALUE.LINK_MODE { PARAM_VALUE.LINK_MODE } {
	# Procedure called to update LINK_MODE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.LINK_MODE { PARAM_VALUE.LINK_MODE } {
	# Procedure called to validate LINK_MODE
	return true
}

proc update_PARAM_VALUE.N { PARAM_VALUE.N } {
	# Procedure called to update N when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.N { PARAM_VALUE.N } {
	# Procedure called to validate N
	return true
}

proc update_PARAM_VALUE.NP { PARAM_VALUE.NP } {
	# Procedure called to update NP when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NP { PARAM_VALUE.NP } {
	# Procedure called to validate NP
	return true
}

proc update_PARAM_VALUE.NUM_CONVERTERS { PARAM_VALUE.NUM_CONVERTERS } {
	# Procedure called to update NUM_CONVERTERS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_CONVERTERS { PARAM_VALUE.NUM_CONVERTERS } {
	# Procedure called to validate NUM_CONVERTERS
	return true
}

proc update_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to update NUM_LANES when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_LANES { PARAM_VALUE.NUM_LANES } {
	# Procedure called to validate NUM_LANES
	return true
}

proc update_PARAM_VALUE.NUM_LINKS { PARAM_VALUE.NUM_LINKS } {
	# Procedure called to update NUM_LINKS when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_LINKS { PARAM_VALUE.NUM_LINKS } {
	# Procedure called to validate NUM_LINKS
	return true
}

proc update_PARAM_VALUE.OCTETS_PER_FRAME { PARAM_VALUE.OCTETS_PER_FRAME } {
	# Procedure called to update OCTETS_PER_FRAME when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.OCTETS_PER_FRAME { PARAM_VALUE.OCTETS_PER_FRAME } {
	# Procedure called to validate OCTETS_PER_FRAME
	return true
}

proc update_PARAM_VALUE.SCR { PARAM_VALUE.SCR } {
	# Procedure called to update SCR when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.SCR { PARAM_VALUE.SCR } {
	# Procedure called to validate SCR
	return true
}


proc update_MODELPARAM_VALUE.NUM_LANES { MODELPARAM_VALUE.NUM_LANES PARAM_VALUE.NUM_LANES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_LANES}] ${MODELPARAM_VALUE.NUM_LANES}
}

proc update_MODELPARAM_VALUE.NUM_LINKS { MODELPARAM_VALUE.NUM_LINKS PARAM_VALUE.NUM_LINKS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_LINKS}] ${MODELPARAM_VALUE.NUM_LINKS}
}

proc update_MODELPARAM_VALUE.OCTETS_PER_FRAME { MODELPARAM_VALUE.OCTETS_PER_FRAME PARAM_VALUE.OCTETS_PER_FRAME } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.OCTETS_PER_FRAME}] ${MODELPARAM_VALUE.OCTETS_PER_FRAME}
}

proc update_MODELPARAM_VALUE.FRAMES_PER_MULTIFRAME { MODELPARAM_VALUE.FRAMES_PER_MULTIFRAME PARAM_VALUE.FRAMES_PER_MULTIFRAME } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.FRAMES_PER_MULTIFRAME}] ${MODELPARAM_VALUE.FRAMES_PER_MULTIFRAME}
}

proc update_MODELPARAM_VALUE.NUM_CONVERTERS { MODELPARAM_VALUE.NUM_CONVERTERS PARAM_VALUE.NUM_CONVERTERS } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_CONVERTERS}] ${MODELPARAM_VALUE.NUM_CONVERTERS}
}

proc update_MODELPARAM_VALUE.N { MODELPARAM_VALUE.N PARAM_VALUE.N } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.N}] ${MODELPARAM_VALUE.N}
}

proc update_MODELPARAM_VALUE.NP { MODELPARAM_VALUE.NP PARAM_VALUE.NP } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NP}] ${MODELPARAM_VALUE.NP}
}

proc update_MODELPARAM_VALUE.HIGH_DENSITY { MODELPARAM_VALUE.HIGH_DENSITY PARAM_VALUE.HIGH_DENSITY } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.HIGH_DENSITY}] ${MODELPARAM_VALUE.HIGH_DENSITY}
}

proc update_MODELPARAM_VALUE.SCR { MODELPARAM_VALUE.SCR PARAM_VALUE.SCR } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.SCR}] ${MODELPARAM_VALUE.SCR}
}

proc update_MODELPARAM_VALUE.LINK_MODE { MODELPARAM_VALUE.LINK_MODE PARAM_VALUE.LINK_MODE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.LINK_MODE}] ${MODELPARAM_VALUE.LINK_MODE}
}

