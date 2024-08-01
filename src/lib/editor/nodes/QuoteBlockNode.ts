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

/** @noInheritDoc */
export class QuoteBlockNode extends ParagraphNode {
  static getType(): string {
    return ElementNodeType.QUOTE;
  }

  static clone(node: QuoteBlockNode): QuoteBlockNode {
    return new QuoteBlockNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.quoteBlock);
    return element;
  }


  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }


  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.QUOTE,
    };
  }
}


export function $createQuoteBlockNode(): QuoteBlockNode {
  return $applyNodeReplacement(new QuoteBlockNode());
}


export function $isQuoteBlockNode(
  node: LexicalNode | null | undefined,
): node is QuoteBlockNode {
  return node instanceof QuoteBlockNode;
}
