import {
  $getRoot,
  CLEAR_HISTORY_COMMAND,
} from "lexical";
import { useEffect, useRef } from "react";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import getSubtextFromEditor from "../utils/getSubtextFromEditor";
import setSubtext from "../utils/setSubtext";


export default ({
  initialText,
  instanceId,
}: {
  initialText: string,
  instanceId: number,
}) => {
  const [editor] = useLexicalComposerContext();
  const currentInstanceIdRef = useRef<number>(0);

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      const currentText = getSubtextFromEditor(root);
      /*
        If the new initial text is not different from the current text, we do
        not need to perform the update as it would just move the cursor from
        the current position. The user probably just has saved their note with
        CTRL/CMD+S.
        This is just an issue if there are two notes with the same
        non-empty content, e.g. when creating a duplicate.
        In that case, the cursor would not reset.
        That's why we also check if the instanceId has changed.
      */
      if (
        currentInstanceIdRef.current !== instanceId
        || initialText !== currentText
      ) {
        setSubtext(root, initialText);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        /*
          When we open a new note, the instanceId changes and the cursor should
          be at the beginning of the note and the view should be scrolled to the
          top.
          When the instanceId has not changed, the user is editing an existing
          note from outside the editor (e.g. appending a link). In this case,
          we should move the cursor to the end.
        */
        if (currentInstanceIdRef.current === instanceId) {
          root.getLastChild()?.selectEnd();
        } else {
          // We need to get the selection inside the first block, because
          // otherwise, the selection is at the beginning of the root node and
          // typing would create a new block before the first one.
          root.getFirstChild()?.selectStart();
        }

        editor.focus();
      }

      currentInstanceIdRef.current = instanceId;
    });
  }, [editor, initialText, instanceId]);

  return null;
};
