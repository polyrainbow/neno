/* eslint-disable @typescript-eslint/no-use-before-define */

import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";

/** @noInheritDoc */
export class InlineCodeNode extends TextNode {
  static getType(): string {
    return "inline-code";
  }

  static clone(node: InlineCodeNode): InlineCodeNode {
    return new InlineCodeNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.inlineCode);
    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): InlineCodeNode {
    const node = $createInlineCodeNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "inline-code",
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}


export function $createInlineCodeNode(text = ""): InlineCodeNode {
  return $applyNodeReplacement(new InlineCodeNode(text));
}


export function $isInlineCodeNode(
  node: LexicalNode | null | undefined,
): node is InlineCodeNode {
  return node instanceof InlineCodeNode;
}
