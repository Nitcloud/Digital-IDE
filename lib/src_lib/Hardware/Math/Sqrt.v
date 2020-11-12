`timescale 1 ps / 1 ps

module sqrt #
(
// GLOBAL PARAMETER DECLARATION
    parameter q_port_width = 16, // The width of the q port
    parameter r_port_width = 16, // The width of the remainder port
    parameter width = 16,        // The width of the radical
    parameter pipeline = 4      // The latency for the output
)
(
// INPUT PORT DECLARATION
    input [width - 1 : 0] radical,
    input clk,
    input ena,
    input aclr,

// OUTPUT PORT DECLARATION
    output [q_port_width - 1 : 0] q,
    output [r_port_width - 1 : 0] remainder
);

// INTERNAL REGISTERS DECLARATION
reg [q_port_width - 1 : 0] q_pipeline[(pipeline +1) : 0];
reg [r_port_width - 1 : 0] remainder_pipeline[(pipeline +1) : 0];
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
integer i1;
integer pipe_ptr;


// INITIAL CONSTRUCT BLOCK
initial begin : INITIALIZE
    // Check for illegal mode
    if(width < 1) begin
        $display("width (%d) must be greater than 0.(ERROR)", width);
        $finish;
    end
    pipe_ptr = 0;
    for (i = 0; i < (pipeline + 1); i = i + 1) begin
        q_pipeline[i] <= 0;
        remainder_pipeline[i] <= 0;
    end
end

// ALWAYS CONSTRUCT BLOCK
always @(posedge clk or posedge aclr) begin : SQUARE_ROOT 
    value1 <= 0;
    value2 <= 0;
    q_index <= (width - 1) / 2;
    q_temp <= {q_port_width{1'b0}};
    r_temp <= {(r_port_width + 1){1'b0}};
    q_value_temp <= {q_port_width{1'b0}};
    q_value_comp <= {(r_port_width + 1){1'b0}};
    if((width % 2) == 1) begin
        index  <= width + 1;
        value1 <= 0;
        value2 <= (radical[index - 2] === 1'b1) ? 1'b1 : 1'b0;
    end
    else if (width > 1) begin
        index  <= width;
        value1 <= (radical[index - 1] === 1'b1) ? 1'b1 : 1'b0;
        value2 <= (radical[index - 2] === 1'b1) ? 1'b1 : 1'b0;
    end
    for(index = index - 2; index >= 0; index = index - 2) begin
        r_temp <=  (r_temp<<2) + (2 * value1) + value2;
        q_value_comp <= ((q_value_temp<<2)  + 1);
        if (r_temp >= q_value_comp) begin 
            r_temp <= r_temp - q_value_comp;
            q_value_temp <= (q_value_temp<<1) + 1;
            q_temp[q_index] <= 1'b1;
        end
        else begin 
            q_value_temp <= q_value_temp<<1; 
            q_temp[q_index] <= 1'b0;
        end 
        if(index >= 2) begin
            value1 <= (radical[index - 1] === 1'b1)? 1: 0;
            value2 <= (radical[index - 2] === 1'b1)? 1: 0;
        end 
        q_index <= q_index - 1; 
    end
end

// store the result to a pipeline(to create the latency)
always @(posedge clk or posedge aclr) begin
    if (aclr) begin
        for (i1 = 0; i1 < (pipeline + 1); i1 = i1 + 1) begin
            q_pipeline[i1] <= 0;
            remainder_pipeline[i1] <= 0;
        end
    end
    else if (ena == 1) begin          
        remainder_pipeline[pipe_ptr] <= r_temp[(r_port_width - 1) : 0];
        q_pipeline[pipe_ptr] <= q_temp;
        if (pipeline > 1)
            pipe_ptr <= (pipe_ptr + 1) % pipeline;
    end
end

// CONTINOUS ASSIGNMENT
assign q = (pipeline > 0) ? q_pipeline[pipe_ptr] : q_temp;
assign remainder = (pipeline > 0) ? remainder_pipeline[pipe_ptr] : r_temp[(r_port_width - 1) : 0];
    
endmodule //altsqrt