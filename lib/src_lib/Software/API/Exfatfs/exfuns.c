#include "exfuns.h"

 //ÎÄ¼þÀàÐÍÁÐ±í
const unsigned char *FILE_TYPE_TBL[6][13]=
{
{"BIN"},			//BINÎÄ¼þ
{"LRC"},			//LRCÎÄ¼þ
{"NES"},			//NESÎÄ¼þ
{"TXT","C","H"},	//ÎÄ±¾ÎÄ¼þ
{"MP1","MP2","MP3","MP4","M4A","3GP","3G2","OGG","ACC","WMA","WAV","MID","FLAC"},//ÒôÀÖÎÄ¼þ
{"BMP","JPG","JPEG","GIF"},//Í¼Æ¬ÎÄ¼þ
};
///////////////////////////////¹«¹²ÎÄ¼þÇø,Ê¹ÓÃmallocµÄÊ±ºò////////////////////////////////////////////
FATFS *fs[2];  		//Âß¼­´ÅÅÌ¹¤×÷Çø.	 
FIL *file;	  		//ÎÄ¼þ1
FIL *ftemp;	  		//ÎÄ¼þ2.
UINT br,bw;			//¶ÁÐ´±äÁ¿
FILINFO fileinfo;	//ÎÄ¼þÐÅÏ¢
DIR dir;  			//Ä¿Â¼

unsigned char *fatbuf;			//SD¿¨Êý¾Ý»º´æÇø
///////////////////////////////////////////////////////////////////////////////////////
//ÎªexfunsÉêÇëÄÚ´æ
//·µ»ØÖµ:0,³É¹¦
//1,Ê§°Ü
unsigned char exfuns_init(void)
{
	fs[0]=(FATFS*)mymalloc(sizeof(FATFS));	//Îª´ÅÅÌ0¹¤×÷ÇøÉêÇëÄÚ´æ	
	fs[1]=(FATFS*)mymalloc(sizeof(FATFS));	//Îª´ÅÅÌ1¹¤×÷ÇøÉêÇëÄÚ´æ
	file=(FIL*)mymalloc(sizeof(FIL));		//ÎªfileÉêÇëÄÚ´æ
	ftemp=(FIL*)mymalloc(sizeof(FIL));		//ÎªftempÉêÇëÄÚ´æ
	fatbuf=(unsigned char*)mymalloc(512);				//ÎªfatbufÉêÇëÄÚ´æ
	if(fs[0]&&fs[1]&&file&&ftemp&&fatbuf)return 0;  //ÉêÇëÓÐÒ»¸öÊ§°Ü,¼´Ê§°Ü.
	else return 1;	
}

//½«Ð¡Ð´×ÖÄ¸×ªÎª´óÐ´×ÖÄ¸,Èç¹ûÊÇÊý×Ö,Ôò±£³Ö²»±ä.
unsigned char char_upper(unsigned char c)
{
	if(c<'A')return c;//Êý×Ö,±£³Ö²»±ä.
	if(c>='a')return c-0x20;//±äÎª´óÐ´.
	else return c;//´óÐ´,±£³Ö²»±ä
}	      
//±¨¸æÎÄ¼þµÄÀàÐÍ
//fname:ÎÄ¼þÃû
//·µ»ØÖµ:0XFF,±íÊ¾ÎÞ·¨Ê¶±ðµÄÎÄ¼þÀàÐÍ±àºÅ.
//		 ÆäËû,¸ßËÄÎ»±íÊ¾ËùÊô´óÀà,µÍËÄÎ»±íÊ¾ËùÊôÐ¡Àà.
unsigned char f_typetell(unsigned char *fname)
{
	unsigned char tbuf[5];
	unsigned char *attr='\0';//ºó×ºÃû
	unsigned char i=0,j;
	while(i<250)
	{
		i++;
		if(*fname=='\0')break;//Æ«ÒÆµ½ÁË×îºóÁË.
		fname++;
	}
	if(i==250)return 0XFF;//´íÎóµÄ×Ö·û´®.
 	for(i=0;i<5;i++)//µÃµ½ºó×ºÃû
	{
		fname--;
		if(*fname=='.')
		{
			fname++;
			attr=fname;
			break;
		}
  	}
	strcpy((char *)tbuf,(const char*)attr);//copy
 	for(i=0;i<4;i++)tbuf[i]=char_upper(tbuf[i]);//È«²¿±äÎª´óÐ´ 
	for(i=0;i<6;i++)
	{
		for(j=0;j<13;j++)
		{
			if(*FILE_TYPE_TBL[i][j]==0)break;//´Ë×éÒÑ¾­Ã»ÓÐ¿É¶Ô±ÈµÄ³ÉÔ±ÁË.
			if(strcmp((const char *)FILE_TYPE_TBL[i][j],(const char *)tbuf)==0)//ÕÒµ½ÁË
			{
				return (i<<4)|j;
			}
		}
	}
	return 0XFF;//Ã»ÕÒµ½		 			   
}	 

//µÃµ½´ÅÅÌÊ£ÓàÈÝÁ¿
//drv:´ÅÅÌ±àºÅ("0:"/"1:")
//total:×ÜÈÝÁ¿	 £¨µ¥Î»KB£©
//free:Ê£ÓàÈÝÁ¿	 £¨µ¥Î»KB£©
//·µ»ØÖµ:0,Õý³£.ÆäËû,´íÎó´úÂë
unsigned char exf_getfree(unsigned char *drv,unsigned long int *total,unsigned long int *free)
{
	FATFS *fs1;
	unsigned char res;
    unsigned long int fre_clust=0, fre_sect=0, tot_sect=0;
    //µÃµ½´ÅÅÌÐÅÏ¢¼°¿ÕÏÐ´ØÊýÁ¿
    res =(unsigned long int)f_getfree((const TCHAR*)drv, (DWORD*)&fre_clust, &fs1);
    if(res==0)
	{											   
	    tot_sect=(fs1->n_fatent-2)*fs1->csize;	//µÃµ½×ÜÉÈÇøÊý
	    fre_sect=fre_clust*fs1->csize;			//µÃµ½¿ÕÏÐÉÈÇøÊý	   
#if _MAX_SS!=512				  				//ÉÈÇø´óÐ¡²»ÊÇ512×Ö½Ú,Ôò×ª»»Îª512×Ö½Ú
		tot_sect*=fs1->csize/512;
		fre_sect*=fs1->csize/512;
#endif	  
		*total=tot_sect>>1;	//µ¥Î»ÎªKB
		*free=fre_sect>>1;	//µ¥Î»ÎªKB 
 	}
	return res;
}		   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////




















