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
  SerializedTextNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";

export class KeyValuePairKeyNode extends TextNode {
  static getType(): string {
    return "keyValuePairKey";
  }

  static clone(node: KeyValuePairKeyNode): KeyValuePairKeyNode {
    return new KeyValuePairKeyNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.keyValuePairKey);
    return element;
  }


  updateDOM(
    prevNode: this,
    element: HTMLElement,
    config: EditorConfig,
  ): boolean {
    // We have to call the parent method so that text editing properly works
    super.updateDOM(prevNode, element, config);
    // We have to return false so that the node is not re-created all the time
    // which prevents the usage of dead keys.
    return false;
  }

  // Dummy function. This will never happen.
  static importJSON(): KeyValuePairKeyNode {
    return new KeyValuePairKeyNode("");
  }

  canInsertTextBefore(): boolean {
    return true;
  }

  isTextEntity(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "keyValuePairKey",
    };
  }
}


export function $createKeyValuePairKeyNode(
  text = "",
): KeyValuePairKeyNode {
  return $applyNodeReplacement(
    new KeyValuePairKeyNode(text),
  );
}

export function $isKeyValuePairKeyNode(
  node: LexicalNode | null | undefined,
): node is KeyValuePairKeyNode {
  return node instanceof KeyValuePairKeyNode;
}
