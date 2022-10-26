import React from "react";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator";
import { l } from "../lib/intl";
import Tooltip from "./Tooltip";
import Icon from "./Icon";
import ActiveNote from "../types/ActiveNote";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import NoteControls from "./NoteControls";

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
  contentMode,
  toggleEditMode,
  uploadInProgress,
  importNote,
  graphId: GraphId,
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
  graphId,
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
        graphId={graphId}
      />
    </div>
    <div className="note-controls-right">
      {
        uploadInProgress
          ? <Tooltip
            title={l("editor.note-has-not-been-saved-yet")}
          >
            <Icon
              icon={"file_upload"}
              title={l("editor.upload-in-progress")}
              size={24}
            />
          </Tooltip>
          : ""
      }
      <UnsavedChangesIndicator
        isUnsaved={activeNote.isUnsaved}
        unsavedChanges={unsavedChanges}
      />
    </div>
  </section>;
};

export default NoteMenuBar;
