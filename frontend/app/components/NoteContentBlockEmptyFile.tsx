import React from "react";
import { l } from "../lib/intl";
import Icon from "./Icon";

const NoteContentBlockEmptyFile = () => {
  return <div
    className="preview-block-file-wrapper"
  >
    <div className="file-not-available">
      <Icon
        icon="warning"
        title={l("note.file-not-available")}
        size={70}
      />
      {l("note.file-not-available")}
    </div>
  </div>;
};


export default NoteContentBlockEmptyFile;
