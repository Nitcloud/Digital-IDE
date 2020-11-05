`timescale 1ns/100ps
`include "fft_inc.h"

module fft_stageX
#( parameter FFT_STG = 7 )
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
wire	                   bfX_1_oen;
wire	[`TOTAL_STAGE-1:0] bfX_1_oaddr;
wire	[`CPLX_WIDTH-1:0]  bfX_1_data;

BF_stgX #( 
	.FFT_STG(FFT_STG) 
) BF_inst0 (
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
	.FFT_STG(FFT_STG)
) ftrans_I_inst (
	.iclk(iclk),
	.ien(bfX_oen),
	.iaddr(bfX_oaddr),
	.idata(bfX_odata),
	.oen(Trans_I_oen),
	.oaddr(Trans_I_oaddr),
	.odata(Trans_I_odata)
);

ftrans_II #( 
	.FFT_STG(FFT_STG)
) ftrans_II_inst (
	.iclk(iclk),
	.ien(bfX_1_oen),
	.iaddr(bfX_1_oaddr),
	.idata(bfX_1_data),
	.oen(oen),
	.oaddr(oaddr),
	.odata(odata)
);

generate begin
	if(3==FFT_STG)
		fft_stage1 #( 
			.FFT_STG(2) 
		) BF_inst1 (
			.iclk(iclk),
			.rst_n(rst_n),
			.ien(Trans_I_oen),
			.iaddr(Trans_I_oaddr),
			.idata(Trans_I_odata),
			.oen(bfX_1_oen),
			.oaddr(bfX_1_oaddr),
			.odata(bfX_1_data)
		);
	else
		BF_stgX #( 
			.FFT_STG(FFT_STG-1) 
		) BF_inst1 (
			.iclk(iclk),
			.rst_n(rst_n),
			.ien(Trans_I_oen),
			.iaddr(Trans_I_oaddr),
			.idata(Trans_I_odata),
			.oen(bfX_1_oen),
			.oaddr(bfX_1_oaddr),
			.odata(bfX_1_data)
		);
end
endgenerate

endmodule
