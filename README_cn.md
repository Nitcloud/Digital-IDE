#! https://zhuanlan.zhihu.com/p/365805011
# FPGA_Develop_Support

在vscode上的FPGA开发插件

如有问题的话欢迎在[issues](https://github.com/Bestduan/fpga_support_plug/issues)上发表。
另外喜欢的话请给个[star](https://github.com/Bestduan/fpga_support_plug)吧

## 前言

该插件为个人开发一开始只是兴趣，仅为开源出一份力，但是随着后期开发的深入遇到了瓶颈以及越来越多自己无法解决的问题，同时自己还要面临再一次的研究生考试，后面半年内可能无法持续更进，由于插件内容功能太多，教程也无法持续补充，你可以自由使用。最后，若是你喜欢这个插件，喜欢数字开发，欢迎与我一起交流。

- 邮箱： sterben.661214@gmail.com  。

## TODO LIST

- [ ] 前端开发辅助功能 
  - [x] 语言支持
    - [x] 语言高亮
    - [x] 文件标志
    - [x] 定义跳转
    - [x] 悬停提示
    - [x] 工程结构
    - [x] 语法诊断
    - [x] 自动对齐
    - [x] 自动补全
  - [ ] 仿真功能
    - [x] 自动生成tb
    - [x] 快速例化
    - [x] vivado快速仿真
    - [x] iverilog快速仿真
    - [ ] modelsim快速仿真
    - [ ] Verilator快速仿真
  - [x] 常见功能库
- [ ] 后端开发辅助功能
  - [x] vivado开发辅助
  - [ ] quartus开发辅助
  - [ ] icestorm开发辅助
- [ ] soc开发辅助
  - [x] ZYNQ开发辅助
  - [ ] RISC开发辅助
  - [ ] Cortex-M开发辅助

# START GIF

* Start interface
![START GIF.gif](https://i.loli.net/2021/04/18/jVU4kwGf83zWFY1.gif)

使用 *TOOL:generate property file* 可以生成初始 `property.json` 文件。
使用 *TOOL:Overwrite the InitPropertyParam* 可以自定义初始 `property.json` 文件。

保存 `property.json` 文件后都会更新一次文件结构，这种文件结构在说明文档中统一定义为标准文件结构。
如果不使用标准文件结构则默认全局解析，这将可能会导致较大的CPU占用。

`【注】`：目前 property.json 的自动提示失效，原因未知，如有了解的烦请给予指教。

# 开发目的
[返回目录](#目录)

本插件的开发目的首先在于为数字前端设计提供友好便捷的开发工具，在此之后，再在对FPGA的开发过程中进行去平台化，同时规范文件结构，完成完整统一友好的数字前后端设计链。紧接着兼容多家FPGA原厂后端设计，完成一条完整的数字设计链。最后，提供在FPGA上的soc设计方案，兼容soc调试工具

# 前期配置
[返回目录](#目录)

1. 如果你需要自带串口调试工具请安装 **python3** 并将其添加到系统环境变量

2. 如果你需要兼容vivado相关功能（包括语法检查、工程搭建、功能仿真等）请将如下路径添加至环境变量
   
   注：(**添加一定要添加绝对路径，我写相对路径的形式只是告知需要添加哪些，同时注意版本号**)

* `./Vivado/2019.2/bin`
* `./Vitis/2019.2/bin` 或 `./SDK/2018.3/bin`

检测配置成功的方式：在shell中输入
- **xsct**
- **vivado -version**
- **python**
均能执行即为成功

`【注】`：目前暂时支持vivado开发，后期会兼容其他厂商的开发环境

# 功能介绍
[返回目录](#目录)
## 前端开发辅助功能
[返回目录](#目录)
### 语言支持
[返回目录](#目录)
提供前端代码设计所需的基本语言服务
#### 语言高亮
[返回目录](#目录)

![语言高亮.png](https://i.loli.net/2021/03/19/3qzOwZkIMay5rvD.png)
现支持以下语言的高亮

- Verilog
- SystemVerilog
- VHDL
- TCL (包括xdc、sdc、fdc约束文件)

#### 语法诊断
[返回目录](#目录)

![语法诊断.png](https://i.loli.net/2021/03/19/bSQFuNgZzaTknwD.png)
语法诊断使用的是外部编译器，因此在setting中配置对应的诊断设置之前请配置好相应的环境。

该语法诊断可以针对不同的语言类型灵活使用不同的诊断器

在该功能中默认使用的是vivado系列，可以根据已有环境搭配不同的诊断组合，但当选择default时则认为关闭诊断

- 针对 verilog 以及 systemverilog 
  
    *HDL.linting.vlog.linter* 支持的有:
    1. vivado   
    2. modelsim
    3. iverilog     
    4. verilator
    5. verible    

- 针对 vhdl
  
    *HDL.linting.vlog.linter* 支持的有: 
    1. vivado系列     
    2. modelsim系列   
    3. ghdl 

#### 文件标志
[返回目录](#目录)

![文件标志.png](https://i.loli.net/2021/03/19/42KuR8l5brX1Hz7.png)

#### 悬停提示
[返回目录](#目录)

主要提示的内容为当前文件内定义的数据类型以及例化模块的相关信息。
![悬停提示.png](https://i.loli.net/2021/03/19/PXdTfWU7MkLYcSF.png)
`【注】`：悬停提示使用的是内置的vlog和vhdl解析器，目前暂时只支持简单的悬停提示

#### 自动补全
[返回目录](#目录)

![自动补全.png](https://i.loli.net/2021/03/19/gMWw3bBpycFDjmP.png)
`【注】`：目前自动补全只支持在verilog和systemverilog中例化模块里进行端口参数例化时的补全

#### 定义跳转
[返回目录](#目录)

![定义跳转.gif](https://i.loli.net/2021/04/18/dgNytkS5r6Gqap1.gif)

#### 工程结构
[返回目录](#目录)

工程结构，以层级关系显示出HDL文件之间包含与被包含关系，单击后可打开对应的文件。

![工程结构.png](https://i.loli.net/2021/03/20/IJOAf4zqHLS6Zpr.png)

#### 自动格式化
[返回目录](#目录)

可以对选中的字符或者全文进行文档的格式化 vscode自带快捷键打开方式：`shift + alt + f`
![自动格式化.gif](https://i.loli.net/2021/07/27/NszfSg8Zbiad36P.gif)
相关设置(setting)说明:

- verilog and systemverilog

1. *HDL.formatter.vlog.default.style*

    verilog 和 systemverilog格式化类型，支持三种类型 `kr`、`ansi`、`gun`

2. *HDL.formatter.vlog.default.args*

    其他参数输入，vlog的格式化使用的是istyle的webassembly因此要输入的参数请参考istyle

    `【注】`：由于该功能是基于istyle来实现的因此对全文格式化依旧不是很完善，建议选中always语句块来进行格式化，后期会持续修复相关问题。

- vhdl

1. *HDL.formatter.vhdl.default.align-comments*

    是否需要对齐注释

2. *HDL.formatter.vhdl.default.indentation*

    tab所对应的空格数量

### 仿真功能
[返回目录](#目录)

#### 自动生成tb文件
[返回目录](#目录)
![tb_gen.gif](https://i.loli.net/2021/07/27/TRAL6nYmH34ufdF.gif)
步骤如下:
1. 使用快捷键`F1`启动命令框，输入 generate, 选择TOOL : generate testbench file
2. 选择仿真文件的类型。

`【注】`：
1. 在标准工程结构下testbench file会被放置到user目录下的sim目录中。
2. 在非标准工程结构下，即自定义工程结构下则会被放置到user目录下的sim目录中。
3. 当时使用*Set as Testbench Top* 时该工程的仿真文件路径会被更改不再是生成的仿真文件。

如果想要更改初始的testbench file的内容则使用快捷键`F1`启动命令框，选择TOOL : Overwrite the template of testbench，选择要更改的仿真文件的类型，这时会打开testbench file的初始化文件在此基础上更改保存即可。

#### 自动例化
[返回目录](#目录)

![自动例化.gif](https://i.loli.net/2021/05/01/gCxJud91GhIWAmL.gif)

该插件支持在Verilog文件中例化Verilog和vhdl模块，同时支持在vhdl文件中例化Verilog和vhdl模块
步骤如下:
1. 将光标放置在文本需要例化处。
2. 使用快捷键`F1`启动命令框，输入instance，选择Tool.instance。
3. 输入需要例化的模块的关键字。
4. 选择需要例化的模块。

或者是使用快捷键 `Alt + I` 进行启动，再输入需要例化的模块的关键字，选择需要例化的模块。

`【注】`：在使用快捷键时其检查是否快捷键键冲突。

#### iverilog快速仿真
[返回目录](#目录)
![iverilog快速仿真](https://i.loli.net/2021/05/02/bfJ1lFGWTjXkeRq.png)

1. 自带多文件仿真，无需 *`include*
2. 支持xilinx仿真库

`【注】`：此功能需要iverilog和gtkwave均加入系统环境变量

如果需要支持xilinx仿真库需要在setting中的 *SIM.Xilinx.LIB.path* 设置xilinx的安装路径

例：{xilinx安装路径}/Vivado/<版本号，例如18.3>/data/verilog/src

#### modelsim快速仿真
[返回目录](#目录)

#### Verilator快速仿真
[返回目录](#目录)

### 常见功能库
[返回目录](#目录)

该插件自带HDL功能库链接功能，在后端调用时，会自动加HDL库文件添加到后端工程中使用方式如下

在property.json文件中配置如下属性
```json
"HardwareLIB": {
    "State": "virtual",
    "Common" : [ 
        "Math/Cordic.v",
        "Math/Cordic.v"
        // ...
    ],
    "Customer" : [ 
        "Relative path"
        // ...
    ]
},
```
*State* 属性代表是加载到本地工作区还是作为远程，
- `virtual` 代表从远程虚拟包含，可以打开并更改，更改之后下次导入就是更改之后的代码。
- `real` 代表将远程文件导入到该工程本地，默认放置到user下的lib中，此时更改不会影响库中的代码。当从real改回virtual时lib文件夹会被删除，请注意。

*Common* 属性代表插件自带的常见HDL功能库，该库的代码不太成熟，仅供参考。当输入的是文件夹时则包含该文件夹下所有的文件。此外不建议直接更改该库中的代码，更改之后再在下一次插件更新之后会被重新覆盖，请慎重。目前已经经过仿真测试的lib路径如下

- Soc
- Math/Cordic.v
- Math/Sort3.v
- Math/Sqrt.v
- Malloc/RAM/Shift_RAM
- Apply/DSP/Advance/Communicate/Modulate
- Apply/DSP/Base/DDS
- Apply/Image  (需要包含 Sort3, Sqrt, Shift_RAM)

*Xilinx_lib* 属性代表插件自带的Xilinx HDL功能库，主要是xilinx专用原语的调用，仅供参考。当输入的是文件夹时则包含该文件夹下所有的文件。此外不建议直接更改该库中的代码，更改之后再在下一次插件更新之后会被重新覆盖，请慎重。目前已经经过测试的lib路径如下

- CLK/CLK_Global.v

*Customer* 属性代表用户自定义HDL功能库。当输入的是文件夹时则包含该文件夹下所有的文件。该属性的使用需要对*setting*下的*PRJ.customer.Lib.repo.path*进行配置用户自定义库的根目录，在配置完成之后再在*Customer* 属性下配置相对路径，要求 *`PRJ.customer.Lib.repo.path`*`/`*`Customer`* 能够组成该文件(夹)的绝对路径。

## 后端开发辅助功能
[返回目录](#目录)

### 启动方式
[返回目录](#目录)

数字前端辅助功能是安装后即可使用，内置 Verilog 和 vhdl 的简单解析器，vhdl的支持后续有时间会完善。

数字后端辅助设计需要配置对应厂商的开发环境，相比于之前版本增加的功能不是很多，后期会继续补充。
现有支持vivado的辅助设计，使用方式如下：

* 步骤一：如果是新建工程则需要生成property文件，注明工程的相关配置
    `使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 **generate property file** 来自动生成`

`【注】`：生成后进行配置，只有在保存后才会自动生成对应的文件结构。通过使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 overwrite 选择 **Overwrite the InitPropertyParam** 来改写默认工程配置

* 步骤二：启动方式如下：
    1. `使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 launch 选择 **FPGA:Launch** 来启动`
    2. `使用快捷键 Alt+z 打开启动命令`
    3. `从功能框中点击FPGA OPTIONS下的 Launch`


`【注】`：在设置Soc为非none时，文件结构会被更改，**在文件结构更改的时候如果从有soc结构改回none，文件夹Software会被强制删除，如有重要文件请妥善保存！！！！！**。


### 通用功能使用说明
[返回目录](#目录)

1. Launch 功能，开启后端功能以 **property.json** 文件中配置的 *FPGA_VERSION* 属性为准。目前只支持vivado。launch之后会根据 **property.json** 文件信息生成相应的工程。如果已经有工程的会直接打开。launch之后在HDL文件中右键选择 *Set as Top* 时会将该文件设置为设计的顶层头文件。

2. Simulate 功能，与在HDL文件中右键显示的simulate不同，该功能使用的是 **property.json** 文件中配置的 *FPGA_VERSION* 属性所对应的仿真功能即使用的是vivado仿真，而在HDL文件中右键显示的simulate则使用的是iverilog仿真，用于对单个文件或者少量文件进行实时快速仿真。在HDL文件中右键选择 *Set as Testbench Top* 时会将该文件设置为仿真的顶层头文件。

3. Refresh 功能，更新xilinx工程下所包含的文件，因为包含的形式是全包含，所有在./user/src和./user/sim下都会包含进去，所以你在src，data，sim下的文件就是你的工程已经包含的文件。更新机制是先全删除再全包含，所以你在文件夹里增删文件，选择 **`Refresh`** 后，工程里也会一起更新。此外如果你已经开启`StartFPGA`的终端再向 *代码文件夹* 中添加HDL文件时，终端会自动将该文件添加到工程中去。

`【注】`：这里所说的代码文件夹指的是 **property.json** 文件中配置的 *HardwareSrc* 属性，该属性为数组类型，一旦配置即会覆盖，即使是在标准工程文件结构下，均以配置为准。如果不配置该属性且不使用标准工程文件结构则默认整个工作区均为代码文件夹，如果配置了**property.json**使用标准文件结构则默认代码文件夹为user下的 *(Hardware)/src* 和 *(Hardware)/sim* 。 

4. Build功能，完成综合，布局布线，你可以在 property.json 下的 **enableShowlog** 里选择实时显示综合布线的日志。当出错的时候会自动跳出错误日志，在设置时如果出现`[CRITICAL WARNING]`时也会跳出，如果正常生成bit和bin文件则可以忽略。

5. Program功能，一键下载，只是下载，固化功能后续补上，不过有zynq的bin文件直接下载到SD卡上插入即可固化。

6. GUI功能，如果需要IP设计，功能时序仿真或者bd设计时选择 **`GUI`** ,之后就会自动打开图形界面。
    
    `【注】`：打开GUI后，打开对应工程的vscode，以及对应的 **`StartFPGA`** 运行终端不能关闭，关闭后GUI会自动退出。如果直接关闭GUI或者vscode退出则不会对工程中的IP和bd设计文件进行移动到user文件夹下，建议使用功能栏 *FPGA OPTIONS* 中的 *Exit* 进行退出，此外在功能栏 *TOOL* 中选择 *Clean* 时也会将工程中的IP和bd设计文件进行移动到user下，同时将整个工程进行删除。

【注】：SDK相关功能还不完善后续准备开放，用于替代xilinx的SDK，彻底解决xilinx SDK使用卡顿问题。

### vivado开发辅助
[返回目录](#目录)

由于目前只支持vivado的相关功能，因此对于vivado开发辅助见通用功能使用说明即可。
`【注】`：对于property.json文件中的 *`Device`* 属性目前已有的如下：

- xc7z020clg400-2
- xc7a35tftg256-1
- xc7a35tcsg324-1
- xc7z035ffg676-2
- xc7z020clg484-1

但支持的器件并不仅限于此，理论上可以支持vivado所能支持的所有器件，你可以直接将你的器件直接写在 *`Device`* 属性下，也可以将你的器件通过 *FPGA:Add devices to the database* 命令将其添加到数据库中，也可以通过 *FPGA:Remove the device from the database* 将其从数据库中删除。

### quartus开发辅助
[返回目录](#目录)

### icestorm开发辅助
[返回目录](#目录)

## soc开发辅助
[返回目录](#目录)

### ZYNQ开发辅助
[返回目录](#目录)

针对 *`Zynq`* 器件在新建工程时可以通过配置bd file来快速搭建想要的Zynq平台。具体 property.json 配置如下

```json
"SOC_MODE": {
    "soc": "ps7_cortexa9_0",
    "bd_file": "zynq_default"
}
```

### RISC开发辅助
[返回目录](#目录)

### Cortex-M开发辅助
[返回目录](#目录)

## 调试开发辅助功能
[返回目录](#目录)

# 配置说明
[返回目录](#目录)

# 鸣谢
[返回目录](#目录)

* [VHDL](https://github.com/puorc/awesome-vhdl)
* [TerosHDL](https://github.com/TerosTechnology/vscode-terosHDL)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL/SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
* [SystemVerilog - Language Support](https://github.com/eirikpre/VSCode-SystemVerilog)