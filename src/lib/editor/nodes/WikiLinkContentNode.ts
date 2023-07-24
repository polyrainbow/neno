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
  SerializedTextNode,
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";

export class WikiLinkContentNode extends TextNode {
  static getType(): string {
    return "wikiLinkContent";
  }

  static clone(node: WikiLinkContentNode): WikiLinkContentNode {
    return new WikiLinkContentNode(node.__text);
  }

  constructor(text: string) {
    super(text);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.wikiLinkContent);
    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): WikiLinkContentNode {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const node = $createWikiLinkContentNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }

  isInline(): boolean {
    return true;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "wikiLinkContent",
    };
  }

  isValid(): boolean {
    const text = this.__text;
    return text.length > 0
      && !text.includes("[")
      && !text.includes("]");
  }
}


export function $createWikiLinkContentNode(text = ""): WikiLinkContentNode {
  return $applyNodeReplacement(new WikiLinkContentNode(text));
}

export function $isWikiLinkContentNode(
  node: LexicalNode | null | undefined,
): node is WikiLinkContentNode {
  return node instanceof WikiLinkContentNode;
}
