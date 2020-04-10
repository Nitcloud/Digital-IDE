#!/usr/bin/env python
# coding=utf-8

'''
#Author       : sterben(Duan)
#LastAuthor   : sterben(Duan)
#Date         : 2020-02-03 17:09:48
#lastTime     : 2020-02-11 16:49:33
#FilePath     : ./.TOOL/Link/start.py
#Description  : 
'''

import os
import re
import sys
import glob 
import shutil
import linecache

def showlog(path):
	xlog_flag = 0
	folder = os.path.exists(path)
	if folder:
		f_log  = open("./prj/xilinx/LOG.log", 'w')
		f_xlog = open(path, 'r')
		log_line = f_xlog.readline()
		while log_line:
			if re.match("ERROR:", log_line) :
				f_log.write(log_line)
				xlog_flag = 1
			if re.match("CRITICAL WARNING:", log_line) :
				f_log.write(log_line)
				xlog_flag = 1
			log_line = f_xlog.readline()
		f_log.close()
		f_xlog.close()
	return xlog_flag

def main(type):
	log_flag = 0
	if type == "synth":
		if showlog("./prj/xilinx/template.runs/synth_1/runme.log") :
			os.system("code ./prj/xilinx/LOG.log")
			log_flag = 1
	elif type == "impl":
		if showlog("./prj/xilinx/template.runs/impl_1/runme.log") :
			os.system("code ./prj/xilinx/LOG.log")
			log_flag = 1
	elif type == "sim":
		if showlog("./prj/xilinx/template.sim/sim_1/behav/xsim/xvlog.log") :
			os.system("code ./prj/xilinx/LOG.log")
			log_flag = 1	
		if showlog("./prj/xilinx/template.sim/sim_1/behav/xsim/elaborate.log") :
			os.system("code ./prj/xilinx/LOG.log")
			log_flag = 1
	if log_flag == 1:
		print("error")
	elif log_flag == 0:
		print("none")

if __name__ == "__main__":
    main(sys.argv[1])