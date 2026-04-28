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
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";
import {
  NOTE_FILE_DESCRIPTION,
  NOTE_FILE_EXTENSION,
  NOTE_MIME_TYPE,
} from "../config";
import { exportNote } from "../lib/FrontendFunctions";

export type ExternalChange
  = { kind: "modified" }
  | { kind: "deleted" };


// =============================================================================
// State sub-hook — owns all useState/refs and state mutators that other
// sub-hooks need. No async I/O or notes-provider calls live here.
// =============================================================================

const useActiveNoteState = () => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const [activeNote, setActiveNote]
    = useState<ActiveNote>(getNewNoteObject({}));
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [externalChange, setExternalChange]
    = useState<ExternalChange | null>(null);
  const noteContentRef = useRef<string>("");
  const unsavedChangesRef = useRef<boolean>(unsavedChanges);
  unsavedChangesRef.current = unsavedChanges;

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


  const handleEditorContentChange = (newContent: string): void => {
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
      additionalHeaders: Object.entries(noteFromServer.meta.additionalHeaders),
      flags: noteFromServer.meta.flags,
    });
    setSlugInput(noteFromServer.meta.slug);
    setDisplayedSlugAliases([...noteFromServer.aliases]);
  };


  return {
    activeNote,
    setActiveNote,
    isBusy,
    setIsBusy,
    externalChange,
    setExternalChange,
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
    noteContentRef,
    unsavedChangesRef,
    handleEditorContentChange,
    setNewNote,
    setActiveNoteFromServer,
  };
};


type ActiveNoteState = ReturnType<typeof useActiveNoteState>;


// =============================================================================
// Actions sub-hook — verbs the user can invoke against the active note
// (save / load / remove / duplicate / import / export). All notes-provider
// I/O lives here. Reads and writes the state object exposed by
// useActiveNoteState.
// =============================================================================

const useActiveNoteActions = (
  state: ActiveNoteState,
  notesProvider: NotesProviderProxy,
) => {
  const createNewNote = async (params: CreateNewNoteParams) => {
    state.setNewNote(params);

    if (params.content) {
      state.setUnsavedChanges(true);
    }

    state.updateEditorInstance();
  };


  const prepareNoteSaveRequest = (): NoteSaveRequest => {
    const { activeNote, slugInput, displayedSlugAliases, updateReferences }
      = state;

    if (activeNote.isUnsaved) {
      return {
        note: {
          content: state.noteContentRef.current,
          meta: {
            additionalHeaders: {},
            flags: activeNote.flags,
          },
        },
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: NotesProviderProxy.isValidSlug(slugInput)
          ? slugInput
          : undefined,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput
            && a.trim().length > 0
            && NotesProviderProxy.isValidSlug(a);
        })),
      };
    } else {
      return {
        note: {
          content: state.noteContentRef.current,
          meta: {
            additionalHeaders: Object.fromEntries(activeNote.additionalHeaders),
            slug: activeNote.slug,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
          },
        },
        // for new notes, use slug input if available. for existing notes, use
        // slug input only if it's different from the current slug.
        changeSlugTo: slugInput !== activeNote.slug
          && NotesProviderProxy.isValidSlug(slugInput)
          ? slugInput
          : undefined,
        updateReferences: slugInput !== activeNote.slug
          && NotesProviderProxy.isValidSlug(slugInput)
          && updateReferences,
        aliases: new Set(displayedSlugAliases.filter((a) => {
          return a !== slugInput
            && a.trim().length > 0
            && NotesProviderProxy.isValidSlug(a);
        })),
      };
    }
  };


  const save = async (): Promise<NoteToTransmit> => {
    if (!NotesProviderProxy.isValidNoteSlugOrEmpty(state.slugInput)) {
      throw new Error("Tried saving an invalid slug. This should not happen!");
    }

    const noteSaveRequest = prepareNoteSaveRequest();
    const noteFromDatabase = await notesProvider.put(noteSaveRequest);
    state.setActiveNoteFromServer(noteFromDatabase);
    // After the saving has been done, let's check if there was an editor update
    // in the meantime. Only if there was no editor update, we can be sure
    // that we have no new unsaved changes.
    if (noteFromDatabase.content === state.noteContentRef.current) {
      state.setUnsavedChanges(false);
    }
    return noteFromDatabase;
  };


  const importFromFile = async (): Promise<void> => {
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
      flags: [...parsedNote.meta.flags, "IMPORTED"],
      files: new Set(),
    };
    state.setActiveNote(newActiveNote);
    // If the user does not change the slug input, we let the app
    // suggest the slug of an imported note.
    state.setSlugInput("");
    state.setUnsavedChanges(true);
    state.noteContentRef.current = parsedNote.content;
    state.updateEditorInstance();
  };


  const remove = async () => {
    if (state.activeNote.isUnsaved) {
      return;
    }

    await notesProvider.remove(state.activeNote.slug);

    createNewNote({});
    state.setUnsavedChanges(false);
  };


  const duplicate = async (): Promise<NoteToTransmit> => {
    if (state.activeNote.isUnsaved) {
      throw new Error("Cannot duplicate an unsaved note");
    }

    const noteSaveRequest: NewNoteSaveRequest = {
      note: {
        meta: {
          additionalHeaders: Object.fromEntries(
            state.activeNote.additionalHeaders,
          ),
          flags: [
            ...state.activeNote.flags,
            `DUPLICATE_OF(${state.activeNote.slug})`,
          ],
        },
        content: state.noteContentRef.current,
      },
      aliases: new Set(),
    };
    const noteFromServer = await notesProvider.put(noteSaveRequest);
    state.setActiveNoteFromServer(noteFromServer);
    state.updateEditorInstance();
    return noteFromServer;
  };


  const exportToFile = () => {
    exportNote(state.activeNote, state.noteContentRef.current, notesProvider);
  };


  const load = async (
    slug: Slug | "random" | "new",
    contentForNewNote?: string,
  ): Promise<Slug | null> => {
    state.setExternalChange(null);
    if (slug === "new") {
      createNewNote({
        slug: undefined,
        content: contentForNewNote ?? "",
      });

      return Promise.resolve(null);
    }

    let receivedNoteSlug: Slug | null = null;
    state.setIsBusy(true);
    try {
      const noteFromServer
        = slug === "random"
          ? await notesProvider.getRandom()
          : await notesProvider.get(slug);
      state.setActiveNoteFromServer(noteFromServer);
      receivedNoteSlug = noteFromServer.meta.slug;
      state.updateEditorInstance();
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
    state.setIsBusy(false);
    return receivedNoteSlug;
  };


  return { save, importFromFile, exportToFile, remove, duplicate, load };
};


