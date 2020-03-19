module testbench();

parameter DATA_WIDTH = 32;
parameter ADDR_WIDTH = 32;
parameter MAIN_FRE   = 100; //unit MHz
reg                   clk       = 0;
reg                   sys_rst_n = 0;
reg                   valid_out = 0;
reg [DATA_WIDTH-1:0]  data = 0;
reg [ADDR_WIDTH-1:0]  addr = 0;

always begin
    #(500/MAIN_FRE) clk = ~clk;
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




initial begin
    $finish;
end

initial begin            
    $dumpfile("wave.vcd");        //生成的vcd文件名称
    $dumpvars(0, testbench);    //tb模块名称
end

endmodule  //TOP