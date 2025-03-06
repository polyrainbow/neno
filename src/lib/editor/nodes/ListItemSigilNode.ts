import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";

export class ListItemSigilNode extends TextNode {
  static getType(): string {
    return "list-item-sigil";
  }

  static clone(node: ListItemSigilNode): ListItemSigilNode {
    return new ListItemSigilNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(element, config.theme.listItemSigil);
    return element;
  }

  static importJSON(): TextNode {
    throw new Error("Method not implemented.");
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: "list-item-sigil",
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  isTextEntity(): boolean {
    return false;
  }

  isInline(): true {
    return true;
  }
}


export function $createListItemSigilNode(text = "- "): ListItemSigilNode {
  return $applyNodeReplacement(new ListItemSigilNode(text));
}


export function $isListItemSigilNode(
  node: LexicalNode | null | undefined,
): node is ListItemSigilNode {
  return node instanceof ListItemSigilNode;
}
