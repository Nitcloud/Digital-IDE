`timescale 1 ns / 1 ns

module Line_Shift_RAM
#(
	parameter Delay_Length = 640,
	parameter INPUT_WIDTH = 8
)
(
	input	  					   clock,
	input	  					   clken, 
	input	  					   clr,
	input	[INPUT_WIDTH - 1 : 0]  shiftin,
	output	[INPUT_WIDTH - 1 : 0]  shiftout
);

reg [15:0] RAM_read_CNT = 1;
reg [15:0] RAM_write_CNT = 0;
reg	[INPUT_WIDTH - 1 : 0] ram_buf = 0;
reg	[INPUT_WIDTH - 1 : 0] shift_ram [Delay_Length:0];

integer m;
initial begin
	for (m = 0; m<=Delay_Length; m=m+1) begin
		shift_ram[m] = 0;
	end    
end

always @(posedge clock) begin
    if (RAM_read_CNT == Delay_Length) begin
        RAM_read_CNT <= 16'd0;
    end
    else
        RAM_read_CNT <= RAM_read_CNT + 1;
end

always @(posedge clock) begin
    if (RAM_write_CNT == Delay_Length) begin
        RAM_write_CNT <= 16'd0;
    end
    else
        RAM_write_CNT <= RAM_write_CNT + 1;
end

always @(posedge clock) begin	
	if (clken) begin
		shift_ram[RAM_write_CNT] <= shiftin;
	end	
	else begin
		shift_ram[RAM_write_CNT] <= 0;
	end
		ram_buf <= shift_ram[RAM_read_CNT];
end

assign shiftout = ram_buf;

endmodule

