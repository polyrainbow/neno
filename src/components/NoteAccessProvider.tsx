import NotesProviderContext from "../contexts/NotesProviderContext";
import {
  getNotesProvider,
} from "../lib/LocalDataStorage";
import BusyView from "./BusyView";
import { useState } from "react";
import {
  initializeNotesProviderWithFolderHandleFromStorage,
  isInitialized,
} from "../lib/LocalDataStorage";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import useRunOnce from "../hooks/useRunOnce";

const NoteAccessProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useRunOnce(() => {
    if (!isInitialized()) {
      initializeNotesProviderWithFolderHandleFromStorage()
        .then(() => {
          setIsReady(true);
        })
        .catch(() => {
          const urlParams = new URLSearchParams();
          /*
            Note: redirect param includes ROOT_PATH, e.g. "/neno/".
            When redirecting to it, consumers should not include ROOT_PATH
            but use the path as is.
          */
          urlParams.set(
            "redirect",
            window.location.pathname,
          );
          // @ts-ignore
          navigation.navigate(
            getAppPath(PathTemplate.START, new Map(), urlParams),
            {
              history: "replace",
            },
          );
        });
    } else {
      setIsReady(true);
    }
  });

  if (!isReady) {
    return <BusyView />;
  }

  return <NotesProviderContext
    value={getNotesProvider()}
  >
    {children}
  </NotesProviderContext>;
};


export default NoteAccessProvider;
