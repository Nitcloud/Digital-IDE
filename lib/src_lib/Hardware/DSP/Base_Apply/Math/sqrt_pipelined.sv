module sqrt_pipelined #
(
    parameter BITS = 32,
    parameter UP   = BITS-1
)
(
	input         clk,
	input  [UP:0] x,
	output [UP:0] osqrt,
	output [UP:0] odebug
);

reg [UP:0] cr   [UP:0];
reg [UP:0] crr  [UP:0];
reg [UP:0] _crr [UP:0];
reg [UP:0] cx   [UP:0];

`define BOUT (UP)	
`define MEDI  (64'h0000000000000001<<(BITS-1))
`define MEDI2 (64'h0000000000000001<<(BITS-1))

always @( posedge clk ) begin
	integer ind;
	cx[0]<= x;
	cr[0]<=  `MEDI;
	crr[0]<= `MEDI2;
	for (ind=0; ind< UP; ind=ind+1) begin
		if ( cx[ind]>crr[ind] ) begin
			cr [ind+1]<= cr [ind] + (`MEDI>>(ind+1));
			crr[ind+1]<= crr [ind] + (`MEDI2>>(2*(ind+1))) + ( (cr[ind])>>(ind) );
		end
		else begin
			cr [ind+1]<= cr [ind] - (`MEDI>>(ind+1));
			crr[ind+1]<= crr [ind] + (`MEDI2>>(2*(ind+1))) - ( (cr[ind])>>(ind) );
		end
		cx [ind+1]<= cx [ind];
	end
end

assign osqrt= cr[`BOUT];
assign odebug= crr[`BOUT];

endmodule
	
	

	