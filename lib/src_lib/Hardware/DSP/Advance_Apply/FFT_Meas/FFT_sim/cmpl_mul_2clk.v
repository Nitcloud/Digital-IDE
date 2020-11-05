`timescale 1 ps / 1 ps
`include "fft_inc.h"
module cmpl_mul_2clk 
(
	input	        clock,
	input	[17:0]  dataa_imag,
	input	[17:0]  dataa_real,
	input	[17:0]  datab_imag,
	input	[17:0]  datab_real,
	output	[35:0]  result_imag,
	output	[35:0]  result_real
);

wire [35:0] sub_wire0;
wire [35:0] sub_wire1;
wire [35:0] result_real;
wire [35:0] result_imag;

wire signed [17:0]ar,ai,br,bi;
assign ar=dataa_real;
assign ai=dataa_imag;
assign bi=datab_imag;
assign br=datab_real;
reg signed [35:0]outr,outi;
reg signed [35:0]r1,i1;
always@(posedge clock)
begin
	outr<=#SIM_DLY ar*br-ai*bi;
	outi<=#SIM_DLY ar*bi+ai*br;
end

always@(posedge clock)
begin
	r1<=#SIM_DLY outr;
	r2<=#SIM_DLY r1;
end

assign result_imag=i1;
assign result_real=r1;

endmodule