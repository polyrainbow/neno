import NotesProviderContext from "../contexts/NotesProviderContext";
import {
  getNotesProvider,
} from "../lib/LocalDataStorage";
import BusyView from "./BusyView";
import { useState } from "react";
import {
  initializeNotesProviderWithExistingFolderHandle,
  isInitialized,
} from "../lib/LocalDataStorage";
import { useNavigate } from "react-router-dom";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { ROOT_PATH } from "../config";
import useRunOnce from "../hooks/useRunOnce";

const NoteAccessProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useRunOnce(() => {
    if (!isInitialized()) {
      initializeNotesProviderWithExistingFolderHandle()
        .then(() => {
          setIsReady(true);
        })
        .catch(() => {
          const urlParams = new URLSearchParams();
          urlParams.set(
            "redirect",
            window.location.pathname.substring(ROOT_PATH.length - 1),
          );
          navigate(getAppPath(PathTemplate.START, new Map(), urlParams));
        });
    } else {
      setIsReady(true);
    }
  });

  if (!isReady) {
    return <BusyView />;
  }

  return <NotesProviderContext.Provider
    value={getNotesProvider()}
  >
    {children}
  </NotesProviderContext.Provider>;
};


export default NoteAccessProvider;
