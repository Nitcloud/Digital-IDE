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

包含了对fpga开发过程中所需要语言的支持

有如下：vhdl，Verilog，systemvVerilog，TCL，xdc，sdc

截止于2020/2/16已完成如下

* 1：对vivado的开发支持

* 2：语法自动校测

## Requirements

It need **python3** **vivado** environment.
要求：vivado的bin文件和sdk的bin文件均要加入环境变量，输入xsct 和 vivado -version均能执行即为成功

## Start With A New Project

* 步骤一：将已有的文件代码放入新建的文件夹中用vscode打开

* 步骤二：使用快捷键shfit+z打开启动命令，此时会自动生成文件结构，在此有以下注意点，testbench.v和TOP.v是自带的，同时也会强制自动定义为仿真和综合的顶层，除此之外会自动生成Makefile文件，请不要删除，里面含配置内容，（当然刚开始啥都没加，就是说DSP和Soc的库没有加进去，设置了也没用，除了在设置为Soc时文件结构会更改，删了还是会自动生成），之后会自动查找当前文件夹下是否有工程，有的话会自动打开，没有的话会自动进入新建模式，按照提示可以选择或者增删器件，之后会新建工程

* 步骤三：将以有的文件放在在相应的文件夹下，约束文件在data下，代码在src下，TOP.v在user下(新建的工程时已经添加进去了，可以直接覆盖或者粘贴进去)(注意，TOP.v是一定要的，而且模块名也一定要TOP，因为之后Update选项会强制将TOP作为顶层)，之后再命令行中选择1）进行Update，到此新建就结束了，之后要添加文件放入对应的文件夹下再选择Update就行了

-----

## START GIF

![START GIF](https://ftp.bmp.ovh/imgs/2020/02/85216ff13beedcc6.gif)

## ERROR GIF

* 综合布局布线时出错自动弹出

![ERROR GIF](https://ftp.bmp.ovh/imgs/2020/02/c31b45ac7ee3edb0.gif)

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
0.0.2 新增testbench/instance功能，右键菜单栏里选择testbench，即可将本文件写出tb文件并且写入默认的testbench.v文件中。右键菜单栏里选择instance，即可将本文件例化并且在终端中显示(本来想直接复制到剪贴板中，但是tkinter库好像没效果，实现成功大佬的希望教一下我(T ^ T)。)

注：0.0.2版本的功能需要依赖chardet，安装方式**pip install chardet**

## Thanks

* [VHDL](https://github.com/puorc/awesome-vhdl)
* [Verilog_Testbench](https://github.com/truecrab/VSCode_Extension_Verilog)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL/SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
