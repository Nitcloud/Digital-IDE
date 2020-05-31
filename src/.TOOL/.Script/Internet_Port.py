#!/usr/bin/python3.6
import sys
import socket
 
BUFFER_SIZE = 1024
TARGET_ADDR = '' #表示为本地主机
TARGET_PORT = 60000
TARGET = (TARGET_ADDR,TARGET_PORT)
 



#AF_INET表示为网络编程socket、SOCK_DGRAM选择UDP协议模式
ss = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
ss.bind(TARGET) #绑定对应的IP地址及端口号
 
while True:
    data,addrRsv = ss.recvfrom(BUFFER_SIZE)
    if not data:
        sys.exit(0)
    else:
        print(data)
 
ss.close()
 
ss = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
BUFFER_SIZE = 1024
TARGET_ADDR = 'IP address'
TARGET_PORT = 60000
TARGET = (TARGET_ADDR,TARGET_PORT)
 
while True:
    aa = input('> ') #输入相应数据
    if not aa:
        break
    #需要为字节型数据，将数据发送给相应目标IP地址及端口号
    ss.sendto(bytes(aa,'utf-8'),TARGET)
    data,addrRsv = ss.recvfrom(BUFFER_SIZE)
    if not data:
        break
    else:
        print(data)
        print(addrRsv)
    
ss.close()