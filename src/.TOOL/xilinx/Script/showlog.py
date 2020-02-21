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
	folder = os.path.exists(os.path.join(path,"synth_1/runme.log"))
	if folder:                  
		os.system("code ./prj/xilinx/template.runs/synth_1/runme.log")
	folder = os.path.exists(os.path.join(path,"impl_1/runme.log"))
	if folder: 
		os.system("code ./prj/xilinx/template.runs/impl_1/runme.log")


def main():
	showlog("./prj/xilinx/template.runs")

if __name__ == "__main__":
    main()