`timescale 1ns/100ps
`include "fft_inc.h"

module fft_stage2 
(
	input iclk,
	input rst_n,

	input                      ien,
	input [`TOTAL_STAGE-1 : 0] iaddr,
	input [`CPLX_WIDTH-1 : 0]  idata,

	output                      oen,
	output [`TOTAL_STAGE-1 : 0] oaddr,
	output [`CPLX_WIDTH-1 : 0]  odata
);
	
wire	                   bfX_oen;
wire	[`TOTAL_STAGE-1:0] bfX_oaddr;
wire	[`CPLX_WIDTH-1:0]  bfX_odata;

wire	                   Trans_I_oen;
wire	[`TOTAL_STAGE-1:0] Trans_I_oaddr;
wire	[`CPLX_WIDTH-1:0]  Trans_I_odata;

fft_stage1 #( 
	.FFT_STG(2) 
) fft_stg1_inst2 (
	.iclk(iclk),
	.rst_n(rst_n),
	.ien(ien),
	.iaddr(iaddr),
	.idata(idata),
	.oen(bfX_oen),
	.oaddr(bfX_oaddr),
	.odata(bfX_odata)
);

ftrans_I #( 
	.FFT_STG(2)
) ftrans_I_inst (
	.iclk(iclk),
	.ien(bfX_oen),
	.iaddr(bfX_oaddr),
	.idata(bfX_odata),
	.oen(Trans_I_oen),
	.oaddr(Trans_I_oaddr),
	.odata(Trans_I_odata)
);

fft_stage1 #( 
	.FFT_STG(1) 
) fft_stg1_inst1 (
	.iclk(iclk),
	.rst_n(rst_n),
	.ien(Trans_I_oen),
	.iaddr(Trans_I_oaddr),
	.idata(Trans_I_odata),
	.oen(oen),
	.oaddr(oaddr),
	.odata(odata)
);

endmodule
