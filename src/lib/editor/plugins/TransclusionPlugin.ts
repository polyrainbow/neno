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
import { ListItemNode } from "../nodes/ListItemNode";
import { HeadingNode } from "../nodes/HeadingNode";
import { TransclusionContentGetter } from "../types/TransclusionContentGetter";


const registerBlockNodeTransform = (
  editor: LexicalEditor,
  getTransclusionContent: TransclusionContentGetter,
) => {
  editor.registerNodeTransform(ParagraphNode, (node: ParagraphNode) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });

  editor.registerNodeTransform(ListItemNode, (node: ListItemNode) => {
    refreshTransclusionsForBlock(node, getTransclusionContent);
  });

  editor.registerNodeTransform(HeadingNode, (node: HeadingNode) => {
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
  getTransclusionContent: TransclusionContentGetter
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

