//-----------------------------------------------------------------------------
// The confidential and proprietary information contained in this file may
// only be used by a person authorised under and to the extent permitted
// by a subsisting licensing agreement from ARM limited.
//
//            (C) COPYRIGHT 2018 ARM limited.
//                ALL RIGHTS RESERVED
//
// This entire notice must be reproduced on all copies of this file
// and copies of this file may only be made by a person if such person is
// permitted to do so under the terms of a subsisting license agreement
// from ARM limited.
//
//      SVN Information
//
//      Checked In          : $Date$
//
//      Revision            : $Revision$
//
//      Release Information : Cortex-M3 DesignStart-r0p1-00rel0
//-----------------------------------------------------------------------------
// Purpose :
//     Module to connect from V2C_DAPLink adaptor board to Arty shield connectors
//-----------------------------------------------------------------------------

module DAPLink_to_Arty_shield
(
    shield_41_to_26,
    uart_rxd_axi,
    uart_txd_axi,
    uart_txd_arty,
    uart_rxd_arty,
    DAPLink_fittedn,
    qspi_q0_i,
    qspi_q0_o,
    qspi_q0_t,
    qspi_q1_i,
    qspi_q1_o,
    qspi_q1_t,
    qspi_q2_i,
    qspi_q2_o,
    qspi_q2_t,
    qspi_q3_i,
    qspi_q3_o,
    qspi_q3_t,
    qspi_ck_o,
    qspi_ss_o,
    qspi_xip_q0_i,
    qspi_xip_q0_o,
    qspi_xip_q0_t,
    qspi_xip_q1_i,
    qspi_xip_q1_o,
    qspi_xip_q1_t,
    qspi_xip_q2_i,
    qspi_xip_q2_o,
    qspi_xip_q2_t,
    qspi_xip_q3_i,
    qspi_xip_q3_o,
    qspi_xip_q3_t,
    qspi_xip_ck_o,
    qspi_xip_ss_o,
    qspi_sel,
    ext_spi_clk,
    spi_q0_i,
    spi_q0_o,
    spi_q0_t,
    spi_q1_i,
    spi_q1_o,
    spi_q1_t,
    spi_ck_o,
    spi_ss_o,
    SWDOEN,
    SWDI,
    SWDO,
    SWCLK,
    SWRSTn
    
);


    // Port defintions
    // Ports are reversed in direction as they connect to peripherals and convert to IO
    // So an input to a peripheral is an output from this module, and visa versa
    inout  [41:26]  shield_41_to_26;        // Main shield interface

    output          uart_rxd_axi;           // UART RXD from peripheral
    input           uart_txd_axi;           // UART TXD to peripheral
    output          uart_txd_arty;          // Interface to base board UART TXD
    input           uart_rxd_arty;          // Interface to base board UART RXD

    output          DAPLink_fittedn;        // Pulled low when the DAPLink board is fitted

    output          qspi_q0_i;              // Quad SPI Data 0
    output          qspi_q1_i;              // Quad SPI Data 1
    output          qspi_q2_i;              // Quad SPI Data 2
    output          qspi_q3_i;              // Quad SPI Data 3
    input           qspi_q0_o;              // Quad SPI Data 0
    input           qspi_q1_o;              // Quad SPI Data 1
    input           qspi_q2_o;              // Quad SPI Data 2
    input           qspi_q3_o;              // Quad SPI Data 3
    input           qspi_q0_t;              // Quad SPI Data 0
    input           qspi_q1_t;              // Quad SPI Data 1
    input           qspi_q2_t;              // Quad SPI Data 2
    input           qspi_q3_t;              // Quad SPI Data 3
    input           qspi_ck_o;              // Quad SPI clock
    input           qspi_ss_o;              // Quad SPI slave select (negative)

    output          qspi_xip_q0_i;          // Quad SPI XIP readonly mode Data 0
    output          qspi_xip_q1_i;          // Quad SPI XIP readonly mode Data 1
    output          qspi_xip_q2_i;          // Quad SPI XIP readonly mode Data 2
    output          qspi_xip_q3_i;          // Quad SPI XIP readonly mode Data 3
    input           qspi_xip_q0_o;          // Quad SPI XIP readonly mode Data 0
    input           qspi_xip_q1_o;          // Quad SPI XIP readonly mode Data 1
    input           qspi_xip_q2_o;          // Quad SPI XIP readonly mode Data 2
    input           qspi_xip_q3_o;          // Quad SPI XIP readonly mode Data 3
    input           qspi_xip_q0_t;          // Quad SPI XIP readonly mode Data 0
    input           qspi_xip_q1_t;          // Quad SPI XIP readonly mode Data 1
    input           qspi_xip_q2_t;          // Quad SPI XIP readonly mode Data 2
    input           qspi_xip_q3_t;          // Quad SPI XIP readonly mode Data 3
    input           qspi_xip_ck_o;          // Quad SPI XIP readonly mode clock
    input           qspi_xip_ss_o;          // Quad SPI XIP readonly mode slave select (negative)
    
    input           qspi_sel;               // Select between QSPI XIP and QSPI normal controllers
    input           ext_spi_clk;            // Clock used to drive QSPI outputs.

    output          spi_q0_i;               // SPI Data 0
    input           spi_q0_o;               // SPI Data 0
    input           spi_q0_t;               // SPI Data 0
    output          spi_q1_i;               // SPI Data 1
    input           spi_q1_o;               // SPI Data 1
    input           spi_q1_t;               // SPI Data 1
    input           spi_ck_o;               // SPI clock
    input           spi_ss_o;               // SPI slave select (negative)

    output          SWDI;                   // SW Data In
    input           SWDO;                   // SW Data Out
    input           SWDOEN;                 // SW Data Out enable (negative)
    output          SWCLK;                  // SW Clock
    output          SWRSTn;                 // SW reset


    wire            qspi_mux_q0_t;
    wire            qspi_mux_q1_t;
    wire            qspi_mux_q2_t;
    wire            qspi_mux_q3_t;
    wire            qspi_mux_q0_o;
    wire            qspi_mux_q1_o;
    wire            qspi_mux_q2_o;
    wire            qspi_mux_q3_o;
    wire            qspi_mux_ck_o;
    wire            qspi_mux_ss_o;

    // Need block to correct Xilinx QSPI XIP peripheral fault
    // Doesn't drive mode bits, instead tristates signals.
    // As QSPI appears to have bus keepers, then if address 0xA is read, then
    // mode bits appear to be set to 0xA, which is for addtional addressing.
    // Circuit checks that command is 0xEB before applying this.  In XIP QUAD mode
    // this is the only command sent.
    reg [4:0] sck_count;
    reg [7:0] command;
    reg       EB_command;
    reg       qspi_xip_t_drive;
    wire      qspi_xip_mode_bits;
    
    always @(posedge ext_spi_clk)
        if( qspi_xip_ss_o )
            command <= 8'h0;
        else if ( qspi_xip_ck_o )
            command <= {command[6:0], qspi_xip_q0_o};
            
    always @(posedge ext_spi_clk)
        if( qspi_xip_ss_o )
            EB_command <= 1'b0;
        else if ( (sck_count == 8) && (command == 8'heb) )
            EB_command <= 1'b1;

    always @(posedge ext_spi_clk)
        if( qspi_xip_ss_o )
            sck_count <= 5'h0;
        else if (qspi_xip_ck_o && (sck_count != 5'h1F) )
            sck_count <= sck_count + 1;

    assign qspi_xip_mode_bits = ((sck_count > 12) && (sck_count < 15) && EB_command);
    
    always @(posedge ext_spi_clk)
        if( qspi_xip_ss_o )
            qspi_xip_t_drive <= 1'b0;
        else if (qspi_xip_ck_o )
            qspi_xip_t_drive <= qspi_xip_mode_bits;
            
    // Mux between the two Quad SPI peripherals.
    // One is in XIP readonly mode, the other is normal read-write
    assign qspi_mux_q0_o = (qspi_sel) ? qspi_q0_o : qspi_xip_q0_o;
    assign qspi_mux_q1_o = (qspi_sel) ? qspi_q1_o : qspi_xip_q1_o;
    assign qspi_mux_q2_o = (qspi_sel) ? qspi_q2_o : qspi_xip_q2_o;
    assign qspi_mux_q3_o = (qspi_sel) ? qspi_q3_o : qspi_xip_q3_o;
    assign qspi_mux_q0_t = (qspi_sel) ? qspi_q0_t : qspi_xip_q0_t & ~qspi_xip_t_drive;
    assign qspi_mux_q1_t = (qspi_sel) ? qspi_q1_t : qspi_xip_q1_t & ~qspi_xip_t_drive;
    assign qspi_mux_q2_t = (qspi_sel) ? qspi_q2_t : qspi_xip_q2_t & ~qspi_xip_t_drive;
    assign qspi_mux_q3_t = (qspi_sel) ? qspi_q3_t : qspi_xip_q3_t & ~qspi_xip_t_drive;
    assign qspi_mux_ck_o = (qspi_sel) ? qspi_ck_o : qspi_xip_ck_o;
    assign qspi_mux_ss_o = (qspi_sel) ? qspi_ss_o : qspi_xip_ss_o;
    
    // Map individual signals to the shield
    
    // SPI connections
    // Single SPI connections are unconventional.
    // According to Xilinx datasheet, io0_o behaves "similar" to MOSI and
    // io1_i behaves "similar" to MISO
    assign shield_41_to_26[26] = spi_ss_o;
    assign spi_q1_i= shield_41_to_26[27];
    assign shield_41_to_26[28] = spi_q0_o;
    assign shield_41_to_26[29] = spi_ck_o;

    // QSPI
    // Tristate enables are active low
    assign shield_41_to_26[30] = (qspi_mux_q0_t) ? 1'bz : qspi_mux_q0_o;
    assign shield_41_to_26[31] = (qspi_mux_q1_t) ? 1'bz : qspi_mux_q1_o;
    assign shield_41_to_26[32] = (qspi_mux_q2_t) ? 1'bz : qspi_mux_q2_o;
    assign shield_41_to_26[33] = (qspi_mux_q3_t) ? 1'bz : qspi_mux_q3_o;
    
    assign qspi_q0_i     = shield_41_to_26[30];
    assign qspi_q1_i     = shield_41_to_26[31];
    assign qspi_q2_i     = shield_41_to_26[32];
    assign qspi_q3_i     = shield_41_to_26[33];
    
    assign qspi_xip_q0_i = shield_41_to_26[30];
    assign qspi_xip_q1_i = shield_41_to_26[31];
    assign qspi_xip_q2_i = shield_41_to_26[32];
    assign qspi_xip_q3_i = shield_41_to_26[33];
    
    assign shield_41_to_26[35] = qspi_mux_ck_o;
    assign shield_41_to_26[36] = qspi_mux_ss_o;
    
    // DAPLink card fitted
    assign DAPLink_fittedn     = shield_41_to_26[34];
    
    // UART
    // Switch RX
    assign uart_rxd_axi        = (DAPLink_fittedn) ? uart_rxd_arty : shield_41_to_26[38];
    // Switch TX
    assign uart_txd_arty       = (DAPLink_fittedn) ? uart_txd_axi : 1'b1;
    assign shield_41_to_26[37] = (DAPLink_fittedn) ? 1'b0 : uart_txd_axi;

    // Serial Wire debug
    assign SWRSTn              = shield_41_to_26[39];
    
    // Data
    // SWDOEN is high for output
    assign SWDI                = shield_41_to_26[40];
    assign shield_41_to_26[40] = (SWDOEN) ? SWDO : 1'bz;
    assign SWCLK               = shield_41_to_26[41];
    

endmodule


