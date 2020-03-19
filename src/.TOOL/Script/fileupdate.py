
import os
import glob 
import shutil
import linecache

def mkdir(path):
	folder = os.path.exists(path)
	if not folder:                  
		os.makedirs(path)    

def deldir(path):
	folder = os.path.exists(path)
	if folder:                  
		shutil.rmtree(path.replace("\\", "/"))    

def movedir(sourse_path,target_path,gen_path):
	folder = os.path.exists(os.path.join(sourse_path,gen_path).replace("\\", "/"))
	if folder :                  
		deldir(os.path.join(target_path,gen_path).replace("\\", "/"))
		shutil.move(os.path.join(sourse_path,gen_path).replace("\\", "/"),target_path)
	else :
		if gen_path != "TOP.v" :
			mkdir(os.path.join(target_path,gen_path).replace("\\", "/"))

def tb_file(path):
	folder = os.path.exists(path)
	if not folder:                  
		tb_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),".TOOL/Xilinx/Data/testbench.v")
		shutil.copy(tb_file_path,path)  

def top_file(path):
	folder = os.path.exists(path)
	if not folder:                  
		tb_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),".TOOL/Xilinx/Data/TOP.v")
		shutil.copy(tb_file_path,path)  

def file_update(path) :
	fpga_include = linecache.getline(path,7)
	if fpga_include.replace('\n', '') == "none" :
		folder = os.path.exists("./user/Hardware")
		if folder:                  
			print("changed")
		else :
			print("unchanged")
		movedir("./user/Hardware","./user","src")
		movedir("./user/Hardware","./user","data")
		movedir("./user/Hardware","./user","sim")
		movedir("./user/Hardware","./user","TOP.v")
		deldir("./user/Hardware")
		deldir("./user/Software")
		tb_file("./user/sim/testbench.v")
		top_file("./user/TOP.v")
	else :
		folder = os.path.exists("./user/Hardware")
		if folder:                  
			print("unchanged")
		else :
			print("changed")
		mkdir("./user/Hardware")
		movedir("./user","./user/Hardware","TOP.v")
		movedir("./user","./user/Hardware","src")
		movedir("./user","./user/Hardware","data")
		movedir("./user","./user/Hardware","sim")
		mkdir("./user/Software/data")
		mkdir("./user/Software/src")
		tb_file("./user/Hardware/sim/testbench.v")
		top_file("./user/Hardware/TOP.v")


if __name__ == "__main__":
    file_update("./Makefile")