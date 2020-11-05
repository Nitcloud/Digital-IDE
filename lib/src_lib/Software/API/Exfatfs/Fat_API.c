#include "Fat_API.h"

//为磁盘注册工作区	 
//path:磁盘路径，比如"0:"、"1:"
//mt:0，不立即注册（稍后注册）；1，立即注册
//返回值:执行结果
unsigned char mf_mount(unsigned char* path,unsigned char mt)
{		   
	return f_mount(fs[0],(const TCHAR*)path,mt); 
}
//打开路径下的文件
//path:路径+文件名
//mode:打开模式
//返回值:执行结果
unsigned char mf_open(unsigned char*path,unsigned char mode)
{
	unsigned char res;	 
	res=f_open(file,(const TCHAR*)path,mode);//打开文件夹
	return res;
} 
//关闭文件
//返回值:执行结果
unsigned char mf_close(void)
{
	f_close(file);
	return 0;
}
//读出数据
//len:读出的长度
//返回值:执行结果
unsigned char mf_read(unsigned int len)
{
	unsigned int i,t;
	unsigned char res=0;
	unsigned int tlen=0;
	UARTprintf(1,"\r\nRead file data is:\r\n");
	for(i=0;i<len/512;i++)
	{
		res=f_read(file,fatbuf,512,&br);
		if(res)
		{
			UARTprintf(1,"Read Error:%d\r\n",res);
			break;
		}else
		{
			tlen+=br;
			for(t=0;t<br;t++)UARTprintf(1,"%c",fatbuf[t]);
		}
	}
	if(len%512)
	{
		res=f_read(file,fatbuf,len%512,&br);
		if(res)	//读数据出错了
		{
			UARTprintf(1,"\r\nRead Error:%d\r\n",res);
		}else
		{
			tlen+=br;
			for(t=0;t<br;t++)UARTprintf(1,"%c",fatbuf[t]);
		}	 
	}
	if(tlen)UARTprintf(1,"\r\nReaded data len:%d\r\n",tlen);//读到的数据长度
	UARTprintf(1,"Read data over\r\n");
	return res;
}
//写入数据
//dat:数据缓存区
//len:写入长度
//返回值:执行结果
unsigned char mf_write(unsigned char*dat,unsigned int len)
{			    
	unsigned char res;	   					   

	UARTprintf(1,"\r\nBegin Write file...\r\n");
	UARTprintf(1,"Write data len:%d\r\n",len);
	res=f_write(file,dat,len,&bw);
	if(res)
	{
		UARTprintf(1,"Write Error:%d\r\n",res);
	}else UARTprintf(1,"Writed data len:%d\r\n",bw);
	UARTprintf(1,"Write data over.\r\n");
	return res;
}

//打开目录
 //path:路径
//返回值:执行结果
unsigned char mf_opendir(unsigned char* path)
{
	return f_opendir(&dir,(const TCHAR*)path);	
}
//关闭目录 
//返回值:执行结果
unsigned char mf_closedir(void)
{
	return f_closedir(&dir);	
}
//打读取文件夹
//返回值:执行结果
unsigned char mf_readdir(void)
{
	unsigned char res;
	char *fn;			 
#if _USE_LFN
 	fileinfo.lfsize = _MAX_LFN * 2 + 1;
	fileinfo.lfname = mymalloc(fileinfo.lfsize);
#endif		  
	res=f_readdir(&dir,&fileinfo);//读取一个文件的信息
	if(res!=FR_OK||fileinfo.fname[0]==0)
	{
		myfree(fileinfo.fname);
		return res;//读完了.
	}
#if _USE_LFN
	fn=*fileinfo.lfname ? fileinfo.lfname : fileinfo.fname;
#else
	fn=fileinfo.fname;;
#endif	
	UARTprintf(1,"\r\n DIR info:\r\n");

//	UARTprintf(1,"dir.id:%d\r\n",dir.id);
//	UARTprintf(1,"dir.index:%d\r\n",dir.index);
//	UARTprintf(1,"dir.sclust:%d\r\n",dir.sclust);
	UARTprintf(1,"dir.obj:%d\r\n",dir.obj);
	UARTprintf(1,"dir.dptr:%d\r\n",dir.dptr);
	UARTprintf(1,"dir.clust:%d\r\n",dir.clust);
	UARTprintf(1,"dir.sect:%d\r\n",dir.sect);

	UARTprintf(1,"\r\n");
	UARTprintf(1,"File Name is:%s\r\n",fn);
	UARTprintf(1,"File Size is:%d\r\n",fileinfo.fsize);
	UARTprintf(1,"File data is:%d\r\n",fileinfo.fdate);
	UARTprintf(1,"File time is:%d\r\n",fileinfo.ftime);
	UARTprintf(1,"File Attr is:%d\r\n",fileinfo.fattrib);
	UARTprintf(1,"\r\n");
	myfree(fileinfo.fname);
	return 0;
}			 

 //遍历文件
 //path:路径
 //返回值:执行结果
