import parseInline from "./parseInline";
import {
  MarkdownBlock,
  MarkdownBlockList,
  MarkdownBlockTable,
  MarkdownBlockType,
  MarkdownColumnAlignment,
  MarkdownListItem,
  MarkdownSpan,
} from "./types";

const ATX_HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
const CODE_FENCE = /^( {0,3})(`{3,}|~{3,})[ \t]*([^`]*)$/;
const HORIZONTAL_RULE
  = /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const QUOTE = /^ {0,3}> ?/;
const LIST_ITEM = /^( *)([-*+]|\d{1,9}[.)])(?:[ \t]+|$)/;
/*
  A list may only interrupt a paragraph if it starts with "1." or a bullet and
  is not empty. Otherwise a wrapped line that happens to begin with a year or
  another number, e.g. "2027. We expect …", would turn into a list.
*/
const LIST_ITEM_INTERRUPTING_PARAGRAPH = /^ {0,3}(?:[-*+]|1[.)])[ \t]+\S/;
const SETEXT_UNDERLINE = /^ {0,3}(=+|-+)[ \t]*$/;
const TABLE_DELIMITER_ROW
  = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;
const TASK_LIST_ITEM = /^\[([ xX])\](?:[ \t]+|$)/;


const isBlank = (line: string): boolean => line.trim().length === 0;


const getIndent = (line: string): number => {
  return line.length - line.trimStart().length;
};


const startsNewBlock = (line: string): boolean => {
  return isBlank(line)
    || ATX_HEADING.test(line)
    || CODE_FENCE.test(line)
    || HORIZONTAL_RULE.test(line)
    || QUOTE.test(line)
    || LIST_ITEM.test(line);
};


const interruptsParagraph = (line: string): boolean => {
  return isBlank(line)
    || ATX_HEADING.test(line)
    || CODE_FENCE.test(line)
    || HORIZONTAL_RULE.test(line)
    || QUOTE.test(line)
    || LIST_ITEM_INTERRUPTING_PARAGRAPH.test(line);
};


const isClosingFence = (line: string, fence: string): boolean => {
  const trimmed = line.trim();
  return trimmed.length >= fence.length
    && Array.from(trimmed).every((char) => char === fence[0]);
};


const splitTableRow = (line: string): string[] => {
  const trimmed = line.trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "");

  const cells: string[] = [];
  let current = "";
  let i = 0;

  while (i < trimmed.length) {
    const char = trimmed[i];

    if (char === "\\" && trimmed[i + 1] === "|") {
      current += "|";
      i += 2;
      continue;
    }

    if (char === "|") {
      cells.push(current.trim());
      current = "";
      i++;
      continue;
    }

    current += char;
    i++;
  }

  cells.push(current.trim());

  return cells;
};


const getColumnAlignment = (
  delimiterCell: string,
): MarkdownColumnAlignment | null => {
  const startsWithColon = delimiterCell.startsWith(":");
  const endsWithColon = delimiterCell.endsWith(":");

  if (startsWithColon && endsWithColon) {
    return MarkdownColumnAlignment.CENTER;
  }

  if (startsWithColon) {
    return MarkdownColumnAlignment.LEFT;
  }

  if (endsWithColon) {
    return MarkdownColumnAlignment.RIGHT;
  }

  return null;
};


interface BlockParseResult<T extends MarkdownBlock> {
  block: T,
  nextIndex: number,
}


const parseTable = (
  lines: string[],
  startIndex: number,
): BlockParseResult<MarkdownBlockTable> => {
  const header = splitTableRow(lines[startIndex]).map(parseInline);
  const alignments = splitTableRow(lines[startIndex + 1])
    .map(getColumnAlignment);

  const rows: MarkdownSpan[][][] = [];
  let i = startIndex + 2;

  while (
    i < lines.length
    && !isBlank(lines[i])
    && lines[i].includes("|")
  ) {
    const cells = splitTableRow(lines[i]);

    while (cells.length < header.length) {
      cells.push("");
    }

    rows.push(cells.slice(0, header.length).map(parseInline));
    i++;
  }

  return {
    block: {
      type: MarkdownBlockType.TABLE,
      header,
      alignments,
      rows,
    },
    nextIndex: i,
  };
};


const createListItem = (itemLines: string[]): MarkdownListItem => {
  const lines = [...itemLines];
  let checked: boolean | null = null;

  const taskMatch = lines[0]?.match(TASK_LIST_ITEM);
  if (taskMatch) {
    checked = taskMatch[1].toLowerCase() === "x";
    lines[0] = lines[0].slice(taskMatch[0].length);
  }

  return {
    checked,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    children: parseBlocks(lines),
  };
};


