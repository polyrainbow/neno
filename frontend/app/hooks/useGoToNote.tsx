import {
  useNavigate,
} from "react-router-dom";
import { paths } from "../lib/config";

const useGoToNote = () => {
  const navigate = useNavigate();

  const goToNote = (noteId, replace = false) => {
    const path = paths.editorWithNote.replace("%NOTE_ID%", noteId);
    return navigate(path, { replace });
  };

  return goToNote;
};

export default useGoToNote;
