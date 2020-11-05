`timescale 1 ps / 1 ps

// MODULE DECLARATION
module shift_taps #
(
    parameter number_of_taps = 4,   // Specifies the number of regularly spaced
                                    //  taps along the shift register
    parameter tap_distance = 3,     // Specifies the distance between the
                                    //  regularly spaced taps in clock cycles
                                    //  This number translates to the number of
                                    //  memory words that will be needed
    parameter width = 8,            // Specifies the width of the input pattern
    parameter RAM_WIDTH = width * number_of_taps,
    parameter TOTAL_TAP_DISTANCE = number_of_taps * tap_distance,
    parameter power_up_state = "CLEARED" 
)
(
    // INPUT PORT DECLARATION
    input [width-1:0] shiftin,      // Data input to the shifter
    input clock,                    // Positive-edge triggered clock
    input clken,                    // Clock enable for the clock port
    input aclr,                     // Asynchronous clear port
    input sclr,                     // Synchronous clear port

    output [width-1:0] shiftout,    // Output from the end of the shift
                                    //  register
    output [RAM_WIDTH-1:0] taps     // Output from the regularly spaced taps
                                    //  along the shift register
);

// INTERNAL REGISTERS DECLARATION
reg [width-1:0]     shiftout_r = 0;
reg [RAM_WIDTH-1:0] taps_r = 0;
reg [width-1:0]     shiftout_tmp = 0;
reg [RAM_WIDTH-1:0] taps_tmp = 0;
reg [width-1:0]     contents [0:TOTAL_TAP_DISTANCE-1];

// LOCAL INTEGER DECLARATION
integer head;     // pointer to memory
integer i;        // for loop index
integer j;        // for loop index
integer k;        // for loop index
integer place;

// INITIAL CONSTRUCT BLOCK
initial begin
head = 0;
if (power_up_state == "CLEARED") begin
    shiftout_r = 0;
    shiftout_tmp = 0;
    for (i = 0; i < TOTAL_TAP_DISTANCE; i = i + 1) begin
        contents [i] = 0;
    end
    for (j = 0; j < RAM_WIDTH; j = j + 1) begin
        taps_r [j] = 0;
        taps_tmp [j] = 0;
    end
end
end

// ALWAYS CONSTRUCT BLOCK
always @(posedge clock or posedge aclr) begin
    if (aclr == 1'b1) begin
        for (k=0; k < TOTAL_TAP_DISTANCE; k=k+1)
            contents[k] = 0;
        head = 0;
        shiftout_tmp = 0;
        taps_tmp = 0;        
    end
    else begin
        if (clken == 1'b1) begin
            if (sclr == 1'b1) begin
                for (k=0; k < TOTAL_TAP_DISTANCE; k=k+1)
                    contents[k] = 0;
                head = 0;
                shiftout_tmp = 0;
                taps_tmp = 0;        
            end
            else
                contents[head] = shiftin;
            head = (head + 1) % TOTAL_TAP_DISTANCE;
            shiftout_tmp = contents[head];
            taps_tmp = 0;
            for (k=0; k < number_of_taps; k=k+1) begin
                place = (((number_of_taps - k - 1) * tap_distance) + head ) % TOTAL_TAP_DISTANCE;
                taps_tmp = taps_tmp | (contents[place] << (k * width));
            end
        end
    end
end

always @(shiftout_tmp) begin
    shiftout_r <= shiftout_tmp;
end

always @(taps_tmp) begin
    taps_r <= taps_tmp;
end

assign shiftout = shiftout_r;
assign taps = taps_r;

endmodule // altshift_taps