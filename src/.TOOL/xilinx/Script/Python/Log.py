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
import glob 
import shutil
import linecache

def showlog(path):
	log_flag = 0
	f_build = open(os.path.join(path,"Build.log"), 'w')

	folder = os.path.exists(os.path.join(path,"synth_1/runme.log"))
	if folder:                  
		f_synth = open(os.path.join(path,"synth_1/runme.log"), 'r')
		synth_line = f_synth.readline()
		while synth_line:
			if re.match("ERROR:", synth_line)  :
				f_build.write(synth_line)
				log_flag = 1
			if re.match("CRITICAL WARNING:", synth_line) :
				f_build.write(synth_line)
				log_flag = 1
			synth_line = f_synth.readline()
		f_synth.close()

	folder = os.path.exists(os.path.join(path,"impl_1/runme.log"))
	if folder: 
		f_impl = open(os.path.join(path,"impl_1/runme.log"), 'r')
		impl_line = f_impl.readline()
		while impl_line:
			if re.match("ERROR:", impl_line) :
				f_build.write(impl_line)
				log_flag = 1
			if re.match("CRITICAL WARNING:", impl_line) :
				f_build.write(impl_line)
				log_flag = 1
			impl_line = f_impl.readline()
		f_impl.close()

	f_build.close()
	return log_flag


def main():
	if showlog("./prj/xilinx/template.runs") :
		os.system("code ./prj/xilinx/template.runs/Build.log")
	os.system("cls")

if __name__ == "__main__":
    main()