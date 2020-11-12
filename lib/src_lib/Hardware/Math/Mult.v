module lpm_mult ( 
    dataa,  // Multiplicand. (Required)
    datab,  // Multiplier. (Required)
    sum,    // Partial sum.
    aclr,   // Asynchronous clear for pipelined usage.
    sclr,   // Synchronous clear for pipelined usage.
    clock,  // Clock for pipelined usage.
    clken,  // Clock enable for pipelined usage.
    result  // result = dataa[] * datab[] + sum. The product LSB is aligned with the sum LSB.
);

// GLOBAL PARAMETER DECLARATION
    parameter lpm_widtha = 1; // Width of the dataa[] port. (Required)
    parameter lpm_widthb = 1; // Width of the datab[] port. (Required)
    parameter lpm_widthp = 1; // Width of the result[] port. (Required)
    parameter lpm_widths = 1; // Width of the sum[] port. (Required)
    parameter lpm_representation  = "UNSIGNED"; // Type of multiplication performed
    parameter lpm_pipeline  = 0; // Number of clock cycles of latency 
    parameter lpm_type = "lpm_mult";
    parameter lpm_hint = "UNUSED";

// INPUT PORT DECLARATION    
    input  [lpm_widtha-1:0] dataa;
    input  [lpm_widthb-1:0] datab;
    input  [lpm_widths-1:0] sum;
    input  aclr;
    input  sclr;
    input  clock;
    input  clken;
    
// OUTPUT PORT DECLARATION    
    output [lpm_widthp-1:0] result;

// INTERNAL REGISTER/SIGNAL DECLARATION
    reg [lpm_widthp-1:0] result_pipe [lpm_pipeline+1:0];
    reg [lpm_widthp-1:0] i_prod;
    reg [lpm_widthp-1:0] t_p;
    reg [lpm_widths-1:0] i_prod_s;
    reg [lpm_widths-1:0] t_s;
    reg [lpm_widtha+lpm_widthb-1:0] i_prod_ab;
    reg [lpm_widtha-1:0] t_a;
    reg [lpm_widthb-1:0] t_b;
    reg sign_ab;
    reg sign_s;
    reg [8*5:1] input_a_is_constant;
    reg [8*5:1] input_b_is_constant;
    reg [8*lpm_widtha:1] input_a_fixed_value;
    reg [8*lpm_widthb:1] input_b_fixed_value;
    reg [lpm_widtha-1:0] dataa_fixed;
    reg [lpm_widthb-1:0] datab_fixed;


// LOCAL INTEGER DECLARATION
    integer i;
    integer pipe_ptr;

// INTERNAL WIRE DECLARATION
    wire [lpm_widtha-1:0] dataa_wire;
    wire [lpm_widthb-1:0] datab_wire;

// INTERNAL TRI DECLARATION
    tri0 aclr;
    tri0 sclr;
    tri0 clock;
    tri1 clken;

    wire i_aclr;
    wire i_sclr;
    wire i_clock;
    wire i_clken;
    buf (i_aclr, aclr);
    buf (i_sclr, sclr);
    buf (i_clock, clock);
    buf (i_clken, clken);

// COMPONENT INSTANTIATIONS
    LPM_HINT_EVALUATION eva();

// FUNCTION DECLARATION   
    // convert string to binary bits.
    function integer str2bin; 
    input [8*256:1] str;
    input str_width;

    reg [8*256:1] reg_str;
    reg [255:0] bin;
    reg [8:1] tmp;
    integer m;
    integer str_width; 

    begin
        reg_str = str;
        for (m=0; m < str_width; m=m+1)
        begin
            tmp = reg_str[8:1];
            reg_str = reg_str >> 8;

            case (tmp)
                "0"    : bin[m] = 1'b0;
                "1"    : bin[m] = 1'b1;
                default: bin[m] = 1'bx;
            endcase
        end
        str2bin = bin;
    end
    endfunction

