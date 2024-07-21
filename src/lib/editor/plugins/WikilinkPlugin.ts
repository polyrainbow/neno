/*
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  TextNode,
} from "lexical";
import { EntityMatch } from "@lexical/text";
import {
  $createWikiLinkContentNode,
  $isWikiLinkContentNode,
  WikiLinkContentNode,
} from "../nodes/WikiLinkContentNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import {
  $createWikiLinkPunctuationNode,
  $isWikiLinkPunctuationNode,
  WikiLinkPunctuationNode,
} from "../nodes/WikiLinkPunctuationNode";
import { $isKeyValuePairKeyNode } from "../nodes/KeyValuePairKeyNode";
import { $isCodeBlockNode } from "../nodes/CodeBlockNode";

const REGEX = /\[\[[^[\]]+\]\]/;

const getWikiLinkMatch = (text: string): EntityMatch | null => {
  const matchArr = REGEX.exec(text);

  if (matchArr === null) {
    return null;
  }

  const wikiLinkLength = matchArr[0].length;
  const startOffset = matchArr.index;
  const endOffset = startOffset + wikiLinkLength;
  return {
    end: endOffset,
    start: startOffset,
  };
};


function registerWikilinkTransforms(
  editor: LexicalEditor,
  getLinkAvailability: (link: string) => Promise<boolean>,
): Array<() => void> {
  const replaceWithSimpleText = (node: TextNode): void => {
    const textNode = $createTextNode(node.getTextContent());
    textNode.setFormat(node.getFormat());
    node.replace(textNode);
  };

  const textNodeTransform = (node: TextNode): void => {
    if (!node.isSimpleText()) {
      return;
    }

    if ($isCodeBlockNode(node.getParent())) {
      return;
    }

    if ($isKeyValuePairKeyNode(node)) return;

    let text = node.getTextContent();
    let currentNode = node;
    let match: EntityMatch | null;


    while (true) {
      match = getWikiLinkMatch(text);
      const nextText = match === null ? "" : text.slice(match.end);
      text = nextText;

      if (match === null) {
        return;
      }

      let nodeToReplace;

      if (match.start === 0) {
        [nodeToReplace, currentNode] = currentNode.splitText(match.end);
      } else {
        [, nodeToReplace, currentNode] = currentNode.splitText(
          match.start,
          match.end,
        );
      }

      const wikilinkTextContent = nodeToReplace.getTextContent().slice(
        2,
        nodeToReplace.getTextContent().length - 2,
      );
      const replacementNode1 = $createWikiLinkPunctuationNode(false);
      const replacementNode2 = $createWikiLinkContentNode(
        wikilinkTextContent,
        getLinkAvailability,
      );
      const replacementNode3 = $createWikiLinkPunctuationNode(true);

      nodeToReplace.insertAfter(replacementNode1);
      replacementNode1.insertAfter(replacementNode2);
      replacementNode2.insertAfter(replacementNode3);

      // restore selection in new nodes
      const selection = $getSelection();
      let selectionOffset = NaN;
      // check if original selection was inside node to be removed
      if (
        $isRangeSelection(selection)
        && selection.focus.key === nodeToReplace.getKey()
      ) {
        selectionOffset = selection.focus.offset;
      }
      nodeToReplace.remove();

      // if selection was in old node that was removed, restore selection
      // in new nodes
      if (!isNaN(selectionOffset)) {
        if (selectionOffset < 3) {
          replacementNode1.select(selectionOffset, selectionOffset);
        } else if (
          selectionOffset > nodeToReplace.getTextContent().length - 2
        ) {
          const newNodeOffset
            = selectionOffset - replacementNode2.getTextContent().length - 2;
          replacementNode3.select(newNodeOffset, newNodeOffset);
        } else {
          const newNodeOffset
            = selectionOffset - 2;
          replacementNode2.select(newNodeOffset, newNodeOffset);
        }
      }
    }
  };

  const reverseWikilinkContentNodeTransform = (
    node: WikiLinkContentNode,
  ) => {
    if (!node.getParent()) return;
    if ($isKeyValuePairKeyNode(node)) return;

    // check if punctuation and content is still intact
    // if not: transform all three into simple text nodes
    const prevSibling = node.getPreviousSibling();
    const nextSibling = node.getNextSibling();

    if (
      !$isWikiLinkPunctuationNode(prevSibling)
      || !$isWikiLinkPunctuationNode(nextSibling)
      || !node.isValid()
      || !prevSibling.isValid()
      || !nextSibling.isValid()
      || $isCodeBlockNode(node.getParent())
    ) {
      replaceWithSimpleText(node);

      $isWikiLinkPunctuationNode(prevSibling)
        && replaceWithSimpleText(prevSibling);

      $isWikiLinkPunctuationNode(nextSibling)
        && replaceWithSimpleText(nextSibling);
    }
  };


  const reverseWikilinkPunctuationNodeTransform = (
    node: WikiLinkPunctuationNode,
  ) => {
    // check if punctuation and content is still intact
    // if not: transform back to simple text node
    if (!node.getParent()) return;

    if ($isKeyValuePairKeyNode(node)) return;

    const hasAccompanyingContentNode = node.__isClosing
      ? $isWikiLinkContentNode(node.getPreviousSibling())
      : $isWikiLinkContentNode(node.getNextSibling());

    if (!node.isValid() || (!hasAccompanyingContentNode)) {
      replaceWithSimpleText(node);
    }
  };

  const removePlainTextTransform = editor.registerNodeTransform(
    TextNode,
    textNodeTransform,
  );

  const removeReverseWikilinkContentNodeTransform
    = editor.registerNodeTransform<WikiLinkContentNode>(
      WikiLinkContentNode,
      reverseWikilinkContentNodeTransform,
    );


  const removeReverseWikilinkPunctuationNodeTransform
    = editor.registerNodeTransform<WikiLinkPunctuationNode>(
      WikiLinkPunctuationNode,
      reverseWikilinkPunctuationNodeTransform,
    );


  return [
    removePlainTextTransform,
    removeReverseWikilinkContentNodeTransform,
    removeReverseWikilinkPunctuationNodeTransform,
  ];
}

export function WikiLinkPlugin(
  {
    getLinkAvailability,
  }: { getLinkAvailability: (link: string) => Promise<boolean> },
): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([WikiLinkContentNode, WikiLinkPunctuationNode])) {
      throw new Error("WikiLinkPlugin: WikiLinkNodes not registered on editor");
    }

    return mergeRegister(
      ...registerWikilinkTransforms(
        editor,
        getLinkAvailability,
      ),
    );
  }, [editor]);

  return null;
}