const parseList = (
  lines: string[],
  startIndex: number,
): BlockParseResult<MarkdownBlockList> => {
  const firstItemMatch = lines[startIndex].match(LIST_ITEM) as RegExpMatchArray;
  const baseIndent = firstItemMatch[1].length;
  const ordered = /\d/.test(firstItemMatch[2]);
  const start = ordered ? parseInt(firstItemMatch[2], 10) : 1;

  const items: MarkdownListItem[] = [];
  let itemLines: string[] = [];
  let contentIndent = firstItemMatch[0].length;
  let i = startIndex;

  const finishItem = () => {
    if (itemLines.length === 0) return;
    items.push(createListItem(itemLines));
    itemLines = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      const nextLine: string | undefined = lines[i + 1];
      const listContinues = typeof nextLine === "string"
        && !isBlank(nextLine)
        && (
          getIndent(nextLine) >= contentIndent
          || (
            LIST_ITEM.test(nextLine)
            && getIndent(nextLine) <= baseIndent
          )
        );

      if (!listContinues) break;

      itemLines.push("");
      i++;
      continue;
    }

    const itemMatch = line.match(LIST_ITEM);

    if (itemMatch && itemMatch[1].length <= baseIndent) {
      const itemIsOrdered = /\d/.test(itemMatch[2]);

      // A marker of the other kind starts a new list.
      if (items.length > 0 && itemIsOrdered !== ordered) break;

      finishItem();
      contentIndent = itemMatch[0].length;
      itemLines.push(line.slice(contentIndent));
      i++;
      continue;
    }

    if (getIndent(line) >= contentIndent) {
      itemLines.push(line.slice(contentIndent));
      i++;
      continue;
    }

    // A less indented line that does not start a block of its own is a lazy
    // continuation of the current item's paragraph.
    if (itemLines.length > 0 && !startsNewBlock(line)) {
      itemLines.push(line.trimStart());
      i++;
      continue;
    }

    break;
  }

  finishItem();

  return {
    block: {
      type: MarkdownBlockType.LIST,
      ordered,
      start,
      items,
    },
    nextIndex: i,
  };
};


const parseBlocks = (lines: string[]): MarkdownBlock[] => {
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i++;
      continue;
    }

    const fenceMatch = line.match(CODE_FENCE);
    if (fenceMatch) {
      const [, indent, fence, info] = fenceMatch;
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !isClosingFence(lines[i], fence)) {
        codeLines.push(
          lines[i].slice(0, indent.length).trim().length === 0
            ? lines[i].slice(indent.length)
            : lines[i],
        );
        i++;
      }

      // skip the closing fence
      i++;

      blocks.push({
        type: MarkdownBlockType.CODE,
        language: info.trim().split(/\s+/)[0] || null,
        code: codeLines.join("\n"),
      });
      continue;
    }

    if (HORIZONTAL_RULE.test(line)) {
      blocks.push({ type: MarkdownBlockType.HORIZONTAL_RULE });
      i++;
      continue;
    }

    const headingMatch = line.match(ATX_HEADING);
    if (headingMatch) {
      const text = (headingMatch[2] ?? "").replace(/[ \t]+#+[ \t]*$/, "");
      blocks.push({
        type: MarkdownBlockType.HEADING,
        level: headingMatch[1].length,
        text: parseInline(text),
      });
      i++;
      continue;
    }

    if (QUOTE.test(line)) {
      const quoteLines: string[] = [];

      while (
        i < lines.length
        && !isBlank(lines[i])
        && !HORIZONTAL_RULE.test(lines[i])
      ) {
        quoteLines.push(lines[i].replace(QUOTE, ""));
        i++;
      }

      blocks.push({
        type: MarkdownBlockType.QUOTE,
        children: parseBlocks(quoteLines),
      });
      continue;
    }

    if (LIST_ITEM.test(line)) {
      const { block, nextIndex } = parseList(lines, i);
      blocks.push(block);
      i = nextIndex;
      continue;
    }

    if (
      line.includes("|")
      && i + 1 < lines.length
      && TABLE_DELIMITER_ROW.test(lines[i + 1])
    ) {
      const { block, nextIndex } = parseTable(lines, i);
      blocks.push(block);
      i = nextIndex;
      continue;
    }

    const paragraphLines = [line];
    let isSetextHeading = false;
    i++;

    while (i < lines.length) {
      const setextMatch = lines[i].match(SETEXT_UNDERLINE);

      if (setextMatch) {
        blocks.push({
          type: MarkdownBlockType.HEADING,
          level: setextMatch[1].startsWith("=") ? 1 : 2,
          text: parseInline(paragraphLines.join("\n")),
        });
        isSetextHeading = true;
        i++;
        break;
      }

      if (
        interruptsParagraph(lines[i])
        || (
          i + 1 < lines.length
          && lines[i].includes("|")
          && TABLE_DELIMITER_ROW.test(lines[i + 1])
        )
      ) {
        break;
      }

      paragraphLines.push(lines[i]);
      i++;
    }

    if (!isSetextHeading) {
      blocks.push({
        type: MarkdownBlockType.PARAGRAPH,
        text: parseInline(paragraphLines.join("\n")),
      });
    }
  }

  return blocks;
};


const removeFrontmatter = (lines: string[]): string[] => {
  if (lines[0]?.trim() !== "---") {
    return lines;
  }

  const endIndex = lines.findIndex(
    (line, index) => index > 0 && /^(?:---|\.\.\.)[ \t]*$/.test(line),
  );

  return endIndex === -1 ? lines : lines.slice(endIndex + 1);
};


const parseMarkdown = (markdown: string): MarkdownBlock[] => {
  const lines = markdown
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "    ")
    .split("\n");

  return parseBlocks(removeFrontmatter(lines));
};


export default parseMarkdown;

export const exportedForTesting = {
  parseBlocks,
  splitTableRow,
};
