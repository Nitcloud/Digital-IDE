#non-project mode: write_bitstream;
write_bitstream ./[current_project].bit -force
write_debug_probes -no_partial_ltxfile -quiet -force ./[current_project].ltx
