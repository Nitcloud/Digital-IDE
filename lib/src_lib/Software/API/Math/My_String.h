/*
 * My_String.h
 *
 *  Created on: 2018Äê5ÔÂ16ÈÕ
 *      Author: duan
 */

#ifndef APIS_MY_STRING_H_
#define APIS_MY_STRING_H_

#include <stdint.h>
#include <stdbool.h>
#include <math.h>

extern int     my_strnum(int8_t*str,double *res);
extern double  my_pow(double x, double y);
extern int8_t  my_strlen(int8_t*str);
extern void    my_strcopy(int8_t*str1,int8_t *str2);
extern int8_t  my_strcmp(int8_t *str1,int8_t *str2);
extern void    ShellSort(double A[], int n);
extern uint8_t my_numstr(double value_f, int8_t *String);
extern void my_numbyt(int8_t *string,double *value,double max);
extern void my_bytnum(int8_t *string,double *value,double max);

#endif /* APIS_MY_STRING_H_ */
