import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedParagraphNode,
} from "lexical";
import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, ElementNode, ParagraphNode } from "lexical";
import { ElementNodeType } from "../types/ElementNodeType";

export class ListItemContentNode extends ElementNode {
  static getType(): string {
    return "list-item-content";
  }

  static clone(node: ListItemContentNode): ListItemContentNode {
    return new ListItemContentNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    addClassNamesToElement(element, config.theme.listItemContent);
    return element;
  }

  updateDOM(
    _prevNode: ListItemContentNode,
    _element: HTMLElement,
    _config: EditorConfig,
  ): boolean {
    return false;
  }

  static importJSON(): ParagraphNode {
    throw new Error("Method not implemented.");
  }

  isInline(): boolean {
    return true;
  }

  canInsertTextBefore(): boolean {
    return true;
  }

  canInsertTextAfter(): boolean {
    return true;
  }

  exportJSON(): SerializedParagraphNode {
    return {
      ...super.exportJSON(),
      type: ElementNodeType.LIST_ITEM,
      textFormat: 0,
      textStyle: "",
    };
  }

  canBeEmpty(): boolean {
    return true;
  }
}


export function $createListItemContentNode(): ListItemContentNode {
  return $applyNodeReplacement(new ListItemContentNode());
}


export function $isListItemContentNode(
  node: LexicalNode | null | undefined,
): node is ListItemContentNode {
  return node instanceof ListItemContentNode;
}