import {
  $createRangeSelection,
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

  // Save selection info before splitting, so we can restore cursor position
  // after the transform restructures the node tree.
  const selection = $getSelection();
  let savedOffset: number | null = null;
  if ($isRangeSelection(selection)) {
    if (selection.anchor.key === firstChild.getKey()) {
      savedOffset = selection.anchor.offset;
    } else if (selection.isCollapsed()) {
      // The anchor might reference an orphaned node with identical text
      // (e.g., from a paste that triggered restoreSigil, where Lexical's
      // internal selection management reverted the key after replace).
      try {
        const anchorNode = selection.anchor.getNode();
        if (
          $isTextNode(anchorNode)
          && anchorNode.getTextContent() === nodeText
        ) {
          savedOffset = selection.anchor.offset;
        }
      } catch {
        // Node was removed from tree, use anchor.offset directly since
        // the text content was the same before removal
        savedOffset = selection.anchor.offset;
      }
    }
  }

  const newNodes = firstChild.splitText(2);
  if (newNodes.length === 0) return;
  const firstNewNode = newNodes[0];
  const sigilNode = new ListItemSigilNode("- ");
  firstNewNode.replace(sigilNode);

  // Collect children to move before inserting the content node, so that
  // transclusion filtering uses the correct index range.
  const childrenToMove = liNode.getChildren().slice(1).filter((child) => {
    // Don't take transclusions into the content node
    return !$isTransclusionNode(child);
  });

  const contentNode = new ListItemContentNode();
  // There might be existing transclusions in the list item node, so we should
  // keep them at the end and insert the content node before them, that means
  // directly after the sigil node.
  sigilNode.insertAfter(contentNode);
  contentNode.append(...childrenToMove);

  // Restore cursor into the content node when it was in the content portion
  // of the original text (offset > 2). splitText + replace + reparenting can
  // lose the selection reference.
  if (
    savedOffset !== null
    && savedOffset > 2
    && $isRangeSelection(selection)
  ) {
    const contentChild = contentNode.getFirstChild();
    if (contentChild) {
      const targetOffset = Math.min(
        savedOffset - 2,
        contentChild.getTextContentSize(),
      );
      // Use $setSelection with a brand new selection to ensure Lexical's DOM
      // reconciler picks up the change. Modifying the existing selection
      // object via anchor.set/focus.set can be reverted by Lexical's internal
      // selection management between transform passes.
      const newSelection = $createRangeSelection();
      newSelection.anchor.set(contentChild.getKey(), targetOffset, "text");
      newSelection.focus.set(contentChild.getKey(), targetOffset, "text");
      $setSelection(newSelection);
    }
  }
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
    // Check whether the cursor is inside the content node's subtree.
    // If so, save the offset relative to the content's full text so we can
    // transfer it to the replacement sigil node. Without this, the selection
    // would reference destroyed child nodes after the replace.
    const selection = $getSelection();
    let savedOffset: number | null = null;

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      if (licNode.isParentOf(anchorNode)) {
        // Calculate text offset from start of content node to cursor position.
        let offset = selection.anchor.offset;
        if ($isTextNode(anchorNode)) {
          let preceding = anchorNode.getPreviousSibling();
          while (preceding) {
            offset += preceding.getTextContentSize();
            preceding = preceding.getPreviousSibling();
          }
        }
        savedOffset = offset;
      }
    }

    const sigilNode = licNode.replace(
      new ListItemSigilNode(licNode.getTextContent()),
    );

    if (savedOffset !== null && $isRangeSelection(selection)) {
      // Transfer cursor position onto the new sigil node.
      // The normalization transform will later re-split the sigil and
      // move the cursor into the content portion.
      selection.anchor.set(sigilNode.getKey(), savedOffset, "text");
      selection.focus.set(sigilNode.getKey(), savedOffset, "text");
    } else {
      /*
        This branch handles the case when a list item is moved to another line
        (pressing enter at beginning of list item). With the current
        transformation setup, we have to restore the selection manually.
      */
      sigilNode.selectStart();
    }
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
