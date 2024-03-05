import {
  $getRoot,
  CLEAR_HISTORY_COMMAND,
} from "lexical";
import { useEffect, useRef } from "react";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
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

      if (currentInstanceIdRef.current !== instanceId) {
        setSubtext(root, initialText);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        root.getFirstChild()?.selectStart();
        editor.focus();
      }

      currentInstanceIdRef.current = instanceId;
    });
  }, [editor, initialText, instanceId]);

  return null;
};
