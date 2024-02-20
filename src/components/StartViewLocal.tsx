import { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import {
  getFolderHandleName,
  initializeNotesProvider,
  initializeNotesProviderWithExistingFolderHandle,
} from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

const StartViewLocal = () => {
  const [localDisclaimer, setLocalDisclaimer]
    = useState<string | null>(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName,
  ] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const retrieveLocalDatabaseFolderHandle = async () => {
      const folderHandleName
        = await getFolderHandleName();
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
                await initializeNotesProviderWithExistingFolderHandle();
                const urlSearchParams
                  = new URLSearchParams(window.location.search);
                if (urlSearchParams.has("redirect")) {
                  navigate(urlSearchParams.get("redirect") ?? "/");
                } else {
                  navigate(getAppPath(
                    PathTemplate.NEW_NOTE,
                    new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                  ));
                }
              } catch (e) {
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
          navigate(getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          ));
        } catch (e) {
          // It is fine if the user aborts the directory selection
        }
      }}
    >
      {l("start.local.select-folder")}
    </button>
  </section>;
};

export default StartViewLocal;
