/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { TextNode } from "lexical";

import { $createHeadingNode, HeadingNode } from "../nodes/HeadingNode";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import { useCallback } from "react";


const REGEX = /^#.*$/mi;

export function HeadingPlugin(): JSX.Element | null {
  const createHeadingNode = useCallback((textNode: TextNode): HeadingNode => {
    return $createHeadingNode(textNode.getTextContent());
  }, []);

  const getHeadingMatch = useCallback((text: string) => {
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

  useLexicalTextEntity<HeadingNode>(
    getHeadingMatch,
    HeadingNode,
    createHeadingNode,
  );

  return null;
}
