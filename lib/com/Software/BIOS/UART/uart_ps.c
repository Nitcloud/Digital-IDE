/*
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2019-05-25 00:34:45
 * #lastTime     : 2020-02-02 19:46:12
 * #FilePath     : \BIOS\uart_ps.c
 * #Description  : ZYNQ中UART ps部分的配置文件
 */

#include "uart_ps.h"

uart_ps_data_t uart_ps_array[2]={
    {
          .UART_BASE=XPS_UART0_BASEADDR,
		  .UART_INTR_ID=XPS_UART0_INT_ID,
		  #ifdef XPAR_PS7_UART_0_DEVICE_ID
		  .UART_DeviceId=XPAR_PS7_UART_0_DEVICE_ID,
		  #endif
    },
    {
          .UART_BASE=XPS_UART1_BASEADDR,
		  .UART_INTR_ID=XPS_UART1_INT_ID,
		  #ifdef XPAR_PS7_UART_1_DEVICE_ID
		  .UART_DeviceId=XPAR_PS7_UART_1_DEVICE_ID,
		  #endif
    },
};

XUartPs Uart_PS[2];
char  UART_rec[UART_LEN];
static const char * const g_pcHex = "0123456789abcdef";

void Uart_SelfTest()
{
    while(1) {
    	if(UARTRead(1,UART_rec) != 0)
		{UARTprintf(1,UART_rec);}
    }
}

void UartIntr_SelfTest()
{
	UARTRead(1,UART_rec);
	UARTprintf(1,UART_rec);
	UARTIntHandler_MSP(1);
}

void UARTIntHandler_MSP(int DeviceId)
{
	u32 IsrStatus;
	IsrStatus = XUartPs_ReadReg(uart_ps_array[DeviceId].UART_BASE,
				   XUARTPS_IMR_OFFSET);
	IsrStatus &= XUartPs_ReadReg(uart_ps_array[DeviceId].UART_BASE,
				   XUARTPS_ISR_OFFSET);
	XUartPs_WriteReg(uart_ps_array[DeviceId].UART_BASE, XUARTPS_ISR_OFFSET,
			IsrStatus);
}

void SetupInterruptSystem_UART(int DeviceId,Xil_InterruptHandler UART_IntrHandler)
{
	XScuGic_Config *IntcConfig; //GIC config
	static XScuGic Intc; 		//GIC
	Xil_ExceptionInit();
	//initialise the GIC
	IntcConfig = XScuGic_LookupConfig(XPAR_SCUGIC_SINGLE_DEVICE_ID);
	XScuGic_CfgInitialize(&Intc, IntcConfig,
					IntcConfig->CpuBaseAddress);

	Xil_ExceptionRegisterHandler(XIL_EXCEPTION_ID_INT,
				(Xil_ExceptionHandler)XScuGic_InterruptHandler,//connect to the hardware
				&Intc);
	Xil_ExceptionEnable();
	XScuGic_Connect(&Intc, uart_ps_array[DeviceId].UART_INTR_ID,
					(Xil_InterruptHandler)UART_IntrHandler,//set up the timer interrupt
					(void *)(Uart_PS+DeviceId));

	XScuGic_Enable(&Intc, uart_ps_array[DeviceId].UART_INTR_ID);//enable the interrupt for the Timer at GIC
	XUartPs_SetInterruptMask((Uart_PS+DeviceId), XUARTPS_IXR_RXOVR/* | XUARTPS_IXR_TXEMPTY | XUARTPS_IXR_TNFUL*/ );
	XUartPs_EnableUart((Uart_PS+DeviceId));//enable interrupt on the timer
	Xil_ExceptionEnableMask(XIL_EXCEPTION_IRQ); //Enable interrupts in the Processor.
}

int UARTInit(int DeviceId,Xil_InterruptHandler UART_IntHandler)
{
	int Status;
	XUartPs_Config *Config;

	Config=XUartPs_LookupConfig(uart_ps_array[DeviceId].UART_DeviceId);
	if (NULL == Config) {
		return XST_FAILURE;
	}

	Status=XUartPs_CfgInitialize((Uart_PS+DeviceId),Config,Config->BaseAddress);
	if (Status != XST_SUCCESS) {
		return XST_FAILURE;
	}
	SetupInterruptSystem_UART(DeviceId,UART_IntHandler);
	return XST_SUCCESS;
}

void UARTprintf(int DeviceId, char *pcString, ...)
{
    va_list vaArgP;
    va_start(vaArgP, pcString);
    UARTvprintf(DeviceId, pcString, vaArgP);
    va_end(vaArgP);
}

int UARTRead(int DeviceId,char *pui8Buffer)
{
	u32 cnt_rec=0;
	while(XUartPs_IsReceiveData(uart_ps_array[DeviceId].UART_BASE))
	{
		*(pui8Buffer+cnt_rec) = XUartPs_ReadReg(uart_ps_array[DeviceId].UART_BASE,
				XUARTPS_FIFO_OFFSET);
		cnt_rec++;
	}
	if(cnt_rec==0){return 0;}
	else {return cnt_rec;}
}

int UARTwrite(int DeviceId,char *pcBuf, uint32_t ui32Len)
{
    unsigned int uIdx;
    for(uIdx = 0; uIdx < ui32Len; uIdx++)
    {
        if(pcBuf[uIdx] == '\n')
        {
        	XUartPs_SendByte(uart_ps_array[DeviceId].UART_BASE,'\r');
        }
        XUartPs_SendByte(uart_ps_array[DeviceId].UART_BASE, pcBuf[uIdx]);
    }
    return(uIdx);
}

