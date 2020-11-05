// `ifndef __FFT_INC_H__
// `endif

`define TOTAL_STAGE   10		


localparam MULT_OP_DLY = 6;	
localparam SIM_DLY = 2;

`define DOUBLE_9BIT_MULT		
// address width
`ifdef DOUBLE_9BIT_MULT
	`define CPLX_WIDTH   36
	`define REAL_WIDTH   18
	`define IMGN_WIDTH   18

	localparam REAL_MSB = 35;
	localparam REAL_LSB = 18;
	localparam IMGN_MSB = 17;
	localparam IMGN_LSB = 0;

	// multiply complex
	localparam MCPLX_WIDTH = 72;
	localparam MREAL_WIDTH = 36;
	localparam MIMGN_WIDTH = 36;

	// from multiply complex to complex 
	localparam REAL_MMSB = 33;
	localparam REAL_MLSB = 16;
	localparam IMGN_MMSB = 33;
	localparam IMGN_MLSB = 16;
`else
	`define CPLX_WIDTH   36
	`define REAL_WIDTH   18
	`define IMGN_WIDTH   18
	
	localparam REAL_MSB = 35;
	localparam REAL_LSB = 18;
	localparam IMGN_MSB = 17;
	localparam IMGN_LSB = 0;

	// multiply complex
	localparam MCPLX_WIDTH = 72;
	localparam MREAL_WIDTH = 36;
	localparam MIMGN_WIDTH = 36;

	// from multiply complex to complex 
	localparam REAL_MMSB = 33;
	localparam REAL_MLSB = 16;
	localparam IMGN_MMSB = 33;
	localparam IMGN_MLSB = 16;
`endif

