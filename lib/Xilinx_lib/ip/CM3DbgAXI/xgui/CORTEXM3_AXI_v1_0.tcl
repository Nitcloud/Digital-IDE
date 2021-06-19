
# Loading additional proc with user specified bodies to compute parameter values.
source [file join [file dirname [file dirname [info script]]] gui/CORTEXM3_AXI_v1_0.gtcl]

# Definitional proc to organize widgets for parameters.
proc init_gui { IPINST } {
  ipgui::add_param $IPINST -name "Component_Name"
  #Adding Page
  set Configuration [ipgui::add_page $IPINST -name "Configuration"]
  set_property tooltip {Overall configuration} ${Configuration}
  set NUM_IRQ [ipgui::add_param $IPINST -name "NUM_IRQ" -parent ${Configuration}]
  set_property tooltip {Number of Interrupts.  Max 240} ${NUM_IRQ}
  set LVL_WIDTH [ipgui::add_param $IPINST -name "LVL_WIDTH" -parent ${Configuration}]
  set_property tooltip {Width of the vector which determines IRQ priority levels} ${LVL_WIDTH}
  set MPU_PRESENT [ipgui::add_param $IPINST -name "MPU_PRESENT" -parent ${Configuration}]
  set_property tooltip {Set whether the MPU is present} ${MPU_PRESENT}
  set WIC_PRESENT [ipgui::add_param $IPINST -name "WIC_PRESENT" -parent ${Configuration}]
  set_property tooltip {Wake up controller present} ${WIC_PRESENT}
  set WIC_LINES [ipgui::add_param $IPINST -name "WIC_LINES" -parent ${Configuration}]
  set_property tooltip {Number of internal IRQ control lines for WIC controller} ${WIC_LINES}
  set BB_PRESENT [ipgui::add_param $IPINST -name "BB_PRESENT" -parent ${Configuration}]
  set_property tooltip {Enable bit banding support} ${BB_PRESENT}

  #Adding Page
  set Debug [ipgui::add_page $IPINST -name "Debug"]
  set_property tooltip {Set debug parameters} ${Debug}
  set DEBUG_LVL [ipgui::add_param $IPINST -name "DEBUG_LVL" -parent ${Debug}]
  set_property tooltip {Level of debug} ${DEBUG_LVL}
  set TRACE_LVL [ipgui::add_param $IPINST -name "TRACE_LVL" -parent ${Debug}]
  set_property tooltip {Set Trace level of debug.  Must be 0 if Debug Level = 0} ${TRACE_LVL}
  set JTAG_PRESENT [ipgui::add_param $IPINST -name "JTAG_PRESENT" -parent ${Debug}]
  set_property tooltip {Enable for JTAG debug.  Serial Wire debug always present} ${JTAG_PRESENT}

  #Adding Page
  set Instruction_Memory [ipgui::add_page $IPINST -name "Instruction Memory"]
  set ITCM_SIZE [ipgui::add_param $IPINST -name "ITCM_SIZE" -parent ${Instruction_Memory} -widget comboBox]
  set_property tooltip {Size of the ITCM memory} ${ITCM_SIZE}
  set ITCM_INIT_RAM [ipgui::add_param $IPINST -name "ITCM_INIT_RAM" -parent ${Instruction_Memory}]
  set_property tooltip {Enable to allow ITCM to be intialised with a file} ${ITCM_INIT_RAM}
  set ITCM_INIT_FILE [ipgui::add_param $IPINST -name "ITCM_INIT_FILE" -parent ${Instruction_Memory}]
  set_property tooltip {File name used to initialise ITCM.  Do not use quotes} ${ITCM_INIT_FILE}

  #Adding Page
  set Data_Memory [ipgui::add_page $IPINST -name "Data Memory"]
  set_property tooltip {Set size and initialisation of data memory} ${Data_Memory}
  ipgui::add_param $IPINST -name "DTCM_SIZE" -parent ${Data_Memory} -widget comboBox
  set DTCM_INIT_RAM [ipgui::add_param $IPINST -name "DTCM_INIT_RAM" -parent ${Data_Memory}]
  set_property tooltip {Enable to allow DTCM to be initialised with a file} ${DTCM_INIT_RAM}
  set DTCM_INIT_FILE [ipgui::add_param $IPINST -name "DTCM_INIT_FILE" -parent ${Data_Memory}]
  set_property tooltip {File name of the DTCM initialisation file.  Do not use quotes} ${DTCM_INIT_FILE}


}

