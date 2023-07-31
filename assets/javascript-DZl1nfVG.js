import { conf as conf$1, language as language$1 } from './typescript-CL7oOJNf.js';
import './editor.main-D3FeRMV7.js';
import './index-MW5GEN4x.js';

/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.50.0(c321d0fbecb50ab8a5365fa1965476b0ae63fc87)
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
