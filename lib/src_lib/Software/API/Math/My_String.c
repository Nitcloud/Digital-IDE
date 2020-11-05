/*
 * My_String.c
 *
 *  Created on: 2018年5月16日
 *      Author: duan
 */

#include "My_String.h"

//希尔排序
// 最差时间复杂度 ---- 根据步长序列的不同而不同。已知最好的为O(n(logn)^2)
// 最优时间复杂度 ---- O(n)
// 平均时间复杂度 ---- 根据步长序列的不同而不同。
// 所需辅助空间 ------ O(1)
// 稳定性 ------------ 不稳定
// 输出---------------从小到大
void ShellSort(double A[], int n)
{
    int i = 0;
    int h = 0;
    while (h <= n)                          // 生成初始增量
    {
        h = 3 * h + 1;
    }
    while (h >= 1)
    {
        for (i = h; i < n; i++)
        {
            int j = i - h;
            double get = A[i];
            while (j >= 0 && A[j] > get)
            {
                A[j + h] = A[j];
                j = j - h;
            }
            A[j + h] = get;
        }
        h = (h - 1) / 3;                    // 递减增量
    }
}

double my_pow(double x, double y)
{
    double m=1;
    if(y==0) {
        return 1;
    }
    else {
        while(y--)
        {
            m=m*x;
        }
        return m;
    }
}

int8_t my_strcmp(int8_t *str1,int8_t *str2)
{
    while(1)
    {
        if(*str1!=*str2)return 1;//不相等
        str1++;
        str2++;
        if(*str1=='\0')break;//对比完成了
    }
    return 0;//两个字符串相等
}
void my_strcopy(int8_t*str1,int8_t *str2)
{
    while(1)
    {
        *str2=*str1;    //拷贝
        if(*str1=='\0')break;//拷贝完成了.
        str1++;
        str2++;
    }
}
int8_t my_strlen(int8_t*str)//不算最后的'/0'
{
    int8_t len=0;
    while(1)
    {
        if(*str=='\0')break;//计数完成了.
        len++;
        str++;
    }
    return len;
}

//浮点数转字符串：返回字符串长度，Precision：精确到小数点位数
uint8_t my_numstr(double value_f, int8_t *String)
{
    uint32_t ui32Pos=0;
    uint32_t ui32Count=0;
    uint32_t ui32Idx=0;
    uint32_t dec_num,int_num;
    int8_t   pcBuf[16];

    if((int32_t)value_f<0)
    {
        *String='-';
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
        String[ui32Idx] = pcBuf[ui32Count];
        ui32Idx++;
    }
    String[ui32Idx]='.';
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
        String[ui32Idx] = pcBuf[ui32Count];
    }
    return ui32Pos;
}

//把字符串转为数字
//支持16进制转换,但是16进制字母必须是大写的,且格式为以0X开头的.
//支持负数   支持浮点数
//*str:数字字符串指针
//*res:转换完的结果存放地址.
//返回值:0，成功转换完成.其他,错误代码.
//1,数据格式错误.2,16进制位数为0.3,起始格式错误.4,十进制位数为0.
int my_strnum(int8_t*str,double *res)
{
    uint32_t t;
    int tnum;
    int bnum=0;      //数字的整数位数
    int b_num=-1;    //数字的小数位数
    int8_t *p;
    uint8_t hexdec=10;   //默认为十进制数据
    uint8_t flag_num=0;  //0,为整数;1,表示为浮点数.
    uint8_t flag=0;      //0,没有符号标记;1,表示正数;2,表示负数.
    p=str;
    *res=0;//清零.
    while(1)
    {
        if((*p<='9'&&*p>='0')||(*p=='.')||((*str=='-'||*str=='+')&&bnum==0)
                ||(*p<='F'&&*p>='A')||(*p=='X'&&bnum==1))//参数合法
        {
            if(*p>='A')hexdec=16;   //字符串中存在字母,为16进制格式.
            if(*str=='-'){flag=2;str+=1;}//偏移掉符号
            else if(*str=='+'){flag=1;str+=1;}//偏移掉符号
            if(*p=='.') {flag_num=1;}
            if (flag_num==0) {
                bnum++;            //位数增加.
            }else {
                b_num++;        //位数增加.
            }
        }
        else break;
        p++;
    }
    p=str;              //重新定位到字符串开始的地址.
    if(hexdec==16)      //16进制数据
    {
        if(bnum<3)return 2;         //位数小于3，直接退出.因为0X就占了2个,如果0X后面不跟数据,则该数据非法.
        if(*p=='0' && (*(p+1)=='X'))//必须以'0X'开头.
        {
            p+=2;   //偏移到数据起始地址.
            bnum-=2;//减去偏移量
        }else return 3;//起始头的格式不对
    }else if(bnum==0)return 4;//位数为0，直接退出.
    while(bnum) {
        bnum--;
        if(*p<='9'&&*p>='0') t=*p-'0';   //得到数字的值
        else t=*p-'A'+10;               //得到A~F对应的值
        *res+=t*my_pow(hexdec,bnum);
        p++;
    }
    if(b_num!=-1)
    {
        while(b_num) {
                *res+=(*(p+b_num)-'0')*my_pow(0.1,b_num);
                b_num--;
            }
    }
    if(flag==2)//是否负数
    {
        tnum=-*res;
        *res=tnum;
    }
    return 0;//成功转换
}

void my_bytnum(int8_t *string,double *value,double max)
{
    int16_t b_value;
    b_value=*string<<8|*(string+1);
    *value=b_value/32768.0f*max;
}

void my_numbyt(int8_t *string,double *value,double max)
{
    int16_t b_value;
    b_value=*value/max*32768.0f;
    *string=b_value>>8;
    *(string+1)=b_value&0x00ff;
}
