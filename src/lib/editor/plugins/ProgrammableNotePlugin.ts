import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  INSERT_LINE_BREAK_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  KEY_BACKSPACE_COMMAND,
  LexicalNode,
  ParagraphNode,
} from "lexical";
import { $isCodeBlockNode } from "../nodes/CodeBlockNode";
import {
  $createScriptOutputNode,
  $isScriptOutputNode,
} from "../nodes/ScriptOutputNode";

export type ScriptExecutor = (
  script: string,
  noteContent: string,
  noteSlug: string,
) => Promise<string>;

interface ScriptBlock {
  openingNodeKey: string;
  closingNodeKey: string;
  code: string;
}

const DEBOUNCE_MS = 500;

const PROGRAMMABLE_NOTE_TAG = "programmable-note";

const SCRIPT_BLOCK_CLASS = "script-block";

const getScriptBlockNodeKeys = (
  children: LexicalNode[],
): Set<string> => {
  const keys = new Set<string>();
  let i = 0;

  while (i < children.length) {
    const child = children[i];
    if (
      $isCodeBlockNode(child)
      && child.getTextContent().startsWith("```")
      && child.getTextContent().substring(3).trim() === "run"
    ) {
      keys.add(child.getKey());
      i++;

      while (i < children.length) {
        const inner = children[i];
        keys.add(inner.getKey());
        if (
          $isCodeBlockNode(inner)
          && inner.getTextContent().trimEnd() === "```"
        ) {
          break;
        }
        i++;
      }
    }
    i++;
  }

  return keys;
};

const extractScriptBlocks = (
  children: LexicalNode[],
): ScriptBlock[] => {
  const blocks: ScriptBlock[] = [];
  let i = 0;

  while (i < children.length) {
    const child = children[i];
    if (
      $isCodeBlockNode(child)
      && child.getTextContent().startsWith("```")
      && child.getTextContent().substring(3).trim() === "run"
    ) {
      const openingNodeKey = child.getKey();
      const codeLines: string[] = [];
      let closingNodeKey: string | null = null;
      i++;

      while (i < children.length) {
        const inner = children[i];
        if (
          $isCodeBlockNode(inner)
          && inner.getTextContent().trimEnd() === "```"
        ) {
          closingNodeKey = inner.getKey();
          break;
        }
        codeLines.push(inner.getTextContent());
        i++;
      }

      if (closingNodeKey) {
        blocks.push({
          openingNodeKey,
          closingNodeKey,
          code: codeLines.join("\n"),
        });
      }
    }
    i++;
  }

  return blocks;
};


interface ProgrammableNotePluginProps {
  executeScript: ScriptExecutor;
  activeNoteSlug: string;
  refreshTrigger: number;
}


