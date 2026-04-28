import {
  $getRoot,
  CLEAR_HISTORY_COMMAND,
} from "lexical";
import { useLayoutEffect, useRef } from "react";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import setSubtext from "../utils/setSubtext";
import { applyAllHighlights } from "../utils/highlight";


export default ({
  initialText,
  instanceId,
}: {
  initialText: string,
  instanceId: number,
}) => {
  const [editor] = useLexicalComposerContext();
  const currentInstanceIdRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (currentInstanceIdRef.current === instanceId) return;

    editor.update(() => {
      const root = $getRoot();
      setSubtext(root, initialText);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      root.getFirstChild()?.selectStart();
      editor.focus();
    }, { discrete: true });

    currentInstanceIdRef.current = instanceId;

    /*
      OnChangePlugin's update listener is registered too late to fire for
      this initial commit, and it also bails when the previous state was
      empty. Apply highlights here, still inside the layout effect, so they
      land in the same frame as the content.
    */
    applyAllHighlights();
  }, [editor, initialText, instanceId]);

  return null;
};
