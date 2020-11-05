clear;
clc;
close ALL;
fs=1024;     %2048²ÉÑùÂÊ
fid=fopen('data_out_addr.txt','r');
addr=fscanf(fid,'%d');
fclose(fid);
fid=fopen('data_out_real.txt','r');
real=fscanf(fid,'%d');
fclose(fid);
fid=fopen('data_out_imag.txt','r');
imag=fscanf(fid,'%d');
fclose(fid);
X=int16(round(addr*1));
a=zeros(1024,1);
b=zeros(1024,1);
for i=1:1024
    X(i)=X(i)+1;
    a(X(i))=real(i);
    b(X(i))=imag(i);
end
figure(1);
plot(a);
figure(2);
plot(b);
figure(3);
c=a+1i*b;
c=abs(c);
plot(c);

    