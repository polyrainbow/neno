import { useEffect, useState } from "react";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import {
  getExistingFolderHandleName,
  initializeNotesProvider,
  initializeNotesProviderWithFolderHandleFromStorage,
} from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

const StartViewLocal = () => {
  const [localDisclaimer, setLocalDisclaimer]
    = useState<string | null>(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName,
  ] = useState<string | null>(null);

  useEffect(() => {
    const retrieveLocalDatabaseFolderHandle = async () => {
      const folderHandleName
        = await getExistingFolderHandleName();
      setLocalDatabaseFolderHandleName(folderHandleName);
    };

    retrieveLocalDatabaseFolderHandle();
  }, []);

  // @ts-ignore
  if (typeof window.showDirectoryPicker !== "function") {
    return <>
      <p>
        {l("start.local.unsupported")}
      </p>
    </>;
  }

  return <section id="start-view-local">
    {
      localDisclaimer === "INVALID_FOLDER_HANDLE"
        ? <p className="error-text">
          {l("start.local.error-accessing-folder")}
        </p>
        : ""
    }
    {
      typeof localDatabaseFolderHandleName === "string"
        ? <>
          <p>
            {l("start.local.already-created-folder")}
          </p>
          <button
            type="button"
            className="default-button default-action"
            onClick={async () => {
              try {
                await initializeNotesProviderWithFolderHandleFromStorage();
                const urlSearchParams
                  = new URLSearchParams(window.location.search);
                if (urlSearchParams.has("redirect")) {
                  // @ts-ignore
                  navigation.navigate(urlSearchParams.get("redirect") ?? "/");
                } else {
                  // @ts-ignore
                  navigation.navigate(getAppPath(
                    PathTemplate.NEW_NOTE,
                    new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                  ));
                }
              } catch (_e) {
                // it could be that the folder is not there anymore but we
                // still have a handle
                setLocalDatabaseFolderHandleName(null);
                setLocalDisclaimer("INVALID_FOLDER_HANDLE");
              }
            }}
          >
            {l(
              "start.local.open-folder-x",
              { dbName: localDatabaseFolderHandleName },
            )}
          </button>
        </>
        : ""
    }
    <p>
      {l("start.local.select-folder.explainer")}
    </p>
    <button
      type="button"
      className="default-button default-action"
      onClick={async () => {
        try {
          // @ts-ignore
          const folderHandle = await window.showDirectoryPicker();
          await initializeNotesProvider(folderHandle);
          // @ts-ignore
          navigation.navigate(getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          ));
        } catch (_e) {
          // It is fine if the user aborts the directory selection
        }
      }}
    >
      {l("start.local.select-folder")}
    </button>
  </section>;
};

export default StartViewLocal;
