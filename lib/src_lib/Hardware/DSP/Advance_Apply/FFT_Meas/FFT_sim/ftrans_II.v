`timescale 1ns/100ps
`include "fft_inc.h"

module ftrans_II
#( parameter FFT_STG = 7 )
(
	input iclk,

	input                    ien,
	input [`TOTAL_STAGE-1:0] iaddr,
	input [`CPLX_WIDTH-1:0]  idata,

	output reg                    oen,
	output reg [`TOTAL_STAGE-1:0] oaddr,
	output reg [`CPLX_WIDTH-1:0]  odata
);
	
wire [`REAL_WIDTH-1:0] twiddle_ore;
wire [`IMGN_WIDTH-1:0] twiddle_oim;

wire [MREAL_WIDTH-1:0] mul_ore;
wire [MIMGN_WIDTH-1:0] mul_oim;

	reg [`TOTAL_STAGE-1:0] oaddr_d [MULT_OP_DLY-1:0];
reg [MULT_OP_DLY-1:0] oen_d = 0;

// generate a `MULT_OP_DLY`-clk-Delay
always @(posedge iclk) oaddr_d[0] <= #SIM_DLY iaddr;
generate	// oaddr_d[5:0] <= #SIM_DLY {oaddr_d[4:0], iaddr};
	genvar index;
	for(index=0; index<MULT_OP_DLY-1; index=index+1) begin: ShiftReg_iaddr
		always @(posedge iclk) oaddr_d[index+1] <= #SIM_DLY oaddr_d[index];
	end
endgenerate
always @(posedge iclk) oaddr <= #SIM_DLY oaddr_d[MULT_OP_DLY-1];
	
always @(posedge iclk)
begin
	oen_d <= #SIM_DLY {oen_d[MULT_OP_DLY-2:0], ien};
	oen <= #SIM_DLY oen_d[MULT_OP_DLY-1];
end

wire k1 = iaddr[FFT_STG-1];
wire k2 = iaddr[FFT_STG-2];
wire [FFT_STG-3:0] n3 = iaddr[FFT_STG-3:0];
wire [FFT_STG-2:0] addr1 = k1 ? {1'b0, n3} : { (FFT_STG-1) {1'b0} };
wire [FFT_STG-2:0] addr2 = k2 ? {n3, 1'b0} : { (FFT_STG-1) {1'b0} };
wire [FFT_STG-1:0] ROM_addr = addr1 + addr2;	// ROM_addr = (k1 + 2*k2) * n3

generate
	case(FFT_STG)
		3:  ftwiddle3 ftwiddle3_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		4:  ftwiddle4 ftwiddle4_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		5:  ftwiddle5 ftwiddle5_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		6:  ftwiddle6 ftwiddle6_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		7:  ftwiddle7 ftwiddle7_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		8:  ftwiddle8 ftwiddle8_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		9:  ftwiddle9 ftwiddle9_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		10: ftwiddle10 ftwiddle10_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
		11: ftwiddle11 ftwiddle11_inst (
				.idx(ROM_addr),
				.ore(twiddle_ore),
				.oim(twiddle_oim)
			);
	endcase
endgenerate

generate
	if(2==MULT_OP_DLY)
		cmpl_mul_2clk cmpl_mul_2c_inst(
			.clock(iclk),
			.dataa_real(idata[REAL_MSB:REAL_LSB]),
			.dataa_imag(idata[IMGN_MSB:IMGN_LSB]),
			.datab_real(twiddle_ore),
			.datab_imag(twiddle_oim),
			.result_real(mul_ore),
			.result_imag(mul_oim)
		);
		
	else if(6==MULT_OP_DLY)
		cmpl_mul_6clk cmpl_mul_6c_inst(
			.clock(iclk),
			.dataa_real(idata[REAL_MSB:REAL_LSB]),
			.dataa_imag(idata[IMGN_MSB:IMGN_LSB]),
			.datab_real(twiddle_ore),
			.datab_imag(twiddle_oim),
			.result_real(mul_ore),
			.result_imag(mul_oim)
		);
		
	else begin
		// $write("Warnning: MULT_OP_DLY is Invalid! Use `MULT_OP_DLY=2`.\n");
		cmpl_mul_2clk cmpl_mul_2c_inst(
			.clock(iclk),
			.dataa_real(idata[REAL_MSB:REAL_LSB]),
			.dataa_imag(idata[IMGN_MSB:IMGN_LSB]),
			.datab_real(twiddle_ore),
			.datab_imag(twiddle_oim),
			.result_real(mul_ore),
			.result_imag(mul_oim)
		);
		
	end
		
endgenerate

always @(posedge iclk) odata <= #SIM_DLY { mul_ore[REAL_MMSB:REAL_MLSB], mul_oim[IMGN_MMSB:IMGN_MLSB] }; 

endmodule