// INITIAL CONSTRUCT BLOCK
    initial
    begin
        // check if lpm_widtha > 0
        if (lpm_widtha <= 0)
        begin
            $display("Error!  lpm_widtha must be greater than 0.\n");
            $display("Time: %0t  Instance: %m", $time);
            $finish;
        end    
        // check if lpm_widthb > 0
        if (lpm_widthb <= 0)
        begin
            $display("Error!  lpm_widthb must be greater than 0.\n");
            $display("Time: %0t  Instance: %m", $time);
            $finish;
        end
        // check if lpm_widthp > 0
        if (lpm_widthp <= 0)
        begin
            $display("Error!  lpm_widthp must be greater than 0.\n");
            $display("Time: %0t  Instance: %m", $time);
            $finish;
        end
        // check if lpm_widthp > 0
        if (lpm_widths <= 0)
        begin
            $display("Error!  lpm_widths must be greater than 0.\n");
            $display("Time: %0t  Instance: %m", $time);
            $finish;
        end
        // check for valid lpm_rep value
        if ((lpm_representation != "SIGNED") && (lpm_representation != "UNSIGNED"))
        begin
            $display("Error!  lpm_representation value must be \"SIGNED\" or \"UNSIGNED\".", $time);
            $display("Time: %0t  Instance: %m", $time);
            $finish;
        end
        
        input_a_is_constant = eva.GET_PARAMETER_VALUE(lpm_hint, "INPUT_A_IS_CONSTANT");

        if (input_a_is_constant == "FIXED")
        begin
            input_a_fixed_value = eva.GET_PARAMETER_VALUE(lpm_hint, "INPUT_A_FIXED_VALUE");
            dataa_fixed = str2bin(input_a_fixed_value, lpm_widtha);
        end
            
        input_b_is_constant = eva.GET_PARAMETER_VALUE(lpm_hint, "INPUT_B_IS_CONSTANT");

        if (input_b_is_constant == "FIXED")
        begin
            input_b_fixed_value = eva.GET_PARAMETER_VALUE(lpm_hint, "INPUT_B_FIXED_VALUE");
            datab_fixed = str2bin(input_b_fixed_value, lpm_widthb);
        end

        pipe_ptr = 0;
    end

// ALWAYS CONSTRUCT BLOCK
    always @(dataa_wire or datab_wire or sum)
    begin
        t_a = dataa_wire;
        t_b = datab_wire;
        t_s = sum;
        sign_ab = 1'b0;
        sign_s = 1'b0;

        // if inputs are sign number    
        if (lpm_representation == "SIGNED")
        begin
            sign_ab = dataa_wire[lpm_widtha-1] ^ datab_wire[lpm_widthb-1];
            sign_s = sum[lpm_widths-1];

            // if negative number, represent them as 2 compliment number.
            if (dataa_wire[lpm_widtha-1] == 1)
                t_a = (~dataa_wire) + 1;
            if (datab_wire[lpm_widthb-1] == 1)
                t_b = (~datab_wire) + 1;
            if (sum[lpm_widths-1] == 1)
                t_s = (~sum) + 1;
        end

        // if sum port is not used
        if (sum === {lpm_widths{1'bz}})
        begin
            t_s = {lpm_widths{1'b0}};
            sign_s = 1'b0;
        end

        if (sign_ab == sign_s)
        begin
            i_prod = (t_a * t_b) + t_s;
            i_prod_s = (t_a * t_b) + t_s;
            i_prod_ab = (t_a * t_b) + t_s;
        end
        else
        begin
            i_prod = (t_a * t_b) - t_s;
            i_prod_s = (t_a * t_b) - t_s;
            i_prod_ab = (t_a * t_b) - t_s;
        end

        // if dataa[] * datab[] produces negative number, compliment the result
        if (sign_ab)
        begin
            i_prod = (~i_prod) + 1;
            i_prod_s = (~i_prod_s) + 1;
            i_prod_ab = (~i_prod_ab) + 1;
        end

        if ((lpm_widthp < lpm_widths) || (lpm_widthp < (lpm_widtha+lpm_widthb)))
            for (i = 0; i < lpm_widthp; i = i + 1)
                i_prod[lpm_widthp-1-i] = (lpm_widths > lpm_widtha+lpm_widthb)
                                            ? i_prod_s[lpm_widths-1-i]
                                            : i_prod_ab[lpm_widtha+lpm_widthb-1-i];

    end

    always @(posedge i_clock or posedge i_aclr)
    begin
        if (i_aclr) // clear the pipeline for result to 0
        begin
            for (i = 0; i <= (lpm_pipeline + 1); i = i + 1)
                result_pipe[i] <= {lpm_widthp{1'b0}};
                
            pipe_ptr <= 0;
        end
        else if (i_clken == 1)
        begin
            if(i_sclr)
            begin
                for (i = 0; i <= (lpm_pipeline + 1); i = i + 1)
                result_pipe[i] <= {lpm_widthp{1'b0}};
                
                pipe_ptr <= 0;
            end
            else
            begin
                result_pipe[pipe_ptr] <= i_prod;

                if (lpm_pipeline > 1)
                    pipe_ptr <= (pipe_ptr + 1) % lpm_pipeline;
            end
        end
    end

// CONTINOUS ASSIGNMENT
    assign dataa_wire =  (input_a_is_constant == "FIXED") ? dataa_fixed : dataa;
    assign datab_wire =  (input_b_is_constant == "FIXED") ? datab_fixed : datab;
    assign result = (lpm_pipeline > 0) ? result_pipe[pipe_ptr] : i_prod;

endmodule // lpm_mult
// END OF MODULE