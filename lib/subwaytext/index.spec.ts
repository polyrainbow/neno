import assert from 'node:assert';
import it, { describe } from 'node:test';
import { Block, BlockType, ListBlockStyle } from './interfaces/Block.js';
import subwaytext from "./index.js"


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

<>
and here we have some multiline code


const x = [{}];
!@#$%&*()
<>

https://example.com Link to example.com
`;

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
          text: "some\nmultiline\ntext",
        }
      },
      {
        type: BlockType.LIST,
        data: {
          type: ListBlockStyle.UNORDERED,
          items: ["List", "unordered"],
        }
      },
      {
        type: BlockType.LIST,
        data: {
          type: ListBlockStyle.ORDERED,
          items: ["ordered list", "another item", ".item3"],
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
          text: "here starts another paragraph"
        }
      },
      {
        type: BlockType.CODE,
        data: {
          code: "and here we have some multiline code\n\n\nconst x = [{}];\n!@#$%&*()"
        }
      },
      {
        type: BlockType.URL,
        data: {
          url: "https;//example.com",
          text: "Link to example.com",
        }
      },
    ];

    assert.deepEqual(subwaytext(input), result);
  });
});
