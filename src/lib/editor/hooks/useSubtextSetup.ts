import type { LexicalEditor } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { registerSubtext } from "../utils/registerSubtext";
import { useLayoutEffect } from "react";

export function useSubtextSetup(editor: LexicalEditor): void {
  useLayoutEffect(() => {
    return mergeRegister(
      registerSubtext(editor),
    );
  }, [editor]);
}
