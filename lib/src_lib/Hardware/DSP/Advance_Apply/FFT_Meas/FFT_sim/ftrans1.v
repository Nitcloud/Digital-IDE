`timescale 1ns/100ps
`include "fft_inc.h"

module ftrans1
(
	input                     ien,
	input  [`TOTAL_STAGE-1:0] iaddr,
	input  [`CPLX_WIDTH-1:0]  idata,
	
	output                    oen,
	output [`TOTAL_STAGE-1:0] oaddr,
	output [`CPLX_WIDTH-1:0]  odata
);

assign odata = idata;
assign oen = ien;

generate	// bit_reverse
	genvar index;
	for(index=0; index<`TOTAL_STAGE; index=index+1) begin: bit_reverse
		assign oaddr[`TOTAL_STAGE-index-1] = iaddr[index];
	end
endgenerate

endmodule
