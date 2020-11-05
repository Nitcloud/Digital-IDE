`timescale 1ns/100ps
`include "fft_inc.h"

module ifft_sim();
	
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
	ien = 1'b0;
	#112 ien = 1'b1;
	#IEN_TIME ien = 1'b0;
end

integer index = 0;
initial
begin
	iaddr = 0;
	$readmemh("real.vec", Ireal_r);
	$readmemh("imag.vec", Iimag_r);
	#92 for(index=0; index<FFT_MAX; index=index+1)
	begin
		#20 iReal = Ireal_r[index];
			iImag = Iimag_r[index];
		iaddr <= index;
	end
end


integer w_file;
initial w_file = $fopen("data_out.txt");
always @(oaddr)
begin
    $fdisplay(w_file, "%d   %d    %d", oaddr, $signed(oReal), $signed(oImag));
end


ifft ifft_ins (
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