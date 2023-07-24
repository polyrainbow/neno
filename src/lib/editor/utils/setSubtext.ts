import { $createParagraphNode, $createTextNode, RootNode } from "lexical";

export default (root: RootNode, text: string) => {
  root.clear();
  const blocks = text.split("\n");

  blocks.forEach((blockText: string) => {
    const blockNode = $createParagraphNode();

    // Create a new TextNode
    const textNode = $createTextNode(blockText);

    // after setting the state, we need to mark the text node dirty, because
    // it is not transformed yet by the registered node transforms
    // https://lexical.dev/docs/concepts/transforms
    textNode.markDirty();

    blockNode.append(textNode);
    root.append(blockNode);
  });
};
