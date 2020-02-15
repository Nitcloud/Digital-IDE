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

def find_file(file_param,file_name):
     file_num = 0
     f_list = os.listdir(file_param)
     for file in f_list:
          if os.path.splitext(file)[1] == file_name:
               os.system("vivado -mode tcl -s ./.TOOL/xilinx/run.tcl ./prj/xilinx/template.xpr -notrace")
               file_num = file_num + 1
     if file_num == 0:
          os.system("vivado -mode tcl -s ./.TOOL/xilinx/start.tcl -notrace")



def main():
     del_file("./")
     find_file("./prj/xilinx",".xpr")
     del_file("./")

if __name__ == "__main__":
    main()