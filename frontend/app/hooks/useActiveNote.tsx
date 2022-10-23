import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import FrontendUserNoteChange, {
  FrontendUserNoteChangeNote,
} from "../types/FrontendUserNoteChange";
import { MainNoteListItem } from "../types/NoteListItem";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "../../../lib/notes/interfaces/NoteSaveRequest";
import UserNoteChange from "../../../lib/notes/interfaces/UserNoteChange";
import { parseSerializedNewNote } from "../../../lib/notes/noteUtils";
import ActiveNote, { UnsavedActiveNote } from "../types/ActiveNote";
import useDisplayedLinkedNotes from "../hooks/useDisplayedLinkedNotes";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import { useContext, useState } from "react";
import {
  getFilesFromUserSelection,
  getNewNoteObject,
  readFileAsString,
  setNoteTitleByContentIfUnset,
} from "../lib/utils";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { DEFAULT_NOTE_TITLE } from "../config";
import DatabaseProvider from "../types/DatabaseProvider";
import { FileId } from "../../../lib/notes/interfaces/FileId";

export default (
  databaseProvider: DatabaseProvider,
  graphId: GraphId,
  handleInvalidCredentialsError,
) => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const newNoteObject: UnsavedActiveNote = getNewNoteObject([]);
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  const displayedLinkedNotes = useDisplayedLinkedNotes(activeNote);
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const handleLinkAddition = async (note: MainNoteListItem): Promise<void> => {
    // return if linked note has already been added
    if (activeNote.changes.some((change) => {
      return (
        change.type === UserNoteChangeType.LINKED_NOTE_ADDED
        && change.noteId === note.id
      );
    })) {
      return;
    }

    // remove possible LINKED_NOTE_DELETED changes
    const newChanges = [
      ...activeNote.changes.filter((change) => {
        return !(
          change.type === UserNoteChangeType.LINKED_NOTE_DELETED
          && change.noteId === note.id
        );
      }),
    ];

    // if linkedNote is NOT already there and saved,
    // let's add a LINKED_NOTE_ADDED change
    if (
      activeNote.isUnsaved
      || (!activeNote.linkedNotes.find((linkedNote) => {
        return linkedNote.id === note.id;
      }))
    ) {
      newChanges.push(
        {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: note.id,
          note: {
            id: note.id,
            title: note.title,
            updatedAt: note.updatedAt,
          },
        },
      );
    }

    setActiveNote({
      ...activeNote,
      changes: newChanges,
    });

    setUnsavedChanges(true);
  };


  const handleLinkRemoval = async (linkedNoteId: NoteId) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === UserNoteChangeType.LINKED_NOTE_DELETED
        && change.noteId === linkedNoteId
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      changes: [
        ...activeNote.changes.filter(
          (change: FrontendUserNoteChange): boolean => {
            return !(
              change.type === UserNoteChangeType.LINKED_NOTE_ADDED
              && change.noteId === linkedNoteId
            );
          },
        ),
        {
          type: UserNoteChangeType.LINKED_NOTE_DELETED,
          noteId: linkedNoteId,
        },
      ],
    });

    setUnsavedChanges(true);
  };


  const setNoteContent = (newContent: string): void => {
    setActiveNote((previousState) => {
      return {
        ...previousState,
        content: newContent,
      };
    });
    setUnsavedChanges(true);
  };


  const setNewNote = (
    linkedNotes: FrontendUserNoteChangeNote[],
    fileIds?: FileId[],
  ) => {
    const newNoteObject: UnsavedActiveNote
      = getNewNoteObject(
        linkedNotes,
        fileIds,
      );
    setActiveNote(newNoteObject);
  };


  const createNewNote = async (
    linkedNotes?: FrontendUserNoteChangeNote[],
    fileIds?: FileId[],
    useForce?: boolean,
  ) => {
    if (unsavedChanges && (!useForce)) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    setNewNote(linkedNotes || [], fileIds);
  };


  const setActiveNoteFromServer = (noteFromServer: NoteToTransmit): void => {
    setActiveNote({
      id: noteFromServer.meta.id,
      title: noteFromServer.meta.title,
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      position: noteFromServer.meta.position,
      linkedNotes: noteFromServer.linkedNotes,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      isUnsaved: false,
      changes: [],
      content: noteFromServer.content,
      files: noteFromServer.files,
      keyValues: Object.entries(noteFromServer.meta.custom),
      flags: noteFromServer.meta.flags,
      contentType: noteFromServer.meta.contentType,
    });
  };


  const prepareNoteSaveRequest = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteSaveRequest> => {
    const noteSaveRequest = {
      note: {
        content: activeNote.content,
        meta: activeNote.isUnsaved
          ? {
            title: activeNote.title,
            custom: Object.fromEntries(activeNote.keyValues),
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          }
          : {
            title: activeNote.title,
            custom: Object.fromEntries(activeNote.keyValues),
            id: activeNote.id,
            position: activeNote.position,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          },
      },
      changes: activeNote.changes.map(
        (change: FrontendUserNoteChange): UserNoteChange => {
          return {
            type: change.type,
            noteId: change.noteId,
          };
        }),
      ignoreDuplicateTitles,
    };

    setNoteTitleByContentIfUnset(
      noteSaveRequest.note,
      DEFAULT_NOTE_TITLE,
    );

    return noteSaveRequest;
  };


  const saveActiveNote = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteToTransmit> => {
    const noteSaveRequest = await prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await databaseProvider.putNote(
      graphId,
      noteSaveRequest,
    );
    setActiveNoteFromServer(noteFromDatabase);
    setUnsavedChanges(false);
    return noteFromDatabase;
  };


  const createNewLinkedNote = () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot create linked note of unsaved note");
    }

    const linkedNote: FrontendUserNoteChangeNote = {
      id: activeNote.id,
      updatedAt: activeNote.updatedAt,
      title: activeNote.title,
    };

    createNewNote([linkedNote]);
  };


  const importNote = async (): Promise<void> => {
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
    }

    const types = [{
      description: "NENO note",
      accept: { "application/neno-note": [".neno"] },
    }];

    const [rawNoteFile] = await getFilesFromUserSelection(types, false);
    const rawNote = await readFileAsString(rawNoteFile);

    try {
      const parsedNote = parseSerializedNewNote(rawNote);
      const newActiveNote: UnsavedActiveNote = {
        isUnsaved: true,
        title: parsedNote.meta.title,
        changes: [],
        content: parsedNote.content,
        keyValues: Object.entries(parsedNote.meta.custom),
        flags: [...parsedNote.meta.flags, "IMPORTED"],
        contentType: parsedNote.meta.contentType,
        files: [],
      };
      setActiveNote(newActiveNote);
      setUnsavedChanges(true);
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw e;
      }
    }
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider.deleteNote(graphId, activeNote.id);

    // using force here because a delete prompt dialog has already been shown
    createNewNote([], [], true);
    setUnsavedChanges(false);
  };


  const duplicateNote = async (): Promise<NoteToTransmit> => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot duplicate an unsaved note");
    }

    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    const noteSaveRequest: NewNoteSaveRequest = {
      note: {
        meta: {
          title: activeNote.title,
          custom: Object.fromEntries(activeNote.keyValues),
          position: {
            x: activeNote.position.x + 20,
            y: activeNote.position.y + 20,
          },
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.id})`],
          contentType: activeNote.contentType,
        },
        content: activeNote.content,
      },
      changes: activeNote.linkedNotes.map((linkedNote) => {
        return {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: linkedNote.id,
        };
      }),
      ignoreDuplicateTitles: true,
    };
    const noteFromServer = await databaseProvider.putNote(
      graphId,
      noteSaveRequest,
    );

    return noteFromServer;
  };


  const loadNote = async (graphId: GraphId, noteId: NoteId): Promise<void> => {
    try {
      const noteFromServer
        = await databaseProvider.getNote(graphId, noteId);
      if (noteFromServer) {
        setActiveNoteFromServer(noteFromServer);
      } else {
        throw new Error("No note received");
      }
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw e;
      }
    }
  };


  return {
    activeNote,
    displayedLinkedNotes,
    handleLinkAddition,
    handleLinkRemoval,
    setNoteContent,
    saveActiveNote,
    setActiveNote,
    createNewNote,
    createNewLinkedNote,
    importNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    unsavedChanges,
    setUnsavedChanges,
  };
};
