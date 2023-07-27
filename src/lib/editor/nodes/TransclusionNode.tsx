import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import Icon from "../../../components/Icon";
import { l } from "../../intl";


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
    const Transclusion = ({ slug }) => {
      const [content, setContent] = useState<ReactElement | null>(null);
      const [isError, setIsError] = useState(false);

      useEffect(() => {
        this.__getTransclusionContent(slug)
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
        {
          isError
            ? <div className="not-available-disclaimer">
              <Icon
                icon="warning"
                title={l("editor.transclusion.not-available")}
                size={70}
              />
              {l("editor.transclusion.not-available")}
            </div>
            : (content ?? <div>Loading...</div>)
        }
        <p className="slug">{this.__link}</p>
      </div>;
    };

    return <Transclusion slug={this.__link.substring(1)}/>;
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
