<!--
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 12:14:01
 * #lastTime     : 2020-02-15 22:24:38
 * #FilePath     : \README.md
 * #Description  : 
 -->

# FPGA Develop Support

FPGA development plugin for VS Code

If you have any questions, please post them under [issues](https://github.com/Bestduan/fpga_support_plug/issues).
Development is not easy, please [star](https://github.com/Bestduan/fpga_support_plug) if you like it.

[中文教程](https://bestduan.github.io/2020/03/03/FPGA-Develop-Support%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/)

-----

* Contains support for languages ​​required during FPGA development (e.g.:**VHDL**, **Verilog**, **SystemvVerilog**, **TCL**, **XDC**, **SDC**).
* Supports automatic testbench generation (and **save as file**).
* Supports rapid development with Vivado, `one-key new project`, `one-key synthesis`, and `one-key download`.
* The Xilinx IP of **CortexM3** is included to facilitate the rapid development of SoCs.


## START GIF

* Start interface
![START GIF](https://ftp.bmp.ovh/imgs/2020/02/85216ff13beedcc6.gif)

## ERROR GIF

* Error pops up automatically when integrated layout
![ERROR GIF](https://ftp.bmp.ovh/imgs/2020/02/c31b45ac7ee3edb0.gif)

-----

## Requirements

It needs **python3** and **Vivado** installed and available on the system `PATH`.  The `PATH` variables that need to be added are as follows:\
(**NOTE:** To add, you must add the absolute path. I wrote the relative path form to tell which ones to add)

* `./Vivado/2018.3/bin`
* `./SDK/2018.3/bin`
* `./Microsoft VS Code/bin`

Finally, Python is required, so when installing it please choose to automatically add to the environment variables during the installation process, and install the pip tool. If you need to automatically write testbench and instance functions, you need to install the `chardet` package.

Installation method: `pip install chardet`,`pip install pyperclip`.

Ways to detect successful configuration: enter `xsct`, `vivado -version`, `python`, `code` in the shell, and check that all can be executed successfully.

-----

## Start With A New Project

1. Put the existing file code in the newly created folder and open it with VS Code.\
   **NOTE:** The path where the newly created folder is located should not have non-ASCII characters (e.g. Chinese characters) because Vivado cannot open the folder containing the those characters.
2. The startup method is as follows:
    * Use the shortcut key `ctrl`+`shift`+`p` / `F1` to open the command box, and enter `StartFPGA` to start
    * Use the shortcut key `alt`+`z` to open the startup command
    * Randomly open a file, right-click and select `StartFPGA` to start

    After startup, the file structure is automatically generated.

    Here are the following points to note:

      * `testbench.v` and `TOP.v` are built-in for top-level instantiation and simulation, so these two files will be **forced** to be automatically defined as the top level for simulation and synthesis
      * If there is no `Makefile` in the folder, the `Makefile` file will be automatically generated. Please do not delete it. The configuration content is included. Later file updates and integrated wiring will be used. (Of course, nothing was added at the beginning, which means that the DSP library was not added, but the CortexM3 Xilinx IP core was added in the 0.1.2 version, which can be used.)\
        If the `Makefile` is deleted, it will be automatically generated.\
        If there is a `Makefile` plugin in the folder, the project will be configured according to the existing `Makefile` file. Because many functions of the plug-in have not been added, the `Makefile` file needs to be configured very little, basically only in the SoC version 0.1.2.

        **Note:** When the SoC is set to non-none, the file structure will be changed. **If the file structure is changed from the SoC structure back to none, the folder Software will be forcibly deleted. If you have important files, please save them properly!!!!!**.

      * After startup, the plug-in will automatically find whether there is a project under the current `prj` folder. If there is a project, it will automatically open. If not, it will automatically enter the new mode. Follow the prompts to select or add or delete devices. Makefile New project, so if there is no `Makefile` file, please configure the automatically generated Makefile before selecting the device.

3. Place the existing design files in the **corresponding folders**:
    * Constraint files under `./user/data`,
    * Code under `./user/src`,
    * `TOP.v` is under `./user` (new project has been added, you can directly overwrite or paste it).
    * Under SoC's design, the hardware design is moved to the `./user/Hardware` folder. The conversion is automatically transplanted in the past, and it will be ok when you add it later. Then select `1) Update` in the command line to update, and the new creation is over. After that, you need to add files to the corresponding folder and select `Update`.

    Of course, this step can also be completed before selecting the device, because the design file will be added once after the new creation.

    **Note:** `TOP.v` is a must, and the module name must also be `TOP`, because then the Update option will force TOP as the top layer.

-----

## Features

* **testbench / instance function:**\
  Select **testbench** in the right-click menu bar, you can write this file out of tb file and write it into the default `testbench.v` file.\
  Select **instance** in the right-click menu bar to instantiate this file and display it in the terminal

* **Update function:**\
  Update the files included under the Xilinx project, because the included form is all included, so it will be included under `./user/src` and `./user/sim`, so you are under `src`, `data`, `sim` Is the file that your project already contains. The update mechanism is to delete all files first and then include them all, so if you add or delete files in the folder, select **1) Update** and the project will be updated together.

* **Build function, complete synthesis, layout and wiring:**\
  You can choose to display the log of integrated wiring in real time in **Showlog** under **Makefile**. When an error occurs, the error log will automatically pop up. If **`[CRITICAL WARNING]`** appears during setup, it will also pop up. If the bit and bin files are generated normally, it can be ignored.

  **Note:** The generation of the bin file is incidental. In the root directory of the project together with the bit, the bin generated when the device is Zynq can be directly used, because I have made `fsbl.elf` and `ps_test.elf` for executable outputs. Bin, my fsbl is designed according to the microphase board, his **`SD0 IO`** is `MIO40` to `MIO45`, **`QSPI`** is `MIO1` to `MIO6`, if the same estimate can be used directly, if not the same, you need to generate `fsbl.elf` And `*.elf`, put it under `./user/BOOT`, pay attention to the name, the plug-in will automatically generate `output.bif` to generate the corresponding executable bin file.

* **Program function, one-click download:**\
  Just download, and the flashing function will be added later, but the bin file of Zynq is directly downloaded to the SD card and inserted to solidify.

* **GUI function:**\
  If you need IP design, sim timing simulation, or bd design selection **6) GUI**, then the graphical interface will automatically open.

  You can input **`updta` / `sim` / `build` / `program`** to **TCL Console** if you want to use the one-key feature in the GUI 

  **Note:** After opening the GUI, open the corresponding project's vscode, and the corresponding `startfpga` running terminal cannot be closed, and the GUI will automatically close after closing

* **Added support for IP and bd design:** (Version 0.1.6+)\
  The specific design is to open the GUI for design. The key point is that after closing the project, the plug-in will automatically move the IP and bd design content under `prj` to the `user` for easy porting. In addition, if you need to migrate IP and bd designs from other projects, simply copy their design contents to the corresponding IP and bd folders under user and select **1) Update**.

-----

## Configuration Settings

Use the following settings to configure the extension to your needs

* `HDL.linting.linter` (Default: `xvlog`)

  Choose the linter for you. Possible values ​​are:

  * `iverilog`
  * `xvlog`
  * `modelsim`
  * `verilator`
  * `none`

  *Note:* Since the path of Vivado has been added to the environment variable before, it is recommended to select `xvlog` here.

-----

## Thanks

* [VHDL](https://github.com/puorc/awesome-vhdl)
* [Verilog_Testbench](https://github.com/truecrab/VSCode_Extension_Verilog)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL / SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
* [SystemVerilog - Language Support](https://github.com/eirikpre/VSCode-SystemVerilog)