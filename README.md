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
1：对vivado的开发支持
2：语法自动校测
使用教程
依赖：vivado vscode python3
要求：vivado的bin文件和sdk的bin文件均要加入环境变量，输入xsct 和 vivado -version均能执行即为成功

开始：
步骤一：将已有的文件代码放入新建的文件夹中用vscode打开
步骤二：shfit+z打开任务，此时会自动生成文件结构，在此有以下注意点，testbench.v是自带的，同时也会自动定义为仿真的顶层，除此之外会自动生成config.txt文件，请不要删除，里面含配置内容，（当然刚开始啥都没加，删了还是会自动生成，唯一的就是定义Soc为有的时候会生成新的文件结构），之后会自动查找当前文件夹下是否有工程，有的话会自动打开，没有的话会自动进入新建模式，选择或者新添器件，之后会新建工程
步骤三：将之前的文件加在相应的文件夹下，约束文件在data下，代码在src下，TOP.v在user下(注意，TOP.v是一定要的，而且模块名也一定要TOP，因为之后Updata选项会强制将TOP作为顶层)，到此新建就结束了，之后要添加文件放入对应的文件夹下再up就行了
