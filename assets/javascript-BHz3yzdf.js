import { conf as conf$1, language as language$1 } from './typescript-B8190xST.js';
import './editor.main-CA8x6Kfr.js';
import './index-Dqh7nsnM.js';

/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.54.0(7c2310116c57517348bbd868a21139f32454be22)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var conf = conf$1;
var language = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",
  tokenPostfix: ".js",
  keywords: [
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "set",
    "static",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  typeKeywords: [],
  operators: language$1.operators,
  symbols: language$1.symbols,
  escapes: language$1.escapes,
  digits: language$1.digits,
  octaldigits: language$1.octaldigits,
  binarydigits: language$1.binarydigits,
  hexdigits: language$1.hexdigits,
  regexpctl: language$1.regexpctl,
  regexpesc: language$1.regexpesc,
  tokenizer: language$1.tokenizer
};

export { conf, language };
