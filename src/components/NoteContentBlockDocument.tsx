import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { humanFileSize } from "../lib/utils";
import NoteContentBlockActions from "./NoteContentBlockActions";

interface NoteContentBlockAudioProps {
  file: FileInfo,
}


const NoteContentBlockDocument = ({
  file,
}: NoteContentBlockAudioProps) => {
  return <div
    className="preview-block-file-wrapper"
    key={file.slug}
  >
    <div className="preview-block-file-first-line">
      <div className="preview-block-file-info">
        <div className="preview-block-file-info-title">
          {file.slug}
        </div>
        <div className="preview-block-file-size">
          {humanFileSize(file.size)}
        </div>
      </div>
      <NoteContentBlockActions file={file} />
    </div>
  </div>;
};


export default NoteContentBlockDocument;
