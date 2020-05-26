import sys
import serial
import serial.tools.list_ports

import time
import threading

class SerialPort:
    message='' 
    def __init__(self,port,buand):
        super(SerialPort, self).__init__()
        self.port = serial.Serial(port,buand)
        self.port.close()
        if not self.port.isOpen():
            self.port.open()
    def port_open(self):
        if not self.port.isOpen():
            self.port.open()
    def port_close(self):
        self.port.close()
    def porpertyConfig(self,parity,stopbits,bytesize):
		if parity == "N":
			self.port.parity = serial.PARITY_NONE
		elif parity == "O":
			self.port.parity = serial.PARITY_ODD
		elif parity == "E":
			self.port.parity = serial.PARITY_EVEN
		elif parity == "M":
			self.port.parity = serial.PARITY_MARK
		elif parity == "S":
			self.port.parity = serial.PARITY_SPACE
		
		if stopbits == "1":
			self.port.stopbits = serial.STOPBITS_ONE
		elif stopbits == "1.5":
			self.port.stopbits = serial.STOPBITS_ONE_POINT_FIVE
		elif stopbits == "2":
			self.port.stopbits = serial.STOPBITS_TWO
		
		if bytesize == "5":
			self.port.bytesize = serial.FIVEBITS
		elif bytesize == "6":
			self.port.bytesize = serial.SIXBITS
		elif bytesize == "7":
			self.port.bytesize = serial.SEVENBITS
		elif bytesize == "8":
			self.port.bytesize = serial.EIGHTBITS
    def send_data(self):
        data = input("[%s] >" % (self.port.name)) 
        n = self.port.write((data+'\n').encode())
        return n
    def read_data(self):
        while True:
            self.message = self.port.readline()
            print("%s" % self.message)

def getCurrentPort(): 
    port_list = list(serial.tools.list_ports.comports())
    
    if len(port_list) <= 0:
        print ("none")
        
    elif len(port_list) == 1:
        serialPort = list(port_list[0])[0]
        content = "one-" + serialPort
        print (content)

    elif len(port_list) > 1:
        content = "multiple"
        for port_serial in port_list:
            content += "-"
            content += port_serial[0]
        print(content)
 
def runthread(portName,baudRate,bytesize,stopbits,parity):
	mSerial = SerialPort(portName,baudRate)
	mSerial.porpertyConfig(parity,stopbits,bytesize)
	mSerial.port_open()

	readDataThread = threading.Thread(target = mSerial.read_data) 
	readDataThread.start()

	while True:
		time.sleep(1)
		mSerial.send_data()  

def main(mode):
	if mode == "getCurrentPort":
		getCurrentPort()
	if mode == "runthread":
		runthread(sys.argv[2],int(sys.argv[3]),sys.argv[4],sys.argv[5],sys.argv[6])

if __name__=='__main__':
	main(sys.argv[1])
