import ActiveNote from "../types/ActiveNote";
import NoteControls from "./NoteControls";
import StatusIndicator from "./StatusIndicator";
import { ContentMode } from "../types/ContentMode";

interface NoteMenuBarProps {
  activeNote: ActiveNote,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
  handleUploadFilesRequest,
  contentMode: ContentMode,
  toggleEditMode: () => void,
  uploadInProgress: boolean,
  importNote,
  disableNoteSaving: boolean,
}

const NoteMenuBar = ({
  activeNote,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
  handleUploadFilesRequest,
  contentMode,
  toggleEditMode,
  uploadInProgress,
  importNote,
  disableNoteSaving,
}: NoteMenuBarProps) => {
  return <section className="note-controls">
    <div className="note-controls-left">
      <NoteControls
        activeNote={activeNote}
        createNewNote={createNewNote}
        createNewLinkedNote={createNewLinkedNote}
        handleNoteSaveRequest={handleNoteSaveRequest}
        removeActiveNote={removeActiveNote}
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
        pinOrUnpinNote={pinOrUnpinNote}
        duplicateNote={duplicateNote}
        openInGraphView={openInGraphView}
        handleUploadFilesRequest={handleUploadFilesRequest}
        contentMode={contentMode}
        toggleEditMode={toggleEditMode}
        importNote={importNote}
        disableNoteSaving={disableNoteSaving}
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
