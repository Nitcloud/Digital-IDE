/*
 * TIMER_Init.h
 *
 *  Created on: 2019Äê2ÔÂ12ÈÕ
 *      Author: duan
 */

#ifndef SRC_TIMER_INIT_H_
#define SRC_TIMER_INIT_H_

//timer info
#define TIMER_DEVICE_ID     XPAR_XSCUTIMER_0_DEVICE_ID
#define INTC_DEVICE_ID      XPAR_SCUGIC_SINGLE_DEVICE_ID
#define TIMER_IRPT_INTR     XPAR_SCUTIMER_INTR

#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdarg.h>
#include "xadcps.h"

#include "xil_types.h"
#include "Xscugic.h"
#include "Xil_exception.h"
#include "xscutimer.h"
//#include "xtmrctr.h"

extern XScuTimer Timer_Init;

extern void ConfigureTimer(u32 time,char *unit);
extern void Timer_EN(u32 state);

#endif /* SRC_TIMER_INIT_H_ */