export default function ProgrammableNotePlugin({
  executeScript,
  activeNoteSlug,
  refreshTrigger,
}: ProgrammableNotePluginProps): null {
  const [editor] = useLexicalComposerContext();
  const lastExecutedCode = useRef(new Map<string, string>());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    // Clear tracking so all scripts re-execute when the
    // note is saved (refreshTrigger changes) or the active
    // note changes (activeNoteSlug changes).
    lastExecutedCode.current.clear();

    const processScripts = async () => {
      const { scriptBlocks, orphanedOutputKeys, noteContent }
        = editor.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();
          const blocks = extractScriptBlocks(children);
          const validClosingKeys = new Set(
            blocks.map((b) => b.closingNodeKey),
          );

          const orphaned: string[] = [];
          for (const child of children) {
            if ($isScriptOutputNode(child)) {
              const prev = child.getPreviousSibling();
              if (
                !prev
                || !validClosingKeys.has(prev.getKey())
              ) {
                orphaned.push(child.getKey());
              }
            }
          }

          const content = children
            .filter(
              (child) => child instanceof ParagraphNode,
            )
            .map((p) => p.getTextContent())
            .join("\n");

          return {
            scriptBlocks: blocks,
            orphanedOutputKeys: orphaned,
            noteContent: content,
          };
        });

      // Cleanup orphaned output nodes
      if (orphanedOutputKeys.length > 0) {
        editor.update(() => {
          for (const key of orphanedOutputKeys) {
            const node = $getNodeByKey(key);
            if ($isScriptOutputNode(node)) {
              node.remove();
            }
          }
        }, { tag: PROGRAMMABLE_NOTE_TAG });
      }

      // Prune tracking for script blocks that no longer exist.
      // Without this, a block that is temporarily invalidated
      // (e.g. editing "run" to "rn" and back) would not
      // re-execute because the code still matches the stale
      // entry.
      const currentOpeningKeys = new Set(
        scriptBlocks.map((b) => b.openingNodeKey),
      );
      for (const key of lastExecutedCode.current.keys()) {
        if (!currentOpeningKeys.has(key)) {
          lastExecutedCode.current.delete(key);
        }
      }

      // Find changed scripts
      const changedBlocks = scriptBlocks.filter(
        (block) => lastExecutedCode.current.get(
          block.openingNodeKey,
        ) !== block.code,
      );

      if (changedBlocks.length === 0) return;

      // Show "Executing..." state
      editor.update(() => {
        for (const block of changedBlocks) {
          const closingNode = $getNodeByKey(block.closingNodeKey);
          if (!closingNode) continue;
          const nextSibling = closingNode.getNextSibling();
          if ($isScriptOutputNode(nextSibling)) {
            nextSibling.setExecuting();
          } else {
            closingNode.insertAfter(
              $createScriptOutputNode("", true),
            );
          }
        }
      }, { tag: PROGRAMMABLE_NOTE_TAG });

      // Execute scripts and update outputs
      for (const block of changedBlocks) {
        const output = await executeScript(
          block.code,
          noteContent,
          activeNoteSlug,
        );
        lastExecutedCode.current.set(
          block.openingNodeKey,
          block.code,
        );

        editor.update(() => {
          const closingNode = $getNodeByKey(
            block.closingNodeKey,
          );
          if (!closingNode) return;

          const nextSibling = closingNode.getNextSibling();
          if ($isScriptOutputNode(nextSibling)) {
            nextSibling.setOutput(output);
          } else {
            closingNode.insertAfter(
              $createScriptOutputNode(output, false),
            );
          }
        }, { tag: PROGRAMMABLE_NOTE_TAG });
      }
    };

    const unregister = editor.registerUpdateListener(
      ({ tags }) => {
        if (tags.has(PROGRAMMABLE_NOTE_TAG)) return;

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(
          processScripts,
          DEBOUNCE_MS,
        );
      },
    );

    // Run immediately so scripts refresh after save, when
    // no Lexical editor update would otherwise be pending.
    debounceTimer.current = setTimeout(processScripts, 0);

    return () => {
      unregister();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [editor, executeScript, activeNoteSlug, refreshTrigger]);

  useEffect(() => {
    const handleEnterAtClosingFence = (): boolean => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return false;
      }

      const anchor = selection.anchor;
      let node: LexicalNode | null = null;

      if (anchor.type === "text") {
        node = anchor.getNode().getParent();
        if (anchor.offset !== anchor.getNode().getTextContentSize()) {
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

    const handleBackspaceAfterScriptOutput = (): boolean => {
      const selection = $getSelection();
      if (
        !$isRangeSelection(selection)
        || !selection.isCollapsed()
      ) {
        return false;
      }

      const anchor = selection.anchor;

      // Cursor must be at position 0
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
      if (!closingFence || !$isCodeBlockNode(closingFence)) {
        return false;
      }

      if (node.getTextContentSize() === 0) {
        node.remove();
      }

      closingFence.selectEnd();
      return true;
    };

    const unregisterLineBreak = editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => handleEnterAtClosingFence(),
      COMMAND_PRIORITY_LOW,
    );

    const unregisterParagraph = editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => handleEnterAtClosingFence(),
      COMMAND_PRIORITY_LOW,
    );

    const unregisterBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const handled = handleBackspaceAfterScriptOutput();
        if (handled && event) {
          event.preventDefault();
        }
        return handled;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregisterLineBreak();
      unregisterParagraph();
      unregisterBackspace();
    };
  }, [editor]);

  useEffect(() => {
    const applyScriptBlockClasses = () => {
      const { scriptKeys, allCodeBlockKeys }
        = editor.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();
          return {
            scriptKeys: getScriptBlockNodeKeys(children),
            allCodeBlockKeys: children
              .filter((c) => $isCodeBlockNode(c))
              .map((c) => c.getKey()),
          };
        });

      for (const key of allCodeBlockKeys) {
        const el = editor.getElementByKey(key);
        if (el) {
          el.classList.toggle(
            SCRIPT_BLOCK_CLASS,
            scriptKeys.has(key),
          );
        }
      }
    };

    const unregister = editor.registerUpdateListener(() => {
      applyScriptBlockClasses();
    });

    applyScriptBlockClasses();

    return unregister;
  }, [editor]);

  return null;
}
