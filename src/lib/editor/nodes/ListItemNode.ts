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

export class ListItemNode extends ParagraphNode {
  static getType(): string {
    return ElementNodeType.LIST_ITEM;
  }

  static clone(node: ListItemNode): ListItemNode {
    return new ListItemNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.listItem);
    return element;
  }

  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }

  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.LIST_ITEM,
    };
  }
}


export function $createListItemNode(): ListItemNode {
  return $applyNodeReplacement(new ListItemNode());
}


export function $isListItemNode(
  node: LexicalNode | null | undefined,
): node is ListItemNode {
  return node instanceof ListItemNode;
}
