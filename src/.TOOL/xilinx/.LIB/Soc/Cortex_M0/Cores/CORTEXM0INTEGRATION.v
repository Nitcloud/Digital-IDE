//------------------------------------------------------------------------------
// The confidential and proprietary information contained in this file may
// only be used by a person authorised under and to the extent permitted
// by a subsisting licensing agreement from ARM Limited or its affiliates.
//
//            (C) COPYRIGHT 2010-2015  ARM Limited or its affiliates.
//                ALL RIGHTS RESERVED
//
// This entire notice must be reproduced on all copies of this file
// and copies of this file may only be made by a person if such person is
// permitted to do so under the terms of a subsisting license agreement
// from ARM Limited or its affiliates.
//
//  Version and Release Control Information:
//
//  File Revision       : $Revision: 275084 $
//  File Date           : $Date: 2014-03-27 15:09:11 +0000 (Thu, 27 Mar 2014) $
//
//  Release Information : Cortex-M0 DesignStart-r1p0-03rel2
//
//------------------------------------------------------------------------------
// Verilog-2001 (IEEE Std 1364-2001)
//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
// Cortex-M0 DesignStart processor integration level, including DAP and WIC
//------------------------------------------------------------------------------

module CORTEXM0INTEGRATION (
     input  wire        FCLK,
     input  wire        SCLK,
     input  wire        HCLK,
     input  wire        DCLK,
     input  wire        PORESETn,
     input  wire        DBGRESETn,
     input  wire        HRESETn,
     input  wire        SWCLKTCK,
     input  wire        nTRST,

     // AHB-LITE MASTER PORT
     output wire [31:0] HADDR,
     output wire [ 2:0] HBURST,
     output wire        HMASTLOCK,
     output wire [ 3:0] HPROT,
     output wire [ 2:0] HSIZE,
     output wire [ 1:0] HTRANS,
     output wire [31:0] HWDATA,
     output wire        HWRITE,
     input  wire [31:0] HRDATA,
     input  wire        HREADY,
     input  wire        HRESP,
     output wire        HMASTER,

     // CODE SEQUENTIALITY AND SPECULATION
     output wire        CODENSEQ,
     output wire [ 2:0] CODEHINTDE,
     output wire        SPECHTRANS,

     // DEBUG
     input  wire        SWDITMS,
     input  wire        TDI,
     output wire        SWDO,
     output wire        SWDOEN,
     output wire        TDO,
     output wire        nTDOEN,
     input  wire        DBGRESTART,
     output wire        DBGRESTARTED,
     input  wire        EDBGRQ,
     output wire        HALTED,

     // MISC
     input  wire        NMI,
     input  wire [31:0] IRQ,
     output wire        TXEV,
     input  wire        RXEV,
     output wire        LOCKUP,
     output wire        SYSRESETREQ,
     input  wire [25:0] STCALIB,
     input  wire        STCLKEN,
     input  wire [ 7:0] IRQLATENCY,
     input  wire [27:0] ECOREVNUM,    // [27:20] to DAP, [19:0] to core

     // POWER MANAGEMENT
     output wire        GATEHCLK,
     output wire        SLEEPING,
     output wire        SLEEPDEEP,
     output wire        WAKEUP,
     output wire [33:0] WICSENSE,
     input  wire        SLEEPHOLDREQn,
     output wire        SLEEPHOLDACKn,
     input  wire        WICENREQ,
     output wire        WICENACK,
     output wire        CDBGPWRUPREQ,
     input  wire        CDBGPWRUPACK,

     // SCAN IO
     input  wire        SE,
     input  wire        RSTBYPASS
);

//------------------------------------------------------------------------------
// Declare visibility signals and some intermediate signals
//------------------------------------------------------------------------------
wire    [31: 0] cm0_r00;
wire    [31: 0] cm0_r01;
wire    [31: 0] cm0_r02;
wire    [31: 0] cm0_r03;
wire    [31: 0] cm0_r04;
wire    [31: 0] cm0_r05;
wire    [31: 0] cm0_r06;
wire    [31: 0] cm0_r07;
wire    [31: 0] cm0_r08;
wire    [31: 0] cm0_r09;
wire    [31: 0] cm0_r10;
wire    [31: 0] cm0_r11;
wire    [31: 0] cm0_r12;
wire    [31: 0] cm0_msp;
wire    [31: 0] cm0_psp;
wire    [31: 0] cm0_r14;
wire    [31: 0] cm0_pc;
wire    [31: 0] cm0_xpsr;
wire    [31: 0] cm0_control;
wire    [31: 0] cm0_primask;

wire    [29: 0] vis_msp;
wire    [29: 0] vis_psp;
wire    [30: 0] vis_pc;
wire    [ 3: 0] vis_apsr;
wire            vis_tbit;
wire    [ 5: 0] vis_ipsr;
wire            vis_control;
wire            vis_primask;

