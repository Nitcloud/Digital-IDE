# -*- coding: utf-8 -*-
# Copyright © 2017 Kevin Thibedeau
# Distributed under the terms of the MIT license
from __future__ import print_function

import re, os, io, ast, pprint, collections

'''Verilog documentation parser'''

verilog_tokens = {
  'root': [
    (r'\bmodule\s+(\w+)\s*', 'module', 'module'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'//#+(.*)\n', 'metacomment'),
    (r'//.*\n', None),
  ],
  'module': [
    (r'parameter\s*(signed|integer|realtime|real|time)?\s*(\[[^]]+\])?', 'parameter_start', 'parameters'),
    (r'(input|inout|output)\s*(reg|supply0|supply1|tri|triand|trior|tri0|tri1|wire|wand|wor)?\s*(signed)?\s*(\[[^]]+\])?', 'module_port_start', 'module_port'),
    (r'endmodule', 'end_module', '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'//#\s*{{(.*)}}\n', 'section_meta'),
    (r'//.*\n', None),
  ],
  'parameters': [
    (r'\s*parameter\s*(signed|integer|realtime|real|time)?\s*(\[[^]]+\])?', 'parameter_start'),
    (r'\s*(\w+)[^),;]*', 'param_item'),
    (r',', None),
    (r'[);]', None, '#pop'),
  ],
  'module_port': [
    (r'\s*(input|inout|output)\s*(reg|supply0|supply1|tri|triand|trior|tri0|tri1|wire|wand|wor)?\s*(signed)?\s*(\[[^]]+\])?', 'module_port_start'),
    (r'\s*(\w+)\s*,?', 'port_param'),
    (r'[);]', None, '#pop'),
    (r'//#\s*{{(.*)}}\n', 'section_meta'),
    (r'//.*\n', None),
  ],

  'block_comment': [
    (r'\*/', 'end_comment', '#pop'),
  ],
}


