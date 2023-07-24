import type { LexicalEditor } from "lexical";

import { mergeRegister } from "@lexical/utils";
import useLayoutEffectImpl from "./useLayoutEffect";
import { registerSubtext } from "../utils/registerSubtext";

export function useSubtextSetup(editor: LexicalEditor): void {
  useLayoutEffectImpl(() => {
    return mergeRegister(
      registerSubtext(editor),
    );
  }, [editor]);
}
