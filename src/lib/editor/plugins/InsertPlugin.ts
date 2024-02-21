import {
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { useEffect } from "react";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";


/*
  This plugin is used to expose the insert function to some parent module that
  is passed as prop to the editor.
  The reason for this approach is that we cannot access the editor object
  from outside the editor component <LexicalComposer/> to perform updates,
  so we need to expose this functionality manually.
*/
export default (
  { parentModule }: {
    parentModule: {
      insert?: (text: string) => void,
      toggleWikilinkWrap?: () => void,
    },
  },
) => {
  const [editor] = useLexicalComposerContext();

  const insert = (text: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(text);
      }
    });
  };

  const toggleWikilinkWrap = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const text = selection.getTextContent();
        if (text.startsWith("[[") && text.endsWith("]]")) {
          selection.insertText(text.substring(2, text.length - 2));
        } else {
          selection.insertText(`[[${text}]]`);
          if (text.length === 0) {
            selection.anchor.offset -= 2;
            selection.focus.offset -= 2;
          }
        }
      }
    });
  };

  useEffect(() => {
    parentModule.insert = insert;
    parentModule.toggleWikilinkWrap = toggleWikilinkWrap;
  }, [insert]);

  return "";
};
