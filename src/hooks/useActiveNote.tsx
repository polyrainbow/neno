import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "../lib/notes/types/NoteSaveRequest";
import {
  parseSerializedNewNote,
} from "../lib/notes/noteUtils";
import ActiveNote, { UnsavedActiveNote } from "../types/ActiveNote";
import { useContext, useState } from "react";
import {
  getFilesFromUserSelection,
  getNewNoteObject,
  getNoteTitleFromActiveNote,
  getWikilinkForNote,
  readFileAsString,
} from "../lib/utils";
import useConfirmDiscardingUnsavedChangesDialog
  from "./useConfirmDiscardingUnsavedChangesDialog";
import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import { Slug } from "../lib/notes/types/Slug";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import NotesProvider from "../lib/notes";
import {
  NOTE_FILE_DESCRIPTION,
  NOTE_FILE_EXTENSION,
  NOTE_MIME_TYPE,
} from "../config";

export default (
  notesProvider: NotesProvider,
) => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const newNoteObject: UnsavedActiveNote = getNewNoteObject({});
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  /* Deliberately setting this always to false instead of saving preference
  in local storage, so the user has to make this decision more consciously. */
  const [updateReferences, setUpdateReferences] = useState<boolean>(false);

  const [slugInput, setSlugInput] = useState<string>("");
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const [editorInstanceId, setEditorInstanceId] = useState<number>(
    Math.random(),
  );


  const updateEditorInstance = () => {
    setEditorInstanceId(Math.random());
  };


  const setNoteContent = (
    newContent: string,
    refreshEditor?: boolean,
  ): void => {
    if (activeNote.content !== newContent) {
      setUnsavedChanges(true);
    }

    setActiveNote((previousState: ActiveNote): ActiveNote => {
      const newNote: ActiveNote = {
        ...previousState,
        content: newContent,
      };

      if (refreshEditor) {
        newNote.initialContent = newContent;
      }

      return newNote;
    });
  };


  const setNewNote = (params: CreateNewNoteParams) => {
    const newNoteObject: UnsavedActiveNote = getNewNoteObject(params);
    setActiveNote(newNoteObject);
    setSlugInput(params.slug || "");
  };


  const createNewNote = async (params: CreateNewNoteParams) => {
    if (unsavedChanges && (!params.useForce)) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    setNewNote(params);

    if (params.content) {
      setUnsavedChanges(true);
    }

    updateEditorInstance();
  };


  const setActiveNoteFromServer = (noteFromServer: NoteToTransmit): void => {
    setActiveNote({
      slug: noteFromServer.meta.slug,
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      outgoingLinks: noteFromServer.outgoingLinks,
      backlinks: noteFromServer.backlinks,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      isUnsaved: false,
      content: noteFromServer.content,
      initialContent: noteFromServer.content,
      files: noteFromServer.files,
      keyValues: Object.entries(noteFromServer.meta.custom),
      flags: noteFromServer.meta.flags,
      contentType: noteFromServer.meta.contentType,
    });

    setSlugInput(noteFromServer.meta.slug);
  };


  const prepareNoteSaveRequest = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteSaveRequest> => {
    if (activeNote.isUnsaved) {
      return {
        note: {
          content: activeNote.content,
          meta: {
            custom: Object.fromEntries(activeNote.keyValues),
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          },
        },
        ignoreDuplicateTitles,
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: NotesProvider.isValidSlug(slugInput)
          ? slugInput
          : undefined,
      };
    } else {
      return {
        note: {
          content: activeNote.content,
          meta: {
            custom: Object.fromEntries(activeNote.keyValues),
            slug: activeNote.slug,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          },
        },
        ignoreDuplicateTitles,
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: slugInput !== activeNote.slug
          && NotesProvider.isValidSlug(slugInput)
          ? slugInput
          : undefined,
        updateReferences: slugInput !== activeNote.slug
          && NotesProvider.isValidSlug(slugInput)
          && updateReferences,
      };
    }
  };


  const saveActiveNote = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteToTransmit> => {
    if ((!NotesProvider.isValidSlug(slugInput)) && slugInput !== "") {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }

    const noteSaveRequest = await prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromDatabase);
    setUnsavedChanges(false);
    return noteFromDatabase;
  };


  const createNewLinkedNote = () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot create linked note of unsaved note");
    }

    const wikilink = getWikilinkForNote(
      activeNote.slug,
      getNoteTitleFromActiveNote(activeNote),
    );

    createNewNote({
      content: `${wikilink}\n`,
    });
  };


  const importNote = async (): Promise<void> => {
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
    }

    const types = [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] },
    }];

    const [rawNoteFile] = await getFilesFromUserSelection(types, false);
    const rawNote = await readFileAsString(rawNoteFile);

    const parsedNote = parseSerializedNewNote(rawNote);
    const newActiveNote: UnsavedActiveNote = {
      isUnsaved: true,
      content: parsedNote.content,
      initialContent: parsedNote.content,
      keyValues: Object.entries(parsedNote.meta.custom),
      flags: [...parsedNote.meta.flags, "IMPORTED"],
      contentType: parsedNote.meta.contentType,
      files: [],
    };
    setActiveNote(newActiveNote);
    // For now, we let the system suggest the slug for imported notes.
    // TODO: Could be improved in the future.
    setSlugInput("");
    setUnsavedChanges(true);
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await notesProvider.remove(activeNote.slug);

    // using force here because a delete prompt dialog has already been shown
    createNewNote({
      useForce: true,
    });
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
          custom: Object.fromEntries(activeNote.keyValues),
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.slug})`],
          contentType: activeNote.contentType,
        },
        content: activeNote.content,
      },
      ignoreDuplicateTitles: true,
    };
    const noteFromServer = await notesProvider.put(noteSaveRequest);

    return noteFromServer;
  };


  const loadNote = async (slug: Slug | "random"): Promise<Slug | null> => {
    let receivedNoteSlug: Slug | null = null;
    setIsBusy(true);
    try {
      const noteFromServer
        = slug === "random"
          ? await notesProvider.getRandom()
          : await notesProvider.get(slug);
      setActiveNoteFromServer(noteFromServer);
      receivedNoteSlug = noteFromServer.meta.slug;
      updateEditorInstance();
    } catch (e) {
      if (e instanceof Error && e.message === "NOTE_NOT_FOUND") {
        createNewNote({
          slug,
          content: "",
        });
      } else {
        throw e;
      }
    }
    setIsBusy(false);
    return receivedNoteSlug;
  };


  return {
    isBusy,
    activeNote,
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
    slugInput,
    setSlugInput,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
  };
};
