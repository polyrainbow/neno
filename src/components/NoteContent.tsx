import React, { useEffect, useState } from "react";
import { MediaType } from "../lib/notes/interfaces/MediaType";
import subwaytext from "../lib/subwaytext/index";
import {
  BlockType,
  ListBlockStyle,
  Span,
} from "../lib/subwaytext/interfaces/Block";
import ActiveNote from "../types/ActiveNote";
import NoteContentBlockAudio from "./NoteContentBlockAudio";
import NoteContentBlockDocument from "./NoteContentBlockDocument";
import NoteContentBlockEmptyFile from "./NoteContentBlockEmptyFile";
import NoteContentBlockParagraph from "./NoteContentBlockParagraph";
import NoteContentBlockVideo from "./NoteContentBlockVideo";
import NoteContentBlockImage from "./NoteContentBlockImage";
import NoteContentEmptyDisclaimer from "./NoteContentEmptyDisclaimer";
import NoteContentInlineText from "./NoteContentInlineText";
import NoteContentBlockTextFile from "./NoteContentBlockTextFile";
import NoteContentBlockQuote from "./NoteContentBlockQuote";
import useNotesProvider from "../hooks/useNotesProvider";
import { FileId } from "../lib/notes/interfaces/FileId";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import {
  extractFirstFileId,
  getAllInlineSpans,
  getMediaTypeFromFilename,
} from "../lib/notes/noteUtils";
import { SpanType } from "../lib/subwaytext/interfaces/SpanType";

interface NoteContentProps {
  note: ActiveNote,
  toggleEditMode: () => void,
}


const NoteContent = ({
  note,
  toggleEditMode,
}: NoteContentProps) => {
  const notesProvider = useNotesProvider();
  const blocks = subwaytext(note.content);
  const [resolvedFileInfos, setResolvedFileInfos] = useState<FileInfo[]>([]);

  /*
    When using a slashlink with a fileId in content, it is not guaranteed that
    we have the associated FileInfo ready in note.files
    So here, we gather all unresolved fileInfos from the note's content and
    try to resolve them with the notesProvider. Further down, we combine those
    resolvedFileInfos with the file infos provided by note.files
  */
  useEffect(() => {
    const inlineSpans = getAllInlineSpans(blocks);

    const fileIdsInContent = inlineSpans
      .filter((span: Span): boolean => {
        if (span.type !== SpanType.SLASHLINK) return false;
        const fileId = extractFirstFileId(span.text.substring(1));
        if (!fileId) return false;
        return true;
      })
      .map((span): FileId => {
        return extractFirstFileId(span.text.substring(1)) as string;
      });

    const initiallyResolvedFileIds = note.files.map((file) => file.fileId);
    const unresolvedFileIds = fileIdsInContent.filter((fileId) => {
      return !initiallyResolvedFileIds.includes(fileId);
    });

    Promise
      .allSettled(
        unresolvedFileIds.map(
          (fileId) => notesProvider.getFileInfo(fileId),
        ),
      )
      .then((results: PromiseSettledResult<FileInfo>[]) => {
        const resolvedFileInfos = results
          .filter(
            (
              result: PromiseSettledResult<FileInfo>,
            ): result is PromiseFulfilledResult<FileInfo> => {
              return result.status === "fulfilled";
            })
          .map((result) => {
            return result.value;
          });

        setResolvedFileInfos(resolvedFileInfos);
      });
  }, []);


  if (blocks.length === 0) {
    return <NoteContentEmptyDisclaimer
      toggleEditMode={toggleEditMode}
    />;
  }

  const allAvailableFileInfos = [
    ...note.files,
    ...resolvedFileInfos,
  ];


  return <div className="note-content-view-mode">
    {
      blocks.map((block) => {
        const slashlinks = getAllInlineSpans([block])
          .filter((span) => span.type === SpanType.SLASHLINK);

        const transclusions = slashlinks.map((slashlink) => {
          const slug = slashlink.text.substring(1);

          const fileId = extractFirstFileId(slug);
          if (!fileId) {
            return <NoteContentBlockEmptyFile
              key={Math.random()}
            />;
          }

          const mediaType = getMediaTypeFromFilename(fileId);
          const file
            = allAvailableFileInfos.find((file) => file.fileId === fileId);
          if (!file) {
            return <NoteContentBlockEmptyFile
              key={Math.random()}
            />;
          }
          if (
            mediaType === MediaType.AUDIO
          ) {
            return <NoteContentBlockAudio
              file={file}
              notesProvider={notesProvider}
              key={file.fileId}
            />;
          } else if (mediaType === MediaType.VIDEO) {
            return <NoteContentBlockVideo
              file={file}
              notesProvider={notesProvider}
              key={file.fileId}
            />;
          } else if (mediaType === MediaType.IMAGE) {
            return <NoteContentBlockImage
              file={file}
              notesProvider={notesProvider}
              key={file.fileId}
            />;
          } else if (mediaType === MediaType.TEXT) {
            return <NoteContentBlockTextFile
              file={file}
              notesProvider={notesProvider}
              key={file.fileId}
            />;
          } else {
            return <NoteContentBlockDocument
              file={file}
              key={file.fileId}
            />;
          }
        });

        let blockMarkup;

        if (block.type === BlockType.LIST) {
          if (block.data.type === ListBlockStyle.UNORDERED) {
            blockMarkup = <ul
              key={Math.random()}
              className="preview-block-list-unordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>
                  <NoteContentInlineText runningText={item} />
                </li>;
              })}
            </ul>;
          } else {
            blockMarkup = <ol
              key={Math.random()}
              className="preview-block-list-ordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>
                  <NoteContentInlineText runningText={item} />
                </li>;
              })}
            </ol>;
          }
        } else if (block.type === BlockType.PARAGRAPH) {
          blockMarkup = <NoteContentBlockParagraph
            runningText={block.data.text}
            key={Math.random()}
          />;
        } else if (block.type === BlockType.QUOTE) {
          blockMarkup = <NoteContentBlockQuote
            runningText={block.data.text}
            key={Math.random()}
          />;
        } else if (block.type === BlockType.CODE) {
          blockMarkup = <pre
            key={Math.random()}
            className="preview-block-code"
          >
            {block.data.code}
          </pre>;
        } else if (block.type === BlockType.HEADING) {
          blockMarkup = <h2 key={Math.random()}>
            <NoteContentInlineText runningText={block.data.text} />
          </h2>;
        } else {
          throw new Error("Unexpected block type");
        }

        return <React.Fragment key={Math.random()}>
          {blockMarkup}
          {transclusions}
        </React.Fragment>;
      })
    }
  </div>;
};


export default NoteContent;
