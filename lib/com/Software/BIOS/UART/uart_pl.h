/*************
Duan制作

UART的配置文件

 2018.2.10
**************/
#ifndef __UART_PL_H__
#define __UART_PL_H__

#include <stdbool.h>
#include <stdint.h>
#include <stdarg.h>
#include <math.h>

#include "xparameters.h"
#include "xstatus.h"
#include "xil_types.h"
#include "xil_io.h"
#include "Xil_exception.h"

#ifdef XPAR_AXI_UARTLITE_0_BASEADDR
	#include "xuartlite_l.h"

	#define  UART_PL_LEN   64

	extern char  UART_PL_rec[UART_PL_LEN];

	typedef struct uart_PL_data_t
	{
		uint32_t UART_BASE;
	}uart_PL_data_t;


	extern void UARTprintf_PL(int style, char *pcString, ...);
	extern int  UARTRead_PL(int DeviceId,char *pui8Buffer);

#endif

#endif
