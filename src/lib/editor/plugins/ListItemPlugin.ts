import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  TextNode,
} from "lexical";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $isListItemNode, ListItemNode } from "../nodes/ListItemNode";
import {
  $isListItemSigilNode,
  ListItemSigilNode,
} from "../nodes/ListItemSigilNode";
import {
  $isListItemContentNode,
  ListItemContentNode,
} from "../nodes/ListItemContentNode";
import { AutoLinkNode } from "@lexical/link";
import { BoldNode } from "../nodes/BoldNode";
import { InlineCodeNode } from "../nodes/InlineCodeNode";
import { WikiLinkContentNode } from "../nodes/WikiLinkContentNode";
import { WikiLinkPunctuationNode } from "../nodes/WikiLinkPunctuationNode";
import { $isTransclusionNode } from "../nodes/TransclusionNode";


const listItemNodeNormalizationTransform = (liNode: ListItemNode): void => {
  if (!$isListItemNode(liNode)) return;
  const firstChild = liNode.getFirstChild();
  if (!firstChild) return;
  if (!(firstChild instanceof TextNode)) return;
  if (
    $isListItemSigilNode(firstChild) && firstChild.getTextContent() === "- "
  ) return;

  const nodeText = firstChild.getTextContent();
  if (nodeText[0] !== "-" || nodeText[1] !== " ") return;

  const newNodes = firstChild.splitText(2);
  if (newNodes.length === 0) return;
  const firstNewNode = newNodes[0];
  const sigilNode = new ListItemSigilNode("- ");
  firstNewNode.replace(sigilNode);

  const contentNode = new ListItemContentNode();
  contentNode.append(...liNode.getChildren().slice(1).filter((child) => {
    // Don't take transclusions into the content node
    return !$isTransclusionNode(child);
  }));

  // There might be existing transclusions in the list item node, so we should
  // keep them at the end and insert the content node before them, that means
  // directly after the sigil node.
  sigilNode.insertAfter(contentNode);
};

// same as above, but from sigil's perspective, if content node gets lost
const restoreContentNodeFromSigil = (
  lisNode: ListItemSigilNode,
): void => {
  if (!$isListItemSigilNode(lisNode)) return;
  if (!lisNode.getNextSibling()) {
    const contentNode = new ListItemContentNode();
    lisNode.getParent()!.append(contentNode);
  }
};

/* If list item node starts with content node, create sigil node */
const restoreSigil = (licNode: ListItemContentNode) => {
  const parent = licNode.getParent();
  if (!parent) return;
  if (!$isListItemNode(parent)) return;

  if (parent.getFirstChild() === licNode) {
    const sigilNode = licNode.replace(
      new ListItemSigilNode(licNode.getTextContent()),
    );
    /*
      This transform usually happens when a list item is moved to another line,
      which happens when pressing enter at beginning of list item.
      With current transformation setup, we have to restore the selection
      manually.
    */
    sigilNode.selectStart();
  }
};

const destroyListItemSigil = (lisNode: ListItemSigilNode) => {
  if (
    (!$isListItemNode(lisNode.getParent()))
    && $isListItemSigilNode(lisNode)
    && lisNode.getTextContent() !== "- "
  ) {
    const selection = $getSelection();
    const newTextNode = $createTextNode(lisNode.getTextContent());
    lisNode.replace(newTextNode);
    if ($isRangeSelection(selection)) {
      if (selection.anchor.getNode() === lisNode) {
        selection.anchor.set(
          newTextNode.getKey(),
          selection.anchor.offset,
          "text",
        );
      }

      if (selection.focus.getNode() === lisNode) {
        selection.focus.set(
          newTextNode.getKey(),
          selection.focus.offset,
          "text",
        );
      }

      $setSelection(selection);
    }
    return;
  }

  const previousSibling = lisNode.getPreviousSibling();
  const nextSibling = lisNode.getNextSibling();

  if (
    $isListItemNode(lisNode.getParent())
    && $isListItemSigilNode(lisNode)
    && $isListItemContentNode(previousSibling)
  ) {
    previousSibling.append($createTextNode(lisNode.getTextContent()));
    lisNode.remove();

    if (nextSibling) {
      previousSibling.append($createTextNode(nextSibling.getTextContent()));
      nextSibling.remove();
    }
  }
};

const destroyListItemContent = (licNode: ListItemContentNode) => {
  const parent = licNode.getParent();
  if (parent && !$isListItemNode(parent)) {
    parent.append(...licNode.getChildren());
    licNode.remove();
  }
};

const appendTextNodesToContent = (textNode: TextNode) => {
  if (!$isTextNode(textNode)) return;
  if (!$isListItemNode(textNode.getParent())) return;

  const nextSibling = textNode.getNextSibling();
  if ($isListItemContentNode(nextSibling)) {
    const firstContentChild = nextSibling.getFirstChild();
    if (firstContentChild) {
      firstContentChild.insertBefore(textNode);
    } else {
      nextSibling.append(textNode);
    }
  }

  const previousSibling = textNode.getPreviousSibling();
  if ($isListItemContentNode(previousSibling)) {
    previousSibling.append(textNode);
  }
};

const appendAutoLinkNodesToContent = (textNode: AutoLinkNode) => {
  if (!$isListItemNode(textNode.getParent())) return;

  const nextSibling = textNode.getNextSibling();
  if ($isListItemContentNode(nextSibling)) {
    const firstContentChild = nextSibling.getFirstChild();
    if (firstContentChild) {
      firstContentChild.insertBefore(textNode);
    } else {
      nextSibling.append(textNode);
    }
  }

  const previousSibling = textNode.getPreviousSibling();
  if ($isListItemContentNode(previousSibling)) {
    previousSibling.append(textNode);
  }
};

export function ListItemPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerNodeTransform(
      ListItemNode,
      listItemNodeNormalizationTransform,
    );

    editor.registerNodeTransform(
      ListItemSigilNode,
      destroyListItemSigil,
    );

    editor.registerNodeTransform(
      ListItemContentNode,
      destroyListItemContent,
    );

    editor.registerNodeTransform(
      TextNode,
      appendTextNodesToContent,
    );

    editor.registerNodeTransform(
      AutoLinkNode,
      appendAutoLinkNodesToContent,
    );

    editor.registerNodeTransform(
      BoldNode,
      appendTextNodesToContent,
    );

    editor.registerNodeTransform(
      InlineCodeNode,
      appendTextNodesToContent,
    );

    editor.registerNodeTransform(
      WikiLinkContentNode,
      appendTextNodesToContent,
    );

    editor.registerNodeTransform(
      WikiLinkPunctuationNode,
      appendTextNodesToContent,
    );

    editor.registerNodeTransform(
      ListItemSigilNode,
      restoreContentNodeFromSigil,
    );

    editor.registerNodeTransform(
      ListItemContentNode,
      restoreSigil,
    );
  }, [editor]);

  return null;
}
