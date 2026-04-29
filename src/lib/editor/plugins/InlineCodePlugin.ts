import type { TextNode } from "lexical";
import { $createInlineCodeNode, InlineCodeNode } from "../nodes/InlineCodeNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { registerLexicalTextEntity } from "@lexical/text";
import { mergeRegister } from "@lexical/utils";
import { useCallback, useLayoutEffect } from "react";


const REGEX = /`[^`]+`/;

export function InlineCodePlugin(): null {
  const [editor] = useLexicalComposerContext();

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

  useLayoutEffect(() => {
    if (!editor.hasNodes([InlineCodeNode])) {
      throw new Error(
        "InlineCodePlugin: InlineCodeNode not registered on editor",
      );
    }

    return mergeRegister(
      ...registerLexicalTextEntity(
        editor,
        getInlineCodeMatch,
        InlineCodeNode,
        createInlineCodeNode,
      ),
    );
  }, [editor, getInlineCodeMatch, createInlineCodeNode]);

  return null;
}
