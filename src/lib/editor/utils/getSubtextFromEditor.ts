import { RootNode } from "lexical";

export default (root: RootNode) => {
  return root.getChildren()
    .map((paragraph) => paragraph.getTextContent())
    .join("\n");
};
