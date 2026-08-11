import { describe, it, expect } from "vitest";
import parseMarkdown from "./index";
import {
  MarkdownBlock,
  MarkdownBlockList,
  MarkdownBlockTable,
  MarkdownBlockType,
  MarkdownColumnAlignment,
  MarkdownSpan,
  MarkdownSpanType,
} from "./types";

const getPlainText = (spans: MarkdownSpan[]): string => {
  return spans.map((span) => {
    switch (span.type) {
    case MarkdownSpanType.TEXT:
    case MarkdownSpanType.CODE:
      return span.text;
    case MarkdownSpanType.IMAGE:
      return span.alt;
    case MarkdownSpanType.LINE_BREAK:
      return "\n";
    default:
      return getPlainText(span.children);
    }
  }).join("");
};

const getInlineSpans = (block: MarkdownBlock): MarkdownSpan[] => {
  if (
    block.type === MarkdownBlockType.PARAGRAPH
    || block.type === MarkdownBlockType.HEADING
  ) {
    return block.text;
  }

  throw new Error("Block has no inline content");
};


describe("markdown parser", () => {
  it("should parse ATX headings", () => {
    const blocks = parseMarkdown("# Title\n\n### Sub *title* ###");

    expect(blocks.length).toBe(2);
    expect(blocks[0].type).toBe(MarkdownBlockType.HEADING);
    expect(getPlainText(getInlineSpans(blocks[0]))).toBe("Title");
    expect(getPlainText(getInlineSpans(blocks[1]))).toBe("Sub title");
    expect(
      blocks[1].type === MarkdownBlockType.HEADING && blocks[1].level,
    ).toBe(3);
  });

  it("should parse setext headings", () => {
    const blocks = parseMarkdown("Title\n=====\n\nSubtitle\n---");

    expect(blocks.length).toBe(2);
    expect(
      blocks[0].type === MarkdownBlockType.HEADING && blocks[0].level,
    ).toBe(1);
    expect(
      blocks[1].type === MarkdownBlockType.HEADING && blocks[1].level,
    ).toBe(2);
  });

  it("should join the lines of a paragraph", () => {
    const blocks = parseMarkdown("one\ntwo\n\nthree");

    expect(blocks.length).toBe(2);
    expect(getPlainText(getInlineSpans(blocks[0]))).toBe("one\ntwo");
    expect(getPlainText(getInlineSpans(blocks[1]))).toBe("three");
  });

  it("should parse hard line breaks", () => {
    const blocks = parseMarkdown("one  \ntwo");
    const spans = getInlineSpans(blocks[0]);

    expect(spans.length).toBe(3);
    expect(spans[1].type).toBe(MarkdownSpanType.LINE_BREAK);
  });

  it("should parse emphasis and strong emphasis", () => {
    const spans = getInlineSpans(
      parseMarkdown("*a* **b** ***c*** ~~d~~ _e_")[0],
    );

    expect(spans[0].type).toBe(MarkdownSpanType.EMPHASIS);
    expect(spans[2].type).toBe(MarkdownSpanType.STRONG);
    expect(spans[4].type).toBe(MarkdownSpanType.STRONG);
    expect(
      spans[4].type === MarkdownSpanType.STRONG
      && spans[4].children[0].type,
    ).toBe(MarkdownSpanType.EMPHASIS);
    expect(spans[6].type).toBe(MarkdownSpanType.STRIKETHROUGH);
    expect(spans[8].type).toBe(MarkdownSpanType.EMPHASIS);
  });

  it("should not create emphasis within words with underscores", () => {
    const spans = getInlineSpans(parseMarkdown("some_var_name")[0]);

    expect(spans.length).toBe(1);
    expect(spans[0].type).toBe(MarkdownSpanType.TEXT);
  });

  it("should parse nested emphasis", () => {
    const spans = getInlineSpans(parseMarkdown("*a **b** c*")[0]);

    expect(spans.length).toBe(1);
    expect(spans[0].type).toBe(MarkdownSpanType.EMPHASIS);
    expect(getPlainText(spans)).toBe("a b c");
  });

  it("should leave unmatched delimiters as text", () => {
    const spans = getInlineSpans(parseMarkdown("2 * 3 * 4 = 24")[0]);

    expect(getPlainText(spans)).toBe("2 * 3 * 4 = 24");
    expect(
      spans.every((span) => span.type === MarkdownSpanType.TEXT),
    ).toBe(true);
  });

  it("should parse code spans", () => {
    const spans = getInlineSpans(parseMarkdown("use `const x = *y*;`")[0]);

    expect(spans[1].type).toBe(MarkdownSpanType.CODE);
    expect(
      spans[1].type === MarkdownSpanType.CODE && spans[1].text,
    ).toBe("const x = *y*;");
  });

  it("should respect backslash escapes", () => {
    const spans = getInlineSpans(parseMarkdown("\\*not emphasized\\*")[0]);

    expect(spans.length).toBe(1);
    expect(getPlainText(spans)).toBe("*not emphasized*");
  });

  it("should parse links, autolinks and images", () => {
    const spans = getInlineSpans(parseMarkdown(
      "[label](https://example.com \"title\") <https://neno.land> "
      + "![alt text](image.png)",
    )[0]);

    expect(spans[0].type).toBe(MarkdownSpanType.LINK);
    expect(
      spans[0].type === MarkdownSpanType.LINK && spans[0].url,
    ).toBe("https://example.com");
    expect(
      spans[0].type === MarkdownSpanType.LINK && spans[0].title,
    ).toBe("title");
    expect(spans[2].type).toBe(MarkdownSpanType.LINK);
    expect(spans[4].type).toBe(MarkdownSpanType.IMAGE);
    expect(
      spans[4].type === MarkdownSpanType.IMAGE && spans[4].url,
    ).toBe("image.png");
  });

  it("should not create links with dangerous schemes", () => {
    const spans = getInlineSpans(
      parseMarkdown("[click me](javascript:alert(1))")[0],
    );

    expect(
      spans.every((span) => span.type !== MarkdownSpanType.LINK),
    ).toBe(true);
    expect(getPlainText(spans)).toBe("click me");
  });

  it("should not create links with obfuscated dangerous schemes", () => {
    const spans = getInlineSpans(
      parseMarkdown("[click me](java\tscript:alert(1))")[0],
    );

    expect(
      spans.every((span) => span.type !== MarkdownSpanType.LINK),
    ).toBe(true);
  });

  it("should parse fenced code blocks", () => {
    const blocks = parseMarkdown(
      "```js\nconst x = 1;\n\n# not a heading\n```\n",
    );

    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe(MarkdownBlockType.CODE);
    expect(
      blocks[0].type === MarkdownBlockType.CODE && blocks[0].language,
    ).toBe("js");
    expect(
      blocks[0].type === MarkdownBlockType.CODE && blocks[0].code,
    ).toBe("const x = 1;\n\n# not a heading");
  });

  it("should parse horizontal rules", () => {
    const blocks = parseMarkdown("a\n\n---\n\nb\n\n***\n");

    expect(blocks[1].type).toBe(MarkdownBlockType.HORIZONTAL_RULE);
    expect(blocks[3].type).toBe(MarkdownBlockType.HORIZONTAL_RULE);
  });

  it("should parse block quotes", () => {
    const blocks = parseMarkdown("> quoted **text**\n> more text\n");

    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe(MarkdownBlockType.QUOTE);
    const children = blocks[0].type === MarkdownBlockType.QUOTE
      ? blocks[0].children
      : [];
    expect(children.length).toBe(1);
    expect(getPlainText(getInlineSpans(children[0])))
      .toBe("quoted text\nmore text");
  });

  it("should parse unordered lists", () => {
    const blocks = parseMarkdown("- one\n- two\n- three\n");
    const list = blocks[0] as MarkdownBlockList;

    expect(list.type).toBe(MarkdownBlockType.LIST);
    expect(list.ordered).toBe(false);
    expect(list.items.length).toBe(3);
    expect(getPlainText(getInlineSpans(list.items[1].children[0])))
      .toBe("two");
  });

  it("should parse ordered lists with a start index", () => {
    const blocks = parseMarkdown("3. three\n4. four\n");
    const list = blocks[0] as MarkdownBlockList;

    expect(list.ordered).toBe(true);
    expect(list.start).toBe(3);
    expect(list.items.length).toBe(2);
  });

  it("should parse nested lists", () => {
    const blocks = parseMarkdown("- one\n  - nested\n  - nested 2\n- two\n");
    const list = blocks[0] as MarkdownBlockList;

    expect(list.items.length).toBe(2);
    expect(list.items[0].children.length).toBe(2);

    const nestedList = list.items[0].children[1] as MarkdownBlockList;
    expect(nestedList.type).toBe(MarkdownBlockType.LIST);
    expect(nestedList.items.length).toBe(2);
  });

  it("should parse task list items", () => {
    const blocks = parseMarkdown("- [x] done\n- [ ] todo\n");
    const list = blocks[0] as MarkdownBlockList;

    expect(list.items[0].checked).toBe(true);
    expect(list.items[1].checked).toBe(false);
    expect(getPlainText(getInlineSpans(list.items[0].children[0])))
      .toBe("done");
  });

  it("should end a list at a following paragraph", () => {
    const blocks = parseMarkdown("- one\n\nparagraph\n");

    expect(blocks.length).toBe(2);
    expect(blocks[0].type).toBe(MarkdownBlockType.LIST);
    expect(blocks[1].type).toBe(MarkdownBlockType.PARAGRAPH);
  });

  it("should parse tables including alignments", () => {
    const blocks = parseMarkdown(
      "| a | b | c |\n| :- | :-: | -: |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |\n",
    );
    const table = blocks[0] as MarkdownBlockTable;

    expect(table.type).toBe(MarkdownBlockType.TABLE);
    expect(table.header.length).toBe(3);
    expect(table.alignments).toEqual([
      MarkdownColumnAlignment.LEFT,
      MarkdownColumnAlignment.CENTER,
      MarkdownColumnAlignment.RIGHT,
    ]);
    expect(table.rows.length).toBe(2);
    expect(getPlainText(table.rows[1][2])).toBe("6");
  });

  it("should ignore YAML frontmatter", () => {
    const blocks = parseMarkdown("---\ntitle: Test\n---\n\n# Heading\n");

    expect(blocks.length).toBe(1);
    expect(blocks[0].type).toBe(MarkdownBlockType.HEADING);
  });

  it("should handle an empty document", () => {
    expect(parseMarkdown("")).toEqual([]);
    expect(parseMarkdown("\n\n  \n")).toEqual([]);
  });
});
