`define cow 34

module dependence_1 (
    input a, b, c,
    output Q 
);

    // a & b | ((b & c) & (b | c))
    // &=*, |=+               AB + BC(B+C)
    // Distribute             AB + BBC + BCC
    // Simplify AA = A        AB + BC + BC
    // Simplify A + A = A     AB + BC
    // Factor                 B(A+C)

    assign Q = b & (a | c);
endmodule