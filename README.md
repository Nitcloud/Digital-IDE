
# FPGA Develop Support

FPGA development plugin for VS Code

If you have any questions, please post them under [issues](https://github.com/Bestduan/fpga_support_plug/issues).
Development is not easy, please [star](https://github.com/Bestduan/fpga_support_plug) if you like it.

[中文教程](https://bestduan.github.io/2020/03/03/FPGA-Develop-Support%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/)

`Note`:I'm really sorry that I will stop updating this Extension for half a year, because I need to prepare for the Unified National Graduate Entrance Examination. In the meantime, if there is a simple bug, I'll fix it quickly, but I won't consider any new features for now.

The plug-in for personal development is only interested in at the beginning, only to open out a force, but with the deepening of the late development encountered bottlenecks, and more and more unable to solve the problem, at the same time the exam of postgraduate in oneself still faces again, half a year may not be able to continue to further behind, because too many plug-in content system, tutorial cannot continue to supplement, the apology, You are free to use it. Finally, if you like this plugin and like digital development, please connact with me.

- Email: sterben.661214@gmail.com.

-----

* Contains support for languages ​​required during FPGA development 
- **VHDL**
- **Verilog**
- **SystemVerilog**
* others
- **TCL**, **XDC**, **SDC**
- **ld**
* Supports automatic testbench generation (and **save as file**).
* Supports rapid development with Vivado, `one-key create new project`, `one-key synthesis`, `one-key simulation` and `one-key download`.

## START GIF

* Start interface
![START GIF.gif](https://i.loli.net/2021/04/18/jVU4kwGf83zWFY1.gif)

-----

## Requirements

1. If you need to bring your own serial debugging tool, install **python3** and add it to the system environment variable

2. If you need compatibility with Vivado features (including syntax checking, engineering, feature emulation, etc.) please add the following variables
   
* `./Vivado/2018.3/bin`
* `./Vitis/2019.2/bin` 或 `./SDK/2018.3/bin`

Ways to detect successful configuration: enter 
- **xsct**
- **vivado -version**
- **python**
in the shell, and check that all can be executed successfully.

[Note] : Currently support Vivado development, later will be compatible with other manufacturers development environment

-----

## Language highlight

![Language highlight.png](https://i.loli.net/2021/03/19/3qzOwZkIMay5rvD.png)

Highlighting of the following languages is now supported

- Verilog
- SystemVerilog
- VHDL
- TCL(include xdc、sdc、fdc)

## Grammar diagnosis

![Grammar diagnosis.png](https://i.loli.net/2021/03/19/bSQFuNgZzaTknwD.png)

Syntax diagnostics use an external compiler, so please configure the appropriate environment before configuring the diagnostic Settings in the setting.

The diagnostic tools currently supported have the relevant environment required and the setting instructions for HDL.Linting.Linter in the setting

1. xilinx    xvlog--check Verilog and systemVerilog  xvhdl--check vhdl  xmixed--check HDL.
2. modelsim  vlog--check  Verilog and systemVerilog
3. iverilog  check Verilog and systemVerilog
4. verilator check Verilog and systemVerilog
   
## File mark

![File mark.png](https://i.loli.net/2021/03/19/42KuR8l5brX1Hz7.png)

## Hover tip

![Hover tip.png](https://i.loli.net/2021/03/19/PXdTfWU7MkLYcSF.png)

[Note] : Hover prompts use the built-in simple Verilog parser, which currently only supports Verilog and SystemVerilog

## Automatic completion

![Automatic completion.png](https://i.loli.net/2021/03/19/gMWw3bBpycFDjmP.png)

## Engineering structure

![Engineering structure.png](https://i.loli.net/2021/03/20/IJOAf4zqHLS6Zpr.png)

## Define

![Define.gif](https://i.loli.net/2021/04/18/dgNytkS5r6Gqap1.gif)


## Thanks

* [VHDL](https://github.com/puorc/awesome-vhdl)
* [TerosHDL](https://github.com/TerosTechnology/vscode-terosHDL)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL/SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
* [SystemVerilog - Language Support](https://github.com/eirikpre/VSCode-SystemVerilog)