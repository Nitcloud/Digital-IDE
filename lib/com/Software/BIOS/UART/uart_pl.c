/*************
DUAN制作

UART的配置文件

 2018.2.10
**************/
#include "uart_pl.h"

#ifdef XPAR_AXI_UARTLITE_0_BASEADDR
uart_PL_data_t uart_PL_array[2]={
    {
          .UART_BASE=XPAR_AXI_UARTLITE_0_BASEADDR,
    },
#ifdef XPAR_AXI_UARTLITE_1_BASEADDR
    {
          .UART_BASE=XPAR_AXI_UARTLITE_1_BASEADDR,
    },
#endif
};

char  UART_PL_rec[UART_PL_LEN];
static const char * const g_pcHex = "0123456789abcdef";

int UARTwrite_PL(int mode,char *pcBuf, uint32_t ui32Len)
{
    unsigned int uIdx;
    for(uIdx = 0; uIdx < ui32Len; uIdx++)
    {
        if(pcBuf[uIdx] == '\n')
        {
        	XUartLite_SendByte(uart_PL_array[mode].UART_BASE,'\r');
        }
        XUartLite_SendByte(uart_PL_array[mode].UART_BASE, pcBuf[uIdx]);
    }
    return(uIdx);
}

int UARTRead_PL(int DeviceId,char *pui8Buffer)
{
	u32 cnt_rec=0;
	while(XUartLite_IsReceiveEmpty(uart_PL_array[DeviceId].UART_BASE))
	{
		*(pui8Buffer+cnt_rec) = XUartLite_ReadReg(uart_PL_array[DeviceId].UART_BASE,
				XUL_RX_FIFO_OFFSET);
		cnt_rec++;
	}
	if(cnt_rec==0){return 0;}
	else {return cnt_rec;}
}

void UARTvprintf_PL(int mode, char *pcString, va_list vaArgP)
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
        UARTwrite_PL(mode, pcString, ui32Idx);
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
                    UARTwrite_PL(mode, (char *)&ui32Value, 1);
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
                        UARTwrite_PL(mode, "-", 1);
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
                    UARTwrite_PL(mode, numstr, ui32Pos);
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
                    UARTwrite_PL(mode, pcStr, ui32Idx);
                    if(ui32Count > ui32Idx)
                    {
                        ui32Count -= ui32Idx;
                        while(ui32Count--)
                        {
                            UARTwrite_PL(mode," ", 1);
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
                    UARTwrite_PL(mode, pcBuf, ui32Pos);
                    break;
                }
                case '%':
                {
                    UARTwrite_PL(mode, pcString - 1, 1);
                    break;
                }
                default:
                {
                    UARTwrite_PL(mode,"ERROR", 5);
                    break;
                }
            }
        }
    }
}

void UARTprintf_PL(int style, char *pcString, ...)
{
    va_list vaArgP;
    va_start(vaArgP, pcString);
    UARTvprintf_PL(style, pcString, vaArgP);
    va_end(vaArgP);
}

#endif

