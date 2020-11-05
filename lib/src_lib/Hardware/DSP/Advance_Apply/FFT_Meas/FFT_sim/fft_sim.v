`timescale 1ns/100ps
`include "fft_inc.h"

module fft_sim();
	
localparam FFT_STAGE = `TOTAL_STAGE;
localparam FFT_MAX = 1<<`TOTAL_STAGE;
localparam IEN_TIME = FFT_MAX*20+3;

reg iclk;
reg rst_n;
reg [FFT_STAGE-1:0] iaddr;
reg [`REAL_WIDTH-1:0] iReal = 0;
reg [`IMGN_WIDTH-1:0] iImag = 0;
reg ien;
wire [`REAL_WIDTH-1:0] oReal;
wire [`IMGN_WIDTH-1:0] oImag;
wire [FFT_STAGE-1:0] oaddr;
wire oen;

reg [`REAL_WIDTH-1:0] Ireal_r [FFT_MAX-1:0];
reg [`IMGN_WIDTH-1:0] Iimag_r [FFT_MAX-1:0];

initial
begin
	rst_n <= 1;
	iclk <= 0;
	rst_n <= #20 0;
	
	forever
		#10 iclk = ~iclk;
end

initial 
begin
	#50000;
	$stop;
end
initial
begin
	ien = 1'b0;
	#112 ien = 1'b1;
	#IEN_TIME ien = 1'b0;
end

integer index = 0;
initial
begin
	iaddr = 0;
	$readmemh("C:/Users/AIR/Desktop/FFT/real.txt", Ireal_r);
	$readmemh("C:/Users/AIR/Desktop/FFT/imag.txt", Iimag_r);
	#92 for(index=0; index<FFT_MAX; index=index+1)
	begin
		#20 iReal = Ireal_r[index];
			iImag = Iimag_r[index];
		iaddr <= index;
	end
end


integer w1_file;
initial w1_file = $fopen("C:/Users/AIR/Desktop/FFT/data_out_addr.txt");
always @(oaddr)
begin
    $fdisplay(w1_file, "%d", oaddr);
end

integer w2_file;
initial w2_file = $fopen("C:/Users/AIR/Desktop/FFT/data_out_real.txt");
always @(oaddr)
begin
    $fdisplay(w2_file, "%d", $signed(oReal));
end

integer w3_file;
initial w3_file = $fopen("C:/Users/AIR/Desktop/FFT/data_out_imag.txt");
always @(oaddr)
begin
    $fdisplay(w3_file, "%d",  $signed(oImag));
end


fft fft_ins (
	.iclk(iclk),
	.rst_n(rst_n),

	.iaddr(iaddr),
	.iReal(iReal),
	.iImag(iImag),
	.ien(ien),

	.oReal(oReal),
	.oImag(oImag),
	.oaddr(oaddr),
	.oen(oen)
);
	
endmodule