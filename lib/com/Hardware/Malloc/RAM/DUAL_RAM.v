module dual_ram #(
    parameter    INPUT_WIDTH  = 12,
    parameter    OUTPUT_WIDTH = 12
) (
    input      clk,
    input      RST,
    input  [INPUT_WIDTH - 1 : 0]    data_i,
    output [OUTPUT_WIDTH - 1 : 0]   data_o
);
    
endmodule  //dual_ram

// 异步读模式的双口分布式RAM
module rams_dist (
    input clk, we, 
    input [5:0]a, dpra, 
    input [15:0]di, 
    output [15:0]spo, dpo
);

reg [15:0] ram [63:0];

always @(posedge clk)
    if (we) ram[a] <= di;
assign spo = ram[a];
assign dpo = ram[dpra];
endmodule