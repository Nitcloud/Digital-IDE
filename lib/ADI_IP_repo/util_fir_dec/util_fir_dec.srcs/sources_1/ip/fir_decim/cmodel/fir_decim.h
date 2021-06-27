
//------------------------------------------------------------------------------
// (c) Copyright 2014 Xilinx, Inc. All rights reserved.
//
// This file contains confidential and proprietary information
// of Xilinx, Inc. and is protected under U.S. and
// international copyright and other intellectual property
// laws.
//
// DISCLAIMER
// This disclaimer is not a license and does not grant any
// rights to the materials distributed herewith. Except as
// otherwise provided in a valid license issued to you by
// Xilinx, and to the maximum extent permitted by applicable
// law: (1) THESE MATERIALS ARE MADE AVAILABLE "AS IS" AND
// WITH ALL FAULTS, AND XILINX HEREBY DISCLAIMS ALL WARRANTIES
// AND CONDITIONS, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
// BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, NON-
// INFRINGEMENT, OR FITNESS FOR ANY PARTICULAR PURPOSE; and
// (2) Xilinx shall not be liable (whether in contract or tort,
// including negligence, or under any other theory of
// liability) for any loss or damage of any kind or nature
// related to, arising under or in connection with these
// materials, including for any direct, or any indirect,
// special, incidental, or consequential loss or damage
// (including loss of data, profits, goodwill, or any type of
// loss or damage suffered as a result of any action brought
// by a third party) even if such damage or loss was
// reasonably foreseeable or Xilinx had been advised of the
// possibility of the same.
//
// CRITICAL APPLICATIONS
// Xilinx products are not designed or intended to be fail-
// safe, or for use in any application requiring fail-safe
// performance, such as life-support or safety devices or
// systems, Class III medical devices, nuclear facilities,
// applications related to the deployment of airbags, or any
// other applications that could lead to death, personal
// injury, or severe property or environmental damage
// (individually and collectively, "Critical
// Applications"). Customer assumes the sole risk and
// liability of any use of Xilinx products in Critical
// Applications, subject only to applicable laws and
// regulations governing limitations on product liability.
//
// THIS COPYRIGHT NOTICE AND DISCLAIMER MUST BE RETAINED AS
// PART OF THIS FILE AT ALL TIMES.
//------------------------------------------------------------------------------ 
//
// C Model configuration for the "fir_decim" instance.
//
//------------------------------------------------------------------------------
//
// coefficients: 0,-1,-2,-4,-6,-8,-8,-5,0,8,18,29,37,41,37,23,0,-31,-67,-100,-124,-130,-113,-69,0,87,181,263,318,326,277,166,0,-202,-410,-589,-700,-709,-594,-352,0,420,848,1211,1432,1446,1210,717,0,-863,-1756,-2535,-3043,-3133,-2690,-1646,0,2180,4757,7534,10278,12743,14697,15951,16384,15951,14697,12743,10278,7534,4757,2180,0,-1646,-2690,-3133,-3043,-2535,-1756,-863,0,717,1210,1446,1432,1211,848,420,0,-352,-594,-709,-700,-589,-410,-202,0,166,277,326,318,263,181,87,0,-69,-113,-130,-124,-100,-67,-31,0,23,37,41,37,29,18,8,0,-5,-8,-8,-6,-4,-2,-1,0
// chanpats: 173
// name: fir_decim
// filter_type: 2
// rate_change: 0
// interp_rate: 1
// decim_rate: 8
// zero_pack_factor: 1
// coeff_padding: 7
// num_coeffs: 129
// coeff_sets: 1
// reloadable: 0
// is_halfband: 0
// quantization: 0
// coeff_width: 16
// coeff_fract_width: 0
// chan_seq: 0
// num_channels: 1
// num_paths: 2
// data_width: 16
// data_fract_width: 15
// output_rounding_mode: 2
// output_width: 16
// output_fract_width: 0
// config_method: 0

const double fir_decim_coefficients[129] = {0,-1,-2,-4,-6,-8,-8,-5,0,8,18,29,37,41,37,23,0,-31,-67,-100,-124,-130,-113,-69,0,87,181,263,318,326,277,166,0,-202,-410,-589,-700,-709,-594,-352,0,420,848,1211,1432,1446,1210,717,0,-863,-1756,-2535,-3043,-3133,-2690,-1646,0,2180,4757,7534,10278,12743,14697,15951,16384,15951,14697,12743,10278,7534,4757,2180,0,-1646,-2690,-3133,-3043,-2535,-1756,-863,0,717,1210,1446,1432,1211,848,420,0,-352,-594,-709,-700,-589,-410,-202,0,166,277,326,318,263,181,87,0,-69,-113,-130,-124,-100,-67,-31,0,23,37,41,37,29,18,8,0,-5,-8,-8,-6,-4,-2,-1,0};

const xip_fir_v7_2_pattern fir_decim_chanpats[1] = {P_BASIC};

static xip_fir_v7_2_config gen_fir_decim_config() {
  xip_fir_v7_2_config config;
  config.name                = "fir_decim";
  config.filter_type         = 2;
  config.rate_change         = XIP_FIR_INTEGER_RATE;
  config.interp_rate         = 1;
  config.decim_rate          = 8;
  config.zero_pack_factor    = 1;
  config.coeff               = &fir_decim_coefficients[0];
  config.coeff_padding       = 7;
  config.num_coeffs          = 129;
  config.coeff_sets          = 1;
  config.reloadable          = 0;
  config.is_halfband         = 0;
  config.quantization        = XIP_FIR_INTEGER_COEFF;
  config.coeff_width         = 16;
  config.coeff_fract_width   = 0;
  config.chan_seq            = XIP_FIR_BASIC_CHAN_SEQ;
  config.num_channels        = 1;
  config.init_pattern        = fir_decim_chanpats[0];
  config.num_paths           = 2;
  config.data_width          = 16;
  config.data_fract_width    = 15;
  config.output_rounding_mode= XIP_FIR_SYMMETRIC_ZERO;
  config.output_width        = 16;
  config.output_fract_width  = 0,
  config.config_method       = XIP_FIR_CONFIG_SINGLE;
  return config;
}

const xip_fir_v7_2_config fir_decim_config = gen_fir_decim_config();

