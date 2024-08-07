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

export class HeadingNode extends ParagraphNode {
  static getType(): string {
    return ElementNodeType.HEADING;
  }

  static clone(node: HeadingNode): HeadingNode {
    return new HeadingNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.sHeading);
    return element;
  }

  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }

  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.HEADING,
    };
  }
}


export function $createHeadingNode(): HeadingNode {
  return $applyNodeReplacement(new HeadingNode());
}


export function $isHeadingNode(
  node: LexicalNode | null | undefined,
): node is HeadingNode {
  return node instanceof HeadingNode;
}
