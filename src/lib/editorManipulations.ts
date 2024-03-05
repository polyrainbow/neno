import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import { Slug } from "./notes/types/Slug";
import { isWhiteSpace } from "./subwaytext/utils";

export const insert = (text: string, editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertText(text);
    }
  });
};


export const insertFileSlugs = (fileSlugs: Slug[], editor: LexicalEditor) => {
  const slashlinks = fileSlugs.map((slug) => `/${slug}`);

  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      let textToBeInserted = slashlinks.join(" ");

      const selectionIsCollapsed
        = selection.focus.key === selection.anchor.key
        && selection.focus.offset === selection.anchor.offset;

      if (selectionIsCollapsed) {
        const anchorNode = selection.anchor.getNode();

        const charBeforeCursor = anchorNode
          .getTextContent()[selection.anchor.offset - 1];

        if (charBeforeCursor && !isWhiteSpace(charBeforeCursor)) {
          textToBeInserted = " " + textToBeInserted;
        }

        let charAfterCursor = anchorNode
          .getTextContent()[selection.anchor.offset];

        if (!charAfterCursor && anchorNode.getNextSibling()) {
          charAfterCursor = anchorNode.getNextSibling().getTextContent()[0];
        }

        if (charAfterCursor && !isWhiteSpace(charAfterCursor)) {
          textToBeInserted = textToBeInserted + " ";
        }
      }

      selection.insertText(textToBeInserted);
    }
  });
};

export const toggleWikilinkWrap = (editor: LexicalEditor) => {
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