proc update_PARAM_VALUE.WIC_LINES { PARAM_VALUE.WIC_LINES PARAM_VALUE.WIC_PRESENT } {
	# Procedure called to update WIC_LINES when any of the dependent parameters in the arguments change
	
	set WIC_LINES ${PARAM_VALUE.WIC_LINES}
	set WIC_PRESENT ${PARAM_VALUE.WIC_PRESENT}
	set values(WIC_PRESENT) [get_property value $WIC_PRESENT]
	if { [gen_USERPARAMETER_WIC_LINES_ENABLEMENT $values(WIC_PRESENT)] } {
		set_property enabled true $WIC_LINES
	} else {
		set_property enabled false $WIC_LINES
	}
}

proc validate_PARAM_VALUE.WIC_LINES { PARAM_VALUE.WIC_LINES } {
	# Procedure called to validate WIC_LINES
	return true
}

proc update_PARAM_VALUE.AUSER_MAX { PARAM_VALUE.AUSER_MAX } {
	# Procedure called to update AUSER_MAX when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AUSER_MAX { PARAM_VALUE.AUSER_MAX } {
	# Procedure called to validate AUSER_MAX
	return true
}

proc update_PARAM_VALUE.AUSER_WIDTH { PARAM_VALUE.AUSER_WIDTH } {
	# Procedure called to update AUSER_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.AUSER_WIDTH { PARAM_VALUE.AUSER_WIDTH } {
	# Procedure called to validate AUSER_WIDTH
	return true
}

proc update_PARAM_VALUE.BB_PRESENT { PARAM_VALUE.BB_PRESENT } {
	# Procedure called to update BB_PRESENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.BB_PRESENT { PARAM_VALUE.BB_PRESENT } {
	# Procedure called to validate BB_PRESENT
	return true
}

proc update_PARAM_VALUE.DEBUG_LVL { PARAM_VALUE.DEBUG_LVL } {
	# Procedure called to update DEBUG_LVL when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DEBUG_LVL { PARAM_VALUE.DEBUG_LVL } {
	# Procedure called to validate DEBUG_LVL
	return true
}

proc update_PARAM_VALUE.DTCM_INIT_FILE { PARAM_VALUE.DTCM_INIT_FILE } {
	# Procedure called to update DTCM_INIT_FILE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DTCM_INIT_FILE { PARAM_VALUE.DTCM_INIT_FILE } {
	# Procedure called to validate DTCM_INIT_FILE
	return true
}

proc update_PARAM_VALUE.DTCM_INIT_RAM { PARAM_VALUE.DTCM_INIT_RAM } {
	# Procedure called to update DTCM_INIT_RAM when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DTCM_INIT_RAM { PARAM_VALUE.DTCM_INIT_RAM } {
	# Procedure called to validate DTCM_INIT_RAM
	return true
}

proc update_PARAM_VALUE.DTCM_SIZE { PARAM_VALUE.DTCM_SIZE } {
	# Procedure called to update DTCM_SIZE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.DTCM_SIZE { PARAM_VALUE.DTCM_SIZE } {
	# Procedure called to validate DTCM_SIZE
	return true
}

proc update_PARAM_VALUE.ITCM_INIT_FILE { PARAM_VALUE.ITCM_INIT_FILE } {
	# Procedure called to update ITCM_INIT_FILE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ITCM_INIT_FILE { PARAM_VALUE.ITCM_INIT_FILE } {
	# Procedure called to validate ITCM_INIT_FILE
	return true
}

proc update_PARAM_VALUE.ITCM_INIT_RAM { PARAM_VALUE.ITCM_INIT_RAM } {
	# Procedure called to update ITCM_INIT_RAM when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ITCM_INIT_RAM { PARAM_VALUE.ITCM_INIT_RAM } {
	# Procedure called to validate ITCM_INIT_RAM
	return true
}

