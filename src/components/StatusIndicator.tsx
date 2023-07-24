import { l } from "../lib/intl";
import StatusIndicatorItem from "./StatusIndicatorItem";

interface StatusIndicatorProps {
  isNew: boolean,
  hasUnsavedChanges: boolean,
  isEverythingSaved: boolean,
  isUploading: boolean,
}

const StatusIndicator = ({
  isNew,
  hasUnsavedChanges,
  isEverythingSaved,
  isUploading,
}: StatusIndicatorProps) => {
  return <>
    <StatusIndicatorItem
      isActive={isNew}
      title={l("editor.note-has-not-been-saved-yet")}
      icon={"fiber_new"}
    />
    <StatusIndicatorItem
      isActive={hasUnsavedChanges}
      title={l("editor.unsaved-changes")}
      icon={"stream"}
    />
    <StatusIndicatorItem
      isActive={isEverythingSaved}
      title={l("editor.no-unsaved-changes")}
      icon={"done"}
    />
    <StatusIndicatorItem
      isActive={isUploading}
      title={l("editor.upload-in-progress")}
      icon={"file_upload"}
    />
  </>;
};

export default StatusIndicator;
