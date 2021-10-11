//-----------------------------------------------------------------------------
//  (c) Copyright 2014 Xilinx, Inc. All rights reserved.
//
//  This file contains confidential and proprietary information
//  of Xilinx, Inc. and is protected under U.S. and
//  international copyright and other intellectual property
//  laws.
//
//  DISCLAIMER
//  This disclaimer is not a license and does not grant any
//  rights to the materials distributed herewith. Except as
//  otherwise provided in a valid license issued to you by
//  Xilinx, and to the maximum extent permitted by applicable
//  law: (1) THESE MATERIALS ARE MADE AVAILABLE "AS IS" AND
//  WITH ALL FAULTS, AND XILINX HEREBY DISCLAIMS ALL WARRANTIES
//  AND CONDITIONS, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING
//  BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, NON-
//  INFRINGEMENT, OR FITNESS FOR ANY PARTICULAR PURPOSE; and
//  (2) Xilinx shall not be liable (whether in contract or tort,
//  including negligence, or under any other theory of
//  liability) for any loss or damage of any kind or nature
//  related to, arising under or in connection with these
//  materials, including for any direct, or any indirect,
//  special, incidental, or consequential loss or damage
//  (including loss of data, profits, goodwill, or any type of
//  loss or damage suffered as a result of any action brought
//  by a third party) even if such damage or loss was
//  reasonably foreseeable or Xilinx had been advised of the
//  possibility of the same.
//
//  CRITICAL APPLICATIONS
//  Xilinx products are not designed or intended to be fail-
//  safe, or for use in any application requiring fail-safe
//  performance, such as life-support or safety devices or
//  systems, Class III medical devices, nuclear facilities,
//  applications related to the deployment of airbags, or any
//  other applications that could lead to death, personal
//  injury, or severe property or environmental damage
//  (individually and collectively, "Critical
//  Applications"). Customer assumes the sole risk and
//  liability of any use of Xilinx products in Critical
//  Applications, subject only to applicable laws and
//  regulations governing limitations on product liability.
//
//  THIS COPYRIGHT NOTICE AND DISCLAIMER MUST BE RETAINED AS
//  PART OF THIS FILE AT ALL TIMES.
//-----------------------------------------------------------------------------
// C testbench for the "fir_interp" instance
//   o Basic C testbench based on the run_bitacc_cmodel.c smoke test program
//     included in the C model zip files. Please refer run_bitacc_cmodel.c
//     for further examples of how to use the FIR Compiler C model.
//   o Unzip the appropriate platform specifc zip file and use the following example 
//     command line to compile and link this TB:
//     gcc -x c++ -I. -L. -lIp_fir_compiler_v7_2_11_bitacc_cmodel -Wl,-rpath,. -o tb_fir_interp tb_fir_interp.c

#include <stdio.h>
#include "fir_compiler_v7_2_bitacc_cmodel.h"
#include "fir_interp.h"

//---------------------------------------------------------------------------------------------------------------------
// Example message handler
static void msg_print(void* handle, int error, const char* msg)
{
	printf("%s\n",msg);
}

//---------------------------------------------------------------------------------------------------------------------
//Print a xip_array_real
void print_array_real(const xip_array_real* x)
{
  putchar('[');
  if (x && x->data && x->data_size)
  {
    const xip_real* p=x->data;
    const xip_real* q=x->data;
    const xip_real* r=x->data+x->data_size;
    while (q!=r)
    {
      if (q!=p) putchar(' ');
      printf("%g",*q);
      q++;
    }
  }
  putchar(']');
  putchar('\n');
}

//----------------------------------------------------------------------------------------------------------------------
// Fill data array with a scaled impulse. Assumes 3-D array.
int create_impulse(xip_array_real* x) {
  int path;
  int chan;
  int i;
  for (path = 0; path < x->dim[0];path++) {
    for (chan = 0; chan < x->dim[1];chan++) {
       xip_fir_v7_2_xip_array_real_set_chan(x,(double)((path+1)*(chan+1)),path,chan,0,P_BASIC);
       for (i = 1; i < x->dim[2];i++) {
         xip_fir_v7_2_xip_array_real_set_chan(x,0,path,chan,i,P_BASIC);
       }
    }
  }
  return 0;
}
//----------------------------------------------------------------------------------------------------------------------
// String arrays used by the print_config funtion
const char *filt_desc[5] = { "SINGLE RATE", "INTERPOLATION", "DECIMATION", "HILBERT", "INTERPOLATED" };
const char *seq_desc[2] = { "Basic" , "Advanced" };

