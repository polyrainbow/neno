import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "../lib/notes/interfaces/NoteSaveRequest";
import { parseSerializedNewNote } from "../lib/notes/noteUtils";
import ActiveNote, { UnsavedActiveNote } from "../types/ActiveNote";
import { useContext, useState } from "react";
import {
  getFilesFromUserSelection,
  getNewNoteObject,
  readFileAsString,
} from "../lib/utils";
import useConfirmDiscardingUnsavedChangesDialog
  from "./useConfirmDiscardingUnsavedChangesDialog";
import NoteToTransmit from "../lib/notes/interfaces/NoteToTransmit";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import { Slug } from "../lib/notes/interfaces/Slug";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import NotesProvider from "../lib/notes";

export default (
  databaseProvider: NotesProvider,
  handleInvalidCredentialsError: () => void,
) => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const newNoteObject: UnsavedActiveNote = getNewNoteObject({});
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [slugInput, setSlugInput] = useState<string>("");
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();


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
  };


  const setActiveNoteFromServer = (noteFromServer: NoteToTransmit): void => {
    setActiveNote({
      slug: noteFromServer.meta.slug,
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      position: noteFromServer.meta.position,
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
    const noteSaveRequest = {
      note: {
        content: activeNote.content,
        meta: activeNote.isUnsaved
          ? {
            custom: Object.fromEntries(activeNote.keyValues),
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          }
          : {
            custom: Object.fromEntries(activeNote.keyValues),
            slug: activeNote.slug,
            position: activeNote.position,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          },
      },
      ignoreDuplicateTitles,
      // for new notes, use slug input if available. for existing notes, use
      // slug input only if it's different from the current slug.
      changeSlugTo: activeNote.isUnsaved
        ? (
          NotesProvider.isValidSlug(slugInput)
            ? slugInput
            : undefined
        )
        : (
          slugInput !== activeNote.slug && NotesProvider.isValidSlug(slugInput)
            ? slugInput
            : undefined
        ),
    };

    return noteSaveRequest;
  };


  const saveActiveNote = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteToTransmit> => {
    if ((!NotesProvider.isValidSlug(slugInput)) && slugInput !== "") {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }

    const noteSaveRequest = await prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await databaseProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromDatabase);
    setUnsavedChanges(false);
    return noteFromDatabase;
  };


  const createNewLinkedNote = () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot create linked note of unsaved note");
    }

    createNewNote({
      content: `[[${activeNote.slug}]]\n`,
    });
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

    await databaseProvider.remove(activeNote.slug);

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
          position: {
            x: activeNote.position.x + 20,
            y: activeNote.position.y + 20,
          },
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.slug})`],
          contentType: activeNote.contentType,
        },
        content: activeNote.content,
      },
      ignoreDuplicateTitles: true,
    };
    const noteFromServer = await databaseProvider.put(noteSaveRequest);

    return noteFromServer;
  };


  const loadNote = async (slug: Slug | "random"): Promise<Slug | null> => {
    let receivedNoteSlug: Slug | null = null;
    setIsBusy(true);
    try {
      const noteFromServer
        = await databaseProvider.get(slug);
      setActiveNoteFromServer(noteFromServer);
      receivedNoteSlug = noteFromServer.meta.slug;
    } catch (e) {
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else if (e instanceof Error && e.message === "NOTE_NOT_FOUND") {
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
  };
};