unsigned char mf_scan_files(unsigned char * path)
{
	FRESULT res;	  
    char *fn;   /* This function is assuming non-Unicode cfg. */
#if _USE_LFN
 	fileinfo.lfsize = _MAX_LFN * 2 + 1;
	fileinfo.lfname = mymalloc(fileinfo.lfsize);
#endif		  

    res = f_opendir(&dir,(const TCHAR*)path); //打开一个目录
    if (res == FR_OK) 
	{	
		UARTprintf(1,"\r\n");
		while(1)
		{
	        res = f_readdir(&dir, &fileinfo);                   //读取目录下的一个文件
	        if (res != FR_OK || fileinfo.fname[0] == 0) break;  //错误了/到末尾了,退出
	        //if (fileinfo.fname[0] == '.') continue;             //忽略上级目录
#if _USE_LFN
        	fn = *fileinfo.lfname ? fileinfo.lfname : fileinfo.fname;
#else							   
        	fn = fileinfo.fname;
#endif	                                              /* It is a file. */
			UARTprintf(1,"%s/", path);//打印路径
			UARTprintf(1,"%s\r\n",  fn);//打印文件名
		} 
    }	  
	myfree(fileinfo.fname);
    return res;	  
}
//显示剩余容量
//drv:盘符
//返回值:剩余容量(字节)
unsigned long int mf_showfree(unsigned char *drv)
{
	FATFS *fs1;
	unsigned char res;
    unsigned long int fre_clust=0, fre_sect=0, tot_sect=0;
    //得到磁盘信息及空闲簇数量
    res = f_getfree((const TCHAR*)drv,(DWORD*)&fre_clust, &fs1);
    if(res==0)
	{											   
	    tot_sect = (fs1->n_fatent - 2) * fs1->csize;//得到总扇区数
	    fre_sect = fre_clust * fs1->csize;			//得到空闲扇区数	   
#if _MAX_SS!=512
		tot_sect*=fs1->csize/512;
		fre_sect*=fs1->csize/512;
#endif	  
		if(tot_sect<20480)//总容量小于10M
		{
		    /* Print free space in unit of KB (assuming 512 bytes/sector) */
		    UARTprintf(1,"\r\n磁盘总容量:%d KB\r\n"
		           "可用空间:%d KB\r\n",
		           tot_sect>>1,fre_sect>>1);
		}else
		{
		    /* Print free space in unit of KB (assuming 512 bytes/sector) */
		    UARTprintf(1,"\r\n磁盘总容量:%d MB\r\n"
		           "可用空间:%d MB\r\n",
		           tot_sect>>11,fre_sect>>11);
		}
	}
	return fre_sect;
}		    
//文件读写指针偏移
//offset:相对首地址的偏移量
//返回值:执行结果.
unsigned char mf_lseek(unsigned long int offset)
{
	return f_lseek(file,offset);
}
//读取文件当前读写指针的位置.
//返回值:位置
unsigned long int mf_tell(void)
{
	return f_tell(file);
}
//读取文件大小
//返回值:文件大小
unsigned long int mf_size(void)
{
	return f_size(file);
} 
//创建目录
//pname:目录路径+名字
//返回值:执行结果
unsigned char mf_mkdir(unsigned char*pname)
{
	return f_mkdir((const TCHAR *)pname);
}

//删除文件/目录
//pname:文件/目录路径+名字
//返回值:执行结果
unsigned char mf_unlink(unsigned char *pname)
{
	return  f_unlink((const TCHAR *)pname);
}

//修改文件/目录名字(如果目录不同,还可以移动文件哦!)
//oldname:之前的名字
//newname:新名字
//返回值:执行结果
unsigned char mf_rename(unsigned char *oldname,unsigned char* newname)
{
	return  f_rename((const TCHAR *)oldname,(const TCHAR *)newname);
}
//获取盘符（磁盘名字）
//path:磁盘路径，比如"0:"、"1:"  
//void mf_getlabel(unsigned char *path)
//{
//	unsigned char buf[20];
//	unsigned long int sn=0;
//	unsigned char res;
//	res=f_getlabel ((const TCHAR *)path,(TCHAR *)buf,(DWORD*)&sn);
//	if(res==FR_OK)
//	{
//		UARTprintf(1,"\r\n磁盘%s 的盘符为:%s\r\n",path,buf);
//		UARTprintf(1,"磁盘%s 的序列号:%X\r\n\r\n",path,sn);
//	}else UARTprintf(1,"\r\n获取失败，错误码:%X\r\n",res);
//}
//设置盘符（磁盘名字），最长11个字符！！，支持数字和大写字母组合以及汉字等
//path:磁盘号+名字，比如"0:ALIENTEK"、"1:OPENEDV"  
//void mf_setlabel(unsigned char *path)
//{
//	unsigned char res;
//	res=f_setlabel ((const TCHAR *)path);
//	if(res==FR_OK)
//	{
//		UARTprintf(1,"\r\n磁盘盘符设置成功:%s\r\n",path);
//	}else UARTprintf(1,"\r\n磁盘盘符设置失败，错误码:%X\r\n",res);
//}
//
////从文件里面读取一段字符串
////size:要读取的长度
//void mf_gets(unsigned int size)
//{
// 	TCHAR* rbuf;
//	rbuf=f_gets((TCHAR*)fatbuf,size,file);
//	if(*rbuf==0)return  ;//没有数据读到
//	else
//	{
//		UARTprintf(1,"\r\nThe String Readed Is:%s\r\n",rbuf);
//	}
//}
////需要_USE_STRFUNC>=1
////写一个字符到文件
////c:要写入的字符
////返回值:执行结果
//unsigned char mf_putc(unsigned char c)
//{
//	return f_putc((TCHAR)c,file);
//}
////写字符串到文件
////c:要写入的字符串
////返回值:写入的字符串长度
//unsigned char mf_puts(unsigned char*c)
//{
//	return f_puts((TCHAR*)c,file);
//}













