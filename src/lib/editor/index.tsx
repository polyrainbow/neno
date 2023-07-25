import {
  $getRoot,
  CLEAR_HISTORY_COMMAND,
  EditorState,
} from "lexical";
import { ReactElement, useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagNode } from "./nodes/HashtagNode";
import { HeadingNode } from "./nodes/HeadingNode";
import { HashtagPlugin } from "./plugins/HashtagPlugin";
import { HeadingPlugin } from "./plugins/HeadingPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import { AutoLinkNode } from "@lexical/link";
import { WikiLinkContentNode } from "./nodes/WikiLinkContentNode";
import { WikiLinkPlugin } from "./plugins/WikilinkPlugin";
import { WikiLinkPunctuationNode } from "./nodes/WikiLinkPunctuationNode";
import { BoldNode } from "./nodes/BoldNode";
import { BoldPlugin } from "./plugins/BoldPlugin";
import { TransclusionNode } from "./nodes/TransclusionNode";
import TransclusionPlugin from "./plugins/TransclusionPlugin";
import { SubtextPlugin } from "./plugins/SubtextPlugin";
import setSubtext from "./utils/setSubtext";
import getSubtextFromEditor from "./utils/getSubtextFromEditor";
import { InlineCodeNode } from "./nodes/InlineCodeNode";
import { InlineCodePlugin } from "./plugins/InlineCodePlugin";
import { CodeBlockNode } from "./nodes/CodeBlockNode";
import { CodeBlockPlugin } from "./plugins/CodeBlockPlugin";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  hashtag: "hashtag",
  link: "link",
  sHeading: "s-heading", // heading seems to be a reserved word
  wikiLinkPunctuation: "wikilink-punctuation",
  wikiLinkContent: "wikilink-content",
  bold: "bold",
  subtext: "subtext",
  inlineCode: "inline-code",
  codeBlock: "code-block",
};


// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error);
}

/*
Convention:
Every subtext block is rendered as a normal editor ParagraphNode.
We cannot extend ParagraphNode to some BlockNode, because then we cannot make
use of RangeSelection.insertParagraph(). RangeSelection.insertNodes([blockNode])
works differently.
*/

const PlainTextStateExchangePlugin = ({
  initialText,
}: { initialText: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      setSubtext(root, initialText);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      root.getLastChild()?.selectEnd();
    });
  }, [editor, initialText]);

  return null;
};


export enum UserRequestType {
  HYPERLINK = "HYPERLINK",
  WIKILINK = "WIKILINK",
  SLASHLINK = "SLASHLINK",
  TRANSCLUSION_TARGET = "TRANSCLUSION_TARGET"
}

interface EditorProps {
  initialText: string,
  onChange: (text: string) => void,
  onUserRequest: (type: UserRequestType, value: string) => void,
  getTransclusionContent: (id: string) => Promise<ReactElement>,
}


export const Editor = ({
  initialText,
  onChange,
  onUserRequest,
  getTransclusionContent,
}: EditorProps) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HashtagNode,
      AutoLinkNode,
      HeadingNode,
      WikiLinkContentNode,
      WikiLinkPunctuationNode,
      BoldNode,
      TransclusionNode,
      InlineCodeNode,
      CodeBlockNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SubtextPlugin
        placeholder={null}
        contentEditable={<ContentEditable />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <PlainTextStateExchangePlugin initialText={initialText}/>
      <OnChangePlugin onChange={
        (editorState: EditorState) => {
          editorState.read(() => {
            // Read the contents of the EditorState here.
            const root = $getRoot();
            onChange(getSubtextFromEditor(root));
          });
        }
      } />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <HashtagPlugin />
      <BoldPlugin />
      <HeadingPlugin />
      <InlineCodePlugin />
      <LinkPlugin />
      <WikiLinkPlugin />
      <TransclusionPlugin
        getTransclusionContent={getTransclusionContent}
      />
      <CodeBlockPlugin />
      <NodeEventPlugin
        nodeType={AutoLinkNode}
        eventType="click"
        eventListener={(e: Event) => {
          const isSlashlink = (str: string) => {
            return str.startsWith("@") || str.startsWith("/");
          };
          if (!(e && e.target)) return;
          const link = (e.target as HTMLElement).innerText;
          if (isSlashlink(link)) {
            onUserRequest(UserRequestType.SLASHLINK, link.substring(1));
          } else {
            onUserRequest(UserRequestType.HYPERLINK, link);
          }
        }}
      />
      <NodeEventPlugin
        nodeType={WikiLinkContentNode}
        eventType="click"
        eventListener={(e: Event) => {
          if (!(e && e.target)) return;
          const link = (e.target as HTMLElement).innerText;
          onUserRequest(UserRequestType.WIKILINK, link);
        }}
      />
      <NodeEventPlugin
        nodeType={TransclusionNode}
        eventType="click"
        eventListener={(e: Event) => {
          if (!(e && e.target)) return;
          let cursorElement = e.target as HTMLElement;
          do {
            if ("transclusionId" in cursorElement.dataset) {
              const transclusionId
                = cursorElement.dataset.transclusionId as string;
              onUserRequest(
                UserRequestType.TRANSCLUSION_TARGET,
                transclusionId,
              );
              return;
            }

            cursorElement = cursorElement.parentElement as HTMLElement;
          } while (cursorElement);
        }}
      />
    </LexicalComposer>
  );
};
