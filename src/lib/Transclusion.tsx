import { ReactElement } from "react";
import { getLines } from "./utils";
import { getNoteTitle, removeWikilinkPunctuation } from "./notes/noteUtils";
import ActiveNote from "../types/ActiveNote";
import NotesProvider from "./notes";
import { Slug } from "./notes/types/Slug";
import { isFileSlug } from "./notes/slugUtils";
import { getMediaTypeFromFilename } from "./notes/utils";
import { MediaType } from "./notes/types/MediaType";
import NoteContentBlockAudio from "../components/NoteContentBlockAudio";
import NoteContentBlockVideo from "../components/NoteContentBlockVideo";
import NoteContentBlockImage from "../components/NoteContentBlockImage";
import NoteContentBlockTextFile from "../components/NoteContentBlockTextFile";
import NoteContentBlockDocument from "../components/NoteContentBlockDocument";

const getSummary = (
  noteContent: string,
  noteTitle: string,
): string => {
  const MAX_LINES = 5;

  const nonEmptyLines = noteContent
    .split("\n")
    .filter((line) => line.trim().length > 0);

  let transclusionContent;

  const noteContentContainsTitle = removeWikilinkPunctuation(nonEmptyLines[0])
    .includes(noteTitle);

  if (nonEmptyLines.length <= MAX_LINES) {
    transclusionContent = noteContentContainsTitle
      ? nonEmptyLines.slice(1).join("\n")
      : nonEmptyLines.join("\n");
  } else {
    transclusionContent = getLines(
      noteContent,
      noteContentContainsTitle ? 1 : 0,
      MAX_LINES,
      true,
    ) + "\n…";
  }

  return removeWikilinkPunctuation(transclusionContent);
};


export const getNoteTransclusionContent = (
  noteContent: string,
  noteTitle: string,
): ReactElement => {
  const summary = getSummary(noteContent, noteTitle);

  return <p className="transclusion-note-content">
    <span className="transclusion-note-title">{noteTitle}</span>
    {summary}
  </p>;
};


export const getTransclusionContent = async (
  slug: Slug,
  note: ActiveNote,
  notesProvider: NotesProvider,
): Promise<ReactElement> => {
  if (!slug) {
    throw new Error("INVALID_FILE_SLUG");
  }

  if (isFileSlug(slug)) {
    const availableFileInfos = [
      ...note.files,
    ];

    const mediaType = getMediaTypeFromFilename(slug);
    let file = availableFileInfos.find((file) => file.slug === slug);

    if (!file) {
      file = await notesProvider.getFileInfo(slug);
    }

    if (
      mediaType === MediaType.AUDIO
    ) {
      return <NoteContentBlockAudio
        file={file}
        notesProvider={notesProvider}
        key={file.slug}
      />;
    } else if (mediaType === MediaType.VIDEO) {
      return <NoteContentBlockVideo
        file={file}
        notesProvider={notesProvider}
        key={file.slug}
      />;
    } else if (mediaType === MediaType.IMAGE) {
      return <NoteContentBlockImage
        file={file}
        notesProvider={notesProvider}
        key={file.slug}
      />;
    } else if (mediaType === MediaType.TEXT) {
      return <NoteContentBlockTextFile
        file={file}
        notesProvider={notesProvider}
        key={file.slug}
      />;
    } else {
      return <NoteContentBlockDocument
        file={file}
        key={file.slug}
      />;
    }
  }

  if ("outgoingLinks" in note) {
    const linkedNote = note.outgoingLinks.find(
      (link) => link.slug === slug,
    );

    if (linkedNote) {
      return getNoteTransclusionContent(linkedNote.content, linkedNote.title);
    }
  }

  const linkedNote = await notesProvider.get(slug);
  return getNoteTransclusionContent(
    linkedNote.content,
    getNoteTitle(linkedNote),
  );
};

export const exportedForTesting = {
  getSummary,
};

