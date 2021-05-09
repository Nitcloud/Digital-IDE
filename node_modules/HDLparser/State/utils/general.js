// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

const SIMULATORS = {
  GHDL : 'ghdl',
  ICARUS : 'icarus',
  MODELSIM : 'modelsim',
  VERILATOR : 'verilator'
};

const FORMATTERS = {
  ISTYLE : 'istyle',
  VERIBLE : 'verible',
  VSG : 'vsg',
  STANDALONE : 'standalone'
};

const LINTERS = {
  GHDL : 'ghdl',
  ICARUS : 'icarus',
  MODELSIM : 'modelsim',
  VERILATOR : 'verilator',
  XVLOG : 'xvlog',
  XVHDL : 'xvhdl',
  VSG : 'vsg',
  VERIBLE : 'verible',
  SVLINT : 'svlint'
};

const VHDLSTANDARS = {
  VHDL2018 : '08'
};

const VERILOGSTANDARS = {
  VERILOG2001 : '2001',
};

const LANGUAGES = {
  VHDL : 'vhdl',
  VERILOG : 'verilog',
  SYSTEMVERILOG : 'systemverilog',
};

module.exports = {
  LANGUAGES : LANGUAGES,
  SIMULATORS : SIMULATORS,
  VERILOGSTANDARS : VERILOGSTANDARS,
  LINTERS : LINTERS,
  FORMATTERS : FORMATTERS
};
