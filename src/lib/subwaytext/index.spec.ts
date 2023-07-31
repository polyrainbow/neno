import { Block, BlockType, ListBlockStyle } from "./interfaces/Block.js";
import subwaytext from "./index.js";
import { SpanType } from "./interfaces/SpanType.js";


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
          text: "Heading",
        },
      },
      {
        type: BlockType.HEADING,
        data: {
          text: "another heading",
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
        type: BlockType.LIST,
        data: {
          type: ListBlockStyle.UNORDERED,
          items: [
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: "List",
              },
            ],
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: "unordered",
              },
            ],
          ],
        },
      },
      {
        type: BlockType.LIST,
        data: {
          type: ListBlockStyle.ORDERED,
          items: [
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: "ordered list",
              },
            ],
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: "another item",
              },
            ],
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: ".item3",
              },
            ],
          ],
        },
      },
      {
        type: BlockType.SLASHLINK,
        data: {
          link: "files/x",
          text: "",
        },
      },
      {
        type: BlockType.SLASHLINK,
        data: {
          link: "files/y.mp3",
          text: "Some description",
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
        type: BlockType.CODE,
        data: {
          // eslint-disable-next-line max-len
          code: "and here we have some multiline code\n\n\nconst x = [{}];\n!@#$%&*()",
          contentType: "javascript",
        },
      },
      {
        type: BlockType.URL,
        data: {
          url: "https://example.com",
          text: "Link to example.com",
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
        },
      }];

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
        },
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
> that goes on for two lines.
After that, a text block.`;

    const result = [
      {
        type: BlockType.QUOTE,
        data: {
          text: [
            {
              text: "This is a quote block\nthat goes on for two lines.",
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
                type: "NORMAL_TEXT",
              },
            ],
          },
        },
      ];

      expect(subwaytext(input)).toStrictEqual(result);
    },
  );
});
