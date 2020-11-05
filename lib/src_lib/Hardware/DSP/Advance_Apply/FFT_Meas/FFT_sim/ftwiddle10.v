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

module ftwiddle10 
(
	input      [9:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 10;

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
		8'h00: { re, im } = { 18'h10000, 18'h00000 };
		8'h01: { re, im } = { 18'h0FFFD, 18'h3FE6D };
		8'h02: { re, im } = { 18'h0FFFA, 18'h3FCDB };
		8'h03: { re, im } = { 18'h0FFF3, 18'h3FB49 };
		8'h04: { re, im } = { 18'h0FFEB, 18'h3F9B7 };
		8'h05: { re, im } = { 18'h0FFE0, 18'h3F825 };
		8'h06: { re, im } = { 18'h0FFD2, 18'h3F693 };
		8'h07: { re, im } = { 18'h0FFC2, 18'h3F502 };
		8'h08: { re, im } = { 18'h0FFB0, 18'h3F370 };
		8'h09: { re, im } = { 18'h0FF9B, 18'h3F1DE };
		8'h0A: { re, im } = { 18'h0FF83, 18'h3F04D };
		8'h0B: { re, im } = { 18'h0FF69, 18'h3EEBC };
		8'h0C: { re, im } = { 18'h0FF4D, 18'h3ED2A };
		8'h0D: { re, im } = { 18'h0FF2E, 18'h3EB9A };
		8'h0E: { re, im } = { 18'h0FF0D, 18'h3EA09 };
		8'h0F: { re, im } = { 18'h0FEE9, 18'h3E878 };
		8'h10: { re, im } = { 18'h0FEC3, 18'h3E6E8 };
		8'h11: { re, im } = { 18'h0FE9A, 18'h3E558 };
		8'h12: { re, im } = { 18'h0FE6F, 18'h3E3C8 };
		8'h13: { re, im } = { 18'h0FE42, 18'h3E239 };
		8'h14: { re, im } = { 18'h0FE12, 18'h3E0A9 };
		8'h15: { re, im } = { 18'h0FDDF, 18'h3DF1A };
		8'h16: { re, im } = { 18'h0FDAA, 18'h3DD8C };
		8'h17: { re, im } = { 18'h0FD73, 18'h3DBFD };
		8'h18: { re, im } = { 18'h0FD39, 18'h3DA70 };
		8'h19: { re, im } = { 18'h0FCFD, 18'h3D8E2 };
		8'h1A: { re, im } = { 18'h0FCBE, 18'h3D755 };
		8'h1B: { re, im } = { 18'h0FC7D, 18'h3D5C8 };
		8'h1C: { re, im } = { 18'h0FC3A, 18'h3D43C };
		8'h1D: { re, im } = { 18'h0FBF4, 18'h3D2B0 };
		8'h1E: { re, im } = { 18'h0FBAB, 18'h3D124 };
		8'h1F: { re, im } = { 18'h0FB61, 18'h3CF99 };
		8'h20: { re, im } = { 18'h0FB13, 18'h3CE0E };
		8'h21: { re, im } = { 18'h0FAC4, 18'h3CC84 };
		8'h22: { re, im } = { 18'h0FA72, 18'h3CAFA };
		8'h23: { re, im } = { 18'h0FA1D, 18'h3C971 };
		8'h24: { re, im } = { 18'h0F9C6, 18'h3C7E9 };
		8'h25: { re, im } = { 18'h0F96D, 18'h3C661 };
		8'h26: { re, im } = { 18'h0F911, 18'h3C4D9 };
		8'h27: { re, im } = { 18'h0F8B3, 18'h3C352 };
		8'h28: { re, im } = { 18'h0F852, 18'h3C1CC };
		8'h29: { re, im } = { 18'h0F7F0, 18'h3C046 };
		8'h2A: { re, im } = { 18'h0F78A, 18'h3BEC1 };
		8'h2B: { re, im } = { 18'h0F723, 18'h3BD3C };
		8'h2C: { re, im } = { 18'h0F6B9, 18'h3BBB8 };
		8'h2D: { re, im } = { 18'h0F64C, 18'h3BA35 };
		8'h2E: { re, im } = { 18'h0F5DD, 18'h3B8B3 };
		8'h2F: { re, im } = { 18'h0F56C, 18'h3B731 };
		8'h30: { re, im } = { 18'h0F4F9, 18'h3B5B0 };
		8'h31: { re, im } = { 18'h0F483, 18'h3B42F };
		8'h32: { re, im } = { 18'h0F40A, 18'h3B2B0 };
		8'h33: { re, im } = { 18'h0F390, 18'h3B131 };
		8'h34: { re, im } = { 18'h0F313, 18'h3AFB2 };
		8'h35: { re, im } = { 18'h0F294, 18'h3AE35 };
		8'h36: { re, im } = { 18'h0F212, 18'h3ACB8 };
		8'h37: { re, im } = { 18'h0F18E, 18'h3AB3C };
		8'h38: { re, im } = { 18'h0F108, 18'h3A9C1 };
		8'h39: { re, im } = { 18'h0F07F, 18'h3A847 };
		8'h3A: { re, im } = { 18'h0EFF4, 18'h3A6CE };
		8'h3B: { re, im } = { 18'h0EF67, 18'h3A555 };
		8'h3C: { re, im } = { 18'h0EED7, 18'h3A3DE };
		8'h3D: { re, im } = { 18'h0EE45, 18'h3A267 };
		8'h3E: { re, im } = { 18'h0EDB1, 18'h3A0F1 };
		8'h3F: { re, im } = { 18'h0ED1B, 18'h39F7C };
		8'h40: { re, im } = { 18'h0EC82, 18'h39E08 };
		8'h41: { re, im } = { 18'h0EBE7, 18'h39C95 };
		8'h42: { re, im } = { 18'h0EB4A, 18'h39B23 };
		8'h43: { re, im } = { 18'h0EAAA, 18'h399B2 };
		8'h44: { re, im } = { 18'h0EA08, 18'h39842 };
		8'h45: { re, im } = { 18'h0E964, 18'h396D3 };
		8'h46: { re, im } = { 18'h0E8BE, 18'h39565 };
		8'h47: { re, im } = { 18'h0E815, 18'h393F8 };
		8'h48: { re, im } = { 18'h0E76A, 18'h3928C };
		8'h49: { re, im } = { 18'h0E6BD, 18'h39121 };
		8'h4A: { re, im } = { 18'h0E60E, 18'h38FB7 };
		8'h4B: { re, im } = { 18'h0E55D, 18'h38E4E };
		8'h4C: { re, im } = { 18'h0E4A9, 18'h38CE6 };
		8'h4D: { re, im } = { 18'h0E3F3, 18'h38B80 };
		8'h4E: { re, im } = { 18'h0E33B, 18'h38A1A };
		8'h4F: { re, im } = { 18'h0E281, 18'h388B6 };
		8'h50: { re, im } = { 18'h0E1C4, 18'h38753 };
		8'h51: { re, im } = { 18'h0E106, 18'h385F0 };
		8'h52: { re, im } = { 18'h0E045, 18'h38490 };
		8'h53: { re, im } = { 18'h0DF82, 18'h38330 };
		8'h54: { re, im } = { 18'h0DEBD, 18'h381D1 };
		8'h55: { re, im } = { 18'h0DDF5, 18'h38074 };
		8'h56: { re, im } = { 18'h0DD2C, 18'h37F18 };
		8'h57: { re, im } = { 18'h0DC60, 18'h37DBD };
		8'h58: { re, im } = { 18'h0DB93, 18'h37C64 };
		8'h59: { re, im } = { 18'h0DAC3, 18'h37B0C };
		8'h5A: { re, im } = { 18'h0D9F1, 18'h379B5 };
		8'h5B: { re, im } = { 18'h0D91D, 18'h3785F };
		8'h5C: { re, im } = { 18'h0D847, 18'h3770A };
		8'h5D: { re, im } = { 18'h0D76F, 18'h375B7 };
		8'h5E: { re, im } = { 18'h0D695, 18'h37466 };
		8'h5F: { re, im } = { 18'h0D5B8, 18'h37315 };
		8'h60: { re, im } = { 18'h0D4DA, 18'h371C6 };
		8'h61: { re, im } = { 18'h0D3F9, 18'h37079 };
		8'h62: { re, im } = { 18'h0D317, 18'h36F2C };
		8'h63: { re, im } = { 18'h0D232, 18'h36DE1 };
		8'h64: { re, im } = { 18'h0D14C, 18'h36C98 };
		8'h65: { re, im } = { 18'h0D063, 18'h36B50 };
		8'h66: { re, im } = { 18'h0CF79, 18'h36A09 };
		8'h67: { re, im } = { 18'h0CE8C, 18'h368C4 };
		8'h68: { re, im } = { 18'h0CD9E, 18'h36780 };
		8'h69: { re, im } = { 18'h0CCAD, 18'h3663E };
		8'h6A: { re, im } = { 18'h0CBBB, 18'h364FD };
		8'h6B: { re, im } = { 18'h0CAC6, 18'h363BE };
		8'h6C: { re, im } = { 18'h0C9D0, 18'h36280 };
		8'h6D: { re, im } = { 18'h0C8D7, 18'h36144 };
		8'h6E: { re, im } = { 18'h0C7DD, 18'h36009 };
		8'h6F: { re, im } = { 18'h0C6E1, 18'h35ED0 };
		8'h70: { re, im } = { 18'h0C5E3, 18'h35D99 };
		8'h71: { re, im } = { 18'h0C4E3, 18'h35C62 };
		8'h72: { re, im } = { 18'h0C3E1, 18'h35B2E };
		8'h73: { re, im } = { 18'h0C2DD, 18'h359FB };
		8'h74: { re, im } = { 18'h0C1D7, 18'h358CA };
		8'h75: { re, im } = { 18'h0C0D0, 18'h3579A };
		8'h76: { re, im } = { 18'h0BFC6, 18'h3566C };
		8'h77: { re, im } = { 18'h0BEBB, 18'h35540 };
		8'h78: { re, im } = { 18'h0BDAE, 18'h35415 };
		8'h79: { re, im } = { 18'h0BC9F, 18'h352EC };
		8'h7A: { re, im } = { 18'h0BB8E, 18'h351C4 };
		8'h7B: { re, im } = { 18'h0BA7B, 18'h3509F };
		8'h7C: { re, im } = { 18'h0B967, 18'h34F7A };
		8'h7D: { re, im } = { 18'h0B851, 18'h34E58 };
		8'h7E: { re, im } = { 18'h0B739, 18'h34D37 };
		8'h7F: { re, im } = { 18'h0B61F, 18'h34C18 };
		8'h80: { re, im } = { 18'h0B504, 18'h34AFB };
		8'h81: { re, im } = { 18'h0B3E7, 18'h349E0 };
		8'h82: { re, im } = { 18'h0B2C8, 18'h348C6 };
		8'h83: { re, im } = { 18'h0B1A7, 18'h347AE };
		8'h84: { re, im } = { 18'h0B085, 18'h34698 };
		8'h85: { re, im } = { 18'h0AF60, 18'h34584 };
		8'h86: { re, im } = { 18'h0AE3B, 18'h34471 };
		8'h87: { re, im } = { 18'h0AD13, 18'h34360 };
		8'h88: { re, im } = { 18'h0ABEA, 18'h34251 };
		8'h89: { re, im } = { 18'h0AABF, 18'h34144 };
		8'h8A: { re, im } = { 18'h0A993, 18'h34039 };
		8'h8B: { re, im } = { 18'h0A865, 18'h33F2F };
		8'h8C: { re, im } = { 18'h0A735, 18'h33E28 };
		8'h8D: { re, im } = { 18'h0A604, 18'h33D22 };
		8'h8E: { re, im } = { 18'h0A4D1, 18'h33C1E };
		8'h8F: { re, im } = { 18'h0A39D, 18'h33B1C };
		8'h90: { re, im } = { 18'h0A266, 18'h33A1C };
		8'h91: { re, im } = { 18'h0A12F, 18'h3391E };
		8'h92: { re, im } = { 18'h09FF6, 18'h33822 };
		8'h93: { re, im } = { 18'h09EBB, 18'h33728 };
		8'h94: { re, im } = { 18'h09D7F, 18'h3362F };
		8'h95: { re, im } = { 18'h09C41, 18'h33539 };
		8'h96: { re, im } = { 18'h09B02, 18'h33444 };
		8'h97: { re, im } = { 18'h099C1, 18'h33352 };
		8'h98: { re, im } = { 18'h0987F, 18'h33261 };
		8'h99: { re, im } = { 18'h0973B, 18'h33173 };
		8'h9A: { re, im } = { 18'h095F6, 18'h33086 };
		8'h9B: { re, im } = { 18'h094AF, 18'h32F9C };
		8'h9C: { re, im } = { 18'h09367, 18'h32EB3 };
		8'h9D: { re, im } = { 18'h0921E, 18'h32DCD };
		8'h9E: { re, im } = { 18'h090D3, 18'h32CE8 };
		8'h9F: { re, im } = { 18'h08F86, 18'h32C06 };
		8'hA0: { re, im } = { 18'h08E39, 18'h32B25 };
		8'hA1: { re, im } = { 18'h08CEA, 18'h32A47 };
		8'hA2: { re, im } = { 18'h08B99, 18'h3296A };
		8'hA3: { re, im } = { 18'h08A48, 18'h32890 };
		8'hA4: { re, im } = { 18'h088F5, 18'h327B8 };
		8'hA5: { re, im } = { 18'h087A0, 18'h326E2 };
		8'hA6: { re, im } = { 18'h0864A, 18'h3260E };
		8'hA7: { re, im } = { 18'h084F3, 18'h3253C };
		8'hA8: { re, im } = { 18'h0839B, 18'h3246C };
		8'hA9: { re, im } = { 18'h08242, 18'h3239F };
		8'hAA: { re, im } = { 18'h080E7, 18'h322D3 };
		8'hAB: { re, im } = { 18'h07F8B, 18'h3220A };
		8'hAC: { re, im } = { 18'h07E2E, 18'h32142 };
		8'hAD: { re, im } = { 18'h07CCF, 18'h3207D };
		8'hAE: { re, im } = { 18'h07B6F, 18'h31FBA };
		8'hAF: { re, im } = { 18'h07A0F, 18'h31EF9 };
		8'hB0: { re, im } = { 18'h078AC, 18'h31E3B };
		8'hB1: { re, im } = { 18'h07749, 18'h31D7E };
		8'hB2: { re, im } = { 18'h075E5, 18'h31CC4 };
		8'hB3: { re, im } = { 18'h0747F, 18'h31C0C };
		8'hB4: { re, im } = { 18'h07319, 18'h31B56 };
		8'hB5: { re, im } = { 18'h071B1, 18'h31AA2 };
		8'hB6: { re, im } = { 18'h07048, 18'h319F1 };
		8'hB7: { re, im } = { 18'h06EDE, 18'h31942 };
		8'hB8: { re, im } = { 18'h06D73, 18'h31895 };
		8'hB9: { re, im } = { 18'h06C07, 18'h317EA };
		8'hBA: { re, im } = { 18'h06A9A, 18'h31741 };
		8'hBB: { re, im } = { 18'h0692C, 18'h3169B };
		8'hBC: { re, im } = { 18'h067BD, 18'h315F7 };
		8'hBD: { re, im } = { 18'h0664D, 18'h31555 };
		8'hBE: { re, im } = { 18'h064DC, 18'h314B5 };
		8'hBF: { re, im } = { 18'h0636A, 18'h31418 };
		8'hC0: { re, im } = { 18'h061F7, 18'h3137D };
		8'hC1: { re, im } = { 18'h06083, 18'h312E4 };
		8'hC2: { re, im } = { 18'h05F0E, 18'h3124E };
		8'hC3: { re, im } = { 18'h05D98, 18'h311BA };
		8'hC4: { re, im } = { 18'h05C21, 18'h31128 };
		8'hC5: { re, im } = { 18'h05AAA, 18'h31098 };
		8'hC6: { re, im } = { 18'h05931, 18'h3100B };
		8'hC7: { re, im } = { 18'h057B8, 18'h30F80 };
		8'hC8: { re, im } = { 18'h0563E, 18'h30EF7 };
		8'hC9: { re, im } = { 18'h054C3, 18'h30E71 };
		8'hCA: { re, im } = { 18'h05347, 18'h30DED };
		8'hCB: { re, im } = { 18'h051CA, 18'h30D6B };
		8'hCC: { re, im } = { 18'h0504D, 18'h30CEC };
		8'hCD: { re, im } = { 18'h04ECE, 18'h30C6F };
		8'hCE: { re, im } = { 18'h04D4F, 18'h30BF5 };
		8'hCF: { re, im } = { 18'h04BD0, 18'h30B7C };
		8'hD0: { re, im } = { 18'h04A4F, 18'h30B06 };
		8'hD1: { re, im } = { 18'h048CE, 18'h30A93 };
		8'hD2: { re, im } = { 18'h0474C, 18'h30A22 };
		8'hD3: { re, im } = { 18'h045CA, 18'h309B3 };
		8'hD4: { re, im } = { 18'h04447, 18'h30946 };
		8'hD5: { re, im } = { 18'h042C3, 18'h308DC };
		8'hD6: { re, im } = { 18'h0413E, 18'h30875 };
		8'hD7: { re, im } = { 18'h03FB9, 18'h3080F };
		8'hD8: { re, im } = { 18'h03E33, 18'h307AD };
		8'hD9: { re, im } = { 18'h03CAD, 18'h3074C };
		8'hDA: { re, im } = { 18'h03B26, 18'h306EE };
		8'hDB: { re, im } = { 18'h0399E, 18'h30692 };
		8'hDC: { re, im } = { 18'h03816, 18'h30639 };
		8'hDD: { re, im } = { 18'h0368E, 18'h305E2 };
		8'hDE: { re, im } = { 18'h03505, 18'h3058D };
		8'hDF: { re, im } = { 18'h0337B, 18'h3053B };
		8'hE0: { re, im } = { 18'h031F1, 18'h304EC };
		8'hE1: { re, im } = { 18'h03066, 18'h3049E };
		8'hE2: { re, im } = { 18'h02EDB, 18'h30454 };
		8'hE3: { re, im } = { 18'h02D4F, 18'h3040B };
		8'hE4: { re, im } = { 18'h02BC3, 18'h303C5 };
		8'hE5: { re, im } = { 18'h02A37, 18'h30382 };
		8'hE6: { re, im } = { 18'h028AA, 18'h30341 };
		8'hE7: { re, im } = { 18'h0271D, 18'h30302 };
		8'hE8: { re, im } = { 18'h0258F, 18'h302C6 };
		8'hE9: { re, im } = { 18'h02402, 18'h3028C };
		8'hEA: { re, im } = { 18'h02273, 18'h30255 };
		8'hEB: { re, im } = { 18'h020E5, 18'h30220 };
		8'hEC: { re, im } = { 18'h01F56, 18'h301ED };
		8'hED: { re, im } = { 18'h01DC6, 18'h301BD };
		8'hEE: { re, im } = { 18'h01C37, 18'h30190 };
		8'hEF: { re, im } = { 18'h01AA7, 18'h30165 };
		8'hF0: { re, im } = { 18'h01917, 18'h3013C };
		8'hF1: { re, im } = { 18'h01787, 18'h30116 };
		8'hF2: { re, im } = { 18'h015F6, 18'h300F2 };
		8'hF3: { re, im } = { 18'h01465, 18'h300D1 };
		8'hF4: { re, im } = { 18'h012D5, 18'h300B2 };
		8'hF5: { re, im } = { 18'h01143, 18'h30096 };
		8'hF6: { re, im } = { 18'h00FB2, 18'h3007C };
		8'hF7: { re, im } = { 18'h00E21, 18'h30064 };
		8'hF8: { re, im } = { 18'h00C8F, 18'h3004F };
		8'hF9: { re, im } = { 18'h00AFD, 18'h3003D };
		8'hFA: { re, im } = { 18'h0096C, 18'h3002D };
		8'hFB: { re, im } = { 18'h007DA, 18'h3001F };
		8'hFC: { re, im } = { 18'h00648, 18'h30014 };
		8'hFD: { re, im } = { 18'h004B6, 18'h3000C };
		8'hFE: { re, im } = { 18'h00324, 18'h30005 };
		8'hFF: { re, im } = { 18'h00192, 18'h30002 };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule
