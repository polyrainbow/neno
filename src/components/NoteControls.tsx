import IconButton from "./IconButton";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import {
  getAppPath, getWikilinkForNote,
} from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";
import { Slug } from "../lib/notes/types/Slug";
import { LOCAL_GRAPH_ID } from "../config";
import useConfirm from "../hooks/useConfirm";
import useGoToNote from "../hooks/useGoToNote";
import { getNoteTitle } from "../lib/notes";

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
  loadNote: (
    slug: Slug | "random" | "new",
    contentForNewNote?: string,
  ) => Promise<Slug | null>,
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
  loadNote,
}: NoteControlsProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
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
            // @ts-ignore
            navigation.navigate(getAppPath(
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
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              const noteWasUnsaved = activeNote.isUnsaved;

              goToNote("new", {
                contentIfNewNote: "",
              });

              /*
                goToNote might not have any effect here, because route and
                state do not change and thus no re-render is triggered when
                route before is "new" and route after is "new", too.
                In that case we need to manually reset the editor.
              */
              if (noteWasUnsaved) {
                loadNote("new");
              }
            }}
          />
          <IconButton
            id="button_create-linked-note"
            disabled={activeNote.isUnsaved}
            title={l("editor.create-linked-note")}
            icon="add_circle"
            onClick={async () => {
              if (activeNote.isUnsaved) return;

              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              goToNote("new", {
                contentIfNewNote: getWikilinkForNote(
                  activeNote.slug,
                  getNoteTitle(activeNote.initialContent),
                ),
              });
            }}
          />
        </>
        : null
    }
    <IconButton
      id="button_save"
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
      onClick={async () => {
        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
        }

        importNote();
      }}
    />
    <IconButton
      id="button_export-note"
      disabled={false}
      title={l("editor.export-note")}
      icon="file_download"
      onClick={() => handleNoteExportRequest()}
    />
    <IconButton
      id="button_add-file"
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
        goToNote("random");
      }}
    />
  </>;
};

export default NoteControls;