//------------------------------------------------------------------------------
// Instantiate Cortex-M0 processor logic level
//------------------------------------------------------------------------------

cortexm0ds_logic u_logic (

        // System inputs
        .FCLK           (FCLK),
        .SCLK           (SCLK),
        .HCLK           (HCLK),
        .DCLK           (DCLK),
        .PORESETn       (PORESETn),
        .HRESETn        (HRESETn),
        .DBGRESETn      (DBGRESETn),
        .RSTBYPASS      (RSTBYPASS),
        .SE             (SE),

        // Power management inputs
        .SLEEPHOLDREQn  (SLEEPHOLDREQn),
        .WICENREQ       (WICENREQ),
        .CDBGPWRUPACK   (CDBGPWRUPACK),

        // Power management outputs
        .SLEEPHOLDACKn  (SLEEPHOLDACKn),
        .WICENACK       (WICENACK),
        .CDBGPWRUPREQ   (CDBGPWRUPREQ),

        .WAKEUP         (WAKEUP),
        .WICSENSE       (WICSENSE),
        .GATEHCLK       (GATEHCLK),
        .SYSRESETREQ    (SYSRESETREQ),

        // System bus
        .HADDR          (HADDR[31:0]),
        .HTRANS         (HTRANS[1:0]),
        .HSIZE          (HSIZE[2:0]),
        .HBURST         (HBURST[2:0]),
        .HPROT          (HPROT[3:0]),
        .HMASTER        (HMASTER),
        .HMASTLOCK      (HMASTLOCK),
        .HWRITE         (HWRITE),
        .HWDATA         (HWDATA[31:0]),
        .HRDATA         (HRDATA[31:0]),
        .HREADY         (HREADY),
        .HRESP          (HRESP),

        .CODEHINTDE     (CODEHINTDE),
        .SPECHTRANS     (SPECHTRANS),
        .CODENSEQ       (CODENSEQ),

        // Interrupts
        .IRQ            (IRQ[31:0]),
        .NMI            (NMI),
        .IRQLATENCY     (IRQLATENCY),
        .ECOREVNUM      (ECOREVNUM),

        // Systick
        .STCLKEN        (STCLKEN),
        .STCALIB        (STCALIB),

        // Debug - JTAG or Serial wire
        // Inputs
        .nTRST          (nTRST),
        .SWDITMS        (SWDITMS),
        .SWCLKTCK       (SWCLKTCK),
        .TDI            (TDI),
        // Outputs
        .TDO            (TDO),
        .nTDOEN         (nTDOEN),
        .SWDO           (SWDO),
        .SWDOEN         (SWDOEN),

        .DBGRESTART     (DBGRESTART),
        .DBGRESTARTED   (DBGRESTARTED),

        // Event communication
        .TXEV           (TXEV),
        .RXEV           (RXEV),
        .EDBGRQ         (EDBGRQ),
        // Status output
        .HALTED         (HALTED),
        .LOCKUP         (LOCKUP),
        .SLEEPING       (SLEEPING),
        .SLEEPDEEP      (SLEEPDEEP),

        .vis_r0_o       (cm0_r00[31:0]),
        .vis_r1_o       (cm0_r01[31:0]),
        .vis_r2_o       (cm0_r02[31:0]),
        .vis_r3_o       (cm0_r03[31:0]),
        .vis_r4_o       (cm0_r04[31:0]),
        .vis_r5_o       (cm0_r05[31:0]),
        .vis_r6_o       (cm0_r06[31:0]),
        .vis_r7_o       (cm0_r07[31:0]),
        .vis_r8_o       (cm0_r08[31:0]),
        .vis_r9_o       (cm0_r09[31:0]),
        .vis_r10_o      (cm0_r10[31:0]),
        .vis_r11_o      (cm0_r11[31:0]),
        .vis_r12_o      (cm0_r12[31:0]),
        .vis_msp_o      (vis_msp[29:0]),
        .vis_psp_o      (vis_psp[29:0]),
        .vis_r14_o      (cm0_r14[31:0]),
        .vis_pc_o       (vis_pc[30:0]),
        .vis_apsr_o     (vis_apsr[3:0]),
        .vis_tbit_o     (vis_tbit),
        .vis_ipsr_o     (vis_ipsr[5:0]),
        .vis_control_o  (vis_control),
        .vis_primask_o  (vis_primask)
);

//------------------------------------------------------------------------------
// Construct some visibility signals out of intermediate signals
//------------------------------------------------------------------------------

assign cm0_msp     = {vis_msp[29:0],2'd0};
assign cm0_psp     = {vis_psp[29:0],2'd0};
assign cm0_pc      = {vis_pc[30:0],1'b0};
assign cm0_xpsr    = {vis_apsr[3:0],3'd0,vis_tbit,18'd0,vis_ipsr[5:0]};
assign cm0_control = {30'd0,vis_control,1'b0};
assign cm0_primask = {31'd0,vis_primask};

endmodule