//----------------------------------------------------------------------------------------------------------------------
// Print a summary of a filter configuration
int print_config(const xip_fir_v7_2_config* cfg) {
  printf("Configuration of %s:\n",cfg->name);
  printf("\tFilter       : ");
  if ( cfg->filter_type == XIP_FIR_SINGLE_RATE || cfg->filter_type == XIP_FIR_HILBERT ) {
    printf("%s\n",filt_desc[cfg->filter_type]);
  } else if ( cfg->filter_type == XIP_FIR_INTERPOLATED ) {
    printf("%s by %d\n",filt_desc[cfg->filter_type],cfg->zero_pack_factor);
  } else {
    printf("%s up by %d down by %d\n",filt_desc[cfg->filter_type],cfg->interp_rate,cfg->decim_rate);
  }
  printf("\tCoefficients : %d ",cfg->coeff_sets);
  if ( cfg->is_halfband ) {
    printf("Halfband ");
  }
  if (cfg->reloadable) {
    printf("Reloadable ");
  }
  printf("coefficient set(s) of %d taps\n",cfg->num_coeffs);
  printf("\tData         : %d path(s) of %d %s channel(s)\n",cfg->num_paths,cfg->num_channels,seq_desc[cfg->chan_seq]);
  
  return 0;
}
  
//----------------------------------------------------------------------------------------------------------------------
int main () {
  const char* ver_str = xip_fir_v7_2_get_version();
  printf("FIR Compiler C Model version: %s\n",ver_str);
  
  print_config(&fir_interp_config);
  
  //Create filter instances
  xip_fir_v7_2* fir_interp_inst = xip_fir_v7_2_create(&fir_interp_config,&msg_print,0);
  if (!fir_interp_inst) {
    printf("Error creating instance\n",fir_interp_config.name);
    return -1;
  } else { 
    printf("Created instance\n",fir_interp_config.name);
  }
  
  // Create input data packet
  xip_array_real* din = xip_array_real_create();
  xip_array_real_reserve_dim(din,3);
  din->dim_size = 3; // 3D array
  din->dim[0] = fir_interp_config.num_paths;
  din->dim[1] = fir_interp_config.num_channels; 
  din->dim[2] = fir_interp_config.num_coeffs; // vectors in a single packet
  din->data_size = din->dim[0] * din->dim[1] * din->dim[2];
  if (xip_array_real_reserve_data(din,din->data_size) == XIP_STATUS_OK) {
    printf("Reserved data\n");
  } else {
    printf("Unable to reserve data!\n");
    return -1;
  }
  
  // Create output data packet
  //  - Automatically sized using xip_fir_v7_2_calc_size
  xip_array_real* dout = xip_array_real_create();
  xip_array_real_reserve_dim(dout,3);
  dout->dim_size = 3; // 3D array
  if(xip_fir_v7_2_calc_size(fir_interp_inst,din,dout,0)== XIP_STATUS_OK) {
    printf("Calculated output data size\n");
    if (xip_array_real_reserve_data(dout,dout->data_size) == XIP_STATUS_OK) {
      printf("Reserved data\n");
    } else {
      printf("Unable to reserve data!\n");
      return -1;
    }
  } else {
    printf("Unable to calculate output date size\n");
    return -1;
  }
  
  // Populate data in with an impulse
  printf("Create impulse\n");
  create_impulse(din);
  
  // Send input data and filter
  if ( xip_fir_v7_2_data_send(fir_interp_inst,din)== XIP_STATUS_OK) {
    printf("Sent data     : ");
    print_array_real(din);
  } else {
    printf("Error sending data\n");
    return -1;
  }
  
  // Retrieve filtered data
  if ( xip_fir_v7_2_data_get(fir_interp_inst,dout,0)== XIP_STATUS_OK) {
    printf("Fetched result: ");
    print_array_real(dout);
  } else {
    printf("Error getting data\n");
    return -1;
  }
}
