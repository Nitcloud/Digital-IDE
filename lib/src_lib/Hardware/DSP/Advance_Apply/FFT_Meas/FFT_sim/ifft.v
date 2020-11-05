`timescale 1ns/100ps
`include "fft_inc.h"

module ifft 
(
	input iclk,
	input rst_n,

	input                    ien,
	input [`TOTAL_STAGE-1:0] iaddr,
	input [`REAL_WIDTH-1:0]  iReal,
	input [`IMGN_WIDTH-1:0]  iImag,

	output reg                    oen,
	output reg [`TOTAL_STAGE-1:0] oaddr,
	output reg [`REAL_WIDTH-1:0]  oReal,
	output reg [`IMGN_WIDTH-1:0]  oImag
);
	
localparam INTER_MODU_WIRE_NUM = ((`TOTAL_STAGE-1)/2);

wire en_end;
wire [`TOTAL_STAGE-1:0] addr_end;
wire [`CPLX_WIDTH-1:0] data_end;

wire en_w [INTER_MODU_WIRE_NUM:0];
wire [`TOTAL_STAGE-1:0] addr_w [INTER_MODU_WIRE_NUM:0];
wire [`CPLX_WIDTH-1:0]  data_w [INTER_MODU_WIRE_NUM:0];

wire [`CPLX_WIDTH-1:0] ConjugIData;

assign en_w[INTER_MODU_WIRE_NUM] = ien;
assign addr_w[INTER_MODU_WIRE_NUM] = iaddr;

// assign data_w[INTER_MODU_WIRE_NUM] = {iReal, iImag};
conjugate_Op conjugate_inst(
	.idata({iReal, iImag}),
	.odata(data_w[INTER_MODU_WIRE_NUM])
);

generate
	genvar gv_stg;
	genvar gv_index;
	for(gv_stg=`TOTAL_STAGE; gv_stg>2; gv_stg=gv_stg-2) begin:	stagX
		// gv_index = ((gv_stg-1)/2);
		fft_stageX #( 
			.FFT_STG(gv_stg)
		) stgX_inst (
			.iclk(iclk),
			.rst_n(rst_n),
			.iaddr(addr_w[((gv_stg-1)/2)]),
			.idata(data_w[((gv_stg-1)/2)]),
			.ien(en_w[((gv_stg-1)/2)]),
			.oaddr(addr_w[((gv_stg-1)/2)-1]),
			.odata(data_w[((gv_stg-1)/2)-1]),
			.oen(en_w[((gv_stg-1)/2)-1])
		);
	end
	if(`TOTAL_STAGE%2)
		begin
			fft_stage1 #(
				.FFT_STG(1)
			) stg1_inst (
				.iclk(iclk),
				.rst_n(rst_n),
				.ien(en_w[0]),
				.iaddr(addr_w[0]),
				.idata(data_w[0]),
				.oen(en_end),
				.oaddr(addr_end),
				.odata(data_end)
			);
		end
	else
		begin
				fft_stage2 stg2_inst (
				.iclk(iclk),
				.rst_n(rst_n),
				.ien(en_w[0]),
				.iaddr(addr_w[0]),
				.idata(data_w[0]),
				.oen(en_end),
				.oaddr(addr_end),
				.odata(data_end)
			); 
		end
endgenerate

// ĩ�˴���������->��ȥN->�����
wire en_e;
wire [`TOTAL_STAGE-1:0] addr_e;
wire [`CPLX_WIDTH-1:0] data_e;
wire [`CPLX_WIDTH-1:0] data_f;
wire [`CPLX_WIDTH-1:0] data_g;

ftrans1 ft1 (
	.ien(en_end),
	.iaddr(addr_end),
	.idata(data_end),
	.oen(en_e),
	.oaddr(addr_e),
	.odata(data_e)
);

conjugate_Op conjugate_inst1(
	.idata(data_e),
	.odata(data_f)
);

Div_Op #( 
	.DIV_EXP(`TOTAL_STAGE) 
) div_inst (
	.idata(data_f),
	.odata(data_g)
);

always @(posedge iclk)
begin
	oen = en_e;
	oaddr = addr_e;
	{oReal, oImag} = data_g;
end

endmodule
