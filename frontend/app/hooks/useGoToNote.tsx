import {
  useNavigate,
} from "react-router-dom";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { paths } from "../lib/config";

const useGoToNote = () => {
  const navigate = useNavigate();

  const goToNote = (noteId:NoteId, replace = false) => {
    const path = paths.editorWithNote.replace("%NOTE_ID%", noteId.toString());
    return navigate(path, { replace });
  };

  return goToNote;
};

export default useGoToNote;
