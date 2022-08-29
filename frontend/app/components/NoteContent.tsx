import React from "react";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import subwaytext from "../../../lib/subwaytext/index";
import { BlockType, ListBlockStyle } from "../../../lib/subwaytext/interfaces/Block";
import ActiveNote from "../interfaces/ActiveNote";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { getFileId, getMediaTypeFromFilename, parseFileIds } from "../lib/utils";
import NoteContentBlockAudio from "./NoteContentBlockAudio";
import NoteContentBlockDocument from "./NoteContentBlockDocument";
import NoteContentBlockEmptyFile from "./NoteContentBlockEmptyFile";
import NoteContentBlockParagraph from "./NoteContentBlockParagraph";
import NoteContentBlockVideo from "./NoteContentBlockVideo";
import NoteContentBlockImage from "./NoteContentBlockImage";
import NoteContentEmptyDisclaimer from "./NoteContentEmptyDisclaimer";
import NoteContentBlockUrl from "./NoteContentBlockUrl";

interface NoteContentProps {
  note: ActiveNote,
  databaseProvider: DatabaseProvider,
  toggleEditMode,
}


const NoteContent = ({
  note,
  databaseProvider,
  toggleEditMode,
}: NoteContentProps) => {
  const blocks = subwaytext(note.content);

  if (blocks.length === 0) {
    return <NoteContentEmptyDisclaimer
      toggleEditMode={toggleEditMode}
    />
  }

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
            = note.files.find((file) => file.fileId === fileId);
          if (!file) {
            return <NoteContentBlockEmptyFile />;
          }
          if (
            mediaType === MediaType.AUDIO
          ) {
            return <NoteContentBlockAudio
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
            />;
          } else if (mediaType === MediaType.VIDEO) {
            return <NoteContentBlockVideo
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
            />;
          } else if (mediaType === MediaType.IMAGE) {
            return <NoteContentBlockImage
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
              description={block.data.text}
            />;
          } else {
            return <NoteContentBlockDocument
              file={file}
              databaseProvider={databaseProvider}
              key={file.fileId}
            />;
          }
        } else if (block.type === BlockType.LIST) {
          if (block.data.type === ListBlockStyle.UNORDERED) {
            return <ul
              key={Math.random()}
              className="preview-block-list-unordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>{item}</li>
              })}
            </ul>;
          } else {
            return <ol
              key={Math.random()}
              className="preview-block-list-ordered"
            >
              {block.data.items.map((item) => {
                return <li key={Math.random()}>{item}</li>
              })}
            </ol>;
          }
        } else if (block.type === BlockType.PARAGRAPH) {
          return <NoteContentBlockParagraph
            text={block.data.text}
            key={Math.random()}
          />
        } else if (block.type === BlockType.CODE) {
          return <pre
            key={Math.random()}
            className="preview-block-code"
          >
            {block.data.code}
          </pre>;
        } else if (block.type === BlockType.HEADING) {
          return <h2 key={Math.random()}>{block.data.text}</h2>
        } else if (block.type === BlockType.URL) {
          return <NoteContentBlockUrl
            key={Math.random()}
            blockData={block.data}
          />;
        }
      })
    }
  </div>;
};


export default NoteContent;
