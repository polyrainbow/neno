// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  createEditor,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  KEY_BACKSPACE_COMMAND,
  COMMAND_PRIORITY_LOW,
  $isElementNode,
  LexicalEditor,
  LexicalNode,
  $getNodeByKey,
  $createRangeSelection,
  $setSelection,
  ParagraphNode,
} from "lexical";
import {
  $createCodeBlockNode,
  CodeBlockNode,
  $isCodeBlockNode,
} from "../nodes/CodeBlockNode";
import {
  $createScriptOutputNode,
  ScriptOutputNode,
  $isScriptOutputNode,
} from "../nodes/ScriptOutputNode";


const createTestEditor = (): LexicalEditor => {
  const editor = createEditor({
    namespace: "test",
    nodes: [CodeBlockNode, ScriptOutputNode],
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
 * Builds the following editor structure:
 *
 *   CodeBlockNode("```run")    - opening fence
 *   ParagraphNode("println…")  - code body
 *   CodeBlockNode("```")       - closing fence
 *   ScriptOutputNode           - output
 *
 * Places the cursor at the end of the closing fence.
 * Returns the keys for later assertions.
 */
const setupRunBlock = (
  editor: LexicalEditor,
): {
  closingKey: string;
  outputKey: string;
} => {
  let closingKey = "";
  let outputKey = "";

  editor.update(
    () => {
      const root = $getRoot();
      root.clear();

      const opening = $createCodeBlockNode();
      opening.append($createTextNode("```run"));

      const body = $createParagraphNode();
      body.append($createTextNode("println('hello')"));

      const closing = $createCodeBlockNode();
      closing.append($createTextNode("```"));

      const output = $createScriptOutputNode("hello\n", false);

      root.append(opening, body, closing, output);

      closingKey = closing.getKey();
      outputKey = output.getKey();

      // Place cursor at end of closing fence text
      closing.selectEnd();
    },
    { discrete: true },
  );

  return { closingKey, outputKey };
};


/**
 * Registers the same command handlers as ProgrammableNotePlugin
 * so we can test the logic without React / useLexicalComposerContext.
 */
const registerCommandHandlers = (
  ed: LexicalEditor,
  onHandled: (result: boolean) => void,
) => {
  const enterHandler = (): boolean => {
    const selection = $getSelection();
    if (
      !$isRangeSelection(selection)
      || !selection.isCollapsed()
    ) {
      return false;
    }

    const anchor = selection.anchor;
    let node: LexicalNode | null = null;

    if (anchor.type === "text") {
      node = anchor.getNode().getParent();
      if (
        anchor.offset
        !== anchor.getNode().getTextContentSize()
      ) {
        return false;
      }
    } else {
      node = anchor.getNode();
      if (
        !$isElementNode(node)
        || anchor.offset !== node.getChildrenSize()
      ) {
        return false;
      }
    }

    if (
      !node
      || !$isCodeBlockNode(node)
      || node.getTextContent().trimEnd() !== "```"
    ) {
      return false;
    }

    const nextSibling = node.getNextSibling();
    if (!$isScriptOutputNode(nextSibling)) {
      return false;
    }

    const newParagraph = $createParagraphNode();
    nextSibling.insertAfter(newParagraph);
    newParagraph.selectStart();
    return true;
  };

  const backspaceHandler = (): boolean => {
    const selection = $getSelection();
    if (
      !$isRangeSelection(selection)
      || !selection.isCollapsed()
    ) {
      return false;
    }

    const anchor = selection.anchor;
    if (anchor.offset !== 0) {
      return false;
    }

    const node = anchor.type === "text"
      ? anchor.getNode().getParent()
      : anchor.getNode();

    if (!node || !$isParagraphNode(node)) {
      return false;
    }

    const prevSibling = node.getPreviousSibling();
    if (!$isScriptOutputNode(prevSibling)) {
      return false;
    }

    const closingFence = prevSibling.getPreviousSibling();
    if (
      !closingFence || !$isCodeBlockNode(closingFence)
    ) {
      return false;
    }

    if (node.getTextContentSize() === 0) {
      node.remove();
    }

    closingFence.selectEnd();
    return true;
  };

  ed.registerCommand(
    INSERT_LINE_BREAK_COMMAND,
    () => {
      const result = enterHandler();
      onHandled(result);
      return result;
    },
    COMMAND_PRIORITY_LOW,
  );

  ed.registerCommand(
    INSERT_PARAGRAPH_COMMAND,
    () => {
      const result = enterHandler();
      onHandled(result);
      return result;
    },
    COMMAND_PRIORITY_LOW,
  );

  ed.registerCommand(
    KEY_BACKSPACE_COMMAND,
    () => {
      const result = backspaceHandler();
      onHandled(result);
      return result;
    },
    COMMAND_PRIORITY_LOW,
  );
};


describe("ProgrammableNotePlugin", () => {
  describe("Enter at closing fence of run block", () => {
    let editor: LexicalEditor;
    let commandHandled: boolean;

    beforeEach(() => {
      editor = createTestEditor();
      commandHandled = false;
      registerCommandHandlers(editor, (r) => {
        commandHandled = r;
      });
    });


    it(
      "should insert paragraph after ScriptOutputNode"
      + " on INSERT_LINE_BREAK_COMMAND",
      () => {
        const { outputKey } = setupRunBlock(editor);

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_LINE_BREAK_COMMAND,
              false,
            );
          },
          { discrete: true },
        );

        expect(commandHandled).toBe(true);

        editor.getEditorState().read(() => {
          const outputNode = $getNodeByKey(outputKey);
          expect(outputNode).not.toBeNull();
          expect($isScriptOutputNode(outputNode)).toBe(true);

          const afterOutput = outputNode!.getNextSibling();
          expect(afterOutput).not.toBeNull();
          expect(
            afterOutput instanceof ParagraphNode,
          ).toBe(true);
          expect(afterOutput!.getTextContent()).toBe("");
        });
      },
    );


    it(
      "should insert paragraph after ScriptOutputNode"
      + " on INSERT_PARAGRAPH_COMMAND",
      () => {
        const { outputKey } = setupRunBlock(editor);

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_PARAGRAPH_COMMAND,
              undefined,
            );
          },
          { discrete: true },
        );

        expect(commandHandled).toBe(true);

        editor.getEditorState().read(() => {
          const outputNode = $getNodeByKey(outputKey);
          expect(outputNode).not.toBeNull();
          expect($isScriptOutputNode(outputNode)).toBe(true);

          const afterOutput = outputNode!.getNextSibling();
          expect(afterOutput).not.toBeNull();
          expect(
            afterOutput instanceof ParagraphNode,
          ).toBe(true);
        });
      },
    );


    it("should preserve the ScriptOutputNode", () => {
      const { closingKey, outputKey } = setupRunBlock(editor);

      editor.update(
        () => {
          editor.dispatchCommand(
            INSERT_LINE_BREAK_COMMAND,
            false,
          );
        },
        { discrete: true },
      );

      editor.getEditorState().read(() => {
        const closing = $getNodeByKey(closingKey);
        expect(closing).not.toBeNull();

        const output = $getNodeByKey(outputKey);
        expect(output).not.toBeNull();
        expect($isScriptOutputNode(output)).toBe(true);

        // Output should still be right after closing fence
        expect(closing!.getNextSibling()).toBe(output);
      });
    });


    it(
      "should place cursor in the new paragraph",
      () => {
        const { outputKey } = setupRunBlock(editor);

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_LINE_BREAK_COMMAND,
              false,
            );
          },
          { discrete: true },
        );

        editor.getEditorState().read(() => {
          const selection = $getSelection();
          expect($isRangeSelection(selection)).toBe(true);
          if (!$isRangeSelection(selection)) return;

          const outputNode = $getNodeByKey(outputKey);
          const newParagraph = outputNode!.getNextSibling();
          expect(newParagraph).not.toBeNull();

          const anchorNode = selection.anchor.getNode();
          const parentOrSelf
            = anchorNode instanceof ParagraphNode
              ? anchorNode
              : anchorNode.getParent();
          expect(parentOrSelf).toBe(newParagraph);
        });
      },
    );


    it(
      "should not handle Enter when cursor is"
      + " not at end of closing fence",
      () => {
        editor.update(
          () => {
            const root = $getRoot();
            root.clear();

            const opening = $createCodeBlockNode();
            opening.append($createTextNode("```run"));

            const body = $createParagraphNode();
            body.append(
              $createTextNode("println('hello')"),
            );

            const closing = $createCodeBlockNode();
            const closingText = $createTextNode("```");
            closing.append(closingText);

            const output = $createScriptOutputNode(
              "hello\n",
              false,
            );

            root.append(opening, body, closing, output);

            // Place cursor at offset 1 (after first backtick)
            const sel = $createRangeSelection();
            sel.anchor.set(
              closingText.getKey(), 1, "text",
            );
            sel.focus.set(
              closingText.getKey(), 1, "text",
            );
            $setSelection(sel);
          },
          { discrete: true },
        );

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_LINE_BREAK_COMMAND,
              false,
            );
          },
          { discrete: true },
        );

        expect(commandHandled).toBe(false);
      },
    );


    it(
      "should not handle Enter on a regular"
      + " code block (no ScriptOutputNode after it)",
      () => {
        editor.update(
          () => {
            const root = $getRoot();
            root.clear();

            const opening = $createCodeBlockNode();
            opening.append($createTextNode("```"));

            const body = $createParagraphNode();
            body.append($createTextNode("some code"));

            const closing = $createCodeBlockNode();
            closing.append($createTextNode("```"));

            const afterParagraph = $createParagraphNode();
            afterParagraph.append(
              $createTextNode("next line"),
            );

            root.append(
              opening, body, closing, afterParagraph,
            );

            closing.selectEnd();
          },
          { discrete: true },
        );

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_LINE_BREAK_COMMAND,
              false,
            );
          },
          { discrete: true },
        );

        expect(commandHandled).toBe(false);
      },
    );


    it(
      "should not handle Enter on a"
      + " non-CodeBlockNode paragraph",
      () => {
        editor.update(
          () => {
            const root = $getRoot();
            root.clear();

            const paragraph = $createParagraphNode();
            paragraph.append(
              $createTextNode("hello world"),
            );

            root.append(paragraph);
            paragraph.selectEnd();
          },
          { discrete: true },
        );

        editor.update(
          () => {
            editor.dispatchCommand(
              INSERT_LINE_BREAK_COMMAND,
              false,
            );
          },
          { discrete: true },
        );

        expect(commandHandled).toBe(false);
      },
    );
  });


  describe(
    "Backspace in paragraph after ScriptOutputNode",
    () => {
      let editor: LexicalEditor;
      let commandHandled: boolean;

      /**
       * Builds:
       *   CodeBlockNode("```run")
       *   ParagraphNode("println…")
       *   CodeBlockNode("```")       ← closing fence
       *   ScriptOutputNode           ← output
       *   ParagraphNode("")          ← empty line after
       *
       * Cursor at start of the empty paragraph.
       */
      const setupRunBlockWithTrailingParagraph = (): {
        closingKey: string;
        outputKey: string;
        trailingKey: string;
      } => {
        let closingKey = "";
        let outputKey = "";
        let trailingKey = "";

        editor.update(
          () => {
            const root = $getRoot();
            root.clear();

            const opening = $createCodeBlockNode();
            opening.append($createTextNode("```run"));

            const body = $createParagraphNode();
            body.append(
              $createTextNode("println('hello')"),
            );

            const closing = $createCodeBlockNode();
            closing.append($createTextNode("```"));

            const output = $createScriptOutputNode(
              "hello\n", false,
            );

            const trailing = $createParagraphNode();

            root.append(
              opening, body, closing, output, trailing,
            );

            closingKey = closing.getKey();
            outputKey = output.getKey();
            trailingKey = trailing.getKey();

            trailing.selectStart();
          },
          { discrete: true },
        );

        return { closingKey, outputKey, trailingKey };
      };

      beforeEach(() => {
        editor = createTestEditor();
        commandHandled = false;
        registerCommandHandlers(editor, (r) => {
          commandHandled = r;
        });
      });


      it(
        "should remove empty paragraph and move cursor"
        + " to closing fence",
        () => {
          const {
            closingKey, trailingKey,
          } = setupRunBlockWithTrailingParagraph();

          editor.update(
            () => {
              editor.dispatchCommand(
                KEY_BACKSPACE_COMMAND,
                null as unknown as KeyboardEvent,
              );
            },
            { discrete: true },
          );

          expect(commandHandled).toBe(true);

          editor.getEditorState().read(() => {
            // Empty paragraph should be removed
            const trailing = $getNodeByKey(trailingKey);
            expect(trailing).toBeNull();

            // Cursor should be at end of closing fence
            const selection = $getSelection();
            expect(
              $isRangeSelection(selection),
            ).toBe(true);
            if (!$isRangeSelection(selection)) return;

            const closing = $getNodeByKey(closingKey);
            expect(closing).not.toBeNull();

            const anchorNode = selection.anchor.getNode();
            const parentOrSelf
              = anchorNode instanceof ParagraphNode
                ? anchorNode
                : anchorNode.getParent();
            expect(parentOrSelf).toBe(closing);
          });
        },
      );


      it(
        "should preserve ScriptOutputNode"
        + " when backspacing",
        () => {
          const {
            closingKey, outputKey,
          } = setupRunBlockWithTrailingParagraph();

          editor.update(
            () => {
              editor.dispatchCommand(
                KEY_BACKSPACE_COMMAND,
                null as unknown as KeyboardEvent,
              );
            },
            { discrete: true },
          );

          editor.getEditorState().read(() => {
            const closing = $getNodeByKey(closingKey);
            const output = $getNodeByKey(outputKey);
            expect(output).not.toBeNull();
            expect($isScriptOutputNode(output)).toBe(true);
            expect(closing!.getNextSibling()).toBe(output);
          });
        },
      );


      it(
        "should not remove non-empty paragraph,"
        + " only move cursor",
        () => {
          let trailingKey = "";
          let closingKey = "";

          editor.update(
            () => {
              const root = $getRoot();
              root.clear();

              const opening = $createCodeBlockNode();
              opening.append($createTextNode("```run"));

              const body = $createParagraphNode();
              body.append(
                $createTextNode("println('hello')"),
              );

              const closing = $createCodeBlockNode();
              closing.append($createTextNode("```"));

              const output = $createScriptOutputNode(
                "hello\n", false,
              );

              const trailing = $createParagraphNode();
              trailing.append(
                $createTextNode("some text"),
              );

              root.append(
                opening, body, closing, output, trailing,
              );

              closingKey = closing.getKey();
              trailingKey = trailing.getKey();

              // cursor at start of trailing paragraph
              const sel = $createRangeSelection();
              const textNode = trailing.getFirstChild()!;
              sel.anchor.set(
                textNode.getKey(), 0, "text",
              );
              sel.focus.set(
                textNode.getKey(), 0, "text",
              );
              $setSelection(sel);
            },
            { discrete: true },
          );

          editor.update(
            () => {
              editor.dispatchCommand(
                KEY_BACKSPACE_COMMAND,
                null as unknown as KeyboardEvent,
              );
            },
            { discrete: true },
          );

          expect(commandHandled).toBe(true);

          editor.getEditorState().read(() => {
            // Paragraph should still exist
            const trailing = $getNodeByKey(trailingKey);
            expect(trailing).not.toBeNull();
            expect(trailing!.getTextContent())
              .toBe("some text");

            // Cursor at end of closing fence
            const selection = $getSelection();
            expect(
              $isRangeSelection(selection),
            ).toBe(true);
            if (!$isRangeSelection(selection)) return;

            const closing = $getNodeByKey(closingKey);
            const anchorNode = selection.anchor.getNode();
            const parentOrSelf
              = anchorNode instanceof ParagraphNode
                ? anchorNode
                : anchorNode.getParent();
            expect(parentOrSelf).toBe(closing);
          });
        },
      );


      it(
        "should not handle backspace when cursor"
        + " is not at position 0",
        () => {
          editor.update(
            () => {
              const root = $getRoot();
              root.clear();

              const opening = $createCodeBlockNode();
              opening.append($createTextNode("```run"));

              const body = $createParagraphNode();
              body.append(
                $createTextNode("println('hello')"),
              );

              const closing = $createCodeBlockNode();
              closing.append($createTextNode("```"));

              const output = $createScriptOutputNode(
                "hello\n", false,
              );

              const trailing = $createParagraphNode();
              trailing.append(
                $createTextNode("some text"),
              );

              root.append(
                opening, body, closing, output, trailing,
              );

              // cursor at offset 4 ("some| text")
              const sel = $createRangeSelection();
              const textNode = trailing.getFirstChild()!;
              sel.anchor.set(
                textNode.getKey(), 4, "text",
              );
              sel.focus.set(
                textNode.getKey(), 4, "text",
              );
              $setSelection(sel);
            },
            { discrete: true },
          );

          editor.update(
            () => {
              editor.dispatchCommand(
                KEY_BACKSPACE_COMMAND,
                null as unknown as KeyboardEvent,
              );
            },
            { discrete: true },
          );

          expect(commandHandled).toBe(false);
        },
      );


      it(
        "should not handle backspace when previous"
        + " sibling is not ScriptOutputNode",
        () => {
          editor.update(
            () => {
              const root = $getRoot();
              root.clear();

              const first = $createParagraphNode();
              first.append($createTextNode("first"));

              const second = $createParagraphNode();

              root.append(first, second);

              second.selectStart();
            },
            { discrete: true },
          );

          editor.update(
            () => {
              editor.dispatchCommand(
                KEY_BACKSPACE_COMMAND,
                null as unknown as KeyboardEvent,
              );
            },
            { discrete: true },
          );

          expect(commandHandled).toBe(false);
        },
      );
    },
  );
});
