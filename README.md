<!--
 * #Author       : sterben(Duan)
 * #LastAuthor   : sterben(Duan)
 * #Date         : 2020-02-15 12:14:01
 * #lastTime     : 2020-02-15 22:24:38
 * #FilePath     : \README.md
 * #Description  : 
 -->

# fpga_support_plug

在vscode上的fpga开发插件

有问题的话请在[issues](https://github.com/Bestduan/fpga_support_plug/issues)上发表。
开发不易，喜欢的话请给个[star](https://github.com/Bestduan/fpga_support_plug)吧

-----

* 包含了对fpga开发过程中所需要语言的支持(如：**vhdl**，**Verilog**，**systemvVerilog**，**TCL**，**xdc**，**sdc**)。

* 支持自动生成testbench(并且**以文件形式保存**)。

* 支持在vivado上快速开发，**一键新建工程**，**一键综合**，甚至**一键下载**。

* 包含了**cortexM3**的xilinx IP，方便Soc的快速开发。

## START GIF

* 启动界面
![START GIF](https://ftp.bmp.ovh/imgs/2020/02/85216ff13beedcc6.gif)

## ERROR GIF

* 综合布局布线时出错自动弹出
![ERROR GIF](https://ftp.bmp.ovh/imgs/2020/02/c31b45ac7ee3edb0.gif)

-----

## Requirements

It needs **python3** **vivado** environment.
需要添加的变量如下(**添加一定要添加绝对路径，我写相对路径的形式只是告知需要添加哪些**)

* `./Vivado/2018.3/bin`
* `./SDK/2018.3/bin`
* `./Microsoft VS Code/bin`

最后要求安装python，并且请在安装过程中请选择自动添加到环境变量。需要自动编写testbench的还需安装chardet包，安装方式**pip install chardet**。

检测配置成功的方式：在shell中输入**xsct**、**vivado -version**、**python**、**code** 均能执行即为成功

-----

## Start With A New Project

* 步骤一：将已有的文件代码放入新建的文件夹中用vscode打开，在这里新建文件夹所在的路径不要有中文。因为vivado无法打开含有中文路径的文件夹。

* 步骤二：启动方式如下：
* `使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 **startfpga** 来启动`
* `使用快捷键 shfit+z 打开启动命令`
* `随意打开一个文件右键选择 **startfpga** 来启动`

启动后会自动生成文件结构。

在此有以下注意点：

1、**testbench.v** 和 **TOP.v** 是自带的，用于顶层例化和仿真，因此这两个文件会被强制自动定义为仿真和综合的顶层

2、如果文件夹下没有**Makefile**就会自动生成**Makefile**文件，请不要删除，里面含配置内容，之后的文件更新和综合布线都会用到。（当然刚开始啥都没加，就是说DSP库没有加进去，但在0.1.2的版本中加入了cortexM3的xilinx的IP核，可以使用。）另外**Makefile**删了还是会自动生成。最后如果文件夹下本来有**Makefile**插件就会根据该存在的**Makefile**文件来配置工程。由于刚刚设计插件很多功能没有加上去，所以**Makefile**文件需要配置的很少，基本只有在0.1.2版本的Soc一项。

注：在设置Soc为非none时，文件结构会被更改，**在文件结构更改的时候如果从有soc结构改回none，文件夹Software会被强制删除，如有重要文件请妥善保存！！！！！**。

3、插件在启动后会自动查找当前**prj**文件夹下是否有工程，有的话会自动打开，没有的话会自动进入新建模式，按照提示可以选择或者增删器件，之后会根据**Makefile**新建工程，因此原本没有**Makefile**文件的话请在选择器件之前将自动生成的Makefile配置好。

* 步骤三：将已经有的设计文件放在**相应的文件夹**下，**约束文件在./user/data**下，**代码在./user/src**下，**TOP.v在./user**下(新建的工程时已经添加进去了，可以直接覆盖或者粘贴进去)。在Soc的设计下硬件设计全部移到./user/Hardware文件夹下，转换时是自动移植过去的，后续添加的时候注意一下就ok了。之后再命令行中选择 **1) Update** 进行Update，到此新建就结束了，之后要添加文件放入对应的文件夹下再选择Update就行了。

当然这一步也可以在选择器件之前就完成，因为新建之后会自动添加一次设计文件。

注：TOP.v是一定要的，而且模块名也一定要TOP，因为之后Update选项会强制将TOP作为顶层。

-----

## 功能介绍

* 1、testbench/instance功能，右键菜单栏里选择testbench，即可将本文件写出tb文件并且写入默认的testbench.v文件中。右键菜单栏里选择instance，即可将本文件例化并且在终端中显示(本来想直接复制到剪贴板中，但是tkinter库好像没效果，希望实现成功的大佬能教一下我(T ^ T)。)

* 2、Update功能，更新xilinx工程下所包含的文件，因为包含的形式是全包含，所以在./user/src和./user/sim下都会包含进去，所以你在src，data，sim下的文件就是你的工程已经包含的文件。更新机制是先全删除再全包含，所以你在文件夹里增删文件，选择**1) Update**后，工程里也会一起更新。

* 3、Build功能，完成综合，布局布线，你可以在Makefile下的**Showlog**里选择实时显示综合布线的日志。当出错的时候会自动跳出错误日志，在设置时如果出现**[CRITICAL WARNING]**时也会跳出，如果正常生成bit和bin文件啧可以忽略。

注：bin文件的生成是附带的，和bit一起在工程根目录下，当器件为zynq时生成的bin是可以直接固化的，因为我自制了fsbl.elf和ps_test.elf用于生成可固化的bin，我的fsbl是按照microphase的板子来设计的，他的SD0的IO是MIO40~MIO45，QSPI是MIO1~MIO6，如果相同估计就可以直接用了，如果不相同就需要你自己生成fsbl.elf和ps_test.elf，放到./user/BOOT下，注意名称要一直，插件会自动生成output.bif从而生成对应的可固化的bin文件。

* 4、Program功能，一键下载，只是下载，固化功能后续补上，不过有zynq的bin文件直接下载到SD卡上插入即可固化。

* 5、GUI功能，如果需要IP设计，sim时序仿真或者bd设计选择**5) GUI**,之后就会自动打开图形界面。

注：打开GUI后，打开对应工程的vscode，以及对应的startfpga运行终端不能关闭，关闭后GUI会自动关闭

-----

## Configuration Settings

Use the following settings to configure the extension to your needs

* `verilog.linting.linter` (Default: `none`)

Choose the linter for you. Possible values are

* `iverilog`
* `xvlog`
* `modelsim`
* `verilator`
* `none`

note：由于之前已经添加vivado的路径到环境变量所以建议这里选择xvlog。

-----

0.0.2 新增testbench/instance功能。

0.1.2 新增Soc的cortexM3的xilinx IP,并且给出示例m3_for_xilinx.bd，修改文件结构转换问题。

0.1.4 修改0.1.3存在的BUG，0.1.3版本无法新建工程设计失误，请见谅，本插件对IP开发还不完善，因此在本版本中删除bd设计，之后如果需要bd或者IP设计请直接双击*.xpr工程文件打开进行设计

## Thanks

* [VHDL](https://github.com/puorc/awesome-vhdl)
* [Verilog_Testbench](https://github.com/truecrab/VSCode_Extension_Verilog)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL/SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
