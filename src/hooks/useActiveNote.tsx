import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "../lib/notes/types/NoteSaveRequest";
import {
  parseSerializedNewNote,
} from "../lib/notes/noteUtils";
import ActiveNote, { UnsavedActiveNote } from "../types/ActiveNote";
import { useContext, useRef, useState } from "react";
import {
  getFilesFromUserSelection,
  getNewNoteObject,
  readFileAsString,
} from "../lib/utils";
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
import { exportNote } from "../lib/FrontendFunctions";

export default (
  notesProvider: NotesProvider,
) => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const newNoteObject: UnsavedActiveNote = getNewNoteObject({});
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const noteContentRef = useRef<string>("");

  /* Deliberately setting this always to false instead of saving preference
  in local storage, so the user has to make this decision more consciously. */
  const [updateReferences, setUpdateReferences] = useState<boolean>(false);

  const [slugInput, setSlugInput] = useState<string>("");
  const [
    displayedSlugAliases,
    setDisplayedSlugAliases,
  ] = useState<string[]>([]);
  const [editorInstanceId, setEditorInstanceId] = useState<number>(
    Math.random(),
  );


  const updateEditorInstance = () => {
    setEditorInstanceId(Math.random());
  };


  const handleEditorContentChange = (
    newContent: string,
  ): void => {
    if (noteContentRef.current !== newContent) {
      setUnsavedChanges(true);
    }

    noteContentRef.current = newContent;
  };


  const setNewNote = (params: CreateNewNoteParams) => {
    const newNoteObject: UnsavedActiveNote = getNewNoteObject(params);
    setActiveNote(newNoteObject);
    setSlugInput(params.slug || "");
    setDisplayedSlugAliases([]);
    noteContentRef.current = "";
  };


  const createNewNote = async (params: CreateNewNoteParams) => {
    setNewNote(params);

    if (params.content) {
      setUnsavedChanges(true);
    }

    updateEditorInstance();
  };


  const setActiveNoteFromServer = (
    noteFromServer: NoteToTransmit,
  ): void => {
    /*
      When we load another existing note, we should refresh our noteContentRef
      as it should represent the current state of the editor.
      When we call this function after a note save, we should not update
      noteContentRef because the editor might already be in a newer state which
      we do not want to overwrite with force.
    */
    if (
      !("slug" in activeNote)
      || noteFromServer.meta.slug !== activeNote.slug
    ) {
      noteContentRef.current = noteFromServer.content;
    }
    setActiveNote({
      slug: noteFromServer.meta.slug,
      // might be better to create a new set here
      aliases: new Set(noteFromServer.aliases),
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      outgoingLinks: noteFromServer.outgoingLinks,
      backlinks: noteFromServer.backlinks,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      numberOfBlocks: noteFromServer.numberOfBlocks,
      isUnsaved: false,
      initialContent: noteFromServer.content,
      files: noteFromServer.files,
      keyValues: Object.entries(noteFromServer.meta.custom),
      flags: noteFromServer.meta.flags,
      contentType: noteFromServer.meta.contentType,
    });
    setSlugInput(noteFromServer.meta.slug);
    setDisplayedSlugAliases([...noteFromServer.aliases]);
  };


  const prepareNoteSaveRequest = (
    ignoreDuplicateTitles: boolean,
  ): NoteSaveRequest => {
    if (activeNote.isUnsaved) {
      return {
        note: {
          content: noteContentRef.current,
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
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput
            && a.trim().length > 0
            && NotesProvider.isValidSlug(a);
        })),
      };
    } else {
      return {
        note: {
          content: noteContentRef.current,
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
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput
            && a.trim().length > 0
            && NotesProvider.isValidSlug(a);
        })),
      };
    }
  };


  const saveActiveNote = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteToTransmit> => {
    if (!NotesProvider.isValidSlugOrEmpty(slugInput)) {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }

    const noteSaveRequest = prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromDatabase);
    // After the saving has been done, let's check if there was an editor update
    // in the meantime. Only if there was no editor update, we can be sure
    // that we have no new unsaved changes.
    if (noteFromDatabase.content === noteContentRef.current) {
      setUnsavedChanges(false);
    }
    return noteFromDatabase;
  };


  const importNote = async (): Promise<void> => {
    const types = [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] },
    }];

    const [rawNoteFile] = await getFilesFromUserSelection(types, false);
    const rawNote = await readFileAsString(rawNoteFile);

    const parsedNote = parseSerializedNewNote(rawNote);
    const newActiveNote: UnsavedActiveNote = {
      isUnsaved: true,
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
    noteContentRef.current = parsedNote.content;
    updateEditorInstance();
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await notesProvider.remove(activeNote.slug);

    createNewNote({});
    setUnsavedChanges(false);
  };


  const duplicateNote = async (): Promise<NoteToTransmit> => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot duplicate an unsaved note");
    }

    const noteSaveRequest: NewNoteSaveRequest = {
      note: {
        meta: {
          custom: Object.fromEntries(activeNote.keyValues),
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.slug})`],
          contentType: activeNote.contentType,
        },
        content: noteContentRef.current,
      },
      ignoreDuplicateTitles: true,
      aliases: new Set(),
    };
    const noteFromServer = await notesProvider.put(noteSaveRequest);
    setActiveNoteFromServer(noteFromServer);
    updateEditorInstance();
    return noteFromServer;
  };


  const handleNoteExportRequest = () => {
    exportNote(activeNote, noteContentRef.current, notesProvider);
  };


  const loadNote = async (
    slug: Slug | "random" | "new",
    contentForNewNote?: string,
  ): Promise<Slug | null> => {
    if (slug === "new") {
      createNewNote({
        slug: undefined,
        content: contentForNewNote ?? "",
      });

      return Promise.resolve(null);
    }

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
          content: contentForNewNote ?? "",
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
    handleEditorContentChange,
    saveActiveNote,
    setActiveNote,
    importNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest,
  };
};
