`timescale 1ns/100ps
`include "fft_inc.h"
/* 	����������ת���ӵ�matlab����
	clear;
	N = 32; 	% FFT ����
	M = 2^16;   % 18λ���ȡ�

	fid = fopen('cos_data.txt','w');

	for i = 0 : N-1
		j = i + 1;
		a(j) = M*cos(2*pi*i/N);  
		re_s = my_fix_flr_bin(a(j), 18, 0);
		b(j) = -M*sin(2*pi*i/N);
		im_s = my_fix_flr_bin(b(j), 18, 0);
		fprintf(fid, '\t\t\t5\''h%02X: { ore, oim } = { 18\''h%05s, 18\''h%05s };\n', i, dec2hex(bin2dec(re_s)), dec2hex(bin2dec(im_s)));
	end

	fclose(fid);
 */

module ftwiddle9
(
	input      [8:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 9;

wire [1:0] h_addr = idx[TW_STAGE-1:TW_STAGE-2];
wire [TW_STAGE-3:0] addr = idx[TW_STAGE-3:0];

always @(*)
begin
	case(h_addr)
		2'b00: { ore, oim } = { re, im };
		2'b01: { ore, oim } = { im, -re };
		2'b10: { ore, oim } = { -re, -im };
		2'b11: { ore, oim } = { -im, re };
		default: { ore, oim } = { 18'h10000, 18'h00000 };
	endcase
end

always @(addr) begin
	case(addr)
		7'h00: { re, im } = { 18'h10000, 18'h00000 };
		7'h01: { re, im } = { 18'h0FFFA, 18'h3FCDB };
		7'h02: { re, im } = { 18'h0FFEB, 18'h3F9B7 };
		7'h03: { re, im } = { 18'h0FFD2, 18'h3F693 };
		7'h04: { re, im } = { 18'h0FFB0, 18'h3F370 };
		7'h05: { re, im } = { 18'h0FF83, 18'h3F04D };
		7'h06: { re, im } = { 18'h0FF4D, 18'h3ED2A };
		7'h07: { re, im } = { 18'h0FF0D, 18'h3EA09 };
		7'h08: { re, im } = { 18'h0FEC3, 18'h3E6E8 };
		7'h09: { re, im } = { 18'h0FE6F, 18'h3E3C8 };
		7'h0A: { re, im } = { 18'h0FE12, 18'h3E0A9 };
		7'h0B: { re, im } = { 18'h0FDAA, 18'h3DD8C };
		7'h0C: { re, im } = { 18'h0FD39, 18'h3DA70 };
		7'h0D: { re, im } = { 18'h0FCBE, 18'h3D755 };
		7'h0E: { re, im } = { 18'h0FC3A, 18'h3D43C };
		7'h0F: { re, im } = { 18'h0FBAB, 18'h3D124 };
		7'h10: { re, im } = { 18'h0FB13, 18'h3CE0E };
		7'h11: { re, im } = { 18'h0FA72, 18'h3CAFA };
		7'h12: { re, im } = { 18'h0F9C6, 18'h3C7E9 };
		7'h13: { re, im } = { 18'h0F911, 18'h3C4D9 };
		7'h14: { re, im } = { 18'h0F852, 18'h3C1CC };
		7'h15: { re, im } = { 18'h0F78A, 18'h3BEC1 };
		7'h16: { re, im } = { 18'h0F6B9, 18'h3BBB8 };
		7'h17: { re, im } = { 18'h0F5DD, 18'h3B8B3 };
		7'h18: { re, im } = { 18'h0F4F9, 18'h3B5B0 };
		7'h19: { re, im } = { 18'h0F40A, 18'h3B2B0 };
		7'h1A: { re, im } = { 18'h0F313, 18'h3AFB2 };
		7'h1B: { re, im } = { 18'h0F212, 18'h3ACB8 };
		7'h1C: { re, im } = { 18'h0F108, 18'h3A9C1 };
		7'h1D: { re, im } = { 18'h0EFF4, 18'h3A6CE };
		7'h1E: { re, im } = { 18'h0EED7, 18'h3A3DE };
		7'h1F: { re, im } = { 18'h0EDB1, 18'h3A0F1 };
		7'h20: { re, im } = { 18'h0EC82, 18'h39E08 };
		7'h21: { re, im } = { 18'h0EB4A, 18'h39B23 };
		7'h22: { re, im } = { 18'h0EA08, 18'h39842 };
		7'h23: { re, im } = { 18'h0E8BE, 18'h39565 };
		7'h24: { re, im } = { 18'h0E76A, 18'h3928C };
		7'h25: { re, im } = { 18'h0E60E, 18'h38FB7 };
		7'h26: { re, im } = { 18'h0E4A9, 18'h38CE6 };
		7'h27: { re, im } = { 18'h0E33B, 18'h38A1A };
		7'h28: { re, im } = { 18'h0E1C4, 18'h38753 };
		7'h29: { re, im } = { 18'h0E045, 18'h38490 };
		7'h2A: { re, im } = { 18'h0DEBD, 18'h381D1 };
		7'h2B: { re, im } = { 18'h0DD2C, 18'h37F18 };
		7'h2C: { re, im } = { 18'h0DB93, 18'h37C64 };
		7'h2D: { re, im } = { 18'h0D9F1, 18'h379B5 };
		7'h2E: { re, im } = { 18'h0D847, 18'h3770A };
		7'h2F: { re, im } = { 18'h0D695, 18'h37466 };
		7'h30: { re, im } = { 18'h0D4DA, 18'h371C6 };
		7'h31: { re, im } = { 18'h0D317, 18'h36F2C };
		7'h32: { re, im } = { 18'h0D14C, 18'h36C98 };
		7'h33: { re, im } = { 18'h0CF79, 18'h36A09 };
		7'h34: { re, im } = { 18'h0CD9E, 18'h36780 };
		7'h35: { re, im } = { 18'h0CBBB, 18'h364FD };
		7'h36: { re, im } = { 18'h0C9D0, 18'h36280 };
		7'h37: { re, im } = { 18'h0C7DD, 18'h36009 };
		7'h38: { re, im } = { 18'h0C5E3, 18'h35D99 };
		7'h39: { re, im } = { 18'h0C3E1, 18'h35B2E };
		7'h3A: { re, im } = { 18'h0C1D7, 18'h358CA };
		7'h3B: { re, im } = { 18'h0BFC6, 18'h3566C };
		7'h3C: { re, im } = { 18'h0BDAE, 18'h35415 };
		7'h3D: { re, im } = { 18'h0BB8E, 18'h351C4 };
		7'h3E: { re, im } = { 18'h0B967, 18'h34F7A };
		7'h3F: { re, im } = { 18'h0B739, 18'h34D37 };
		7'h40: { re, im } = { 18'h0B504, 18'h34AFB };
		7'h41: { re, im } = { 18'h0B2C8, 18'h348C6 };
		7'h42: { re, im } = { 18'h0B085, 18'h34698 };
		7'h43: { re, im } = { 18'h0AE3B, 18'h34471 };
		7'h44: { re, im } = { 18'h0ABEA, 18'h34251 };
		7'h45: { re, im } = { 18'h0A993, 18'h34039 };
		7'h46: { re, im } = { 18'h0A735, 18'h33E28 };
		7'h47: { re, im } = { 18'h0A4D1, 18'h33C1E };
		7'h48: { re, im } = { 18'h0A266, 18'h33A1C };
		7'h49: { re, im } = { 18'h09FF6, 18'h33822 };
		7'h4A: { re, im } = { 18'h09D7F, 18'h3362F };
		7'h4B: { re, im } = { 18'h09B02, 18'h33444 };
		7'h4C: { re, im } = { 18'h0987F, 18'h33261 };
		7'h4D: { re, im } = { 18'h095F6, 18'h33086 };
		7'h4E: { re, im } = { 18'h09367, 18'h32EB3 };
		7'h4F: { re, im } = { 18'h090D3, 18'h32CE8 };
		7'h50: { re, im } = { 18'h08E39, 18'h32B25 };
		7'h51: { re, im } = { 18'h08B99, 18'h3296A };
		7'h52: { re, im } = { 18'h088F5, 18'h327B8 };
		7'h53: { re, im } = { 18'h0864A, 18'h3260E };
		7'h54: { re, im } = { 18'h0839B, 18'h3246C };
		7'h55: { re, im } = { 18'h080E7, 18'h322D3 };
		7'h56: { re, im } = { 18'h07E2E, 18'h32142 };
		7'h57: { re, im } = { 18'h07B6F, 18'h31FBA };
		7'h58: { re, im } = { 18'h078AC, 18'h31E3B };
		7'h59: { re, im } = { 18'h075E5, 18'h31CC4 };
		7'h5A: { re, im } = { 18'h07319, 18'h31B56 };
		7'h5B: { re, im } = { 18'h07048, 18'h319F1 };
		7'h5C: { re, im } = { 18'h06D73, 18'h31895 };
		7'h5D: { re, im } = { 18'h06A9A, 18'h31741 };
		7'h5E: { re, im } = { 18'h067BD, 18'h315F7 };
		7'h5F: { re, im } = { 18'h064DC, 18'h314B5 };
		7'h60: { re, im } = { 18'h061F7, 18'h3137D };
		7'h61: { re, im } = { 18'h05F0E, 18'h3124E };
		7'h62: { re, im } = { 18'h05C21, 18'h31128 };
		7'h63: { re, im } = { 18'h05931, 18'h3100B };
		7'h64: { re, im } = { 18'h0563E, 18'h30EF7 };
		7'h65: { re, im } = { 18'h05347, 18'h30DED };
		7'h66: { re, im } = { 18'h0504D, 18'h30CEC };
		7'h67: { re, im } = { 18'h04D4F, 18'h30BF5 };
		7'h68: { re, im } = { 18'h04A4F, 18'h30B06 };
		7'h69: { re, im } = { 18'h0474C, 18'h30A22 };
		7'h6A: { re, im } = { 18'h04447, 18'h30946 };
		7'h6B: { re, im } = { 18'h0413E, 18'h30875 };
		7'h6C: { re, im } = { 18'h03E33, 18'h307AD };
		7'h6D: { re, im } = { 18'h03B26, 18'h306EE };
		7'h6E: { re, im } = { 18'h03816, 18'h30639 };
		7'h6F: { re, im } = { 18'h03505, 18'h3058D };
		7'h70: { re, im } = { 18'h031F1, 18'h304EC };
		7'h71: { re, im } = { 18'h02EDB, 18'h30454 };
		7'h72: { re, im } = { 18'h02BC3, 18'h303C5 };
		7'h73: { re, im } = { 18'h028AA, 18'h30341 };
		7'h74: { re, im } = { 18'h0258F, 18'h302C6 };
		7'h75: { re, im } = { 18'h02273, 18'h30255 };
		7'h76: { re, im } = { 18'h01F56, 18'h301ED };
		7'h77: { re, im } = { 18'h01C37, 18'h30190 };
		7'h78: { re, im } = { 18'h01917, 18'h3013C };
		7'h79: { re, im } = { 18'h015F6, 18'h300F2 };
		7'h7A: { re, im } = { 18'h012D5, 18'h300B2 };
		7'h7B: { re, im } = { 18'h00FB2, 18'h3007C };
		7'h7C: { re, im } = { 18'h00C8F, 18'h3004F };
		7'h7D: { re, im } = { 18'h0096C, 18'h3002D };
		7'h7E: { re, im } = { 18'h00648, 18'h30014 };
		7'h7F: { re, im } = { 18'h00324, 18'h30005 };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule


module ftwiddle8 
(
	input [7:0] idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 8;

wire [1:0] h_addr = idx[TW_STAGE-1:TW_STAGE-2];
wire [TW_STAGE-3:0] addr = idx[TW_STAGE-3:0];

always @(*)
begin
	case(h_addr)
		2'b00: { ore, oim } = { re, im };
		2'b01: { ore, oim } = { im, -re };
		2'b10: { ore, oim } = { -re, -im };
		2'b11: { ore, oim } = { -im, re };
		default: { ore, oim } = { 18'h10000, 18'h00000 };
	endcase
end

always @(addr) begin
	case(addr)
		6'h00: { re, im } = { 18'h10000, 18'h00000 };
		6'h01: { re, im } = { 18'h0FFEB, 18'h3F9B7 };
		6'h02: { re, im } = { 18'h0FFB0, 18'h3F370 };
		6'h03: { re, im } = { 18'h0FF4D, 18'h3ED2A };
		6'h04: { re, im } = { 18'h0FEC3, 18'h3E6E8 };
		6'h05: { re, im } = { 18'h0FE12, 18'h3E0A9 };
		6'h06: { re, im } = { 18'h0FD39, 18'h3DA70 };
		6'h07: { re, im } = { 18'h0FC3A, 18'h3D43C };
		6'h08: { re, im } = { 18'h0FB13, 18'h3CE0E };
		6'h09: { re, im } = { 18'h0F9C6, 18'h3C7E9 };
		6'h0A: { re, im } = { 18'h0F852, 18'h3C1CC };
		6'h0B: { re, im } = { 18'h0F6B9, 18'h3BBB8 };
		6'h0C: { re, im } = { 18'h0F4F9, 18'h3B5B0 };
		6'h0D: { re, im } = { 18'h0F313, 18'h3AFB2 };
		6'h0E: { re, im } = { 18'h0F108, 18'h3A9C1 };
		6'h0F: { re, im } = { 18'h0EED7, 18'h3A3DE };
		6'h10: { re, im } = { 18'h0EC82, 18'h39E08 };
		6'h11: { re, im } = { 18'h0EA08, 18'h39842 };
		6'h12: { re, im } = { 18'h0E76A, 18'h3928C };
		6'h13: { re, im } = { 18'h0E4A9, 18'h38CE6 };
		6'h14: { re, im } = { 18'h0E1C4, 18'h38753 };
		6'h15: { re, im } = { 18'h0DEBD, 18'h381D1 };
		6'h16: { re, im } = { 18'h0DB93, 18'h37C64 };
		6'h17: { re, im } = { 18'h0D847, 18'h3770A };
		6'h18: { re, im } = { 18'h0D4DA, 18'h371C6 };
		6'h19: { re, im } = { 18'h0D14C, 18'h36C98 };
		6'h1A: { re, im } = { 18'h0CD9E, 18'h36780 };
		6'h1B: { re, im } = { 18'h0C9D0, 18'h36280 };
		6'h1C: { re, im } = { 18'h0C5E3, 18'h35D99 };
		6'h1D: { re, im } = { 18'h0C1D7, 18'h358CA };
		6'h1E: { re, im } = { 18'h0BDAE, 18'h35415 };
		6'h1F: { re, im } = { 18'h0B967, 18'h34F7A };
		6'h20: { re, im } = { 18'h0B504, 18'h34AFB };
		6'h21: { re, im } = { 18'h0B085, 18'h34698 };
		6'h22: { re, im } = { 18'h0ABEA, 18'h34251 };
		6'h23: { re, im } = { 18'h0A735, 18'h33E28 };
		6'h24: { re, im } = { 18'h0A266, 18'h33A1C };
		6'h25: { re, im } = { 18'h09D7F, 18'h3362F };
		6'h26: { re, im } = { 18'h0987F, 18'h33261 };
		6'h27: { re, im } = { 18'h09367, 18'h32EB3 };
		6'h28: { re, im } = { 18'h08E39, 18'h32B25 };
		6'h29: { re, im } = { 18'h088F5, 18'h327B8 };
		6'h2A: { re, im } = { 18'h0839B, 18'h3246C };
		6'h2B: { re, im } = { 18'h07E2E, 18'h32142 };
		6'h2C: { re, im } = { 18'h078AC, 18'h31E3B };
		6'h2D: { re, im } = { 18'h07319, 18'h31B56 };
		6'h2E: { re, im } = { 18'h06D73, 18'h31895 };
		6'h2F: { re, im } = { 18'h067BD, 18'h315F7 };
		6'h30: { re, im } = { 18'h061F7, 18'h3137D };
		6'h31: { re, im } = { 18'h05C21, 18'h31128 };
		6'h32: { re, im } = { 18'h0563E, 18'h30EF7 };
		6'h33: { re, im } = { 18'h0504D, 18'h30CEC };
		6'h34: { re, im } = { 18'h04A4F, 18'h30B06 };
		6'h35: { re, im } = { 18'h04447, 18'h30946 };
		6'h36: { re, im } = { 18'h03E33, 18'h307AD };
		6'h37: { re, im } = { 18'h03816, 18'h30639 };
		6'h38: { re, im } = { 18'h031F1, 18'h304EC };
		6'h39: { re, im } = { 18'h02BC3, 18'h303C5 };
		6'h3A: { re, im } = { 18'h0258F, 18'h302C6 };
		6'h3B: { re, im } = { 18'h01F56, 18'h301ED };
		6'h3C: { re, im } = { 18'h01917, 18'h3013C };
		6'h3D: { re, im } = { 18'h012D5, 18'h300B2 };
		6'h3E: { re, im } = { 18'h00C8F, 18'h3004F };
		6'h3F: { re, im } = { 18'h00648, 18'h30014 };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule
