import { PathTemplate } from "../types/PathTemplate";
import { getAppPath } from "../lib/utils";
import {
  initializeNotesProviderWithExistingFolderHandle,
  isInitialized,
} from "../lib/LocalDataStorage";
import useRunOnce from "./useRunOnce";
import { useNavigate } from "react-router-dom";
import { LOCAL_GRAPH_ID, ROOT_PATH } from "../config";

export default async () => {
  const navigate = useNavigate();

  const checkGraphAccess = async () => {
    if (!isInitialized()) {
      try {
        await initializeNotesProviderWithExistingFolderHandle();
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
          ]),
        ));
      } catch (e) {
        const urlParams = new URLSearchParams();
        urlParams.set(
          "redirect",
          window.location.pathname.substring(ROOT_PATH.length - 1),
        );
        navigate(getAppPath(PathTemplate.START, new Map(), urlParams));
      }
    }
  };

  useRunOnce(() => {
    checkGraphAccess();
  });
};
