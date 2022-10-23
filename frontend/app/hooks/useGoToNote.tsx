import {
  useNavigate,
} from "react-router-dom";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { PathTemplate } from "../enum/PathTemplate";
import { getAppPath } from "../lib/utils";

const useGoToNote = () => {
  const navigate = useNavigate();

  const goToNote = (
    graphId: GraphId,
    noteId: NoteId,
    replace = false,
  ) => {
    const path = getAppPath(
      PathTemplate.EXISTING_NOTE,
      new Map([
        ["GRAPH_ID", graphId],
        ["NOTE_ID", noteId.toString()],
      ]),
    );

    return navigate(path, { replace });
  };

  return goToNote;
};

export default useGoToNote;
