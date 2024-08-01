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

export class KeyValueNode extends ParagraphNode {
  static getType(): string {
    return ElementNodeType.KEY_VALUE_NODE;
  }

  static clone(node: KeyValueNode): KeyValueNode {
    return new KeyValueNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.keyValue);
    return element;
  }

  static importJSON(): KeyValueNode {
    throw new Error("Method not implemented.");
  }

  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.KEY_VALUE_NODE,
    };
  }
}


export function $createKeyValueNode(): KeyValueNode {
  return $applyNodeReplacement(new KeyValueNode());
}


export function $isKeyValueNode(
  node: LexicalNode | null | undefined,
): node is KeyValueNode {
  return node instanceof KeyValueNode;
}
