`timescale 1ns/100ps
`include "fft_inc.h"
module ftwiddle7 
(
	input      [6:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
	
reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 7;

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
		5'h00: { re, im } = { 18'h0FFFF, 18'h00000 };
		5'h01: { re, im } = { 18'h0FFB0, 18'h3F370 };
		5'h02: { re, im } = { 18'h0FEC3, 18'h3E6E8 };
		5'h03: { re, im } = { 18'h0FD39, 18'h3DA70 };
		5'h04: { re, im } = { 18'h0FB13, 18'h3CE0E };
		5'h05: { re, im } = { 18'h0F852, 18'h3C1CC };
		5'h06: { re, im } = { 18'h0F4F9, 18'h3B5B0 };
		5'h07: { re, im } = { 18'h0F108, 18'h3A9C1 };
		5'h08: { re, im } = { 18'h0EC82, 18'h39E08 };
		5'h09: { re, im } = { 18'h0E76A, 18'h3928C };
		5'h0A: { re, im } = { 18'h0E1C4, 18'h38753 };
		5'h0B: { re, im } = { 18'h0DB93, 18'h37C64 };
		5'h0C: { re, im } = { 18'h0D4DA, 18'h371C6 };
		5'h0D: { re, im } = { 18'h0CD9E, 18'h36780 };
		5'h0E: { re, im } = { 18'h0C5E3, 18'h35D99 };
		5'h0F: { re, im } = { 18'h0BDAE, 18'h35415 };
		5'h10: { re, im } = { 18'h0B504, 18'h34AFB };
		5'h11: { re, im } = { 18'h0ABEA, 18'h34251 };
		5'h12: { re, im } = { 18'h0A266, 18'h33A1C };
		5'h13: { re, im } = { 18'h0987F, 18'h33261 };
		5'h14: { re, im } = { 18'h08E39, 18'h32B25 };
		5'h15: { re, im } = { 18'h0839B, 18'h3246C };
		5'h16: { re, im } = { 18'h078AC, 18'h31E3B };
		5'h17: { re, im } = { 18'h06D73, 18'h31895 };
		5'h18: { re, im } = { 18'h061F7, 18'h3137D };
		5'h19: { re, im } = { 18'h0563E, 18'h30EF7 };
		5'h1A: { re, im } = { 18'h04A4F, 18'h30B06 };
		5'h1B: { re, im } = { 18'h03E33, 18'h307AD };
		5'h1C: { re, im } = { 18'h031F1, 18'h304EC };
		5'h1D: { re, im } = { 18'h0258F, 18'h302C6 };
		5'h1E: { re, im } = { 18'h01917, 18'h3013C };
		5'h1F: { re, im } = { 18'h00C8F, 18'h3004F };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end
endmodule


module ftwiddle6 
(
	input [5:0] idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 6;

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
		4'h0: { re, im } = { 18'h10000, 18'h00000 };
		4'h1: { re, im } = { 18'h0FEC3, 18'h3E6E8 };
		4'h2: { re, im } = { 18'h0FB13, 18'h3CE0E };
		4'h3: { re, im } = { 18'h0F4F9, 18'h3B5B0 };
		4'h4: { re, im } = { 18'h0EC82, 18'h39E08 };
		4'h5: { re, im } = { 18'h0E1C4, 18'h38753 };
		4'h6: { re, im } = { 18'h0D4DA, 18'h371C6 };
		4'h7: { re, im } = { 18'h0C5E3, 18'h35D99 };
		4'h8: { re, im } = { 18'h0B504, 18'h34AFB };
		4'h9: { re, im } = { 18'h0A266, 18'h33A1C };
		4'hA: { re, im } = { 18'h08E39, 18'h32B25 };
		4'hB: { re, im } = { 18'h078AC, 18'h31E3B };
		4'hC: { re, im } = { 18'h061F7, 18'h3137D };
		4'hD: { re, im } = { 18'h04A4F, 18'h30B06 };
		4'hE: { re, im } = { 18'h031F1, 18'h304EC };
		4'hF: { re, im } = { 18'h01917, 18'h3013C };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule


module ftwiddle5 
(
	input      [4:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 5;

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
		3'h0: { re, im } = { 18'h10000, 18'h00000 };
		3'h1: { re, im } = { 18'h0FB13, 18'h3CE0E };
		3'h2: { re, im } = { 18'h0EC82, 18'h39E08 };
		3'h3: { re, im } = { 18'h0D4DA, 18'h371C6 };
		3'h4: { re, im } = { 18'h0B504, 18'h34AFB };
		3'h5: { re, im } = { 18'h08E39, 18'h32B25 };
		3'h6: { re, im } = { 18'h061F7, 18'h3137D };
		3'h7: { re, im } = { 18'h031F1, 18'h304EC };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule


module ftwiddle4 (
	input      [3:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

localparam TW_STAGE = 4;

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

always @(addr)
begin
	case(addr)
		2'h0: { re, im } = { 18'h10000, 18'h00000 };
		2'h1: { re, im } = { 18'h0EC82, 18'h39E08 };
		2'h2: { re, im } = { 18'h0B504, 18'h34AFB };
		2'h3: { re, im } = { 18'h061F7, 18'h3137D };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end

endmodule

module ftwiddle3 
(
	input      [2:0]             idx,
	output reg [`REAL_WIDTH-1:0] ore,
	output reg [`IMGN_WIDTH-1:0] oim
);
`include "fft_inc.h"

reg [`REAL_WIDTH-1:0] re;
reg [`IMGN_WIDTH-1:0] im;

wire [1:0] h_addr = idx[2:1];
wire addr = idx[0];

always @(*) begin
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
		1'h0: { re, im } = { 18'h10000, 18'h00000 };
		1'h1: { re, im } = { 18'h0B504, 18'h34AFB };
		default: { re, im } = { 18'h10000, 18'h00000 };
	endcase
end
	
endmodule

