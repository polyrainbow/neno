import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { ReactNode, useState } from "react";
import { getIconSrc } from "../../utils";
import { Output } from "../../script-worker/outputTypes";
import ScriptOutputRenderer from "../../../components/ScriptOutput";


const outputAsPlainText = (output: Output): string => {
  return output.map((segment) => {
    return segment.type === "text" ? segment.value : segment.title;
  }).join("");
};


const ScriptOutput = ({
  output,
  isExecuting,
}: {
  output: Output;
  isExecuting: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputAsPlainText(output)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (isExecuting) {
    return <div className="script-output">
      <span className="script-output-status">
        Executing...
      </span>
    </div>;
  }

  return <div className="script-output">
    <pre className="script-output-content">
      <ScriptOutputRenderer output={output} />
    </pre>
    <button
      className="script-output-copy-button"
      onClick={handleCopy}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      <img
        src={getIconSrc(
          copied ? "done" : "content_copy",
        )}
        alt=""
        className="svg-icon"
        aria-hidden="true"
      />
    </button>
  </div>;
};


export class ScriptOutputNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "script-output";
  }

  static clone(node: ScriptOutputNode): ScriptOutputNode {
    return new ScriptOutputNode(
      node.__output,
      node.__isExecuting,
      node.__key,
    );
  }

  __output: Output;
  __isExecuting: boolean;

  constructor(
    output: Output,
    isExecuting: boolean,
    key?: NodeKey,
  ) {
    super(key);
    this.__output = output;
    this.__isExecuting = isExecuting;
  }

  setOutput(output: Output): void {
    const writable = this.getWritable();
    writable.__output = output;
    writable.__isExecuting = false;
  }

  setExecuting(): void {
    const writable = this.getWritable();
    writable.__isExecuting = true;
  }

  decorate(): ReactNode {
    return <ScriptOutput
      output={this.__output}
      isExecuting={this.__isExecuting}
    />;
  }

  createDOM(): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("script-output-wrapper");
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

  getTextContent(): string {
    return "";
  }
}


export function $createScriptOutputNode(
  output: Output = [],
  isExecuting: boolean = true,
): ScriptOutputNode {
  return new ScriptOutputNode(output, isExecuting);
}


export function $isScriptOutputNode(
  node: LexicalNode | null | undefined,
): node is ScriptOutputNode {
  return node instanceof ScriptOutputNode;
}
