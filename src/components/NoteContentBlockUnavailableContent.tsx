import { l } from "../lib/intl";
import Icon from "./Icon";

const NoteContentBlockUnavailableContent = () => {
  return <div
    className="preview-block-file-wrapper"
  >
    <div className="content-not-available">
      <Icon
        icon="warning"
        title={l("note.content-not-available")}
        size={70}
      />
      {l("note.content-not-available")}
    </div>
  </div>;
};


export default NoteContentBlockUnavailableContent;
