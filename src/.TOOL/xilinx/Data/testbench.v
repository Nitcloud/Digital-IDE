module testbench();

parameter DATA_WIDTH = 32;
parameter ADDR_WIDTH = 32;
reg                   clk_100m  = 0;
reg                   sys_rst_n = 0;
reg [DATA_WIDTH-1:0]  data = 0;
reg [ADDR_WIDTH-1:0]  addr = 0;

wire         valid_out;
always begin
    #10 clk_100m = ~clk_100m;
end
always begin
    #50 sys_rst_n = 1;
end
always begin
    if (valid_out) begin
        #10 addr = addr + 1;#10;
    end
    else begin     
        #10 addr = 0;#10;
    end
end
always begin
    if (valid_out) begin
        #10 data = data + 1;#10;
    end
    else begin     
        #10 data = 0;#10;
    end
end








endmodule  //TOP