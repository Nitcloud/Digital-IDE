#ifndef __HMI_H
#define __HMI_H

#include <stdio.h>
#include <stdint.h>
#include <math.h>

#include "BIOS/uart_ps.h"

extern const unsigned char SIN_TABLE[];

void HMICommandPut(const char *Data);
void HMIDrawCurve(const unsigned char *Data ,int Num);
void HMIShowText(int TextNum, const char *Data);


#endif
