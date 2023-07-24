import type { TextNode } from "lexical";

import { $createInlineCodeNode, InlineCodeNode } from "../nodes/InlineCodeNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import { useCallback, useEffect } from "react";


const REGEX = /`[^`]+`/;

export function InlineCodePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([InlineCodeNode])) {
      throw new Error(
        "InlineCodePlugin: InlineCodeNode not registered on editor",
      );
    }
  }, [editor]);

  const createInlineCodeNode = useCallback(
    (textNode: TextNode): InlineCodeNode => {
      return $createInlineCodeNode(textNode.getTextContent());
    },
    [],
  );

  const getInlineCodeMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    const headingLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + headingLength;
    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<InlineCodeNode>(
    getInlineCodeMatch,
    InlineCodeNode,
    createInlineCodeNode,
  );

  return null;
}
