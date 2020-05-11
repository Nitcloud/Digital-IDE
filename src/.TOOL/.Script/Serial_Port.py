import serial
import serial.tools.list_ports

import time
import threading
 
def current_com(): 
	port_list = list(serial.tools.list_ports.comports())
	
	if len(port_list) <= 0:
		print ("The Serial port can't find!")
		
	elif len(port_list) == 1:
		port_serial = list(port_list[0])[0]
		ser = serial.Serial(port_serial,9600,timeout = 60)
		print ("%s >") % ser.name

	else:
		pass

# class SerialPort:
# 	message='' 
# 	def __init__(self,port,buand):
# 		super(SerialPort, self).__init__()
# 		self.port=serial.Serial(port,buand)
# 		self.port.close()
# 		if not self.port.isOpen():
# 			self.port.open()
# 	def port_open(self):
# 		if not self.port.isOpen():
# 			self.port.open()
# 	def port_close(self):
# 		self.port.close()
# 	def send_data(self):
# 			data = input("请输入要发送的数据（非中文）并同时接收数据: ")
# 			n=self.port.write((data+'\n').encode())
# 			return n
# 	def read_data(self):
# 		while True:
# 			self.message=self.port.readline()
# 			print(self.message)
 
# serialPort="COM7"   #串口
# baudRate=9600       #波特率
 
# if __name__=='__main__':
    
# 	mSerial=SerialPort(serialPort,baudRate)
# 	t1=threading.Thread(target=mSerial.read_data) 
 
# 	t1.start()
# 	while True:
#          time.sleep(1)
#          mSerial.send_data()  