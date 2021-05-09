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

const ts_verilog_parser = require('./ts_verilog_parser');
const ts_vhdl_parser = require('./ts_vhdl_parser');

class ParserFactory {
  constructor() { }

  async getParser(lang, comment_symbol) {
    if (lang === 'vhdl') {
      return await this.getVhdlParser(comment_symbol);
    } else if (lang === 'verilog') {
      return await this.getVerilogParser(comment_symbol);
    }
  }

  async getVhdlParser(comment_symbol) {
    let parser = new ts_vhdl_parser.Parser(comment_symbol);
    await parser.init();
    return parser;
  }

  async getVerilogParser(comment_symbol) {
    let parser = new ts_verilog_parser(comment_symbol);
    await parser.init();
    return parser;
  }
}

module.exports = {
  ParserFactory: ParserFactory
};