void UARTvprintf(int DeviceId, char *pcString, va_list vaArgP)
{
    uint32_t ui32Idx, ui32Value, ui32Pos, ui32Count, ui32Base, ui32Neg;
    double value_f=0.0f;
    uint32_t dec_num,int_num;
    char *pcStr, pcBuf[16] ,cFill,numstr[16];
    while(*pcString)
    {
        for(ui32Idx = 0;
            (pcString[ui32Idx] != '%') && (pcString[ui32Idx] != '\0');
            ui32Idx++)
        {
        }
        UARTwrite(DeviceId, pcString, ui32Idx);
        pcString += ui32Idx;
        if(*pcString == '%')
        {
            pcString++;
            ui32Count = 0;
            cFill = ' ';
again:
            switch(*pcString++)
            {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                {
                    if((pcString[-1] == '0') && (ui32Count == 0))
                    {
                        cFill = '0';
                    }
                    ui32Count *= 10;
                    ui32Count += pcString[-1] - '0';
                    goto again;
                }
                case 'c':
                {
                    ui32Value = va_arg(vaArgP, uint32_t);
                    UARTwrite(DeviceId, (char *)&ui32Value, 1);
                    break;
                }
                case 'd':
                case 'i':
                {
                    ui32Value = va_arg(vaArgP, uint32_t);
                    ui32Pos = 0;
                    if((int32_t)ui32Value < 0)
                    {
                        ui32Value = -(int32_t)ui32Value;
                        ui32Neg = 1;
                    }
                    else
                    {
                        ui32Neg = 0;
                    }
                    ui32Base = 10;
                    goto convert;
                }
                case 'f':
                {
                    value_f = va_arg(vaArgP,double);
                    ui32Pos=0;
                    ui32Count=0;
                    ui32Idx=0;
                    if((int32_t)value_f<0)
                    {
                        UARTwrite(DeviceId, "-", 1);
                        value_f=-value_f;
                    }
                    int_num = (uint32_t)(value_f);
                    dec_num = (uint32_t)((value_f-int_num)*10000);
                    while(int_num)
                    {
                        pcBuf[ui32Count] = ((uint32_t)int_num%10)+'0';
                        ui32Count++;
                        int_num= int_num/10;
                    }
                    ui32Pos+=ui32Count;
                    while (ui32Count!=0)
                    {
                        ui32Count--;
                        numstr[ui32Idx] = pcBuf[ui32Count];
                        ui32Idx++;
                    }
                    numstr[ui32Idx]='.';
                    ui32Pos++;
                    while(ui32Count!=4)
                    {
                        pcBuf[ui32Count] = ((uint32_t)dec_num%10)+'0';
                        ui32Count++;
                        dec_num= dec_num/10;
                    }
                    ui32Pos+=ui32Count;
                    while (ui32Count)
                    {
                        ui32Count--;
                        ui32Idx++;
                        numstr[ui32Idx] = pcBuf[ui32Count];
                    }
                    UARTwrite(DeviceId, numstr, ui32Pos);
                    ui32Pos=0;
                    ui32Count=0;
                    ui32Idx=0;
                    break;
                }
                case 's':
                {
                    pcStr = va_arg(vaArgP, char *);
                    for(ui32Idx = 0; pcStr[ui32Idx] != '\0'; ui32Idx++)
                    {
                    }
                    UARTwrite(DeviceId, pcStr, ui32Idx);
                    if(ui32Count > ui32Idx)
                    {
                        ui32Count -= ui32Idx;
                        while(ui32Count--)
                        {
                            UARTwrite(DeviceId," ", 1);
                        }
                    }
                    break;
                }
                case 'u':
                {
                    ui32Value = va_arg(vaArgP, uint32_t);
                    ui32Pos = 0;
                    ui32Base = 10;
                    ui32Neg = 0;
                    goto convert;
                }
                case 'x':
                case 'X':
                case 'p':
                {
                    ui32Value = va_arg(vaArgP, uint32_t);
                    ui32Pos = 0;
                    ui32Base = 16;
                    ui32Neg = 0;
convert:
                    for(ui32Idx = 1;
                        (((ui32Idx * ui32Base) <= ui32Value) &&
                         (((ui32Idx * ui32Base) / ui32Base) == ui32Idx));
                        ui32Idx *= ui32Base, ui32Count--)
                    {
                    }
                    if(ui32Neg)
                    {
                        ui32Count--;
                    }
                    if(ui32Neg && (cFill == '0'))
                    {
                        pcBuf[ui32Pos++] = '-';
                        ui32Neg = 0;
                    }
                    if((ui32Count > 1) && (ui32Count < 16))
                    {
                        for(ui32Count--; ui32Count; ui32Count--)
                        {
                            pcBuf[ui32Pos++] = cFill;
                        }
                    }
                    if(ui32Neg)
                    {
                        pcBuf[ui32Pos++] = '-';
                    }
                    for(; ui32Idx; ui32Idx /= ui32Base)
                    {
                        pcBuf[ui32Pos++] =
                            g_pcHex[(ui32Value / ui32Idx) % ui32Base];
                    }
                    UARTwrite(DeviceId, pcBuf, ui32Pos);
                    break;
                }
                case '%':
                {
                    UARTwrite(DeviceId, pcString - 1, 1);
                    break;
                }
                default:
                {
                    UARTwrite(DeviceId,"ERROR", 5);
                    break;
                }
            }
        }
    }
}


