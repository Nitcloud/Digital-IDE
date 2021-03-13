📦Hardware
 ┣ 📂Apply
 ┃ ┣ 📂DSP
 ┃ ┃ ┣ 📂Advance
 ┃ ┃ ┃ ┣ 📂AGC
 ┃ ┃ ┃ ┃ ┣ 📜AGC.PNG
 ┃ ┃ ┃ ┃ ┗ 📜AGC.v
 ┃ ┃ ┃ ┣ 📂Communicate
 ┃ ┃ ┃ ┃ ┣ 📂Coding
 ┃ ┃ ┃ ┃ ┃ ┣ 📜manchester.v
 ┃ ┃ ┃ ┃ ┃ ┗ 📜mseq.v
 ┃ ┃ ┃ ┃ ┣ 📂Demodulate
 ┃ ┃ ┃ ┃ ┃ ┗ 📂IQ
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜Demodulate.v
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜IQ_Mixed.v
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜Loop_filter.v
 ┃ ┃ ┃ ┃ ┗ 📂Modulate
 ┃ ┃ ┃ ┃ ┃ ┣ 📂AM
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜AM_Modulate.v
 ┃ ┃ ┃ ┃ ┃ ┗ 📂FM
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜FM_Modulate.v
 ┃ ┃ ┃ ┣ 📂FFT
 ┃ ┃ ┃ ┃ ┣ 📂Burst_FFT_IFFT
 ┃ ┃ ┃ ┃ ┗ 📂Flow_FFT_IFFT
 ┃ ┃ ┃ ┃ ┃ ┣ 📜BF_op.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜BF_stg1.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜BF_stgX.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜cmpl_mult.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜fft.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜fft_stage.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ftrans.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ftwiddle.v
 ┃ ┃ ┃ ┃ ┃ ┗ 📜testbench.v
 ┃ ┃ ┃ ┗ 📂PLL
 ┃ ┃ ┃ ┃ ┣ 📂Code
 ┃ ┃ ┃ ┃ ┃ ┣ 📜adfmreceiver.pdf
 ┃ ┃ ┃ ┃ ┃ ┣ 📜circuit.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜fir.v
 ┃ ┃ ┃ ┃ ┃ ┣ 📜loop_filter.v
 ┃ ┃ ┃ ┃ ┃ ┗ 📜multiplier.v
 ┃ ┃ ┃ ┃ ┗ 📂Image
 ┃ ┃ ┃ ┃ ┃ ┣ 📜architecture.png
 ┃ ┃ ┃ ┃ ┃ ┣ 📜fmsquare.jpg
 ┃ ┃ ┃ ┃ ┃ ┗ 📜fmtriangular.jpg
 ┃ ┃ ┗ 📂Base
 ┃ ┃ ┃ ┣ 📂CLK
 ┃ ┃ ┃ ┃ ┣ 📜CLK_DIV.v
 ┃ ┃ ┃ ┃ ┗ 📜CLK_Sample.v
 ┃ ┃ ┃ ┣ 📂DDS
 ┃ ┃ ┃ ┃ ┗ 📜DDS_Gen.v
 ┃ ┃ ┃ ┗ 📂Measure
 ┃ ┃ ┃ ┃ ┣ 📜Fre_meas.v
 ┃ ┃ ┃ ┃ ┣ 📜Max_meas.v
 ┃ ┃ ┃ ┃ ┣ 📜Min_meas.v
 ┃ ┃ ┃ ┃ ┗ 📜Valid_Meas.v
 ┃ ┗ 📂Image
 ┃ ┃ ┣ 📂Advance_Apply
 ┃ ┃ ┃ ┣ 📜Image_XYCrop.v
 ┃ ┃ ┃ ┗ 📜Parallel_Line_Detector.v
 ┃ ┃ ┗ 📂Basic_Apply
 ┃ ┃ ┃ ┣ 📂Dat
 ┃ ┃ ┃ ┃ ┣ 📜RAW8_RGB888.v
 ┃ ┃ ┃ ┃ ┗ 📜RGB888_YCbCr444.v
 ┃ ┃ ┃ ┣ 📂Detector
 ┃ ┃ ┃ ┃ ┣ 📜Dilation_Detector.v
 ┃ ┃ ┃ ┃ ┣ 📜Erosion_Detector.v
 ┃ ┃ ┃ ┃ ┗ 📜Sobel_Edge_Detector.v
 ┃ ┃ ┃ ┣ 📂Filter
 ┃ ┃ ┃ ┃ ┣ 📜Gray_Median_Filter.v
 ┃ ┃ ┃ ┃ ┗ 📜Median_Filter_3X3.v
 ┃ ┃ ┃ ┣ 📂Matrix
 ┃ ┃ ┃ ┃ ┣ 📜Matrix_Generate_3X3.v
 ┃ ┃ ┃ ┃ ┗ 📜Matrix_Generate_3X3_Buf.v
 ┃ ┃ ┃ ┗ 📜Video_Image_Processor.v
 ┣ 📂Driver
 ┃ ┣ 📂ADC_driver
 ┃ ┃ ┣ 📂AD6645
 ┃ ┃ ┃ ┗ 📜AD6645.v
 ┃ ┃ ┣ 📂ADS412x_driver
 ┃ ┃ ┃ ┣ 📜ADC_CFG.vhd
 ┃ ┃ ┃ ┣ 📜ADS412x_driver.v
 ┃ ┃ ┃ ┗ 📜CFG_INT.vhd
 ┃ ┃ ┗ 📂ADS9226_driver
 ┃ ┃ ┃ ┗ 📜AD9226_driver.v
 ┃ ┣ 📂DAC_driver
 ┃ ┃ ┣ 📂DAC3162_driver
 ┃ ┃ ┃ ┣ 📜DAC3162_driver.v
 ┃ ┃ ┃ ┣ 📜LVDS_DDR_clk.v
 ┃ ┃ ┃ ┗ 📜LVDS_DDR_data.v
 ┃ ┃ ┣ 📂DAC9767_driver
 ┃ ┃ ┃ ┗ 📜DA9767.v
 ┃ ┃ ┗ 📂DAC_PWM
 ┃ ┃ ┃ ┗ 📜DAC_PWM.v
 ┃ ┣ 📂DDS_driver
 ┃ ┃ ┗ 📜ADF_driver.v
 ┃ ┣ 📂KEY_driver
 ┃ ┃ ┗ 📜key_driver.v
 ┃ ┣ 📂Motor_driver
 ┃ ┃ ┗ 📜Motor_driver.v
 ┃ ┣ 📂SDRAM_driver
 ┃ ┃ ┣ 📂core
 ┃ ┃ ┃ ┣ 📜sdrc_bank_ctl.v
 ┃ ┃ ┃ ┣ 📜sdrc_bank_fsm.v
 ┃ ┃ ┃ ┣ 📜sdrc_bs_convert.v
 ┃ ┃ ┃ ┣ 📜sdrc_core.v
 ┃ ┃ ┃ ┣ 📜sdrc_define.v
 ┃ ┃ ┃ ┣ 📜sdrc_req_gen.v
 ┃ ┃ ┃ ┗ 📜sdrc_xfr_ctl.v
 ┃ ┃ ┣ 📂model
 ┃ ┃ ┃ ┣ 📜IS42VM16400K.V
 ┃ ┃ ┃ ┣ 📜mt48lc2m32b2.v
 ┃ ┃ ┃ ┣ 📜mt48lc4m16.v
 ┃ ┃ ┃ ┣ 📜mt48lc4m32b2.v
 ┃ ┃ ┃ ┣ 📜mt48lc8m16a2.v
 ┃ ┃ ┃ ┗ 📜mt48lc8m8a2.v
 ┃ ┃ ┣ 📂synth
 ┃ ┃ ┃ ┗ 📂constraints
 ┃ ┃ ┃ ┃ ┣ 📜sdrc_synth.sdc
 ┃ ┃ ┃ ┃ ┗ 📜sdrc_top.sdc
 ┃ ┃ ┣ 📂tb
 ┃ ┃ ┃ ┣ 📜tb_core.sv
 ┃ ┃ ┃ ┗ 📜tb_top.sv
 ┃ ┃ ┣ 📂top
 ┃ ┃ ┃ ┗ 📜sdrc_top.v
 ┃ ┃ ┗ 📂wb2sdrc
 ┃ ┃ ┃ ┗ 📜wb2sdrc.v
 ┃ ┗ 📂UART_driver
 ┃ ┃ ┣ 📜UART_rx.v
 ┃ ┃ ┣ 📜uart_rx_control.v
 ┃ ┃ ┣ 📜UART_tx.v
 ┃ ┃ ┗ 📜uart_tx_control.v
 ┣ 📂Malloc
 ┃ ┣ 📂FIFO
 ┃ ┃ ┣ 📜async_fifo.v
 ┃ ┃ ┗ 📜sync_fifo.v
 ┃ ┗ 📂RAM
 ┃ ┃ ┣ 📂Shift_RAM
 ┃ ┃ ┃ ┣ 📜Line_Shift_RAM.v
 ┃ ┃ ┃ ┗ 📜RAMshift_taps.v
 ┃ ┃ ┗ 📜Line_Shift_RAM.v
 ┣ 📂Math
 ┃ ┣ 📜Add_Sub.v
 ┃ ┣ 📜Cordic.v
 ┃ ┣ 📜Div.v
 ┃ ┣ 📜Mult.v
 ┃ ┣ 📜phase_acc.v
 ┃ ┣ 📜Sort3.v
 ┃ ┗ 📜Sqrt.v
 ┣ 📂Soc
 ┃ ┣ 📂Cortex_M0
 ┃ ┃ ┗ 📜cortexm0ds_logic.v
 ┃ ┗ 📂Cortex_M3
 ┃ ┃ ┗ 📜cortexm3ds_logic.v
 ┣ 📜testbench.v
 ┗ 📜testbench.vhd