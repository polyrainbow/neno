import Prism, { Token, TokenStream } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markdown";

Prism.languages.run = Prism.languages.javascript;
Prism.languages.mod = Prism.languages.javascript;

export interface TokenSpan {
  start: number;
  end: number;
  type: string;
}

const walk = (
  stream: TokenStream,
  offset: number,
  spans: TokenSpan[],
  inheritedType: string | null,
): number => {
  if (typeof stream === "string") {
    if (inheritedType !== null && stream.length > 0) {
      spans.push({
        start: offset,
        end: offset + stream.length,
        type: inheritedType,
      });
    }
    return offset + stream.length;
  }

  if (Array.isArray(stream)) {
    let cursor = offset;
    for (const item of stream) {
      cursor = walk(item, cursor, spans, inheritedType);
    }
    return cursor;
  }

  return walk(stream.content, offset, spans, stream.type);
};

export const tokenizeCode = (
  code: string,
  language: string,
): TokenSpan[] => {
  const grammar = Prism.languages[language];
  if (!grammar) return [];
  const tokens = Prism.tokenize(code, grammar) as Array<string | Token>;
  const spans: TokenSpan[] = [];
  walk(tokens, 0, spans, null);
  return spans;
};
