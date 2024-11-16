import {
  $createTextNode,
  $isTextNode,
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



const listItemNodeNormalizationTransform = (liNode: ListItemNode): void => {
  if (!$isListItemNode(liNode)) return;
  const firstChild = liNode.getFirstChild();
  if (!firstChild) return;
  if (!(firstChild instanceof TextNode)) return;
  if ($isListItemSigilNode(firstChild)) return;

  const nodeText = firstChild.getTextContent();
  if (nodeText[0] !== "-" || nodeText[1] !== " ") return;

  const newNodes = firstChild.splitText(2);
  if (newNodes.length === 0) return;
  const firstNewNode = newNodes[0];
  firstNewNode.replace(new ListItemSigilNode("- "));

  const contentNode = new ListItemContentNode();
  contentNode.append(...liNode.getChildren().slice(1));
  liNode.append(contentNode);
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
    || lisNode.getTextContent() !== "- "
  ) {
    lisNode.replace($createTextNode(lisNode.getTextContent()));
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


export function ListItemPlugin(): JSX.Element | null {
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
