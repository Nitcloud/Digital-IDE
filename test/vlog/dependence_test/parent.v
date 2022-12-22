
/* 
 * CN: 如果使用`include "head_1.v" 则模块 dependence_1 使用的应该是 head_1.v 文件中的，
 *     而不会调用child_1.v中的 dependence_1 同名模块。
 * EN: 
 */


`include "child_1.v"
`define main out



module Main(
    input a, b, c,
    output Qus, Qs, `main
);


dependence_1 dependence_1(
    .a(a),
    .b(b),
    .c(c),
    .Q(Qus)
);

dependence_2 dependence_2(
    .a(a),
    .b(b),
    .c(c),
    .Q(Qs)
);

dependence_3 dependence_3(
    .a(a),
    .b(b),
    .c(c),
    .Q(Qs)
);

endmodule
/* @wavedrom
{
    "signal" : [
        { name: "clk",  wave: "p......" },
        { name: "bus",  wave: "x.34.5x", data: "head body tail" },
        { name: "wire", wave: "0.1..0." }
    ]
}
*/


/* @wavedrom
{ 
    signal: [
    { name: "pclk", wave: 'p.......' },
    { name: "Pclk", wave: 'P.......' },
    { name: "nclk", wave: 'n.......' },
    { name: "Nclk", wave: 'N.......' },
    {},
    { name: 'clk0', wave: 'phnlPHNL' },
    { name: 'clk1', wave: 'xhlhLHl.' },
    { name: 'clk2', wave: 'hpHplnLn' },
    { name: 'clk3', wave: 'nhNhplPl' },
    { name: 'clk4', wave: 'xlh.L.Hx' },
]}
*/