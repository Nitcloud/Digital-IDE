`timescale 1ns/100ps
`include "fft_inc.h"

module conjugate_Op 
(
	input  [`CPLX_WIDTH-1:0] idata,
	output [`CPLX_WIDTH-1:0] odata
);

assign odata = { idata[REAL_MSB:REAL_LSB], -idata[IMGN_MSB:IMGN_LSB] };

endmodule
