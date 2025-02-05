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

export function BoldPlugin(): null {
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
    let startOffset = -1;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charIsSigil = char === "*";

      if (
        (startOffset === -1)
        && charIsSigil
        && (
          !text[i-1]
          || text[i-1].trim().length === 0
        )
      ) {
        startOffset = i;

      // break if a ` is between two *
      } else if (startOffset > -1 && char === "`") {
        startOffset = -1;
      } else if (startOffset > -1 && charIsSigil) {

        // break if * is followed immediately by *
        if (i === startOffset + 1) {
          startOffset = -1;
        } else {
          return {
            end: i + 1,
            start: startOffset,
          };
        }
      }
    }

    return null;
  }, []);

  useLexicalTextEntity<BoldNode>(
    getBoldMatch,
    BoldNode,
    createBoldNode,
  );

  return null;
}
