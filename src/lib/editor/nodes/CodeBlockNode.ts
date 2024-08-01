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
  NodeKey,
  SerializedParagraphNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, ParagraphNode } from "lexical";
import { ElementNodeType } from "../types/ElementNodeType";

export class CodeBlockNode extends ParagraphNode {
  static getType(): string {
    return ElementNodeType.CODE;
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.codeBlock);
    return element;
  }


  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }


  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.CODE,
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
