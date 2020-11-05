/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2019-05-25 00:34:45
 * #lastTime     : 2020-02-02 19:31:08
 * #FilePath     : \BIOS\uart_ps.h
 * #Description  : 
 */
#ifndef __UART_PS_H__
#define __UART_PS_H__

#include <stdbool.h>
#include <stdint.h>
#include <stdarg.h>
#include <math.h>

#include "xparameters_ps.h"
#include "xparameters.h"
#include "xuartps_hw.h"
#include "xuartps.h"
#include "xstatus.h"
#include "xil_types.h"
#include "xil_io.h"
#include "Xscugic.h"
#include "Xil_exception.h"


#define  UART_LEN   64

extern char  UART_rec[UART_LEN];

typedef struct uart_ps_data_t
{
    uint32_t UART_BASE;
    uint32_t UART_INTR_ID;
    uint32_t UART_DeviceId;
}uart_ps_data_t;


extern void ConfigureUART(int mode, int band);
extern void UARTprintf(int style, char *pcString, ...);
extern int  UARTRead(int DeviceId,char *pui8Buffer);
extern int  UARTInit(int DeviceId,Xil_InterruptHandler UART_IntHandler);
extern void UARTIntHandler_MSP(int DeviceId);
extern void UartIntr_SelfTest();
extern void Uart_SelfTest();

#endif
