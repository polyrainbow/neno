import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { ReactElement, ReactNode, useEffect, useState } from "react";


export class TransclusionNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "transclusion";
  }

  static clone(node: TransclusionNode): TransclusionNode {
    return new TransclusionNode(
      node.__link,
      node.__getTransclusionContent,
      node.__key,
    );
  }

  __link: string;

  constructor(
    link: string,
    getTransclusionContent: (id: string) => Promise<ReactElement>,
    key?: NodeKey,
  ) {
    super(key);
    this.__link = link;
    this.__getTransclusionContent = getTransclusionContent;
  }

  decorate(): ReactNode {
    const transclusionId = this.__link.substring(1);
    const TransclusionContent = () => {
      const [content, setContent] = useState<ReactElement | null>(null);

      useEffect(() => {
        this.__getTransclusionContent(transclusionId)
          .then((content) => {
            setContent(content);
          });
      }, [transclusionId]);

      return content
        ? content
        : <div>Loading...</div>;
    };

    return <div className="transclusion" data-transclusion-id={transclusionId}>
      <TransclusionContent />
      <p className="slug">{this.__link}</p>
    </div>;
  }

  createDOM(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("transclusion-wrapper");
    return div;
  }


  updateDOM(): false {
    return false;
  }

  static importJSON(): LexicalNode {
    throw new Error("Method not implemented.");
  }

  exportJSON(): SerializedLexicalNode {
    return super.exportJSON();
  }

  isInline(): boolean {
    return false;
  }
}

export function $createTransclusionNode(
  link: string,
  getTransclusionContent: (id: string) => Promise<ReactElement>,
): TransclusionNode {
  return new TransclusionNode(link, getTransclusionContent);
}

export function $isTransclusionNode(
  node: LexicalNode | null | undefined,
): node is TransclusionNode {
  return node instanceof TransclusionNode;
}
