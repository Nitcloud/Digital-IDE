/*
 * TIMER_Init.c
 *
 *  Created on: 2019年2月12日
 *      Author: duan
 */

//#define TIMER_LOAD_VALUE    0x13D92D3F
#include "Timer_Init.h"

XScuTimer Timer_Init;

void __attribute__((weak)) Timer_Handler()
{
    static int count = 0;   //计数
    count++;
    printf(" %d Second\n\r",count);  //每秒打印输出一次
}

static void TimerIntHandler_MSP_PS(void *CallBackRef)
{
    XScuTimer *TimerInstancePtr = (XScuTimer *) CallBackRef;
    XScuTimer_ClearInterruptStatus(TimerInstancePtr);
    Timer_Handler();
}

void SetupInterruptSystem_TIME(u32 DeviceId,
                XScuTimer *TimerInstancePtr, u16 TimerIntrId,
                 Xil_ExceptionHandler TimerIntrHandler_MSP)
{
    XScuGic_Config *IntcConfig; //GIC config
    static XScuGic Intc;        //GIC
    Xil_ExceptionInit();
    //initialise the GIC
    IntcConfig = XScuGic_LookupConfig(DeviceId);
    XScuGic_CfgInitialize(&Intc, IntcConfig,
                    IntcConfig->CpuBaseAddress);

    Xil_ExceptionRegisterHandler(XIL_EXCEPTION_ID_INT,
                (Xil_ExceptionHandler)XScuGic_InterruptHandler,//connect to the hardware
                &Intc);

    XScuGic_Connect(&Intc, TimerIntrId,
                    (Xil_ExceptionHandler)TimerIntrHandler_MSP,//set up the timer interrupt
                    (void *)TimerInstancePtr);

    XScuGic_Enable(&Intc, TimerIntrId);//enable the interrupt for the Timer at GIC
    XScuTimer_EnableInterrupt(TimerInstancePtr);//enable interrupt on the timer
    Xil_ExceptionEnableMask(XIL_EXCEPTION_IRQ); //Enable interrupts in the Processor.
}


void TimerInit_PS(u32 time,char *unit)
{
     u32 TIMER_LOAD_VALUE;
     XScuTimer_Config *TMRConfigPtr;     //timer config
     //私有定时器初始化
     TMRConfigPtr = XScuTimer_LookupConfig(TIMER_DEVICE_ID);
     XScuTimer_CfgInitialize(&Timer_Init, TMRConfigPtr,TMRConfigPtr->BaseAddr);
     //加载计数周期，私有定时器的时钟为CPU的一般，为333MHZ,如果计数1S,
     //加载值为1sx(333x1000x1000)(1/s)-1=0x13D92D3F
     if(*unit=='u')
     {TIMER_LOAD_VALUE=333*time-1;}
     else if(*unit=='m')
     {TIMER_LOAD_VALUE=333000*time-1;}
     else if(*unit=='s')
     {TIMER_LOAD_VALUE=333000000*time-1;}
     XScuTimer_LoadTimer(&Timer_Init, TIMER_LOAD_VALUE);
     XScuTimer_EnableAutoReload(&Timer_Init);
     SetupInterruptSystem_TIME(INTC_DEVICE_ID,
                &Timer_Init,TIMER_IRPT_INTR,
                TimerIntHandler_MSP_PS);
}

//void TimerInit_PL(u32 DeviceId,u32 time,char *unit,XTmrCtr_Handler TimerIntHandler_PL)
//{
//    XTmrCtr *TimerInstance;
//    u32 TIMER_LOAD_VALUE;
//    xStattime = XTmrCtr_Initialize(TimerInstance, DeviceId);
//    XTmrCtr_SetHandler(TimerInstance, TimerIntHandler_PL, (void*)TimerInstance);
//    if(*unit=='u')
//    {TIMER_LOAD_VALUE=0xFFFFFFFF-(50*time-1);}
//    else if(*unit=='m')
//    {TIMER_LOAD_VALUE=0xFFFFFFFF-(50000*time-1);}
//    else if(*unit=='s')
//    {TIMER_LOAD_VALUE=0xFFFFFFFF-(50000000*time-1);}
//    XTmrCtr_SetResetValue(TimerInstance, DeviceId, TIMER_LOAD_VALUE);
//    XTmrCtr_SetOptions(TimerInstance, DeviceId, ( XTC_INT_MODE_OPTION | XTC_AUTO_RELOAD_OPTION ));
//    SetupInterruptSystem_TIME(DeviceId,
//                TimerInstance,TIMER_IRPT_INTR,
//                XTmrCtr_InterruptHandler);
//}

void Timer_EN(u32 state)
{
	if(state==0)
	{
		XScuTimer_Stop(&Timer_Init);
	}else if(state==1)
	{
		XScuTimer_Start(&Timer_Init);
	}
}

