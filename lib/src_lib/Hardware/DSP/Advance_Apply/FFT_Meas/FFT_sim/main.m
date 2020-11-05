clear;
clc;
close ALL;
fs=1024;     %2048采样率
f1=50;       %50HZ信号
t=0:1/fs:1023/fs;
datalength=fs;
x=cos(2*pi*f1*t)./256+1;
Y = fft(x,1024);
figure(1);

Ayy = (abs(Y)); 
plot(Ayy);
figure(2);
plot(x);
X=round(x*131072);
writelength=fs;
writedata=zeros(fs,1);
for i=1:fs
   a=X(i);
   if(a<0)
      a=0;
   end
   if(a>262144)
      a=262143;
   end
   if(a>131071)
       a=a-131072;
   else
       a=a+131072;    
   end
   writedata(i)=a;
end
figure(3);
plot(writedata);
fid=fopen('real.txt','w');
fprintf(fid,'%x\n',writedata);
fclose(fid);

imagedata=zeros(fs,1);
for i=1:fs
    imagedata(i)=0;
end
fid=fopen('image.txt','w');
fprintf(fid,'%x\n',imagedata);
fclose(fid);
   

