`timescale 1ns/100ps
`include "fft_inc.h"

module Div_Op 
#( parameter DIV_EXP = 7 )
(
	input [`CPLX_WIDTH-1:0] idata;
	output [`CPLX_WIDTH-1:0] odata
);

assign odata[REAL_MSB:REAL_LSB] = { { DIV_EXP { idata[REAL_MSB] } }, idata[REAL_MSB:REAL_LSB+DIV_EXP] };
assign odata[IMGN_MSB:IMGN_LSB] = { { DIV_EXP { idata[IMGN_MSB] } }, idata[IMGN_MSB:IMGN_LSB+DIV_EXP] };

endmodule
