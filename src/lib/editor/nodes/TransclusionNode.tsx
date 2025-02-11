import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import Icon from "../../../components/Icon";
import { l } from "../../intl";
import { Slug } from "../../notes/types/Slug";
import { TransclusionContentGetter } from "../types/TransclusionContentGetter";


const Transclusion = ({
  slug,
  getTransclusionContent,
}: {
  slug: Slug,
  getTransclusionContent: TransclusionContentGetter,
}) => {
  const [content, setContent] = useState<ReactElement | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getTransclusionContent(slug)
      .then((content) => {
        setContent(content);
        setIsError(false);
      })
      .catch(() => {
        setContent(<p>Not available.</p>);
        setIsError(true);
      });
  }, [slug]);

  return <div
    className={"transclusion " + (isError ? "unavailable" : "")}
    data-transclusion-id={slug}
  >
    <p className="slug">/{slug}</p>
    {
      isError
        ? <div className="not-available-disclaimer">
          <Icon
            icon="warning"
          />
          {l("editor.transclusion.not-available")}
        </div>
        : (content ?? <div>Loading...</div>)
    }
  </div>;
};

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
  __getTransclusionContent: TransclusionContentGetter;

  constructor(
    link: string,
    getTransclusionContent: TransclusionContentGetter,
    key?: NodeKey,
  ) {
    super(key);
    this.__link = link;
    this.__getTransclusionContent = getTransclusionContent;
  }

  decorate(): ReactNode {
    return <Transclusion
      slug={this.__link.substring(1)}
      getTransclusionContent={this.__getTransclusionContent}
    />;
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
  getTransclusionContent: TransclusionContentGetter,
): TransclusionNode {
  return new TransclusionNode(link, getTransclusionContent);
}

export function $isTransclusionNode(
  node: LexicalNode | null | undefined,
): node is TransclusionNode {
  return node instanceof TransclusionNode;
}
