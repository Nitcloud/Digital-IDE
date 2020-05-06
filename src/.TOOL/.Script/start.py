#!/usr/bin/env python
# coding=utf-8

'''
#Author       : sterben(Duan)
#LastAuthor   : sterben(Duan)
#Date         : 2020-02-03 17:09:48
#lastTime     : 2020-02-11 16:49:33
#FilePath     : ./.TOOL/.Script/start.py
#Description  : 
'''

import os
import sys
import glob 
import shutil
import linecache
import fileupdate

def del_file(file_param):
    folder = os.path.exists(os.path.join(file_param,".Xil"))
    if folder:
        shutil.rmtree(os.path.join(file_param,".Xil"))
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

def fpga_info():
    lines = []
    line_cnt = 0

    Version_line = 2
    prj_name_line = 2
    mode_line = 0

    fp = open("./Makefile", 'r')
    for line in fp:
        lines.append(line)
        line_cnt = line_cnt + 1
        if line == "Soc\n":
            mode_line = line_cnt
    fp.close()

    prj_info = lines[Version_line].replace('\n', '').split(' ')
    fpga_Version = prj_info[0]
    if len(prj_info) < 3:
        prj_name = "template"
    else:
        prj_name = prj_info[2]
    mode = lines[mode_line].replace('\n', '')
    info = [fpga_Version,prj_name,mode]
    return info

def move_xbd_xIP(prj_name,mode):
    source_IP_path = "./prj/xilinx/template.srcs/sources_1/ip".replace("template",prj_name)
    source_bd_path = "./prj/xilinx/template.srcs/sources_1/bd".replace("template",prj_name)
    if mode == "none":
        target_path = "./user"
    elif mode == "soc":
        target_path = "./user/Hardware"
    
    folder = os.path.exists(source_IP_path)
    if folder:
        files = os.listdir(source_IP_path) 
        for file in files: 
            fileupdate.deldir(os.path.join(target_path,"IP",file).replace("\\", "/"))
            shutil.move(os.path.join(source_IP_path,file).replace("\\", "/"),os.path.join(target_path,"IP").replace("\\", "/"))
    
    folder = os.path.exists(source_bd_path)
    if folder:
        files = os.listdir(source_bd_path) 
        for file in files: 
            fileupdate.deldir(os.path.join(target_path,"bd",file).replace("\\", "/"))
            shutil.move(os.path.join(source_bd_path,file).replace("\\", "/"),os.path.join(target_path,"bd").replace("\\", "/"))

def Open_prj():
    #handle xilinx
    f_list = os.listdir("./prj/xilinx")
    for file in f_list:
        if os.path.splitext(file)[1] == ".xpr":
            tcl_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"Xilinx/Script/Xilinx_TCL/Vivado/Run.tcl")
            cmd = "vivado -mode tcl -s %s -notrace" % (tcl_file.replace("\\", "/"))
            os.system(cmd)
            return "xilinx"
    return 0     

def mkconfig(path) :
    fileupdate.mkdir("./prj/xilinx")
    fileupdate.mkdir("./prj/intel")
    fileupdate.mkdir("./prj/modelsim")
    folder = os.path.exists(path)
    if not folder:
        config_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"Makefile")
        shutil.copy(config_file_path,path)
    info = fpga_info()
    if Open_prj() == "xilinx": #Open existing project
        move_xbd_xIP(info[1],info[2])
    else:              #Creat New project
        if info[0] == "xilinx" :
            tcl_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"Xilinx/Script/Xilinx_TCL/Vivado/Start.tcl")
            cmd = "vivado -mode tcl -s %s -notrace" % (tcl_file.replace("\\", "/"))
            os.system(cmd)
            move_xbd_xIP(info[1],info[2])

def start_sdk():
    tcl_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"Xilinx/Script/Xilinx_TCL/SDK/xsct_run.tcl")
    cmd = "xsct %s" % (tcl_file.replace("\\", "/"))
    os.system(cmd)

def main(mode):
    del_file("./")
    if mode == "fpga":
        mkconfig("./Makefile")
    elif mode == "sdk":
        start_sdk()
    del_file("./")

if __name__ == "__main__":
    main(sys.argv[1])