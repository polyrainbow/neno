import { Slug } from "../lib/notes/types/Slug";
import ActiveNote from "../types/ActiveNote";
import NoteControls from "./NoteControls";
import StatusIndicator from "./StatusIndicator";

interface NoteMenuBarProps {
  activeNote: ActiveNote,
  handleNoteSaveRequest: () => void,
  removeActiveNote: () => void,
  unsavedChanges: boolean,
  setUnsavedChanges: (value: boolean) => void,
  pinOrUnpinNote: (slug: Slug) => void,
  duplicateNote: () => void,
  handleUploadFilesRequest: () => void,
  uploadInProgress: boolean,
  importNote: () => void,
  disableNoteSaving: boolean,
  handleNoteExportRequest: () => void,
  loadNote: (
    slug: Slug | "random" | "new",
    contentForNewNote?: string,
  ) => Promise<Slug | null>,
}

const NoteMenuBar = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  uploadInProgress,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest,
  loadNote,
}: NoteMenuBarProps) => {
  return <section className="note-controls">
    <div className="note-controls-left">
      <NoteControls
        activeNote={activeNote}
        handleNoteSaveRequest={handleNoteSaveRequest}
        removeActiveNote={removeActiveNote}
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
        pinOrUnpinNote={pinOrUnpinNote}
        duplicateNote={duplicateNote}
        handleUploadFilesRequest={handleUploadFilesRequest}
        importNote={importNote}
        disableNoteSaving={disableNoteSaving}
        handleNoteExportRequest={handleNoteExportRequest}
        loadNote={loadNote}
      />
    </div>
    <div className="note-controls-right">
      <StatusIndicator
        isNew={activeNote.isUnsaved}
        hasUnsavedChanges={unsavedChanges}
        isEverythingSaved={!unsavedChanges}
        isUploading={uploadInProgress}
      />
    </div>
  </section>;
};

export default NoteMenuBar;
