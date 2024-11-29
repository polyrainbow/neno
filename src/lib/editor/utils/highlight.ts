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
