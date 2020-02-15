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

import glob 
import os

def del_file(file_param):
     for infile in glob.glob(os.path.join(file_param, '*.jou')):
          os.remove(infile)
     for infile in glob.glob(os.path.join(file_param, '*.log')):
          os.remove(infile)
     for infile in glob.glob(os.path.join(file_param, '*.str')):
          os.remove(infile)
     for infile in glob.glob(os.path.join(file_param, "prj/", '*.jou')):
          os.remove(infile)
     for infile in glob.glob(os.path.join(file_param, "prj/", '*.log')):
          os.remove(infile)


def Handle_file(file_param,file_name):
     file_num = 0
     f_list = os.listdir(file_param)
     for file in f_list:
          if os.path.splitext(file)[1] == file_name:
               tcl_file = os.path.join(os.path.dirname(os.path.abspath(__file__)),".TOOL/xilinx/run.tcl")
               cmd = "vivado -mode tcl -s %s ./prj/xilinx/template.xpr -notrace" % (tcl_file.replace("\\", "/"))
               os.system(cmd)
               file_num = file_num + 1
     if file_num == 0:
          tcl_file = os.path.join(os.path.dirname(os.path.abspath(__file__)),".TOOL/xilinx/start.tcl")
          cmd = "vivado -mode tcl -s %s -notrace" % (tcl_file.replace("\\", "/"))
          os.system(cmd)


def main():
     del_file("./")
     Handle_file("./prj/xilinx",".xpr")
     del_file("./")

if __name__ == "__main__":
    main()