type ActiveNoteActions = ReturnType<typeof useActiveNoteActions>;


// =============================================================================
// External change detection sub-hook — handles cross-tab sync. Watches for
// disk-side mutations to the active note and surfaces a banner state plus
// reload/dismiss handlers. Depends on actions.load to perform reloads.
// =============================================================================

const useExternalChangeDetection = (
  state: ActiveNoteState,
  load: ActiveNoteActions["load"],
  notesProvider: NotesProviderProxy,
) => {
  const check = async (): Promise<void> => {
    if (state.activeNote.isUnsaved) return;
    const slug = state.activeNote.slug;
    try {
      const fresh = await notesProvider.get(slug);
      const localContent = state.noteContentRef.current;
      if (fresh.content === localContent) {
        // No real change for this note (broadcast was for something else).
        return;
      }
      if (!state.unsavedChangesRef.current) {
        // Clean editor: silently adopt the new content.
        state.setActiveNoteFromServer(fresh);
        state.updateEditorInstance();
      } else {
        state.setExternalChange({ kind: "modified" });
      }
    } catch (e) {
      if (e instanceof Error && e.message === "NOTE_NOT_FOUND") {
        state.setExternalChange({ kind: "deleted" });
      }
    }
  };


  const reload = async (): Promise<void> => {
    if (state.activeNote.isUnsaved) return;
    state.setExternalChange(null);
    state.setUnsavedChanges(false);
    await load(state.activeNote.slug);
  };


  const dismiss = (): void => {
    state.setExternalChange(null);
  };


  return { check, reload, dismiss };
};


// =============================================================================
// Orchestrator — wires the three sub-hooks together and exposes the same
// grouped return shape NoteView already consumes.
// =============================================================================

export default (notesProvider: NotesProviderProxy) => {
  const state = useActiveNoteState();
  const actions = useActiveNoteActions(state, notesProvider);
  const externalChange = useExternalChangeDetection(
    state,
    actions.load,
    notesProvider,
  );

  return {
    activeNote: state.activeNote,
    setActiveNote: state.setActiveNote,
    isBusy: state.isBusy,
    unsavedChanges: state.unsavedChanges,
    setUnsavedChanges: state.setUnsavedChanges,
    slugForm: {
      input: state.slugInput,
      setInput: state.setSlugInput,
      aliases: state.displayedSlugAliases,
      setAliases: state.setDisplayedSlugAliases,
    },
    editor: {
      instanceId: state.editorInstanceId,
      updateInstance: state.updateEditorInstance,
      handleContentChange: state.handleEditorContentChange,
    },
    references: {
      update: state.updateReferences,
      setUpdate: state.setUpdateReferences,
    },
    actions,
    externalChange: {
      state: state.externalChange,
      check: externalChange.check,
      reload: externalChange.reload,
      dismiss: externalChange.dismiss,
    },
  };
};
