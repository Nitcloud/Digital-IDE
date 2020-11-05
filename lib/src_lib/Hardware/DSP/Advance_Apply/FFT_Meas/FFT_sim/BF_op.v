`timescale 1ns/100ps
`include "fft_inc.h"

module BF_op
(
	input  [`CPLX_WIDTH-1:0] ia,
	input  [`CPLX_WIDTH-1:0] ib,
	output [`CPLX_WIDTH-1:0] oa,
	output [`CPLX_WIDTH-1:0] ob
);
	
assign oa[REAL_MSB:REAL_LSB] = ia[REAL_MSB:REAL_LSB] + ib[REAL_MSB:REAL_LSB];
assign oa[IMGN_MSB:IMGN_LSB] = ia[IMGN_MSB:IMGN_LSB] + ib[IMGN_MSB:IMGN_LSB];

assign ob[REAL_MSB:REAL_LSB] = ia[REAL_MSB:REAL_LSB] - ib[REAL_MSB:REAL_LSB];
assign ob[IMGN_MSB:IMGN_LSB] = ia[IMGN_MSB:IMGN_LSB] - ib[IMGN_MSB:IMGN_LSB];

endmodule
