import { Fragment, ReactNode, useMemo } from "react";
import parseMarkdown from "../lib/markdown";
import {
  MarkdownBlock,
  MarkdownBlockType,
  MarkdownListItem,
  MarkdownSpan,
  MarkdownSpanType,
} from "../lib/markdown/types";

interface MarkdownPreviewProps {
  markdown: string,
  className?: string,
}


const renderSpans = (spans: MarkdownSpan[]): ReactNode[] => {
  return spans.map((span, index) => {
    const key = span.type + "-" + index;

    switch (span.type) {
    case MarkdownSpanType.TEXT:
      return <Fragment key={key}>{span.text}</Fragment>;
    case MarkdownSpanType.CODE:
      return <code key={key}>{span.text}</code>;
    case MarkdownSpanType.STRONG:
      return <strong key={key}>{renderSpans(span.children)}</strong>;
    case MarkdownSpanType.EMPHASIS:
      return <em key={key}>{renderSpans(span.children)}</em>;
    case MarkdownSpanType.STRIKETHROUGH:
      return <s key={key}>{renderSpans(span.children)}</s>;
    case MarkdownSpanType.LINK:
      return <a
        key={key}
        href={span.url}
        title={span.title ?? undefined}
        target="_blank"
        rel="noreferrer noopener"
      >{renderSpans(span.children)}</a>;
    case MarkdownSpanType.IMAGE:
      return <img
        key={key}
        src={span.url ?? undefined}
        alt={span.alt}
        title={span.title ?? undefined}
        loading="lazy"
      />;
    case MarkdownSpanType.LINE_BREAK:
      return <br key={key} />;
    }
  });
};


const renderListItemContent = (item: MarkdownListItem): ReactNode => {
  const [firstBlock, ...otherBlocks] = item.children;

  // The first paragraph of a list item is rendered without the paragraph
  // element, so that the item text stays on the line of its marker.
  if (firstBlock?.type === MarkdownBlockType.PARAGRAPH) {
    return <>
      {renderSpans(firstBlock.text)}
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      {renderBlocks(otherBlocks)}
    </>;
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderBlocks(item.children);
};


const renderBlock = (block: MarkdownBlock, key: string): ReactNode => {
  switch (block.type) {
  case MarkdownBlockType.HEADING: {
    const HeadingTag = ("h" + Math.min(block.level, 6)) as
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return <HeadingTag key={key}>{renderSpans(block.text)}</HeadingTag>;
  }
  case MarkdownBlockType.PARAGRAPH:
    return <p key={key}>{renderSpans(block.text)}</p>;
  case MarkdownBlockType.CODE:
    return <pre
      key={key}
      data-language={block.language ?? undefined}
    ><code>{block.code}</code></pre>;
  case MarkdownBlockType.QUOTE:
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return <blockquote key={key}>{renderBlocks(block.children)}</blockquote>;
  case MarkdownBlockType.HORIZONTAL_RULE:
    return <hr key={key} />;
  case MarkdownBlockType.LIST: {
    const items = block.items.map((item, index) => {
      return <li
        key={"item-" + index}
        className={
          typeof item.checked === "boolean" ? "task-list-item" : undefined
        }
      >
        {
          typeof item.checked === "boolean"
            ? <input
              type="checkbox"
              checked={item.checked}
              disabled
              readOnly
            />
            : ""
        }
        {renderListItemContent(item)}
      </li>;
    });

    return block.ordered
      ? <ol key={key} start={block.start}>{items}</ol>
      : <ul key={key}>{items}</ul>;
  }
  case MarkdownBlockType.TABLE:
    return <div className="markdown-table-wrapper" key={key}>
      <table>
        <thead>
          <tr>
            {
              block.header.map((cell, index) => <th
                key={"header-cell-" + index}
                style={{ textAlign: block.alignments[index] ?? undefined }}
              >{renderSpans(cell)}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            block.rows.map((row, rowIndex) => <tr key={"row-" + rowIndex}>
              {
                row.map((cell, cellIndex) => <td
                  key={"cell-" + cellIndex}
                  style={{
                    textAlign: block.alignments[cellIndex] ?? undefined,
                  }}
                >{renderSpans(cell)}</td>)
              }
            </tr>)
          }
        </tbody>
      </table>
    </div>;
  }
};


const renderBlocks = (blocks: MarkdownBlock[]): ReactNode[] => {
  return blocks.map(
    (block, index) => renderBlock(block, block.type + "-" + index),
  );
};


const MarkdownPreview = ({
  markdown,
  className,
}: MarkdownPreviewProps) => {
  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);

  return <div
    className={
      className ? "markdown-preview " + className : "markdown-preview"
    }
  >{renderBlocks(blocks)}</div>;
};


export default MarkdownPreview;
