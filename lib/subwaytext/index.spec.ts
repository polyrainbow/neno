import assert from 'node:assert';
import it, { describe } from 'node:test';
import { Block, BlockType, ListBlockStyle } from './interfaces/Block.js';
import subwaytext from "./index.js";
import { SpanType } from './interfaces/SpanType.js';


describe("subwaytext", () => {
  it("should parse basic documents correctly", async () => {
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


/file:x
/file:y.mp3     Some description
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
        }
      },
      {
        type: BlockType.HEADING,
        data: {
          text: "another heading",
        }
      },
      {
        type: BlockType.PARAGRAPH,
        data: {
          text: [
            {
              type: SpanType.NORMAL_TEXT,
              text: "some\nmultiline\ntext",
            },
          ],
        }
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
        }
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
              }
            ],
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: "another item",
              }
            ],
            [
              {
                type: SpanType.NORMAL_TEXT,
                text: ".item3",
              }
            ],
          ],
        }
      },
      {
        type: BlockType.SLASHLINK,
        data: {
          link: "file:x",
          text: "",
        }
      },
      {
        type: BlockType.SLASHLINK,
        data: {
          link: "file:y.mp3",
          text: "Some description",
        }
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
        }
      },
      {
        type: BlockType.CODE,
        data: {
          // eslint-disable-next-line max-len
          code: "and here we have some multiline code\n\n\nconst x = [{}];\n!@#$%&*()",
          contentType: "javascript",
        }
      },
      {
        type: BlockType.URL,
        data: {
          url: "https://example.com",
          text: "Link to example.com",
        }
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
        }
      },
    ];

    assert.deepEqual(subwaytext(input), result);
  });

  it("should unescape escaped code block signals within a code block", () => {
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
      }
    }];

    assert.deepEqual(subwaytext(input), result);
  });
});
