import {
  $getRoot,
  EditorState,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "./nodes/HeadingNode";
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
import getSubtextFromEditor from "./utils/getSubtextFromEditor";
import { InlineCodeNode } from "./nodes/InlineCodeNode";
import { InlineCodePlugin } from "./plugins/InlineCodePlugin";
import { CodeBlockNode } from "./nodes/CodeBlockNode";
import { BlockTransformPlugin } from "./plugins/BlockTransformPlugin";
import { QuoteBlockNode } from "./nodes/QuoteBlockNode";
import { LinkType } from "../../types/LinkType";
import { UserRequestType } from "./types/UserRequestType";
import { ListItemNode } from "./nodes/ListItemNode";
import PlainTextStateExchangePlugin
  from "./plugins/PlainTextStateExchangePlugin";
import theme from "./theme";
import AutoFocusPlugin from "./plugins/AutoFocusPlugin";
import { TransclusionContentGetter } from "./types/TransclusionContentGetter";
import { highlightHeadingSigils } from "./utils/highlight";
import { KeyValueNode } from "./nodes/KeyValueNode";
import { KeyValuePairKeyNode } from "./nodes/KeyValuePairKeyNode";
import { KeyValuePlugin } from "./plugins/KeyValuePlugin";
import { ListItemSigilNode } from "./nodes/ListItemSigilNode";
import { ListItemPlugin } from "./plugins/ListItemPlugin";
import { ListItemContentNode } from "./nodes/ListItemContentNode";

/*
  Convention:
  Every subtext block is rendered as a normal editor ParagraphNode.
  We cannot extend ParagraphNode to some BlockNode, because then we cannot make
  use of RangeSelection.insertParagraph().
  RangeSelection.insertNodes([blockNode]) works differently.

  HashtagPlugin is disabled for now, since not part of spec yet and
  collisions with HeadingPlugin.
  See also
https://github.com/subconsciousnetwork/subtext/issues/21#issuecomment-1651543966
*/

interface EditorProps {
  initialText: string,
  instanceId: number,
  onChange: (text: string) => void,
  onUserRequest: (type: UserRequestType, value: string) => void,
  getTransclusionContent: TransclusionContentGetter,
  getLinkAvailability: (link: string, linkType: LinkType) => Promise<boolean>,
}

export const Editor = ({
  initialText,
  instanceId,
  onChange,
  onUserRequest,
  getTransclusionContent,
  getLinkAvailability,
}: EditorProps) => {
  return <>
    <ContentEditable />
    <SubtextPlugin
      ErrorBoundary={LexicalErrorBoundary}
    />
    <PlainTextStateExchangePlugin
      initialText={initialText}
      instanceId={instanceId}
    />
    <OnChangePlugin onChange={
      (editorState: EditorState) => {
        editorState.read(() => {
          highlightHeadingSigils();
          const root = $getRoot();
          onChange(getSubtextFromEditor(root));
        });
      }
    } />
    <HistoryPlugin />
    <AutoFocusPlugin />
    <BoldPlugin />
    <InlineCodePlugin />
    <KeyValuePlugin />
    <LinkPlugin />
    <ListItemPlugin />
    <WikiLinkPlugin getLinkAvailability={(linkText: string) => {
      return getLinkAvailability(linkText, LinkType.WIKILINK);
    }} />
    <TransclusionPlugin
      getTransclusionContent={getTransclusionContent}
    />
    <BlockTransformPlugin />
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
  </>;
};

const Context = ({
  children,
}: React.PropsWithChildren) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: unknown) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
    nodes: [
      AutoLinkNode,
      HeadingNode,
      WikiLinkContentNode,
      WikiLinkPunctuationNode,
      BoldNode,
      TransclusionNode,
      InlineCodeNode,
      CodeBlockNode,
      QuoteBlockNode,
      ListItemNode,
      ListItemSigilNode,
      ListItemContentNode,
      KeyValueNode,
      KeyValuePairKeyNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {children}
    </LexicalComposer>
  );
};

export {
  ContentEditable,
  Context,
};
