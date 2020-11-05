`timescale 1 ps / 1 ps
`include "fft_inc.h"
module cmpl_mul_6clk 
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
reg signed [35:0]r1,i1,r2,i2,r3,i3,r4,i4,r5,i5;
always@(posedge clock)
begin
	outr<=#SIM_DLY ar*br-ai*bi;
	outi<=#SIM_DLY ar*bi+ai*br;
end

always@(posedge clock)
begin
	r1<=#SIM_DLY outr;
	r2<=#SIM_DLY r1;
	r3<=#SIM_DLY r2;
	r4<=#SIM_DLY r3;
	r5<=#SIM_DLY r4;
	i1<=#SIM_DLY outi;
	i2<=#SIM_DLY i1;
	i3<=#SIM_DLY i2;
	i4<=#SIM_DLY i3;
	i5<=#SIM_DLY i4;
end

assign result_imag=i5;
assign result_real=r5;
	
endmodule
