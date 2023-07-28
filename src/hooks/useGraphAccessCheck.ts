import { PathTemplate } from "../enum/PathTemplate";
import { getAppPath } from "../lib/utils";
import {
  initializeNotesProviderWithExistingFolderHandle,
  isInitialized,
} from "../lib/LocalDataStorage";
import useRunOnce from "./useRunOnce";
import { useNavigate } from "react-router-dom";
import { LOCAL_GRAPH_ID } from "../config";

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
        urlParams.set("redirect", window.location.pathname);
        navigate(getAppPath(PathTemplate.LOGIN, new Map(), urlParams));
      }
    }
  };

  useRunOnce(() => {
    checkGraphAccess();
  });
};
