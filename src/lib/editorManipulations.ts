import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import { isWhiteSpace } from "./subwaytext/utils";
import { InsertItem } from "../types/InsertItem";

export const insert = (text: string, editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertText(text);
    }
  });
};


export const concatenateInsertItems = (items: InsertItem[]): string => {
  let concatenatedText = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemBefore = i > 0 ? items[i] : null;

    if (item.type === "file-slug") {
      if (itemBefore?.value.endsWith(" ") || itemBefore?.type === "file-slug") {
        concatenatedText += " ";
      }
    } else {
      if (itemBefore?.type === "file-slug" && !item.value.startsWith(" ")) {
        concatenatedText += " ";
      }
    }

    concatenatedText += item.value;
  }

  return concatenatedText;
};


export const insertItems = (items: InsertItem[], editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {

      let concatenatedText = concatenateInsertItems(items);

      const selectionIsCollapsed
        = selection.focus.key === selection.anchor.key
        && selection.focus.offset === selection.anchor.offset;

      if (selectionIsCollapsed) {
        const anchorNode = selection.anchor.getNode();

        const charBeforeCursor = anchorNode
          .getTextContent()[selection.anchor.offset - 1];

        if (charBeforeCursor && !isWhiteSpace(charBeforeCursor)) {
          concatenatedText = " " + concatenatedText;
        }

        let charAfterCursor = anchorNode
          .getTextContent()[selection.anchor.offset];

        const nextSibling = anchorNode.getNextSibling();
        if (!charAfterCursor && nextSibling) {
          charAfterCursor = nextSibling.getTextContent()[0];
        }

        if (charAfterCursor && !isWhiteSpace(charAfterCursor)) {
          concatenatedText = concatenatedText + " ";
        }
      }

      selection.insertText(concatenatedText);
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
