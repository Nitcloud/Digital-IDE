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

def Find_elf(path):
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
		print("There are multiple elf files in the BOOT folder")
		print("Please select the elf file you want to solidify")
		for elf_file in elf_list:
			elf_num = elf_num + 1
			print(elf_num,elf_file)
		while 1:
			Index = int(input("Index:"))
			if ((Index >= 1) & (Index <= elf_num)) :
				print(elf_list[Index-1])
				return elf_list[Index-1]
			else:
				print("please input right choice")
	else:
		for elf_file in elf_list:
			elf_num = elf_num + 1
		return elf_list[0]

def make_boot():
	folder = os.path.exists("./user/BOOT")
	output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),"BOOT")  
              
	f = open(os.path.join(output_path,"output.bif"), 'w')
	f.write("//arch = zynq; split = false; format = BIN\n")
	f.write("the_ROM_image:\n")
	f.write("{\n")

	if not folder:
		bootloader = "\t[bootloader]%s/fsbl.elf\n" % (output_path.replace("\\", "/"))
		ps_elf = "\t%s/%s\n" % (output_path.replace("\\", "/"),Find_elf(output_path.replace("\\", "/")))
		f.write(bootloader)
		f.write("\t./template.bit\n")
		f.write(ps_elf)
	else :
		bootloader = "\t[bootloader]./user/BOOT/fsbl.elf\n"
		ps_elf = "\t./user/BOOT/%s\n" % Find_elf("./user/BOOT")
		f.write(bootloader)
		f.write("\t./template.bit\n")
		f.write(ps_elf)

	f.write("}")
	f.close()

if __name__ == "__main__":
    make_boot()