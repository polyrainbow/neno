/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { TextNode } from "lexical";
import { $createBoldNode, BoldNode } from "../nodes/BoldNode";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import { useCallback, useEffect } from "react";

const REGEX = /\*[^*]+\*/;

export function BoldPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([BoldNode])) {
      throw new Error("BoldPlugin: BoldNode not registered on editor");
    }
  }, [editor]);

  const createBoldNode = useCallback((textNode: TextNode): BoldNode => {
    return $createBoldNode(textNode.getTextContent());
  }, []);

  const getBoldMatch = useCallback((text: string) => {
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

  useLexicalTextEntity<BoldNode>(
    getBoldMatch,
    BoldNode,
    createBoldNode,
  );

  return null;
}
