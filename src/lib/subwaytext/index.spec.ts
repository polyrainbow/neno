import { Block, BlockType } from "./types/Block.js";
import subwaytext from "./index.js";
import { SpanType } from "./types/SpanType.js";
import serialize from "./serialize.js";
import { describe, it, expect } from "vitest";

describe("subwaytext", () => {
  it("should parse basic documents correctly", () => {
    const input = `#Heading
    

#       another heading
some
multiline
text

-List
-  unordered
1.ordered list
2. another item
3..item3


/files/x
/files/y.mp3     Some description
here starts another paragraph

\`\`\`javascript
and here we have some multiline code


const x = [{}];
!@#$%&*()
\`\`\`

https://example.com Link to example.com
A paragraph with a https://link.com and a /slashlink`;

    const result: Block[] = [
      {
        type: BlockType.HEADING,
        data: {
          whitespace: "",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "Heading",
            },
          ],
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "    ",
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.HEADING,
        data: {
          whitespace: "       ",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "another heading",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "some",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "multiline",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "text",
            },
          ],
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.UNORDERED_LIST_ITEM,
        data: {
          whitespace: "",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "List",
            },
          ],
        },
      },
      {
        type: BlockType.UNORDERED_LIST_ITEM,
        data: {
          whitespace: "  ",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "unordered",
            },
          ],
        },
      },
      {
        type: BlockType.ORDERED_LIST_ITEM,
        data: {
          whitespace: "",
          index: "1",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "ordered list",
            },
          ],
        },
      },
      {
        type: BlockType.ORDERED_LIST_ITEM,
        data: {
          whitespace: " ",
          index: "2",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "another item",
            },
          ],
        },
      },
      {
        type: BlockType.ORDERED_LIST_ITEM,
        data: {
          whitespace: "",
          index: "3",
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: ".item3",
            },
          ],
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.SLASHLINK,
              text: "/files/x",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.SLASHLINK,
              text: "/files/y.mp3",
            },
            {
              type: SpanType.NORMAL_TEXT,
              text: "     Some description",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "here starts another paragraph",
            },
          ],
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.CODE,
        data: {
          // eslint-disable-next-line @stylistic/max-len
          code: "and here we have some multiline code\n\n\nconst x = [{}];\n!@#$%&*()",
          contentType: "javascript",
          whitespace: "",
        },
      },
      {
        type: BlockType.EMPTY,
        data: {
          whitespace: "",
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.HYPERLINK,
              text: "https://example.com",
            },
            {
              type: SpanType.NORMAL_TEXT,
              text: " Link to example.com",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "A paragraph with a ",
            },
            {
              type: SpanType.HYPERLINK,
              text: "https://link.com",
            },
            {
              type: SpanType.NORMAL_TEXT,
              text: " and a ",
            },
            {
              type: SpanType.SLASHLINK,
              text: "/slashlink",
            },
          ],
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(result);
  });

  it(
    "should unescape escaped code block signals within a code block",
    () => {
      const input = `\`\`\`
\\\`\`\`
code
\\\`\`\`
\`\`\``;

      const result = [{
        type: BlockType.CODE,
        data: {
          code: "```\ncode\n```",
          contentType: "",
          whitespace: "",
        },
      }];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it(
    "should recognize key-value blocks",
    () => {
      const input = `$Q What is Subtext?
$check-back-on       2030-01-01
$like
$ no-kv`;

      const result = [
        {
          type: BlockType.KEY_VALUE_PAIR,
          data: {
            key: "Q",
            value: [
              {
                type: SpanType.NORMAL_TEXT,
                text: "What is Subtext?",
              },
            ],
            whitespace: " ",
          },
        },
        {
          type: BlockType.KEY_VALUE_PAIR,
          data: {
            key: "check-back-on",
            value: [
              {
                type: SpanType.NORMAL_TEXT,
                text: "2030-01-01",
              },
            ],
            whitespace: "       ",
          },
        },
        {
          type: BlockType.KEY_VALUE_PAIR,
          data: {
            key: "like",
            value: [],
            whitespace: "",
          },
        },
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                type: SpanType.NORMAL_TEXT,
                text: "$ no-kv",
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it("should recognize a code block after a paragraph block", () => {
    const input = `\`\`\`
code
\`\`\`
text
\`\`\`
code
\`\`\``;

    const result = [
      {
        type: BlockType.CODE,
        data: {
          code: "code",
          contentType: "",
          whitespace: "",
        },
      },
      {
        data: {
          text: [
            {
              text: "text",
              type: "NORMAL_TEXT",
            },
          ],
        },
        type: BlockType.PARAGRAPH,
      },
      {
        type: BlockType.CODE,
        data: {
          code: "code",
          contentType: "",
          whitespace: "",
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(result);
  });


  it("should not recognize paragraph blocks with $ as key value blocks", () => {
    const input = "A paragraph with $dollarsign somewhere.";

    const result = [
      {
        data: {
          text: [
            {
              text: "A paragraph with $dollarsign somewhere.",
              type: "NORMAL_TEXT",
            },
          ],
        },
        type: BlockType.PARAGRAPH,
      },
    ];

    expect(subwaytext(input)).toStrictEqual(result);
  });

  it("should recognize single-line quote blocks", () => {
    const input = ">   This is a single-line quote block.";

    const result = [
      {
        type: BlockType.QUOTE,
        data: {
          whitespace: "   ",
          text: [
            {
              text: "This is a single-line quote block.",
              type: "NORMAL_TEXT",
            },
          ],
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(result);
  });


  it("should recognize multiline quote blocks", () => {
    const input = `>   This is a quote block
> another one
After that, a text block.`;

    const result = [
      {
        type: BlockType.QUOTE,
        data: {
          whitespace: "   ",
          text: [
            {
              text: "This is a quote block",
              type: "NORMAL_TEXT",
            },
          ],
        },
      },
      {
        type: BlockType.QUOTE,
        data: {
          whitespace: " ",
          text: [
            {
              text: "another one",
              type: "NORMAL_TEXT",
            },
          ],
        },
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              text: "After that, a text block.",
              type: "NORMAL_TEXT",
            },
          ],
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(result);
  });

  it(
    "allow end of code block backticks to be followed by whitespace",
    () => {
      const input = `\`\`\`
some code
\`\`\`      
normal text`;

      const result = [
        {
          type: BlockType.CODE,
          data: {
            code: "some code",
            contentType: "",
            whitespace: "",
          },
        },
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                text: "normal text",
                type: "NORMAL_TEXT",
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );


  it(
    "should parse wikilinks",
    () => {
      const input = "Some text with a [[nice Wikilink]] in between.";

      const result = [
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                text: "Some text with a ",
                type: "NORMAL_TEXT",
              },
              {
                text: "[[nice Wikilink]]",
                type: "WIKILINK",
              },
              {
                text: " in between.",
                type: "NORMAL_TEXT",
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it(
    "should parse wikilinks with a slash inside",
    () => {
      const input
        = "Other [[Thinking tools / Tools for Thought]] similar to [[NENO]]";

      const result = [
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                text: "Other ",
                type: "NORMAL_TEXT",
              },
              {
                text: "[[Thinking tools / Tools for Thought]]",
                type: "WIKILINK",
              },
              {
                text: " similar to ",
                type: "NORMAL_TEXT",
              },
              {
                text: "[[NENO]]",
                type: "WIKILINK",
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it(
    "should not detect a slashlink when single slash is followed by a space",
    () => {
      const input = "Thinking tools / Tools for Thought";

      const result = [
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                text: "Thinking tools / Tools for Thought",
                type: SpanType.NORMAL_TEXT,
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it(
    "should detect a wikilink when the line starts with a URL",
    () => {
      const input = "\nhttps://example.com [[Wikilink]]";

      const result = [
        {
          type: BlockType.EMPTY,
          data: {
            whitespace: "",
          },
        },
        {
          type: BlockType.PARAGRAPH,
          data: {
            text: [
              {
                text: "https://example.com",
                type: SpanType.HYPERLINK,
              },
              {
                text: " ",
                type: SpanType.NORMAL_TEXT,
              },
              {
                text: "[[Wikilink]]",
                type: SpanType.WIKILINK,
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );

  it("should round-trip basic documents correctly", () => {
    const input = `#Heading
    

#       another heading
some
multiline
text

-List
-  unordered
1.ordered list
2. another item
3..item3


/files/x
/files/y.mp3     Some description
here starts another paragraph

\`\`\`javascript
and here we have some multiline code


const x = [{}];
!@#$%&*()
\`\`\`

https://example.com Link to example.com
A paragraph with a https://link.com and a /slashlink`;

    const result = subwaytext(input);
    const output = serialize(result);
    expect(output).toStrictEqual(input);
  });


  it("should round-trip key-value pairs correctly", () => {
    const input = `$Q What is Subtext?
$check-back-on       2030-01-01
$like
$ no-kv`;

    const result = subwaytext(input);
    const output = serialize(result);
    expect(output).toStrictEqual(input);
  });


  it("should preserve all digits in ordered lists", () => {
    const input = `
1.ordered list
02. another item
003.item3
07.06.2021`;

    const result = subwaytext(input);
    const output = serialize(result);
    expect(output).toStrictEqual(input);
  });


  it("should preserve backslash before code fences", () => {
    const input = `\`\`\`
\\\`\`\`
code inside code
\\\`\`\`
\`\`\``;

    const result = subwaytext(input);
    const output = serialize(result);
    expect(output).toStrictEqual(input);
  });

  it("should recognize wikilinks without space in between", () => {
    const input = "[[link 1]][[link 2]][[link 3]]";

    const expectedResult = [
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.WIKILINK,
              text: "[[link 1]]",
            },
            {
              type: SpanType.WIKILINK,
              text: "[[link 2]]",
            },
            {
              type: SpanType.WIKILINK,
              text: "[[link 3]]",
            },
          ],
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(expectedResult);
  });

  it("should recognize wikilinks with letters in between", () => {
    const input = "[[link 1]]a[[link 2]]a[[link 3]]";

    const expectedResult = [
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.WIKILINK,
              text: "[[link 1]]",
            },
            {
              type: SpanType.NORMAL_TEXT,
              text: "a",
            },
            {
              type: SpanType.WIKILINK,
              text: "[[link 2]]",
            },
            {
              type: SpanType.NORMAL_TEXT,
              text: "a",
            },
            {
              type: SpanType.WIKILINK,
              text: "[[link 3]]",
            },
          ],
        },
      },
    ];

    expect(subwaytext(input)).toStrictEqual(expectedResult);
  });
});
