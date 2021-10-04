import {
  useHistory,
} from "react-router-dom";
import { paths } from "../lib/config";

const useGoToNote = () => {
  const history = useHistory();

  const goToNote = (noteId, replacePath = false) => {
    const path = paths.editorWithNote.replace("%NOTE_ID%", noteId);
    return replacePath
      ? history.replace(path)
      : history.push(path);
  };

  return goToNote;
};

export default useGoToNote;
