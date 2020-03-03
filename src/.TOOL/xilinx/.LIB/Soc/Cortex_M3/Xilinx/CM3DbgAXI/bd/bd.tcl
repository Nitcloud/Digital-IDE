# Post packaging of Cortex_M3

proc init {cellpath otherInfo } {
  set cell_handlex [get_bd_cells $cellpath]

  bd::mark_propagate_only $cell_handlex "NUM_IRQ"
  bd::mark_propagate_override $cell_handlex "IRQ_LEVEL_EDGE IRQ_HIGH_LOW"
}

proc post_config_ip { cellpath otherInfo } {
  set cell [get_bd_cells $cellpath]

  # BD_ATTRIBUTE.FUNCTION
  foreach memory_mapped_intf { CM3_SYS_AXI3 } {
    set bif [get_bd_intf_pins -quiet -regexp "$cellpath/$memory_mapped_intf"]
    if {[string length $bif] > 0} {
      set_property BD_ATTRIBUTE.FUNCTION CPU $bif
    }
  }
}

proc post_propagate { cellpath otherInfo } {
  set cell [get_bd_cells $cellpath]

  set intrPin [get_bd_pins ${cellpath}/IRQ]
  set intrDriver [find_bd_objs -thru_hier -relation connected_to $intrPin]
  if { [string length $intrDriver] > 0 } {

    # Update NUM_IRQ:
    # - Check for propagated PortWidth property
    # - Check for vector ports and pins on driver
    # - Assume single port or pin if properties LEFT and RIGHT are empty
    set width [get_property CONFIG.PortWidth $intrPin]
    set max_width 240
    if { [string length $width] > 0 && $width != 0 } {
      if {$width <= $max_width} {
        set_property CONFIG.NUM_IRQ $width $cell
      }
    } elseif { [string length $width] == 0 } {
      set left  [get_property LEFT  $intrDriver]
      set right [get_property RIGHT $intrDriver]
      if { [string length $left] > 0 && [string length $right] > 0 } {
        set width [expr ($left > $right) ? $left - $right + 1 : $right - $left + 1]
      } else {
        set width 1
      }
      if {$width <=  $max_width} {
        set_property CONFIG.NUM_IRQ $width $cell
      }
    }

    # Determine port type:
    # - Check for propagated PortType property
    # - Check for PortType property on driver
    # - Check for TYPE property on driver
    set PortType [get_property CONFIG.PortType $intrPin]
    if { [string length $PortType] == 0 } {
      set PortType [get_property CONFIG.PortType $intrDriver]
      if { [string length $PortType] == 0 } {
        set PortType [get_property TYPE $intrDriver]
      }
    }

    # Update IP properties
    # - Error if maximum external interrupts exceeded
    # - Warning if neither PortType nor sensitivity set
    # - Allow one common sensitivity value for all interrupt inputs
    # - Warning if number of sensitivity values do not match number of interrupt inputs
    # - Assign properties, with warning if sensitivity value not recognized
    set nLevelEdge    [get_property CONFIG.IRQ_LEVEL_EDGE $cell]
    set nHighLow      [get_property CONFIG.IRQ_HIGH_LOW   $cell]
    set userLevelEdge [string equal [get_property CONFIG.IRQ_LEVEL_EDGE.VALUE_SRC $cell] "USER"]
    set userHighLow   [string equal [get_property CONFIG.IRQ_HIGH_LOW.VALUE_SRC   $cell] "USER"]

    set mask   [expr (1 << $width) - 1]
    set nCount [expr $width - 1]

    set auto [expr ! ($userLevelEdge || $userHighLow)]
    set Sen_Value [get_property CONFIG.SENSITIVITY $intrPin]
    set msg "- using default interrupt type Rising Edge. Please change this manually if necessary."
    if {$width > $max_width} {
      bd::send_msg -of $cellpath -type ERROR -msg_id 3 -text \
        ": The maximum number of available external interrupts exceeded ($width > $max_width)."
    } elseif { $PortType != "intr" || [string length ${Sen_Value}] == 0 } {
      if {$auto} {
        bd::send_msg -of $cellpath -type WARNING -msg_id 4 -text \
          ": Could not determine interrupt input port type ${msg}"
      }
    } else {
      set Sen_Value [string trim ${Sen_Value} :]
      set senArray  [split ${Sen_Value} :]
      set senSize   [llength $senArray]

      # Handle common sensitivity value for more than one interrupt
      if { ($width != $senSize) && ($senSize == 1) } {
        for {set i 1} {$i < $width} {incr i} {
          lappend senArray $Sen_Value
        }
        set senSize [llength $senArray]
      }

      # Check width and update properties according to sensitivity
      if { $width != $senSize } {
        if {$auto} {
          bd::send_msg -of $cellpath -type WARNING -msg_id 5 -text \
            ": Number of interrupt inputs ($width) does not match property SENSITIVITY ($senSize items) ${msg}"
        }
      } else {
        foreach senStr $senArray {
          set nBit [ expr 1 << $nCount ]
          set senStr [string toupper $senStr]
          if { $senStr == "LEVEL_HIGH" } {
             set nLevelEdge [expr { $nLevelEdge & (~ $nBit) } ]
             set nHighLow   [expr { $nHighLow  | $nBit } ]
          } elseif { $senStr == "LEVEL_LOW" } {
             set nLevelEdge [expr { $nLevelEdge & (~ $nBit) } ]
             set nHighLow   [expr { $nHighLow & (~ $nBit) } ]
          } elseif { $senStr == "EDGE_RISING" } {
             set nLevelEdge [expr { $nLevelEdge | $nBit } ]
             set nHighLow   [expr { $nHighLow | $nBit } ]
          } elseif { $senStr == "EDGE_FALLING" } {
             set nLevelEdge [expr { $nLevelEdge | $nBit } ]
             set nHighLow   [expr { $nHighLow & (~ $nBit) } ]
          } elseif {$auto} {
             bd::send_msg -of $cellpath -type WARNING -msg_id 1 -text \
               ": Property SENSITIVITY = \"${senStr}\" for interrupt input ${nCount} not recognized ${msg}"
          }
          set nCount [expr $nCount - 1]
        }
      }

      set strLevelEdge [format "0x%08X" $nLevelEdge]
      if {$userLevelEdge} {
        set curLevelEdge [get_property CONFIG.IRQ_LEVEL_EDGE $cell]
        if {($nLevelEdge & $mask) != ($curLevelEdge & $mask)} {
          bd::send_msg -of $cellpath -type WARNING -msg_id 7 -text \
            ": Interrupts type manual value ($curLevelEdge) does not match computed value ($strLevelEdge)."
        }
      } else {
        set_property CONFIG.IRQ_LEVEL_EDGE $strLevelEdge $cell
      }

      set strHighLow [format "0x%08X" $nHighLow]
      if {$userHighLow} {
        set curHighLow [get_property CONFIG.IRQ_HIGH_LOW $cell]
        if {($nHighLow & $mask) != ($curHighLow & $mask)} {
          bd::send_msg -of $cellpath -type WARNING -msg_id 8 -text \
            ": Level type manual value ($curHighLow) does not match computed value ($strHighLow)."
        }
      } else {
        set_property CONFIG.IRQ_HIGH_LOW $strHighLow $cell
      }

    }
  }
}
