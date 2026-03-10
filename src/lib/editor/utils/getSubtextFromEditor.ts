import { ParagraphNode, RootNode } from "lexical";

export default (root: RootNode) => {
  return root.getChildren()
    .filter((child) => child instanceof ParagraphNode)
    .map((paragraph) => paragraph.getTextContent())
    .join("\n");
};