proc update_PARAM_VALUE.ITCM_SIZE { PARAM_VALUE.ITCM_SIZE } {
	# Procedure called to update ITCM_SIZE when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.ITCM_SIZE { PARAM_VALUE.ITCM_SIZE } {
	# Procedure called to validate ITCM_SIZE
	return true
}

proc update_PARAM_VALUE.JTAG_PRESENT { PARAM_VALUE.JTAG_PRESENT } {
	# Procedure called to update JTAG_PRESENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.JTAG_PRESENT { PARAM_VALUE.JTAG_PRESENT } {
	# Procedure called to validate JTAG_PRESENT
	return true
}

proc update_PARAM_VALUE.LVL_WIDTH { PARAM_VALUE.LVL_WIDTH } {
	# Procedure called to update LVL_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.LVL_WIDTH { PARAM_VALUE.LVL_WIDTH } {
	# Procedure called to validate LVL_WIDTH
	return true
}

proc update_PARAM_VALUE.MPU_PRESENT { PARAM_VALUE.MPU_PRESENT } {
	# Procedure called to update MPU_PRESENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.MPU_PRESENT { PARAM_VALUE.MPU_PRESENT } {
	# Procedure called to validate MPU_PRESENT
	return true
}

proc update_PARAM_VALUE.NUM_IRQ { PARAM_VALUE.NUM_IRQ } {
	# Procedure called to update NUM_IRQ when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.NUM_IRQ { PARAM_VALUE.NUM_IRQ } {
	# Procedure called to validate NUM_IRQ
	return true
}

proc update_PARAM_VALUE.STRB_MAX { PARAM_VALUE.STRB_MAX } {
	# Procedure called to update STRB_MAX when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.STRB_MAX { PARAM_VALUE.STRB_MAX } {
	# Procedure called to validate STRB_MAX
	return true
}

proc update_PARAM_VALUE.STRB_WIDTH { PARAM_VALUE.STRB_WIDTH } {
	# Procedure called to update STRB_WIDTH when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.STRB_WIDTH { PARAM_VALUE.STRB_WIDTH } {
	# Procedure called to validate STRB_WIDTH
	return true
}

proc update_PARAM_VALUE.TRACE_LVL { PARAM_VALUE.TRACE_LVL PARAM_VALUE.DEBUG_LVL} {
	# Procedure called to update TRACE_LVL when any of the dependent parameters in the arguments change
    # Trace must be 0 if debug = 0
    if {[get_property value ${PARAM_VALUE.DEBUG_LVL}] == 0} {
        set_property value 0 ${PARAM_VALUE.TRACE_LVL}
    }
}

proc validate_PARAM_VALUE.TRACE_LVL { PARAM_VALUE.TRACE_LVL } {
	# Procedure called to validate TRACE_LVL
	return true
}

proc update_PARAM_VALUE.WIC_PRESENT { PARAM_VALUE.WIC_PRESENT } {
	# Procedure called to update WIC_PRESENT when any of the dependent parameters in the arguments change
}

proc validate_PARAM_VALUE.WIC_PRESENT { PARAM_VALUE.WIC_PRESENT } {
	# Procedure called to validate WIC_PRESENT
	return true
}


proc update_MODELPARAM_VALUE.NUM_IRQ { MODELPARAM_VALUE.NUM_IRQ PARAM_VALUE.NUM_IRQ } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.NUM_IRQ}] ${MODELPARAM_VALUE.NUM_IRQ}
}

proc update_MODELPARAM_VALUE.JTAG_PRESENT { MODELPARAM_VALUE.JTAG_PRESENT PARAM_VALUE.JTAG_PRESENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.JTAG_PRESENT}] ${MODELPARAM_VALUE.JTAG_PRESENT}
}

proc update_MODELPARAM_VALUE.ITCM_SIZE { MODELPARAM_VALUE.ITCM_SIZE PARAM_VALUE.ITCM_SIZE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ITCM_SIZE}] ${MODELPARAM_VALUE.ITCM_SIZE}
}

proc update_MODELPARAM_VALUE.DTCM_SIZE { MODELPARAM_VALUE.DTCM_SIZE PARAM_VALUE.DTCM_SIZE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DTCM_SIZE}] ${MODELPARAM_VALUE.DTCM_SIZE}
}

