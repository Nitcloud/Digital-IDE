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

def Find_elf(path,type):
	#handle xilinx
	elf_list = []
	elf_num = 0
	Index = 0
	f_list = os.listdir(path)
	for file in f_list:
		if os.path.splitext(file)[1] == ".elf":
			if file != "fsbl.elf" :
				elf_list.append(file)
	if len(elf_list) > 1 :
		if type == "first":
			print("There are multiple elf files in the BOOT folder")
			print("Please select the elf file you want to BOOT")
			for elf_file in elf_list:
				elf_num = elf_num + 1
				print(elf_num,elf_file)
		else:
			print(elf_list[int(type)-1])
			return elf_list[int(type)-1]
	elif len(elf_list) == 1 :
		print("one")
		return elf_list[0]
	elif  len(elf_list) == 0 :
		print("none")
		return "none"

def make_boot_file(type,prj_name):
	BOOT_folder = os.path.exists("./user/BOOT")
	output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),"BOOT")  
              
	f = open(os.path.join(output_path,"output.bif"), 'w')
	f.write("//arch = zynq; split = false; format = BIN\n")
	f.write("the_ROM_image:\n")
	f.write("{\n")

	if not BOOT_folder:
		bootloader = "\t[bootloader]%s/fsbl.elf\n" % (output_path.replace("\\", "/"))
		ps_elf = "\t%s/%s\n" % (output_path.replace("\\", "/"),Find_elf(output_path.replace("\\", "/"),type))
		f.write(bootloader)
		f.write("\t./template.bit\n".replace("template",prj_name))
		f.write(ps_elf)
	else :
		if os.path.exists("./user/BOOT/fsbl.elf") :
			bootloader = "\t[bootloader]./user/BOOT/fsbl.elf\n"
		else :
			bootloader = "\t[bootloader]%s/fsbl.elf\n" % (output_path.replace("\\", "/"))
		ps_elf = "\t./user/BOOT/%s\n" % Find_elf("./user/BOOT",type)
		f.write(bootloader)
		f.write("\t./template.bit\n".replace("template",prj_name))
		f.write(ps_elf)

	f.write("}")
	f.close()

	cmd = "bootgen -arch zynq -image $xilinx_path/BOOT/output.bif -o ./BOOT.bin -w on"
	os.system(cmd)


if __name__ == "__main__":
    make_boot_file(sys.argv[1],sys.argv[2])