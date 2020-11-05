#ifndef __FATTESTER_H
#define __FATTESTER_H 

#include "string.h"			   
#include "exfuns.h"
#include "malloc.h"
#include "ff.h"

#include "BIOS/uart_ps.h"
 
unsigned char mf_mount(unsigned char* path,unsigned char mt);
unsigned char mf_open(unsigned char*path,unsigned char mode);
unsigned char mf_close(void);
unsigned char mf_read(unsigned int len);
unsigned char mf_write(unsigned char*dat,unsigned int len);
unsigned char mf_opendir(unsigned char* path);
unsigned char mf_closedir(void);
unsigned char mf_readdir(void);
unsigned char mf_scan_files(unsigned char * path);
unsigned long int mf_showfree(unsigned char *drv);
unsigned char mf_lseek(unsigned long int offset);
unsigned long int mf_tell(void);
unsigned long int mf_size(void);
unsigned char mf_mkdir(unsigned char*pname);
unsigned char mf_fmkfs(unsigned char* path,unsigned char mode,unsigned int au);
unsigned char mf_unlink(unsigned char *pname);
unsigned char mf_rename(unsigned char *oldname,unsigned char* newname);
void mf_getlabel(unsigned char *path);
void mf_setlabel(unsigned char *path); 
void mf_gets(unsigned int size);
unsigned char mf_putc(unsigned char c);
unsigned char mf_puts(unsigned char*c);
 
#endif





























