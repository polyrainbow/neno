import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  TextNode,
} from "lexical";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import {
  $createKeyValuePairKeyNode,
  $isKeyValuePairKeyNode,
  KeyValuePairKeyNode,
} from "../nodes/KeyValuePairKeyNode";
import { $isKeyValueNode, KeyValueNode } from "../nodes/KeyValueNode";
import { EntityMatch } from "@lexical/text";


const getKeyMatchInLine = (text: string): EntityMatch | null => {
  const REGEX = /[\p{L}\p{M}\d\-_]+/gu;
  const matchArr = REGEX.exec(text);

  if (matchArr === null) {
    return null;
  }

  if (text[0] !== "$") return null;

  const keyLength = matchArr[0].length;
  const startOffset = 1;
  const endOffset = startOffset + keyLength;
  return {
    end: endOffset,
    start: startOffset,
  };
};

const getKeyMatchAtTextStart = (text: string): EntityMatch | null => {
  const REGEX = /^[\p{L}\p{M}\d\-_]+/gu;
  const matchArr = REGEX.exec(text);

  if (matchArr === null) {
    return null;
  }

  const keyLength = matchArr[0].length;
  const startOffset = 0;
  const endOffset = startOffset + keyLength;
  return {
    end: endOffset,
    start: startOffset,
  };
};


function registerTransforms(
  editor: LexicalEditor,
): Array<() => void> {
  const replaceWithSimpleText = (node: TextNode): void => {
    const textNode = $createTextNode(node.getTextContent());
    textNode.setFormat(node.getFormat());
    node.replace(textNode);
  };

  const textNodeToKeyTransform = (node: TextNode): void => {
    if (!node.isSimpleText()) {
      return;
    }

    if (!$isKeyValueNode(node.getParent())) {
      return;
    }

    const textContent = node.getTextContent();
    const previousSibling = node.getPreviousSibling();

    if (
      (!previousSibling && textContent.startsWith("$"))
    ) {
      const match = getKeyMatchInLine(textContent);
      if (!match) return;

      const [, nodeToReplace] = node.splitText(
        match.start,
        match.end,
      );

      const keyNode = $createKeyValuePairKeyNode(
        nodeToReplace.getTextContent(),
      );
      nodeToReplace.replace(keyNode);
    } else if (
      $isKeyValuePairKeyNode(previousSibling)
    ) {
      const match = getKeyMatchAtTextStart(textContent);

      if (match) {
        const [nodeToBeCombined] = node.splitText(
          match.end,
        );
        const kvNode = $createKeyValuePairKeyNode(
          nodeToBeCombined.getTextContent(),
        );
        nodeToBeCombined.replace(kvNode);
      }
    }
  };

  const keyToTextNodeTransform = (
    node: KeyValuePairKeyNode,
  ) => {
    const parent = node.getParent();
    if (!parent) return;
    const textContent = node.getTextContent();

    if (
      (!$isKeyValueNode(parent))
      || !(/^[\p{L}\p{M}\d\-_]+$/gu.test(textContent))
    ) {
      replaceWithSimpleText(node);
    }
  };


  const combineKeyNodeTransform = (
    leftNode: KeyValuePairKeyNode,
  ) => {
    const parent = leftNode.getParent();
    if (!parent) return;

    const rightNode = leftNode.getNextSibling();

    if (
      $isKeyValueNode(parent)
      && $isKeyValuePairKeyNode(rightNode)
    ) {
      const leftNodeTextContent = leftNode.getTextContent();
      const combinedNode = $createKeyValuePairKeyNode(
        leftNodeTextContent + rightNode.getTextContent(),
      );
      leftNode.replace(combinedNode);

      // restore selection in new nodes
      const selection = $getSelection();
      let selectionOffset = NaN;
      // check if original selection was inside node to be removed
      if (
        $isRangeSelection(selection)
        && selection.focus.key === rightNode.getKey()
      ) {
        selectionOffset = selection.focus.offset;
      }

      rightNode.remove();

      // if selection was in old node that was removed, restore selection
      // in new nodes
      if (!isNaN(selectionOffset)) {
        combinedNode.select(
          leftNodeTextContent.length + selectionOffset,
          leftNodeTextContent.length + selectionOffset,
        );
      }

      return;
    }
  };

  const removeTextNodeToKeyTransform = editor.registerNodeTransform(
    TextNode,
    textNodeToKeyTransform,
  );

  const removeKeyToTextNodeTransform
    = editor.registerNodeTransform<KeyValuePairKeyNode>(
      KeyValuePairKeyNode,
      keyToTextNodeTransform,
    );

  const removeCombineKeyNodeTransform
    = editor.registerNodeTransform<KeyValuePairKeyNode>(
      KeyValuePairKeyNode,
      combineKeyNodeTransform,
    );


  return [
    removeTextNodeToKeyTransform,
    removeKeyToTextNodeTransform,
    removeCombineKeyNodeTransform,
  ];
}

export function KeyValuePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([KeyValueNode, KeyValuePairKeyNode])) {
      throw new Error("KeyValuePlugin: Nodes not registered on editor");
    }

    return mergeRegister(
      ...registerTransforms(
        editor,
      ),
    );
  }, [editor]);

  return null;
}
