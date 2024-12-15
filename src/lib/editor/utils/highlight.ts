export const highlightHeadingSigils = () => {
  const headingElements = document.querySelectorAll(
    "div[data-lexical-editor] .s-heading",
  );

  const ranges: Range[] = [];
  Array.from(headingElements).forEach((element) => {
    const span = element.children[0];
    const textNode = span.childNodes[0];
    const range = new Range();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    ranges.push(range);
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("heading-block-sigil", highlight);
};

export const highlightQuoteBlockSigils = () => {
  const quoteBlocks = document.querySelectorAll(
    "div[data-lexical-editor] .quote-block",
  );

  const ranges: Range[] = [];
  Array.from(quoteBlocks).forEach((element) => {
    const span = element.children[0];
    const textNode = span.childNodes[0];
    const range = new Range();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    ranges.push(range);
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("quote-block-sigil", highlight);
};


export const highlightInlineCodeSigils = () => {
  const inlineCodeSpans = document.querySelectorAll(
    "div[data-lexical-editor] .inline-code",
  );

  const ranges: Range[] = [];
  Array.from(inlineCodeSpans).forEach((span) => {
    const textNode = span.childNodes[0];
    const rangeStart = new Range();
    rangeStart.setStart(textNode, 0);
    rangeStart.setEnd(textNode, 1);
    ranges.push(rangeStart);

    const textContent = textNode.textContent;

    if (textContent) {
      const rangeEnd = new Range();
      rangeEnd.setStart(textNode, textContent.length - 1);
      rangeEnd.setEnd(textNode, textContent.length);
      ranges.push(rangeEnd);
    }
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("inline-code-sigil", highlight);
};
