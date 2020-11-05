// `ifndef __FFT_INC_H__
// `endif

`define TOTAL_STAGE   10		// 最多可以实现2048点(11阶)FFT/IFFT。

// 原来的乘法器需要6个周期，需要使用RAM资源做寄存操作。资源浪费严重。现在改成2个周期。缺点是最大工作频率降低。
// 利用这一点也可以实现可配置。
// 不指定的情况下，MULT_OP_DLY = 2。
localparam MULT_OP_DLY = 6;	

// 仿真使用，赋值时延。
localparam SIM_DLY = 2;

`define DOUBLE_9BIT_MULT		// 用来配置复数乘法器的位数。
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
	// `define CPLX_WIDTH   18
	// `define REAL_WIDTH   9
	// `define IMGN_WIDTH   9

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

