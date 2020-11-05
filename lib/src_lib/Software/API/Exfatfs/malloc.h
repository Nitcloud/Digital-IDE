#ifndef __MALLOC_H
#define __MALLOC_H

 
#ifndef NULL
#define NULL 0
#endif

//内存参数设定.
#define MEM_BLOCK_SIZE			16  	  						//内存块大小为32字节
#define MEM_MAX_SIZE			8*1024  						//最大管理内存 42K
#define MEM_ALLOC_TABLE_SIZE	MEM_MAX_SIZE/MEM_BLOCK_SIZE 	//内存表大小
 
		 
//内存管理控制器
struct _m_mallco_dev
{
	void (*init)(void);				//初始化
	unsigned char (*perused)(void);		  	//内存使用率
	unsigned char 	*membase;					//内存池 
	unsigned int *memmap; 					//内存管理状态表
	unsigned char  memrdy; 					//内存管理是否就绪
};
extern struct _m_mallco_dev mallco_dev;	//在mallco.c里面定义

void mymemset(void *s,unsigned char c,unsigned int count);	//设置内存
void mymemcpy(void *des,void *src,unsigned int n);//复制内存     
void mem_init(void);					 //内存管理初始化函数(外/内部调用)
unsigned int mem_malloc(unsigned int size);		 		//内存分配(内部调用)
unsigned char mem_free(unsigned int offset);		 		//内存释放(内部调用)
unsigned char mem_perused(void);					//得内存使用率(外/内部调用) 
////////////////////////////////////////////////////////////////////////////////
//用户调用函数
void myfree(void *ptr);  				//内存释放(外部调用)
void *mymalloc(unsigned int size);				//内存分配(外部调用)
void *myrealloc(void *ptr,unsigned int size);	//重新分配内存(外部调用)
#endif













