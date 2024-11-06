import {
  $createTransclusionNode,
  $isTransclusionNode,
  TransclusionNode,
} from "../nodes/TransclusionNode";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  LexicalNode,
  ParagraphNode,
} from "lexical";
import { $isAutoLinkNode, AutoLinkNode } from "@lexical/link";
import { ElementNodeType } from "../types/ElementNodeType";
import { TransclusionContentGetter } from "../types/TransclusionContentGetter";
import { $isListItemContentNode } from "../nodes/ListItemContentNode";

const transclusionsMatchSlashlinks = (
  slashlinks: AutoLinkNode[],
  transclusions: TransclusionNode[],
): boolean => {
  if (slashlinks.length !== transclusions.length) return false;

  for (let i = 0; i < slashlinks.length; i++) {
    if (slashlinks[i].getTextContent() !== transclusions[i].__link) {
      return false;
    }
  }

  return true;
};


const splitParagraphAtLineBreaks = (node: ParagraphNode): void => {
  const selection = $getSelection();
  let cursor = node;
  let startOffset = 0;
  let endOffset;

  node.getTextContent()
    .split("\n")
    .forEach((line: string, i: number): void => {
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode(line);
      paragraphNode.append(textNode);
      cursor.insertAfter(paragraphNode);
      cursor = paragraphNode;

      endOffset = startOffset + line.length;

      if (
        $isRangeSelection(selection)
        && selection.focus.offset >= startOffset
        && selection.focus.offset <= endOffset
      ) {
        paragraphNode.select(selection.focus.offset - startOffset);
      }

      startOffset = endOffset + i;
    });

  node.remove();
  cursor.selectEnd();
};


const isSlashlinkNode = (node: LexicalNode): node is AutoLinkNode => {
  return $isAutoLinkNode(node)
    && (
      node.getTextContent().startsWith("/")
      || node.getTextContent().startsWith("@")
    );
};


export default (
  node: ParagraphNode,
  getTransclusionContent: TransclusionContentGetter,
) => {
  // this usually happens after a paste event, so let's fix the structure first
  if (
    node.getType() === ElementNodeType.PARAGRAPH
    && node.getTextContent().includes("\n")
  ) {
    splitParagraphAtLineBreaks(node);
    return;
  }

  const nodeType = node.getType() as ElementNodeType;

  let slashlinks: AutoLinkNode[];

  if (nodeType === ElementNodeType.LIST_ITEM) {
    const contentNode = node.getChildren()[1];
    if (!$isListItemContentNode(contentNode)) {
      // Maybe the other transformations have not been performed yet, so let's
      // wait first.
      return [];
    }
    slashlinks = contentNode.getChildren().filter(isSlashlinkNode);
  } else if (
    nodeType === ElementNodeType.PARAGRAPH
    || nodeType === ElementNodeType.HEADING
  ) {
    slashlinks = node.getChildren().filter(isSlashlinkNode);
  } else {
    slashlinks = []; // don't create slashlinks on code or quote blocks
  }

  const transclusions: TransclusionNode[] = node.getChildren()
    .filter(
      (child: LexicalNode): child is TransclusionNode => {
        return $isTransclusionNode(child);
      });

  if (transclusionsMatchSlashlinks(slashlinks, transclusions)) {
    return;
  }

  // remove transclusions at end of block
  while ($isTransclusionNode(node.getLastChild())) {
    node.getLastChild()?.remove();
  }

  slashlinks.forEach((slashlinkNode) => {
    const transclusionNode = $createTransclusionNode(
      slashlinkNode.getTextContent(),
      getTransclusionContent,
    );
    node.append(transclusionNode);
  });
};
