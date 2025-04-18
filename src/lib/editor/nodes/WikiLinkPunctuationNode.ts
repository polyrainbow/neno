/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable @typescript-eslint/no-use-before-define */

import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";


interface SerializedWikiLinkPunctuationNode extends SerializedTextNode {
  __isClosing: boolean;
}

export class WikiLinkPunctuationNode extends TextNode {
  static getType(): string {
    return "wikiLinkPunctuation";
  }

  static clone(node: WikiLinkPunctuationNode): WikiLinkPunctuationNode {
    return new WikiLinkPunctuationNode(node.__isClosing, node.__key);
  }

  __isClosing = false;

  constructor(isClosing: boolean, key?: NodeKey) {
    super(isClosing ? "]]" : "[[", key);
    this.__isClosing = isClosing;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.wikiLinkPunctuation);
    return element;
  }

  static importJSON(
    serializedNode: SerializedWikiLinkPunctuationNode,
  ): WikiLinkPunctuationNode {
    const node = $createWikiLinkPunctuationNode(serializedNode.__isClosing);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  // This is important so that no unnecessary transformation loop is triggered.
  // Text inserted after this node (no matter if opening of closing) should be
  // put in a normal text node
  canInsertTextAfter(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }

  isInline(): true {
    return true;
  }

  isValid(): boolean {
    return (
      (this.__isClosing && this.__text === "]]")
      || ((!this.__isClosing) && this.__text === "[[")
    );
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "wikiLinkPunctuation",
    };
  }
}


export function $createWikiLinkPunctuationNode(
  isClosing: boolean,
): WikiLinkPunctuationNode {
  return $applyNodeReplacement(new WikiLinkPunctuationNode(isClosing));
}


export function $isWikiLinkPunctuationNode(
  node: LexicalNode | null | undefined,
): node is WikiLinkPunctuationNode {
  return node instanceof WikiLinkPunctuationNode;
}
