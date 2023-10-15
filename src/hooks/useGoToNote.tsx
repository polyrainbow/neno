import {
  useNavigate,
} from "react-router-dom";
import { PathTemplate } from "../types/PathTemplate";
import { getAppPath } from "../lib/utils";
import { Slug } from "../lib/notes/types/Slug";
import { LOCAL_GRAPH_ID } from "../config";

const useGoToNote = () => {
  const navigate = useNavigate();

  const goToNote = (
    slug: Slug,
    replace = false,
  ) => {
    const path = getAppPath(
      PathTemplate.EXISTING_NOTE,
      new Map([
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["SLUG", slug],
      ]),
    );

    return navigate(path, { replace });
  };

  return goToNote;
};

export default useGoToNote;
