import sys
import serial
import serial.tools.list_ports

import time
import threading

serialPort = "COM3" #serialPortName

class SerialPort:
    message='' 
    def __init__(self,port,buand):
        super(SerialPort, self).__init__()
        self.port=serial.Serial(port,buand)
        self.port.close()
        if not self.port.isOpen():
            self.port.open()
    def port_open(self):
        if not self.port.isOpen():
            self.port.open()
    def port_close(self):
        self.port.close()
    def porpertyConfig(self,parity,stopbits,bytesize):
        self.port.PARITIES  = parity
        self.port.STOPBITS  = stopbits
        self.port.BYTESIZES = bytesize
    def send_data(self):
        data = input("%s >" % (self.port.name)) 
        n = self.port.write((data+'\n').encode())
        return n
    def read_data(self):
        while True:
            self.message = self.port.readline()
            print("%s > %s" % (self.port.name,self.message))

def getCurrentPort(): 
    port_list = list(serial.tools.list_ports.comports())
    
    if len(port_list) <= 0:
        print ("none")
        
    elif len(port_list) == 1:
        serialPort = list(port_list[0])[0]
        print ("one")

    else:
        for port_serial in port_list:
            print ("%s" % (port_serial[0])) 

    return len(port_list)
 
def runthread(portName,baudRate,parity,stopbits,bytesize):
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
		runthread(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6])

if __name__=='__main__':
    # runthread(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5])
	# runthread("COM6",115200,"N",1,8)
	main(sys.argv[1])
