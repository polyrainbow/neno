import {
  useNavigate,
} from "react-router-dom";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { PathTemplate } from "../enum/PathTemplate";
import { getAppPath } from "../lib/utils";

const useGoToNote = () => {
  const navigate = useNavigate();

  const goToNote = (noteId: NoteId, replace = false) => {
    const path = getAppPath(
      PathTemplate.EDITOR_WITH_NOTE,
      new Map([["NOTE_ID", noteId.toString()]]),
    );

    return navigate(path, { replace });
  };

  return goToNote;
};

export default useGoToNote;
