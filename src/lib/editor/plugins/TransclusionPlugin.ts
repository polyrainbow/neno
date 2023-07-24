import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { ReactElement, useEffect } from "react";
import {
  TransclusionNode,
} from "../nodes/TransclusionNode";
import { $isParagraphNode, LexicalEditor, ParagraphNode } from "lexical";
import refreshTransclusionsForBlock
  from "../utils/refreshTransclusionsForBlock";
import { AutoLinkNode } from "@lexical/link";


const registerBlockNodeTransform = (
  editor: LexicalEditor,
  getTransclusionContent: (id: string) => Promise<ReactElement>,
) => {
  editor.registerNodeTransform(ParagraphNode, (node: ParagraphNode) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });

  editor.registerNodeTransform(AutoLinkNode, (node: AutoLinkNode) => {
    let block = node.getParent();
    while (!$isParagraphNode(block)) {
      block = block.getParent();
    }
    refreshTransclusionsForBlock(block, getTransclusionContent);
  });
};


interface TransclusionPluginProps {
  getTransclusionContent: (id: string) => Promise<ReactElement>
}


export default function TransclusionPlugin({
  getTransclusionContent,
}: TransclusionPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TransclusionNode])) {
      throw new Error("Transclusion plugin is missing required nodes");
    }

    return registerBlockNodeTransform(
      editor,
      getTransclusionContent,
    );
  }, [editor]);

  return null;
}

