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

def showlog(path,prj_name):
	folder = os.path.exists(os.path.join(path,"synth_1/runme.log"))
	if folder:                  
		os.system("code ./prj/xilinx/template.runs/synth_1/runme.log".replace("template",prj_name))
	folder = os.path.exists(os.path.join(path,"impl_1/runme.log"))
	if folder: 
		os.system("code ./prj/xilinx/template.runs/impl_1/runme.log".replace("template",prj_name))


def main(prj_name):
	showlog("./prj/xilinx/template.runs".replace("template",prj_name),prj_name)

if __name__ == "__main__":
    main(sys.argv[1])