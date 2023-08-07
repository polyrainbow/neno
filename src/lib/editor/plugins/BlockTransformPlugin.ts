/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $createParagraphNode,
  $isRootNode,
  $setCompositionKey,
  LineBreakNode,
  ParagraphNode,
  RootNode,
} from "lexical";
import { useEffect } from "react";
import {
  $createCodeBlockNode,
  CodeBlockNode,
} from "../nodes/CodeBlockNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { $createQuoteBlockNode, QuoteBlockNode } from "../nodes/QuoteBlockNode";
import { ElementNodeType } from "../types/ElementNodeType";
import { $createHeadingNode, HeadingNode } from "../nodes/HeadingNode";
import { $createListItemNode, ListItemNode } from "../nodes/ListItemNode";

type BlockNode = ParagraphNode
| CodeBlockNode
| QuoteBlockNode
| HeadingNode
| ListItemNode;

const assignCorrectElementNodes = (
  elementNodes: BlockNode[],
): void => {
  const typeNodeShouldHaveMap: Map<BlockNode, ElementNodeType>
    = new Map<BlockNode, ElementNodeType>();

  let insideCodeBlock = false;
  for (const node of elementNodes) {
    const nodeText = node.getTextContent();

    if (!insideCodeBlock) {
      // TODO: we should allow a language specification after backticks
      if (nodeText === "```") {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = true;
      } else if (nodeText.startsWith(">")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.QUOTE);
      } else if (nodeText.startsWith("#")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.HEADING);
      } else if (nodeText.startsWith("-")) {
        typeNodeShouldHaveMap.set(node, ElementNodeType.LIST_ITEM);
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.PARAGRAPH);
      }
    } else {
      // let's allow trailing whitespace with trimEnd()
      if (nodeText.trimEnd() === "```") {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
        insideCodeBlock = false;
      } else {
        typeNodeShouldHaveMap.set(node, ElementNodeType.CODE);
      }
    }
  }

  elementNodes.forEach((elementNode) => {
    const currentNodeType = elementNode.getType();
    const typeNodeShouldHave = typeNodeShouldHaveMap.get(elementNode);

    if (currentNodeType !== typeNodeShouldHave) {
      if (typeNodeShouldHave === ElementNodeType.PARAGRAPH) {
        elementNode.replace($createParagraphNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.CODE) {
        elementNode.replace($createCodeBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.QUOTE) {
        elementNode.replace($createQuoteBlockNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.HEADING) {
        elementNode.replace($createHeadingNode(), true);
      } else if (typeNodeShouldHave === ElementNodeType.LIST_ITEM) {
        elementNode.replace($createListItemNode(), true);
      } else {
        throw new Error("Unknown node type: " + typeNodeShouldHave);
      }
    }
  });
};


export function BlockTransformPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerNodeTransform(RootNode, (root: RootNode) => {
      assignCorrectElementNodes(root.getChildren());
      // Node.replace() sets a composition key, and does not reset it again,
      // so we have to do it manually to not break backspace functionality
      $setCompositionKey(null);
    });

    editor.registerNodeTransform(LineBreakNode, (node: LineBreakNode) => {
      const element = node.getParent() as ParagraphNode;
      if ($isRootNode(element)) {
        return;
      }
      const prevSiblings = node.getPreviousSiblings();
      const nextSiblings = node.getNextSiblings();
      const n1 = $createParagraphNode();
      n1.append(...prevSiblings);
      const n2 = $createParagraphNode();
      n2.append(...nextSiblings);

      element.replace(n1, false);
      n1.insertAfter(n2);
      element.remove();
    });
  }, [editor]);

  return null;
}
