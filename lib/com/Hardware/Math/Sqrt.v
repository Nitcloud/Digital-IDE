`timescale 1 ps / 1 ps

module Sqrt # (
// GLOBAL PARAMETER DECLARATION
    parameter q_port_width = 16, // The width of the q port
    parameter r_port_width = 16, // The width of the remainder port
    parameter width        = 16  // The width of the radical
) (
// INPUT PORT DECLARATION
    input  [width - 1 : 0]        radical,
// OUTPUT PORT DECLARATION
    output [q_port_width - 1 : 0] q,
    output [r_port_width - 1 : 0] remainder
);

// INTERNAL REGISTERS DECLARATION
reg [r_port_width : 0]     r_temp = 0;
reg [q_port_width - 1 : 0] q_temp = 0;
reg [q_port_width - 1 : 0] q_value_temp = 0;
reg [r_port_width : 0]     q_value_comp = 0;

// LOCAL INTEGER DECLARATION
integer value1;
integer value2;
integer index;
integer q_index;
integer i;
integer pipe_ptr;

// INITIAL CONSTRUCT BLOCK
initial begin : INITIALIZE
    // Check for illegal mode
    if(width < 1) begin
        $display("width (%d) must be greater than 0.(ERROR)", width);
        $finish;
    end
end

// ALWAYS CONSTRUCT BLOCK
always @(radical) begin : SQUARE_ROOT 
    value1 = 0;
    value2 = 0;
    q_index = (width - 1) >> 1;
    q_temp  = {q_port_width{1'b0}};
    r_temp  = {(r_port_width + 1){1'b0}};
    q_value_temp = {q_port_width{1'b0}};
    q_value_comp = {(r_port_width + 1){1'b0}};
    if((width[0]) == 1) begin
        index  = width + 1;
        value1 = 0;
        value2 = (radical[index - 2] === 1'b1) ? 1'b1 : 1'b0;
    end
    else if (width > 1) begin
        index  = width;
        value1 = (radical[index - 1] === 1'b1) ? 1'b1 : 1'b0;
        value2 = (radical[index - 2] === 1'b1) ? 1'b1 : 1'b0;
    end
    for(index = index - 2; index >= 0; index = index - 2) begin
        r_temp =  (r_temp<<2) + (2 * value1) + value2;
        q_value_comp = ((q_value_temp<<2)  + 1);
        if (r_temp >= q_value_comp) begin 
            r_temp = r_temp - q_value_comp;
            q_value_temp = (q_value_temp<<1) + 1;
            q_temp[q_index] = 1'b1;
        end
        else begin 
            q_value_temp = q_value_temp<<1; 
            q_temp[q_index] = 1'b0;
        end 
        if(index >= 2) begin
            value1 = (radical[index - 1] === 1'b1)? 1: 0;
            value2 = (radical[index - 2] === 1'b1)? 1: 0;
        end 
        q_index = q_index - 1; 
    end
end

// CONTINOUS ASSIGNMENT
assign q = q_temp;
assign remainder = r_temp[(r_port_width - 1) : 0];
    
endmodule //altsqrt