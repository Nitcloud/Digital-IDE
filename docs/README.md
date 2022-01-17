#! https://zhuanlan.zhihu.com/p/365805011
# Digital IDE 开发手册-version 0.1.20

## 前言

如有问题的话欢迎在[issues](https://github.com/Bestduan/Digital-IDE/issues)上发表。
另外喜欢的话请给个[star](https://github.com/Bestduan/Digital-IDE)吧。

- 邮箱： sterben.661214@gmail.com  。

## 关于反馈

首先感谢您的使用与反馈，首先如果您有关于此插件更好的想法在知乎和github下均可发表，但如果是使用中出现的问题请移步至[github](https://github.com/Bestduan/Digital-IDE/issues)发表，请勿在知乎下发表，感谢您的配合。

此外在发表issue的时候，请详细说明您所遇到的问题，重点包含以下部分
- 运行环境
- 使用版本
- 报错信息 (来源：vscode本身以及Toggle Developer Tool)
- 具体问题，以及出现的原因
- 如果是特殊情况请粘贴源码 (为了更好的能复现问题)
- 请尽量截图展示

## TODO LIST

关于后期开发主要是前端辅助设计，以及陆续兼容三方设计平台，同时搭建属于自己的全套开源工具链，最终从辅助型向设计型转变。

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
    - [x] 语言翻译
    - [x] 状态预览
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
  - [ ] SymbiFlow开发辅助
- [ ] soc开发辅助
  - [x] ZYNQ开发辅助
  - [ ] RISC开发辅助
  - [ ] Cortex-M开发辅助

## 关于未来

前端辅助设计特性到目前为止应该就只剩下代码转文档和注释的自动提示，代码转文档估计会套用terosHDL插件的，因为实在是改不动，设计的很不错，改动也是小改，后期主要目标就是hardware和software的联合开发，一方面应对soc的趋势，另一方面基于eclipse的xilinx软件开发平台实在是太卡了。此外还有HDL开源库的搭建，总之内容还是挺多的，而且个人开发也算是到达极限了，毕竟要学的东西太多了，接到的反馈和帮助也不足，所以后期的更新可能会有点慢，希望见谅。

# START-GIF

* Start interface
![START GIF.gif](https://i.loli.net/2021/04/18/jVU4kwGf83zWFY1.gif)

- 使用 *TOOL:generate property file* 可以生成初始 `property.json` 文件。
- 使用 *TOOL:Overwrite the InitPropertyParam* 可以自定义初始 `property.json` 文件。

保存 `property.json` 文件后都会更新一次文件结构，这种文件结构在说明文档中统一定义为标准文件结构。
如果不使用标准文件结构则默认全局解析，这将可能会导致较大的CPU占用。

标准文件结构如下：
```
.vscode
  └── property.json   -- 工程配置文件 用户自定义 (或者存放于工作区的根目录也可)
prj                   -- 用于存放工程文件
  ├── intel           -- 用于存放xilinx的工程文件
  ├── simulation      -- 用于存放第三方仿真工具运行时的中间文件
  └── xilinx          -- 用于存放xilinx的工程文件
user                  -- 用于存放用户设计的源文件 用户自定义
  ├── ip              -- 用于存放工程ip代码 (厂商工具管理，但由扩展搬移至src同级目录)
  ├── bd              -- 用于存放工程block designer源码 (厂商工具管理，但由扩展搬移至src同级目录)
  ├── data            -- 主要存放数据文件，以及约束文件
  ├── sim             -- 用于存放用户仿真代码
  └── src             -- 用于存放用户的设计源码   
       └─ lib         -- 用于存放用户的硬件库源码   
```

当 `property.json` 文件中 SOC_MODE.soc 设置不为 "none" 后保存配置文件，文件结构会自动更改为混合设计结构主要是user文件夹会改变，变为如下结构：

```
user               -- 用于存放用户设计的源文件 用户自定义
  Hardware         -- 主要存放硬件逻辑设计
     ├── ip        -- 用于存放工程ip代码 (厂商工具管理，但由扩展搬移至src同级目录)
     ├── bd        -- 用于存放工程block designer源码 (厂商工具管理，但由扩展搬移至src同级目录) 
     ├── data      -- 主要存放数据文件，以及约束文件
     ├── sim       -- 用于存放用户仿真代码
     └── src       -- 用于存放用户的设计源码  
          └─ lib   -- 用于存放用户的硬件库源码   
  Software         -- 主要存放软件驱动设计
     ├── data      -- 主要存放数据文件，以及约束文件
     └── src       -- 用于存放用户的工程源码   
```

当 `property.json` 文件中 SOC_MODE.soc 重新设置为 "none" 后保存配置文件，文件结构会自动更改为原单一设计文件结构，Software下的所有文件均会被删除，请慎重。但删除前会有提示，提示默认开启。

重新自定义文件结构，property.json文件配置如下:
```json
{
    "PRJ_STRUCTURE": "customer",  // 一定要声明，不声明即使设置了以下参数也没效果
    "PRJ_Path": "${workspace}/<your project path>",          // 请勿缺省
    "HardwareSrc": "${workspace}/<your hardware src path>",  // 请勿缺省
    "HardwareSim": "${workspace}/<your hardware sim path>",  // 请勿缺省
    "HardwareData": "${workspace}/<your hardware data path>",// 请勿缺省
    "SoftwareSrc": "${workspace}/<your software src path>",
    "SoftwareData": "${workspace}/<your software data path>",
}
```
1. `${workspace}`代表当前工作区的路径，所有路径请使用斜杆`/`而非反斜杠`\\`。
2. 在自定义工程结构下lib放在 `HardwareSrc` 路径下，而ip和bd文件夹则放置在其同级目录下

【注】： 在设置中 `PRJ.file.limit.number` 也非常重要，默认为600，当该工作区下的HDL文件超出这个数时，扩展功能将不会启动，优先等其他扩展启动完成之后请手动启动。
   - 启动方式：`F1` 呼出命令栏，输入launch，选择 `launch extension` 即可启动。

# 前期配置

该扩展的大部分功能是不依赖第三方环境的本人深受环境配置之苦，后续会陆续将主流开源三方软件转成wasm打造无需配置环境的开发平台。目前已经成功将yosys嵌入扩展中故无需安装yosys的相关环境，但遗憾的是暂时并不支持yosys扩展。

1. 如果你需要 **自带串口调试工具** 请安装 **python3** 并将其添加到系统环境变量

2. 如果你需要兼容vivado相关功能（包括语法检查、工程搭建、功能仿真等）请将如下路径添加至环境变量
   
   注：(**添加一定要添加绝对路径，我写相对路径的形式只是告知需要添加哪些，同时注意版本号**)

   * `./Vivado/2019.2/bin`
   * `./Vitis/2019.2/bin` 或 `./SDK/2018.3/bin`

检测配置成功的方式：在shell中输入
- **xsct**
- **vivado -version**
- **python**
均能执行即为成功

`【注】`：目前暂时支持vivado开发，后期会兼容其他厂商的开发环境，此外需要三方仿真器的如iverilog需要将其添加到环境变量中去。

# 功能介绍

## 前端开发辅助功能

### 语言支持

提供前端代码设计所需的基本语言服务
#### 语言高亮

![语言高亮.png](https://i.loli.net/2021/03/19/3qzOwZkIMay5rvD.png)
现支持以下语言的高亮

- Verilog
- SystemVerilog
- VHDL
- TCL (包括xdc、sdc、fdc约束文件)

#### 语法诊断

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
  
    *HDL.linting.vhdl.linter* 支持的有: 
    1. vivado系列     
    2. modelsim系列   
    3. ghdl 

针对自动语法检查导致不太好的编码体验，设置了两种触发检查的模式。运行模式在设置中 *HDL.linting.mode* 可进行更改，默认为auto模式，自动触发，即在打开文件和保存文件时触发语法检查功能。还有一种为手动触发的manual模式，在所需要的检查的文件页面上右击，选择 `syntax check` 即可对当前文件进行语法检查。

#### 文件标志

![文件标志.png](https://i.loli.net/2021/03/19/42KuR8l5brX1Hz7.png)

#### 悬停提示

主要提示的内容为当前文件内定义的数据类型以及例化模块的相关信息。
![悬停提示.png](https://i.loli.net/2021/03/19/PXdTfWU7MkLYcSF.png)
`【注】`：悬停提示使用的是内置的vlog和vhdl解析器，目前暂时只支持简单的悬停提示

#### 自动补全

![自动补全.png](https://i.loli.net/2021/03/19/gMWw3bBpycFDjmP.png)
`【注】`：目前自动补全只支持在verilog和systemverilog中例化模块里进行端口参数例化时的补全

#### 定义跳转

![定义跳转.gif](https://i.loli.net/2021/04/18/dgNytkS5r6Gqap1.gif)

#### 工程结构

工程结构，以层级关系显示出HDL文件之间包含与被包含关系，单击后可打开对应的文件。

![工程结构](https://i.loli.net/2021/09/05/5RUmrpCl7sSuQ12.png)

#### 自动格式化

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

#### vhdl转Verilog翻译

目前只支持vhdl转Verilog的翻译功能具体使用办法见如下gif：

![vhdl转Verilog翻译](https://s2.loli.net/2022/01/07/prTk2VjoYIv7wZm.gif)

#### 状态机预览

![状态机预览](https://s2.loli.net/2022/01/10/4JroaIAju3wtgTR.png)

### 仿真功能

#### 生成tb并例化

步骤如下:
1. 使用快捷键`F1`启动命令框，输入 Testbench, 选择TOOL : Testbench, 或者在需要生成并例化的文件下右击选择Testbench。
2. 选择仿真文件的类型以及需要存储的位置，如果存在直接替换即可。

`【注】`：
如果想要更改初始的testbench file的内容则使用快捷键`F1`启动命令框，选择TOOL : Overwrite the template of testbench，选择要更改的仿真文件的类型，这时会打开testbench file的初始化文件在此基础上更改保存即可。此外请保留 `//Instance` 标志，该标志是用于识别需要例化的位置。

该功能不是很建议使用，直接在tb文件中使用instance指令生成更方便。

后期会考虑tb文件与例化模块间的智能连线。

#### 自动例化

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

在0.1.18版本之后优化设计支持 `include` 设计

![iverilog快速仿真](https://i.loli.net/2021/05/02/bfJ1lFGWTjXkeRq.png)

1. 自带多文件仿真，无需 *`include*
   
2. 支持xilinx仿真库
    - 在setting中的 *SIM.Xilinx.LIB.path* 设置xilinx的安装路径
    - 例：{xilinx安装路径}/Vivado/<版本号，例如18.3>/data/verilog/src

`【注】`：此功能需要iverilog和gtkwave均加入系统环境变量


#### modelsim快速仿真


#### Verilator快速仿真


### 常见功能库

#### IP_REPO

使用方式：

property.json文件中配置如下属性
```json
"IP_REPO": [
    "arm", // 包含ip CM3DbgAXI & DAPLink_to_Arty_shield
    "adi"  // 包含 adi 公司下所有器件ip，已去除所包含的绝对路径 取自 adi2019_r1
],
```

#### Extension HDL Lib

该扩展自带HDL功能库链接功能，在后端调用时，会自动加HDL库文件添加到后端工程中。

使用方式：

property.json文件中配置如下：
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
*State* 属性代表是加载到本地工作区还是作为远程进行链接。
- `virtual` 代表从远程虚拟包含，可以打开并更改，更改之后下次导入就是更改之后的代码。
- `real` 代表将远程文件导入到该工程本地，放置到 HardwareSrc 下的lib中，此时更改不会影响库中的代码。
  - 【注】：当从 real 改回 virtual 时lib文件夹会被删除，请注意。

*Common* 属性代表插件自带的常见HDL功能库，该库的代码不太成熟，仅供参考。

【注】：当输入的是文件夹时则包含该文件夹下所有的文件。此外不建议直接更改该库中的代码，更改之后再在下一次插件更新之后会被重新覆盖，请慎重。目前已经经过仿真测试的lib路径如下

- Soc
- Math/Cordic.v
- Math/Sort3.v
- Math/Sqrt.v
- Malloc/RAM/Shift_RAM
- Apply/DSP/Advance/Communicate/Modulate
- Apply/DSP/Base/DDS
- Apply/Image  (需要包含 Sort3, Sqrt, Shift_RAM)

*Xilinx_lib* 属性代表插件自带的Xilinx HDL功能库，主要是xilinx专用原语的调用，仅供参考。

【注】：当输入的是文件夹时则包含该文件夹下所有的文件。此外不建议直接更改该库中的代码，更改之后再在下一次插件更新之后会被重新覆盖，请慎重。目前已经经过测试的lib路径如下

- CLK/CLK_Global.v

*Customer* 属性代表用户自定义HDL功能库。

【注】：当输入的是文件夹时则包含该文件夹下所有的文件。该属性的使用需要对*setting*下的*PRJ.customer.Lib.repo.path*进行配置用户自定义库的根目录，在配置完成之后再在*Customer* 属性下配置相对路径，要求 *`PRJ.customer.Lib.repo.path`*`/`*`Customer`* 能够组成该文件(夹)的绝对路径。

以上功能在实际使用中由于缺少自动补全使用时确实有点麻烦，但json下好像不支持自动补全暂时还不知道原因。

## 后端开发辅助功能

`【注】`：目前只支持在标准文件结构下的工程搭建。

### 启动方式

数字前端辅助功能是安装后即可使用，内置 Verilog 和 vhdl 的简单解析器，vhdl的支持后续有时间会完善。

数字后端辅助设计需要配置对应厂商的开发环境，相比于之前版本增加的功能不是很多，后期会继续补充。
现有支持vivado的辅助设计，使用方式如下：

* 步骤一：如果是新建工程则需要生成property文件，注明工程的相关配置
    `使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 **generate property file** 来自动生成`

    `【注】`：
        - 生成后进行配置，只有在保存后才会自动生成对应的文件结构。
        - 通过使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 overwrite 选择 **Overwrite the InitPropertyParam** 来改写默认的工程配置

* 步骤二：启动方式如下：
    1. `使用快捷键 ctrl+shfit+p/F1 打开命令框，输入 launch 选择 **FPGA:Launch** 来启动`
    2. `使用快捷键 Alt+z 打开启动命令`
    3. `从功能框中点击FPGA OPTIONS下的 Launch`


`【注】`：在设置Soc为非none时，文件结构会被更改，**在文件结构更改的时候如果从有soc结构改回none，文件夹Software会被强制删除，如有重要文件请妥善保存！！！！！**。

### 通用功能使用说明

1. Launch 功能，开启后端功能以 *property.json* 文件中配置的 *TOOL_CHAIN* 属性为准。目前只支持vivado。launch之后会根据 *property.json* 文件信息生成相应的工程。如果已经有工程的会直接打开vivado的gui界面。
   1. launch之后在HDL文件中右键选择 *Set as Top* 时会将该文件在vivado中设置为设计的顶层头文件。
   2. launch之后其他功能才会有效。

2. Simulate 功能，与在HDL文件中右键显示的simulate不同，该功能使用的是 *property.json* 文件中配置的 *TOOL_CHAIN* 属性所对应的仿真功能，即vivado自带仿真，而在其他地方打开的simulate则使用的是第三方仿真工具，用于对单个文件或者少量文件进行实时快速仿真。(目前仅iverilog)
   1. 在HDL文件中右键选择 *Set as Testbench Top* 时会将该文件设置为仿真的顶层头文件。
   2. 若仿真成功则会直接打开vivado的gui界面，显示仿真数据与波形。
   3. 若仿真失败则会在output栏输出错误日志。

3. Refresh 功能，更新xilinx工程下所包含的文件，因为包含的形式是全包含
   1. 包含的内容如下：
      1. 刷新 `ip_repo_paths`
      2. `HardwareSrc` 与 `HardwareSim` 下的所有HDL文件
      3. `HardwareSrc` 同级目录下bd和ip文件夹以及 `PRJ_Path` 中的所有 bd/ip 设计文件
      4. lib远程链接的文件，即 `HardwareLIB` 下配置的文件 (当HardwareLIB.State = "virtual")
      5. `HardwareData` 下的约束文件
   2. 若单个增删某个文件只要将其在工作区下增删，扩展会自动添加到vivado中无需重新refresh

4. Build 功能，完成综合，布局布线，你可以在 property.json 下的 *enableShowlog* 里选择是否将日志在终端中输出。
   1. `enableShowlog` 为true时只有当出现 `CRITICAL WARNING` & `ERROR` 时才会弹出output栏，并只输出错误与严重警告日志。
   2. Build 功能下还细分 synth、impl、bitstream 这三个小阶段的功能。

5. Program 功能，一键下载。只是下载暂时不支持固化。

6. GUI 功能，如果需要IP设计，功能时序仿真或者bd设计时选择 *`GUI`* ,之后就会自动打开图形界面。
    
    `【注】`：
    1. 打开GUI后，打开对应工程的vscode，以及对应的 *`HardWare`* 运行终端不能人为删除，删除后整个vivado的gui界面会自动关闭，若不保存则可能会导致设计丢失。
    2. 如果直接关闭vivado的gui界面或者删除*`HardWare`* 运行终端则不会将 `PRJ_Path` 文件夹下的IP和bd设计文件移动`HardwareSrc` 的同级目录下。虽然不会产生什么影响但分散的设计不方便管理，所以建议使用功能栏 *FPGA OPTIONS* 中的 *Exit* 进行退出。
    3. 功能栏 *TOOL* 中选择 *Clean* 时也会将工程中的IP和bd设计文件进行移动到`HardwareSrc` 的同级目录下，同时将整个工程进行删除。

【注】：SDK相关功能还不完善后续准备开放，用于替代xilinx的SDK，彻底解决xilinx SDK使用卡顿问题。

### vivado开发辅助

由于目前只支持vivado的相关功能，因此对于vivado开发辅助见通用功能使用说明即可。
`【注】`：对于property.json文件中的 *`Device`* 属性目前已有的如下：

- xc7z020clg400-2
- xc7a35tftg256-1
- xc7a35tcsg324-1
- xc7z035ffg676-2
- xc7z020clg484-1

但支持的器件并不仅限于此，理论上可以支持vivado所能支持的所有器件，你可以直接将你的器件直接写在 *`Device`* 属性下，也可以将你的器件通过 *FPGA:Add devices to the database* 命令将其添加到数据库中，也可以通过 *FPGA:Remove the device from the database* 将其从数据库中删除。

### quartus开发辅助


### icestorm开发辅助


## soc开发辅助


### ZYNQ开发辅助


针对 *`Zynq`* 器件在新建工程时可以通过配置bd file来快速搭建想要的Zynq平台。具体 property.json 配置如下

```json
"SOC_MODE": {
    "soc": "ps7_cortexa9_0",
    "bd_file": "zynq_default"
}
```

### RISC开发辅助

### Cortex-M开发辅助

## 调试开发辅助

### Schematic Viewer

插件使用 `yosys 0.10` 版本的内核(开源的yosysjs为0.5版本)进行指定工程的综合(可全平台运行)，并展示综合后的网络图

![netlist](https://s2.loli.net/2022/01/07/YR2UHVpM3PK5sut.png)

该功能目前处于测试阶段，支持 `include` 以及多文件工程。

使用方式
1. 点击右上角的图标进行面板的创建
2. 或者在project structure中选择需要显示的模块，或者在文件中右击选择 `show netlist`


# 鸣谢


* [VHDL](https://github.com/puorc/awesome-vhdl)
* [yosys](http://www.clifford.at/yosys)
* [TerosHDL](https://github.com/TerosTechnology/vscode-terosHDL)
* [TCL Language Support](https://github.com/go2sh/tcl-language-support)
* [Verilog HDL/SystemVerilog](https://github.com/mshr-h/vscode-verilog-hdl-support)
* [SystemVerilog - Language Support](https://github.com/eirikpre/VSCode-SystemVerilog)