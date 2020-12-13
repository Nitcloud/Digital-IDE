# -*- coding: utf-8 -*-
# Copyright © 2017 Kevin Thibedeau
# Distributed under the terms of the MIT license
from __future__ import print_function

import re, os, io, ast
from pprint import pprint

'''VHDL documentation parser'''

vhdl_tokens = {
  'root': [
    (r'package\s+(\w+)\s+is', 'package', 'package'),
    (r'package\s+body\s+(\w+)\s+is', 'package_body', 'package_body'),
    (r'function\s+(\w+|"[^"]+")\s*\(', 'function', 'param_list'),
    (r'procedure\s+(\w+)\s*\(', 'procedure', 'param_list'),
    (r'function\s+(\w+)', 'function', 'simple_func'),
    (r'component\s+(\w+)\s*is', 'component', 'component'),
    (r'entity\s+(\w+)\s*is', 'entity', 'entity'),
    (r'architecture\s+(\w+)\s*of', 'architecture', 'architecture'),
    (r'subtype\s+(\w+)\s+is\s+(\w+)', 'subtype'),
    (r'type\s+(\w+)\s*is', 'type', 'type_decl'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'package': [
    (r'function\s+(\w+|"[^"]+")\s*\(', 'function', 'param_list'),
    (r'procedure\s+(\w+)\s*\(', 'procedure', 'param_list'),
    (r'function\s+(\w+)', 'function', 'simple_func'),
    (r'component\s+(\w+)\s*is', 'component', 'component'),
    (r'subtype\s+(\w+)\s+is\s+(\w+)', 'subtype'),
    (r'constant\s+(\w+)\s+:\s+(\w+)', 'constant'),
    (r'type\s+(\w+)\s*is', 'type', 'type_decl'),
    (r'end\s+package', None, '#pop'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'package_body': [
    (r'end\s+package\s+body', None, '#pop'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'type_decl': [
    (r'array', 'array_type', '#pop'),
    (r'file', 'file_type', '#pop'),
    (r'access', 'access_type', '#pop'),
    (r'record', 'record_type', '#pop'),
    (r'range', 'range_type', '#pop'),
    (r'\(', 'enum_type', '#pop'),
    (r';', 'incomplete_type', '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'param_list': [
    (r'\s*((?:variable|signal|constant|file)\s+)?(\w+)\s*', 'param'),
    (r'\s*,\s*', None),
    (r'\s*:\s*', None, 'param_type'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'param_type': [
    (r'\s*((?:in|out|inout|buffer)\s+)?(\w+)\s*', 'param_type'),
    (r'\s*;\s*', None, '#pop'),
    (r"\s*:=\s*('.'|[^\s;)]+)", 'param_default'),
    (r'\)\s*(?:return\s+(\w+)\s*)?;', 'end_subprogram', '#pop:2'),
    (r'\)\s*(?:return\s+(\w+)\s*)?is', None, '#pop:2'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'simple_func': [
    (r'\s+return\s+(\w+)\s*;', 'end_subprogram', '#pop'),
    (r'\s+return\s+(\w+)\s+is', None, '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'component': [
    (r'generic\s*\(', None, 'generic_list'),
    (r'port\s*\(', None, 'port_list'),
    (r'end\s+component\s*\w*;', 'end_component', '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'entity': [
    (r'end\s+entity\s*;', 'end_entity', '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'architecture': [
    (r'end\s+architecture\s*;', 'end_arch', '#pop'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'generic_list': [
    (r'\s*(\w+)\s*', 'generic_param'),
    (r'\s*,\s*', None),
    (r'\s*:\s*', None, 'generic_param_type'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'generic_param_type': [
    (r'\s*(\w+)\s*', 'generic_param_type'),
    (r'\s*;\s*', None, '#pop'),
    (r"\s*:=\s*([\w']+)", 'generic_param_default'),
    (r'\)\s*;', 'end_generic', '#pop:2'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'port_list': [
    (r'\s*(\w+)\s*', 'port_param'),
    (r'\s*,\s*', None),
    (r'\s*:\s*', None, 'port_param_type'),
    (r'--#\s*{{(.*)}}\n', 'section_meta'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'port_param_type': [
    (r'\s*(in|out|inout|buffer)\s+(\w+)\s*\(', 'port_array_param_type', 'array_range'),
    (r'\s*(in|out|inout|buffer)\s+(\w+)\s*', 'port_param_type'),
    (r'\s*;\s*', None, '#pop'),
    (r"\s*:=\s*([\w']+)", 'port_param_default'),
    (r'\)\s*;', 'end_port', '#pop:2'),
    (r'--#(.*)\n', 'metacomment'),
    (r'/\*', 'block_comment', 'block_comment'),
    (r'--.*\n', None),
  ],
  'array_range': [
    (r'\(', 'open_paren', 'nested_parens'),
    (r'\)', 'array_range_end', '#pop'),
  ],
  'nested_parens': [
    (r'\(', 'open_paren', 'nested_parens'),
    (r'\)', 'close_paren', '#pop'),
  ],
  'block_comment': [
    (r'\*/', 'end_comment', '#pop'),
  ],
}