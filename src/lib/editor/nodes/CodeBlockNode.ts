/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, ParagraphNode } from "lexical";

/** @noInheritDoc */
export class CodeBlockNode extends ParagraphNode {
  static getType(): string {
    return "codeBlock";
  }

  constructor() {
    super();
  }

  static clone(): CodeBlockNode {
    return new CodeBlockNode();
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.codeBlock);
    return element;
  }


  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }


  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "code-block",
    };
  }
}


export function $createCodeBlockNode(): CodeBlockNode {
  return $applyNodeReplacement(new CodeBlockNode());
}


export function $isCodeBlockNode(
  node: LexicalNode | null | undefined,
): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}
