/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import useLexicalEditable from "@lexical/react/useLexicalEditable";

import { useSubtextSetup } from "../hooks/useSubtextSetup";
import { useCanShowPlaceholder } from "../hooks/useCanShowPlaceholder";
import { ErrorBoundaryType, useDecorators } from "../hooks/useDecorators";

function Placeholder({
  content,
}: {
  content: ((isEditable: boolean) => null | JSX.Element) | null | JSX.Element;
}): null | JSX.Element {
  const [editor] = useLexicalComposerContext();
  const showPlaceholder = useCanShowPlaceholder(editor);
  const editable = useLexicalEditable();

  if (!showPlaceholder) {
    return null;
  }

  if (typeof content === "function") {
    return content(editable);
  } else {
    return content;
  }
}


export function SubtextPlugin({
  contentEditable,
  placeholder,
  ErrorBoundary,
}: {
  contentEditable: JSX.Element;
  placeholder:
  | ((isEditable: boolean) => null | JSX.Element)
  | null
  | JSX.Element;
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  useSubtextSetup(editor);

  return <>
    {contentEditable}
    <Placeholder content={placeholder} />
    {decorators}
  </>;
}
