import { l } from "../lib/intl";
import Icon from "./Icon";

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
  const labels = [];
  if (isNew) {
    labels.push(l("editor.note-has-not-been-saved-yet"));
  }
  if (hasUnsavedChanges) {
    labels.push(l("editor.unsaved-changes"));
  }
  if (isEverythingSaved) {
    labels.push(l("editor.no-unsaved-changes"));
  }
  if (isUploading) {
    labels.push(l("editor.upload-in-progress"));
  }

  return <div
    className="status-indicator"
    aria-label={labels.join(", ")}
  >
    {
      isNew
        ? <Icon
          icon="fiber_new"
        />
        : null
    }
    {
      hasUnsavedChanges
        ? <Icon
          icon="stream"
        />
        : null
    }
    {
      isEverythingSaved
        ? <Icon
          icon="done"
        />
        : null
    }
    {
      isUploading
        ? <Icon
          icon="file_upload"
        />
        : null
    }
  </div>;
};

export default StatusIndicator;
