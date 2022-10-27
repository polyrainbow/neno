import React, { useEffect, useState } from "react";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import subwaytext from "../../../lib/subwaytext/index";
import {
  BlockSlashlink,
  BlockType,
  ListBlockStyle,
} from "../../../lib/subwaytext/interfaces/Block";
import ActiveNote from "../types/ActiveNote";
import {
  getFileId,
} from "../lib/utils";
import NoteContentBlockAudio from "./NoteContentBlockAudio";
import NoteContentBlockDocument from "./NoteContentBlockDocument";
import NoteContentBlockEmptyFile from "./NoteContentBlockEmptyFile";
import NoteContentBlockParagraph from "./NoteContentBlockParagraph";
import NoteContentBlockVideo from "./NoteContentBlockVideo";
import NoteContentBlockImage from "./NoteContentBlockImage";
import NoteContentEmptyDisclaimer from "./NoteContentEmptyDisclaimer";
import NoteContentBlockUrl from "./NoteContentBlockUrl";
import NoteContentRunningText from "./NoteContentRunningText";
import NoteContentBlockTextFile from "./NoteContentBlockTextFile";
import NoteContentBlockQuote from "./NoteContentBlockQuote";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import { FileId } from "../../../lib/notes/interfaces/FileId";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { getMediaTypeFromFilename } from "../../../lib/notes/noteUtils";

interface NoteContentProps {
  note: ActiveNote,
  toggleEditMode,
  graphId: GraphId,
}


const NoteContent = ({
  note,
  toggleEditMode,
  graphId,
}: NoteContentProps) => {
  const databaseProvider = useDatabaseProvider();
  const blocks = subwaytext(note.content);
  const [resolvedFileInfos, setResolvedFileInfos] = useState<FileInfo[]>([]);


  /*
    When using a slashlink with a fileId in content, it is not guaranteed that
    we have the accofing FileInfo ready in note.files
    So here, we gather all unresolved fileInfos from the note's content and
    try to resolve it against the database. Further down, we combine those
    resolvedFileInfos with the file infos provided by note.files
  */
  useEffect(() => {
    const fileIdsInContent = blocks
      .filter((block): block is BlockSlashlink => {
        if (block.type !== BlockType.SLASHLINK) return false;
        const fileId = getFileId(block.data.link);
        if (!fileId) return false;
        return true;
      })
      .map((block): FileId => {
        return getFileId(block.data.link) as string;
      });

    const initiallyResolvedFileIds = note.files.map((file) => file.fileId);
    const unresolvedFileIds = fileIdsInContent.filter((fileId) => {
      return !initiallyResolvedFileIds.includes(fileId);
    });

    Promise
      .allSettled(
        unresolvedFileIds.map(
          (fileId) => databaseProvider.getFileInfo(graphId, fileId),
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


  return <div>
    {
      blocks.map((block) => {
        if (block.type === BlockType.SLASHLINK) {
          const fileId = getFileId(block.data.link);
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
              databaseProvider={databaseProvider}
              key={file.fileId}
              graphId={graphId}
            />;
          } else if (mediaType === MediaType.VIDEO) {
            return <NoteContentBlockVideo
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
              graphId={graphId}
            />;
          } else if (mediaType === MediaType.IMAGE) {
            return <NoteContentBlockImage
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
              description={block.data.text}
              graphId={graphId}
            />;
          } else if (mediaType === MediaType.TEXT) {
            return <NoteContentBlockTextFile
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
              graphId={graphId}
            />;
          } else {
            return <NoteContentBlockDocument
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
              graphId={graphId}
            />;
          }
        } else if (block.type === BlockType.LIST) {
          if (block.data.type === ListBlockStyle.UNORDERED) {
            return <ul
              key={Math.random()}
              className="preview-block-list-unordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>
                  <NoteContentRunningText runningText={item} />
                </li>;
              })}
            </ul>;
          } else {
            return <ol
              key={Math.random()}
              className="preview-block-list-ordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>
                  <NoteContentRunningText runningText={item} />
                </li>;
              })}
            </ol>;
          }
        } else if (block.type === BlockType.PARAGRAPH) {
          return <NoteContentBlockParagraph
            runningText={block.data.text}
            key={Math.random()}
          />;
        } else if (block.type === BlockType.QUOTE) {
          return <NoteContentBlockQuote
            runningText={block.data.text}
            key={Math.random()}
          />;
        } else if (block.type === BlockType.CODE) {
          return <pre
            key={Math.random()}
            className="preview-block-code"
          >
            {block.data.code}
          </pre>;
        } else if (block.type === BlockType.HEADING) {
          return <h2 key={Math.random()}>{block.data.text}</h2>;
        } else if (block.type === BlockType.URL) {
          return <NoteContentBlockUrl
            key={Math.random()}
            blockData={block.data}
          />;
        } else {
          throw new Error("Unexpected block type");
        }
      })
    }
  </div>;
};


export default NoteContent;
