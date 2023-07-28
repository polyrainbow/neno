import { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import {
  getFolderHandleName,
  initializeNotesProvider,
  initializeNotesProviderWithExistingFolderHandle,
} from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

const LoginViewLocal = () => {
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
      <h1>{l("login.local.heading")}</h1>
      <p>
        {l("login.local.unsupported")}
      </p>
    </>;
  }

  return <section>
    <h1>{l("login.local.heading")}</h1>
    {
      localDisclaimer === "INVALID_FOLDER_HANDLE"
        ? <p className="error-text">
          {l("login.local.error-accessing-folder")}
        </p>
        : ""
    }
    {
      typeof localDatabaseFolderHandleName === "string"
        ? <>
          <p>
            {l("login.local.already-created-folder")}
          </p>
          <button
            type="button"
            className="default-button default-action"
            onClick={async () => {
              try {
                await initializeNotesProviderWithExistingFolderHandle();
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ));
              } catch (e) {
                console.error(e);

                // it could be that the folder is not there anymore but we
                // still have a handle
                setLocalDatabaseFolderHandleName(null);
                setLocalDisclaimer("INVALID_FOLDER_HANDLE");
              }
            }}
          >
            {l(
              "login.local.open-folder-x",
              { dbName: localDatabaseFolderHandleName },
            )}
          </button>
        </>
        : ""
    }
    <p>
      {l("login.local.select-folder.explainer")}
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
          console.error(e);
        }
      }}
    >
      {l("login.local.select-folder")}
    </button>
  </section>;
};

export default LoginViewLocal;
