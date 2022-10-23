import React, { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { DatabaseMode } from "../enum/DatabaseMode";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";

const LoginViewLocal = ({
  localDatabaseProvider,
  setDatabaseMode,
}) => {
  const [localDisclaimer, setLocalDisclaimer]
    = useState<string | null>(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName,
  ] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const retrieveLocalDatabaseFolderHandle = async () => {
      if (!localDatabaseProvider) return;
      const folderHandleName
        = await localDatabaseProvider.getFolderHandleName();
      setLocalDatabaseFolderHandleName(folderHandleName);
    };

    retrieveLocalDatabaseFolderHandle();
  }, [localDatabaseProvider]);

  if (typeof window.showDirectoryPicker !== "function") {
    return <>
      <h1>{l("login.local.heading")}</h1>
      <p>
        {l("login.local.unsupported")}
      </p>
    </>;
  }

  return <>
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
            {l("login.local.already-created-database")}
          </p>
          <button
            type="button"
            className="default-button default-action"
            onClick={async () => {
              try {
                const response
                  = await localDatabaseProvider.initializeDatabase();
                setDatabaseMode(DatabaseMode.LOCAL);
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  new Map([["GRAPH_ID", response.graphIds[0]]]),
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
              "login.local.open-database-x",
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
          const folderHandle = await window.showDirectoryPicker();
          const response
            = await localDatabaseProvider.login(folderHandle);
          setDatabaseMode(DatabaseMode.LOCAL);
          navigate(getAppPath(
            PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", response.graphIds[0]]]),
          ));
        } catch (e) {
          console.error(e);
        }
      }}
    >
      {l("login.local.select-folder")}
    </button>
  </>;
};

export default LoginViewLocal;
