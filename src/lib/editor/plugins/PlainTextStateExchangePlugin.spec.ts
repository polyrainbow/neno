// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import {
  $getRoot,
  $setCompositionKey,
  createEditor,
  LexicalEditor,
  ParagraphNode,
  RootNode,
} from "lexical";
import { $createHeadingNode, HeadingNode } from "../nodes/HeadingNode";
import {
  $createQuoteBlockNode,
  QuoteBlockNode,
} from "../nodes/QuoteBlockNode";
import setSubtext from "../utils/setSubtext";


const createTestEditor = (): LexicalEditor => {
  const editor = createEditor({
    namespace: "test",
    nodes: [HeadingNode, QuoteBlockNode],
    onError: (error) => {
      throw error;
    },
  });

  const root = document.createElement("div");
  root.setAttribute("contenteditable", "true");
  editor.setRootElement(root);

  return editor;
};


/**
 * Minimal block transform mimicking BlockTransformPlugin: converts
 * ParagraphNodes to HeadingNode / QuoteBlockNode based on content prefix.
 * Like the real plugin, it checks currentType !== targetType to avoid
 * infinite transform loops (HeadingNode extends ParagraphNode).
 */
const registerBlockTransform = (editor: LexicalEditor) => {
  return editor.registerNodeTransform(
    RootNode,
    (root: RootNode) => {
      const blocks = root.getChildren()
        .filter(
          (child) => child instanceof ParagraphNode,
        ) as ParagraphNode[];

      for (const node of blocks) {
        const text = node.getTextContent();
        const currentType = node.getType();

        let targetType = "paragraph";
        if (text.startsWith("#")) {
          targetType = "heading";
        } else if (text.startsWith(">")) {
          targetType = "quote";
        }

        if (currentType !== targetType) {
          if (targetType === "heading") {
            node.replace($createHeadingNode(), true);
          } else if (targetType === "quote") {
            node.replace($createQuoteBlockNode(), true);
          }
        }
      }
      $setCompositionKey(null);
    },
  );
};


describe("PlainTextStateExchangePlugin", () => {
  let editor: LexicalEditor;

  beforeEach(() => {
    editor = createTestEditor();
    registerBlockTransform(editor);
  });


  it(
    "should apply node transforms synchronously"
    + " via discrete update",
    () => {
      editor.update(
        () => {
          const root = $getRoot();
          setSubtext(root, "# Heading\nregular text\n> quote");
        },
        { discrete: true },
      );

      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        expect(children).toHaveLength(3);
        expect(children[0].getType()).toBe("heading");
        expect(children[0].getTextContent()).toBe("# Heading");
        expect(children[1].getType()).toBe("paragraph");
        expect(children[1].getTextContent())
          .toBe("regular text");
        expect(children[2].getType()).toBe("quote");
        expect(children[2].getTextContent()).toBe("> quote");
      });
    },
  );


  it(
    "should apply transforms when switching"
    + " to new content",
    () => {
      // Set initial content (Note A)
      editor.update(
        () => {
          const root = $getRoot();
          setSubtext(root, "# First Note\nsome text");
        },
        { discrete: true },
      );

      // Switch to new content (Note B)
      editor.update(
        () => {
          const root = $getRoot();
          setSubtext(root, "> Quote block\n# Second Note");
        },
        { discrete: true },
      );

      // Editor should show Note B with correct node types
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        expect(children).toHaveLength(2);
        expect(children[0].getType()).toBe("quote");
        expect(children[0].getTextContent())
          .toBe("> Quote block");
        expect(children[1].getType()).toBe("heading");
        expect(children[1].getTextContent())
          .toBe("# Second Note");
      });
    },
  );


  it(
    "discrete mode is required for synchronous"
    + " transform application",
    () => {
      // Set initial content
      editor.update(
        () => {
          const root = $getRoot();
          setSubtext(root, "initial");
        },
        { discrete: true },
      );

      // Update WITHOUT discrete: transforms are deferred
      editor.update(() => {
        const root = $getRoot();
        setSubtext(root, "# Heading");
      });

      // Committed state should still show the OLD content
      // because the non-discrete update hasn't been flushed
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const firstChild = root.getFirstChild();
        expect(firstChild!.getTextContent()).toBe("initial");
      });
    },
  );
});
