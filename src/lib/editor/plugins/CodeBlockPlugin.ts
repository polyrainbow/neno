/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $createParagraphNode,
  $setCompositionKey,
  ParagraphNode,
  RootNode,
} from "lexical";
import { useEffect } from "react";
import {
  $createCodeBlockNode,
  $isCodeBlockNode,
  CodeBlockNode,
} from "../nodes/CodeBlockNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";


enum ElementNodeType {
  CODE = "CODE",
  PARAGRAPH = "PARAGRAPH",
}

const assignCorrectElementNodes = (
  elementNodes: (ParagraphNode | CodeBlockNode)[],
): void => {
  const nodesMap: Map<ParagraphNode | CodeBlockNode, ElementNodeType>
    = new Map<ParagraphNode | CodeBlockNode, ElementNodeType>();

  let i = 0;
  let currentSection = ElementNodeType.PARAGRAPH;
  while (elementNodes[i]) {
    if (currentSection === ElementNodeType.PARAGRAPH) {
      // TODO: we should allow a language specification after backticks
      if (elementNodes[i].getTextContent() === "```") {
        nodesMap.set(elementNodes[i], ElementNodeType.CODE);
        currentSection = ElementNodeType.CODE;
      } else {
        nodesMap.set(elementNodes[i], ElementNodeType.PARAGRAPH);
      }
    } else {
      // let's allow trailing whitespace with trimEnd()
      if (elementNodes[i].getTextContent().trimEnd() === "```") {
        nodesMap.set(elementNodes[i], ElementNodeType.CODE);
        currentSection = ElementNodeType.PARAGRAPH;
      } else {
        nodesMap.set(elementNodes[i], ElementNodeType.CODE);
      }
    }
    i++;
  }

  elementNodes.forEach((elementNode) => {
    if (nodesMap.get(elementNode) === ElementNodeType.CODE) {
      if (elementNode.getType() === "paragraph") {
        elementNode.replace($createCodeBlockNode(), true);
      }
    } else {
      if ($isCodeBlockNode(elementNode)) {
        elementNode.replace($createParagraphNode(), true);
      }
    }
  });
};


export function CodeBlockPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerNodeTransform(RootNode, (root: RootNode) => {
      assignCorrectElementNodes(root.getChildren());
      // Node.replace() sets a composition key, and does not reset it again,
      // so we have to do it manually to not break backspace functionality
      $setCompositionKey(null);
    });
  }, [editor]);

  return null;
}
