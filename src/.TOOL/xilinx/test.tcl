


variable current_Location [file normalize [info script]]
set val [exec python [file dirname $current_Location]/Script/fileupdate.py -quiet]
puts $val