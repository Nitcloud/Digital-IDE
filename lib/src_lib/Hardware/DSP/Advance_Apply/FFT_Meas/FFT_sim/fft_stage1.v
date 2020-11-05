`timescale 1ns/100ps
`include "fft_inc.h"

module fft_stage1
#( parameter FFT_STG = 7 )
(
	input iclk,
	input rst_n,

	input                      ien,
	input [`TOTAL_STAGE-1 : 0] iaddr,
	input [`CPLX_WIDTH-1 : 0]  idata,

	output reg                      oen,
	output reg [`TOTAL_STAGE-1 : 0] oaddr,
	output reg [`CPLX_WIDTH-1 : 0]  odata
);
	
localparam TOTAL_ADDR_MAX   = { `TOTAL_STAGE { 1'b1 } };
localparam STG_MAX          = { FFT_STG { 1'b1 } };
localparam STG_HALFMAX      = ( STG_MAX >> 1 );

wire [`CPLX_WIDTH-1 : 0] bf_ia;
wire [`CPLX_WIDTH-1 : 0] bf_ib;
wire [`CPLX_WIDTH-1 : 0] bf_oa;
wire [`CPLX_WIDTH-1 : 0] bf_ob;

wire is_load;
wire is_calc;
wire with_dump;
reg dump = 0;

reg [`CPLX_WIDTH-1 : 0] r [STG_HALFMAX:0];

wire [`CPLX_WIDTH-1 : 0] wdata_in;
wire wen_in;

assign is_load = ~iaddr[FFT_STG-1];
assign is_calc = iaddr[FFT_STG-1];

reg [FFT_STG-1:0] dump_cnt = 0;
// for sync-ram: registered write port, unregistered read port
integer i;
always @(posedge iclk) begin
	if(wen_in) r[0] <= #SIM_DLY wdata_in;
	for(i = STG_HALFMAX; i > 0; i=i-1) 
		r[i] <= #SIM_DLY r[i-1];
end
//    ram wr sigal
assign wdata_in = is_load ? idata : bf_ob;
assign wen_in = ien;

// bufferfly
assign bf_ia = r[STG_HALFMAX];
assign bf_ib = idata;

always @(posedge iclk)
begin
	if(is_calc & ien) // actually started
	begin
		odata <= #SIM_DLY bf_oa;
		oaddr <= #SIM_DLY oaddr + 1'b1;
		oen <= #SIM_DLY 1'b1;
	end
	else if((is_load | ~ien) & with_dump)
	begin
		odata <= #SIM_DLY r[STG_HALFMAX];
		oaddr <= #SIM_DLY oaddr + 1'b1;
		oen <= #SIM_DLY 1'b1;
	end
	else // input address is big, but is not writing
	begin
		odata <= #SIM_DLY 0;
		oaddr <= #SIM_DLY  TOTAL_ADDR_MAX;
		oen <= #SIM_DLY 1'b0;
	end
end

always @(posedge iclk)
begin
	if(iaddr[FFT_STG-1:0] == STG_MAX && ien)
	begin
		dump <= #SIM_DLY 1'b1;
		dump_cnt <= #SIM_DLY 0;
	end
	else if(dump)
	begin
		if(dump_cnt == STG_HALFMAX) dump <= #SIM_DLY 1'b0;
		dump_cnt <= #SIM_DLY dump_cnt + 1'b1;
	end
end

assign with_dump = dump;

BF_op bf0(
	.ia(bf_ia),
	.ib(bf_ib),
	.oa(bf_oa),
	.ob(bf_ob)
);

endmodule
