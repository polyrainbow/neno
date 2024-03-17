import IconButton from "./IconButton";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import {
  getAppPath, getNoteTitleFromActiveNote, getWikilinkForNote,
} from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";
import { Slug } from "../lib/notes/types/Slug";
import { LOCAL_GRAPH_ID } from "../config";
import useConfirm from "../hooks/useConfirm";
import useGoToNote from "../hooks/useGoToNote";

interface NoteControlsProps {
  activeNote: ActiveNote,
  handleNoteSaveRequest: () => void,
  removeActiveNote: () => void,
  unsavedChanges: boolean,
  setUnsavedChanges: (val: boolean) => void,
  pinOrUnpinNote: (slug: Slug) => void,
  duplicateNote: () => void,
  handleUploadFilesRequest: () => void,
  importNote: () => void,
  disableNoteSaving: boolean,
  handleNoteExportRequest: () => void,
}

const NoteControls = ({
  activeNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  importNote,
  disableNoteSaving,
  handleNoteExportRequest,
}: NoteControlsProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = useConfirm();
  const goToNote = useGoToNote();

  return <>
    {
      isSmallScreen
        ? <IconButton
          id="button_list"
          title={l("editor.go-to-list")}
          icon="list"
          onClick={async () => {
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            navigate(getAppPath(
              PathTemplate.LIST,
              new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
            ));
          }}
        />
        : null
    }
    {
      !isSmallScreen
        ? <>
          <IconButton
            id="button_new"
            title={l("editor.new-note")}
            icon="add"
            onClick={() => goToNote("new")}
          />
          <IconButton
            id="button_create-linked-note"
            disabled={activeNote.isUnsaved}
            title={l("editor.create-linked-note")}
            icon="add_circle"
            onClick={() => {
              if (activeNote.isUnsaved) return;

              goToNote("new", {
                contentIfNewNote: getWikilinkForNote(
                  activeNote.slug,
                  getNoteTitleFromActiveNote(activeNote),
                ),
              });
            }}
          />
        </>
        : null
    }
    <IconButton
      id="button_upload"
      title={l("editor.save-note")}
      icon="save"
      disabled={disableNoteSaving}
      onClick={handleNoteSaveRequest}
    />
    <IconButton
      id="button_remove"
      disabled={activeNote.isUnsaved}
      title={l("editor.remove-note")}
      icon={"delete"}
      onClick={async () => {
        await confirm({
          text: l("editor.remove-note.confirm.text"),
          confirmText: l("editor.remove-note.confirm.confirm"),
          cancelText: l("dialog.cancel"),
          encourageConfirmation: false,
        });

        removeActiveNote();
      }}
    />
    <IconButton
      id="button_duplicate"
      disabled={activeNote.isUnsaved}
      title={l("editor.duplicate-note")}
      icon="content_copy"
      onClick={() => duplicateNote()}
    />
    <IconButton
      id="button_pin"
      disabled={activeNote.isUnsaved}
      title={l("editor.pin-note")}
      icon="push_pin"
      onClick={() => {
        if (activeNote.isUnsaved) return;
        pinOrUnpinNote(activeNote.slug);
      }}
    />
    <IconButton
      id="button_import-note"
      disabled={!activeNote.isUnsaved}
      title={l("editor.import-note")}
      icon="file_upload"
      onClick={() => importNote()}
    />
    <IconButton
      id="button_export-note"
      disabled={false}
      title={l("editor.export-note")}
      icon="file_download"
      onClick={() => handleNoteExportRequest()}
    />
    <IconButton
      id="button_upload-file"
      disabled={false}
      title={l("editor.upload-file")}
      icon="upload_file"
      onClick={() => handleUploadFilesRequest()}
    />
    <IconButton
      id="button_random-note"
      disabled={false}
      title={l("editor.open-random-note")}
      icon="question_mark"
      onClick={async () => {
        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
          setUnsavedChanges(false);
        }
        navigate(getAppPath(
          PathTemplate.EXISTING_NOTE,
          new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
            ["SLUG", "random"],
          ]),
        ));
      }}
    />
  </>;
};

export default NoteControls;