proc update_MODELPARAM_VALUE.ITCM_INIT_RAM { MODELPARAM_VALUE.ITCM_INIT_RAM PARAM_VALUE.ITCM_INIT_RAM } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ITCM_INIT_RAM}] ${MODELPARAM_VALUE.ITCM_INIT_RAM}
}

proc update_MODELPARAM_VALUE.DTCM_INIT_RAM { MODELPARAM_VALUE.DTCM_INIT_RAM PARAM_VALUE.DTCM_INIT_RAM } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DTCM_INIT_RAM}] ${MODELPARAM_VALUE.DTCM_INIT_RAM}
}

proc update_MODELPARAM_VALUE.ITCM_INIT_FILE { MODELPARAM_VALUE.ITCM_INIT_FILE PARAM_VALUE.ITCM_INIT_FILE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.ITCM_INIT_FILE}] ${MODELPARAM_VALUE.ITCM_INIT_FILE}
}

proc update_MODELPARAM_VALUE.DTCM_INIT_FILE { MODELPARAM_VALUE.DTCM_INIT_FILE PARAM_VALUE.DTCM_INIT_FILE } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DTCM_INIT_FILE}] ${MODELPARAM_VALUE.DTCM_INIT_FILE}
}

proc update_MODELPARAM_VALUE.AUSER_WIDTH { MODELPARAM_VALUE.AUSER_WIDTH PARAM_VALUE.AUSER_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AUSER_WIDTH}] ${MODELPARAM_VALUE.AUSER_WIDTH}
}

proc update_MODELPARAM_VALUE.AUSER_MAX { MODELPARAM_VALUE.AUSER_MAX PARAM_VALUE.AUSER_MAX } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.AUSER_MAX}] ${MODELPARAM_VALUE.AUSER_MAX}
}

proc update_MODELPARAM_VALUE.STRB_WIDTH { MODELPARAM_VALUE.STRB_WIDTH PARAM_VALUE.STRB_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.STRB_WIDTH}] ${MODELPARAM_VALUE.STRB_WIDTH}
}

proc update_MODELPARAM_VALUE.STRB_MAX { MODELPARAM_VALUE.STRB_MAX PARAM_VALUE.STRB_MAX } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.STRB_MAX}] ${MODELPARAM_VALUE.STRB_MAX}
}

proc update_MODELPARAM_VALUE.MPU_PRESENT { MODELPARAM_VALUE.MPU_PRESENT PARAM_VALUE.MPU_PRESENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.MPU_PRESENT}] ${MODELPARAM_VALUE.MPU_PRESENT}
}

proc update_MODELPARAM_VALUE.LVL_WIDTH { MODELPARAM_VALUE.LVL_WIDTH PARAM_VALUE.LVL_WIDTH } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.LVL_WIDTH}] ${MODELPARAM_VALUE.LVL_WIDTH}
}

proc update_MODELPARAM_VALUE.TRACE_LVL { MODELPARAM_VALUE.TRACE_LVL PARAM_VALUE.TRACE_LVL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.TRACE_LVL}] ${MODELPARAM_VALUE.TRACE_LVL}
}

proc update_MODELPARAM_VALUE.DEBUG_LVL { MODELPARAM_VALUE.DEBUG_LVL PARAM_VALUE.DEBUG_LVL } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.DEBUG_LVL}] ${MODELPARAM_VALUE.DEBUG_LVL}
}

proc update_MODELPARAM_VALUE.WIC_PRESENT { MODELPARAM_VALUE.WIC_PRESENT PARAM_VALUE.WIC_PRESENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.WIC_PRESENT}] ${MODELPARAM_VALUE.WIC_PRESENT}
}

proc update_MODELPARAM_VALUE.WIC_LINES { MODELPARAM_VALUE.WIC_LINES PARAM_VALUE.WIC_LINES } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.WIC_LINES}] ${MODELPARAM_VALUE.WIC_LINES}
}

proc update_MODELPARAM_VALUE.BB_PRESENT { MODELPARAM_VALUE.BB_PRESENT PARAM_VALUE.BB_PRESENT } {
	# Procedure called to set VHDL generic/Verilog parameter value(s) based on TCL parameter value
	set_property value [get_property value ${PARAM_VALUE.BB_PRESENT}] ${MODELPARAM_VALUE.BB_PRESENT}
}

