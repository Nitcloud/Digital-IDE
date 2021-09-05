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

function diagramGenerator(structure, bn) {
  const fs = require('fs');
  const window = require('svgdom');
  const SVG = require('svg.js')(window);
  const document = window.document;

  var canvas = SVG(document.documentElement);
  canvas.clear();
  var border = 'black';
  var genBox = '#bdecb6';  //'blue'
  var portBox = '#fdfd96';  //'red'
  var locx = 200;
  var locy = 0;
  var width = 100;
  var high = 100;
  var total_high = 100;
  var size = 20;
  var font = 'Helvetica';
  var offset = 10;
  var text_offset = 7;
  var text_space = 15;
  var text_space_pin = text_space / 3;
  var separator = 10;
  var name = 0;
  var kind = 1;
  var generics = [[], []];
  var inPorts = [[], []];
  var outPorts = [[], []];

  if (bn === 1) {
    border = 'black';
    genBox = 'white';
    portBox = 'white';
  }

  generics = getGenerics(structure, name, kind);
  inPorts = getPortsIn(structure, name, kind);
  outPorts = getPortsOut(structure, name, kind);
  locx = (size / 2) * maxString(generics, inPorts, [0, 0], kind) + 2 * offset;
  width = (size / 2) * (maxString(generics, inPorts, [0, 0], name) + maxString([0, 0], [0, 0], outPorts, name));
  // console.log(inPorts);
  // console.log(outPorts);
  // console.log(structure);

  let min_x = 0;
  let max_x = 0;
  let max_leght_text_x = 0;
  let max_leght_text_out_kind = 0;

  //generic square
  high = size * generics[0].length;
  total_high = high + offset / 2;
  if (generics[0].length > 0) {
    var recta = canvas.rect(width, high + offset).fill(border).move(locx, locy);
    canvas.rect(width - 4, high + offset / 2).fill(genBox).move(locx + 2, locy + 2);
    //write generics
    for (let i = 0; i < generics[0].length; i++) {
      locy = size * i + offset / 2;
      var textleft = canvas.text(generics[kind][i]).move(locx - text_space - text_space_pin, locy - text_offset).font({ family: font, size: size, anchor: 'end' });
      var textleft = canvas.text(generics[name][i]).move(locx + text_space, locy - text_offset).font({ family: font, size: size, anchor: 'start' });
      let max_local = generics[name][i].length + generics[kind][i].length;
      max_leght_text_x = Math.max(max_leght_text_x, max_local);
      max_x = max_leght_text_x;
      min_x = Math.min(min_x, textleft['node'].getAttribute('x'));
      var pins = canvas.line(locx - text_space, 0, locx, 0).move(locx - text_space, locy + size * 2 / 4).stroke({ color: 'black', width: size / 4, linecap: 'rec' });
    }
  }
  //ports square
  locy = high + offset / 2 + separator;
  high = size * Math.max(inPorts[0].length, outPorts[0].length);
  total_high = total_high + high + offset / 2;
  var recta = canvas.rect(width, high + offset).fill(border).move(locx, locy);
  canvas.rect(width - 4, high + offset / 2).fill(portBox).move(locx + 2, locy + 2);
  //write ports
  for (let i = 0; i < inPorts[0].length; i++) {
    locy = size * generics[0].length + offset + size * i + separator;
    var textleft = canvas.text(inPorts[kind][i]).move(locx - text_space - text_space_pin, locy - text_offset).font({ family: font, size: size, anchor: 'end' });
    var textleft = canvas.text(inPorts[name][i]).move(locx + text_space, locy - text_offset).font({ family: font, size: size, anchor: 'start' });
    let max_local = inPorts[kind][i].length;
    max_leght_text_x = Math.max(max_leght_text_x, max_local);
    min_x = Math.min(min_x, textleft['node'].getAttribute('x'));
    var pins = canvas.line(locx - text_space, 0, locx, 0).move(locx - text_space, locy + size * 2 / 4).stroke({ color: 'black', width: size / 4, linecap: 'rec' });
  }
  max_x = width;
  max_leght_text_out_kind = Math.max(max_leght_text_x + offset, offset);
  if (outPorts[0].length > 0) {
    max_x = 0;
    max_leght_text_out_kind = 0;
    for (let i = 0; i < outPorts[0].length; i++) {
      locy = size * generics[0].length + offset + size * i + separator;
      var textright = canvas.text(outPorts[kind][i]).move(locx + width + text_space + text_space_pin, locy - text_offset).font({ family: font, size: size, anchor: 'start' });
      var textright = canvas.text(outPorts[name][i]).move(locx + width - text_space, locy - text_offset).font({ family: font, size: size, anchor: 'end' });
      let max_local = outPorts[kind][i].length;
      max_leght_text_out_kind = Math.max(max_leght_text_out_kind, max_local);
      max_x = Math.max(max_x, textright['node'].getAttribute('x'));
      var pins = canvas.line(locx - text_space, 0, locx, 0).move(locx + width, locy + size * 2 / 4).stroke({ color: 'black', width: size / 4, linecap: 'rec' });
    }
  }

  let total_width = max_x + (size / 2) * max_leght_text_out_kind + 2 * offset;
  canvas.viewbox(0, 0, total_width, 2 * offset + total_high);

  return canvas.svg();
}

function getGenerics(structure, name, kind) {
  var str = [[], []];
  for (let x = 0; x <= structure.generics.length - 1; ++x) {
    str[name][x] = '   ' + structure.generics[x]['name'] + ' ';
    str[kind][x] = '   ' + structure.generics[x]['type'] + ' ';
  }
  return str;
}

function getPortsIn(structure, name, kind) {
  var str_in = [[], []];
  var cont_in = 0;
  for (let x = 0; x <= structure.ports.length - 1; ++x) {
    if (structure.ports[x]['direction'] === "in" || structure.ports[x]['direction'] === "input") {
      str_in[name][cont_in] = '   ' + structure.ports[x]['name'] + ' ';
      str_in[kind][cont_in] = '   ' + structure.ports[x]['type'] + ' ';
      cont_in++;
    }
  }
  return str_in;
}

function getPortsOut(structure, name, kind) {
  var str_in = [[], []];
  var cont_in = 0;
  for (let x = 0; x <= structure.ports.length - 1; ++x) {
    if (structure.ports[x]['direction'] === "out" || structure.ports[x]['direction'] === "output" || structure.ports[x]['direction'] === "inout" || structure.ports[x]['direction'] === "buffer") {
      str_in[name][cont_in] = '   ' + structure.ports[x]['name'] + ' ';
      str_in[kind][cont_in] = '   ' + structure.ports[x]['type'] + ' ';
      cont_in++;
    }
  }
  return str_in;
}

function maxString(generics, inPorts, outPorts, data) {
  var max = 2;
  for (let i = 0; i < generics[data].length; i++) {
    max = Math.max(max, generics[data][i].length);
  }
  max = max / 1.5;
  for (let i = 0; i < inPorts[data].length; i++) {
    max = Math.max(max, inPorts[data][i].length);
  }
  for (let i = 0; i < outPorts[data].length; i++) {
    max = Math.max(max, outPorts[data][i].length);
  }
  return max;
}

//*****************************************************************************/
//***************************** Exports ***************************************/
//*****************************************************************************/
module.exports = {
  diagramGenerator: diagramGenerator
}
