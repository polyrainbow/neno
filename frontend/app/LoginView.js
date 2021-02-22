import React, { useEffect, useState } from "react";
import HeaderContainer from "./HeaderContainer.js";
import LoginViewServer from "./LoginViewServer.js";
import View from "./enum/View.js";

const LoginView = ({
  setActiveView,
  serverDatabaseProvider,
  localDatabaseProvider,
  setDatabaseMode,
}) => {
  const [localDisclaimer, setLocalDisclaimer]
    = useState(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName,
  ] = useState(null);


  useEffect(async () => {
    const folderHandleName = await localDatabaseProvider.getFolderHandleName();
    setLocalDatabaseFolderHandleName(folderHandleName);
  }, []);

  return <>
    <HeaderContainer />
    <section id="section_login">
      <LoginViewServer
        setActiveView={setActiveView}
        serverDatabaseProvider={serverDatabaseProvider}
        setDatabaseMode={setDatabaseMode}
      />
      <h1>Local database</h1>
      {
        localDisclaimer === "INVALID_FOLDER_HANDLE"
          ? <p style={{ color: "red" }}>
            There was a problem accessing the database folder.
            Have you moved or deleted it?
          </p>
          : ""
      }
      {
        typeof localDatabaseFolderHandleName === "string"
          ? <>
            <p>
              You have already created a local database that you can just open.
            </p>
            <button
              type="button"
              className="default-button default-action"
              onClick={async () => {
                try {
                  await localDatabaseProvider.initializeDatabase();
                  setDatabaseMode("LOCAL");
                  setActiveView(View.EDITOR);
                } catch (e) {
                  console.error(e);

                  // it could be that the folder is not there anymore but we
                  // still have a handle
                  setLocalDatabaseFolderHandleName(null);
                  setLocalDisclaimer("INVALID_FOLDER_HANDLE");
                }
              }}
            >
              Open database {localDatabaseFolderHandleName}
            </button>
          </>
          : ""
      }
      <p>
        Select a folder to be used as database
        (if no database in that folder exists yet, a new one will be created)
      </p>
      <button
        type="button"
        className="default-button default-action"
        onClick={async () => {
          try {
            const folderHandle = await window.showDirectoryPicker();
            await localDatabaseProvider.login(folderHandle);
            setDatabaseMode("LOCAL");
            setActiveView(View.EDITOR);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Select database folder
      </button>
    </section>
  </>;
};

export default LoginView;
