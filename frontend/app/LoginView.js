import React, { useEffect, useState } from "react";
import HeaderContainer from "./HeaderContainer.js";


const LoginView = ({
  setActiveView,
  serverDatabaseProvider,
  localDatabaseProvider,
  setDatabaseMode,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverDisclaimer, setServerDisclaimer]
    = useState(null);
  const [localDisclaimer, setLocalDisclaimer]
    = useState(null);
  const [
    localDatabaseFolderHandleName,
    setLocalDatabaseFolderHandleName,
  ] = useState(null);

  const [isBusy, setIsBusy] = useState(false);


  const startLoginAttempt = () => {
    setIsBusy(true);
    serverDatabaseProvider.login(username, password)
      .then((success) => {
        if (success) {
          setDatabaseMode("SERVER");
          setActiveView("EDITOR");
        } else {
          setServerDisclaimer("INVALID_CREDENTIALS");
          setIsBusy(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setServerDisclaimer("SERVER_ERROR");
        setIsBusy(false);
      });
  };

  useEffect(async () => {
    const folderHandleName = await localDatabaseProvider.getFolderHandleName();
    setLocalDatabaseFolderHandleName(folderHandleName);
  }, []);


  return <>
    <HeaderContainer />
    <section id="section_login">
      <h1>Server database</h1>
      {
        serverDisclaimer === "INVALID_CREDENTIALS"
          ? <p style={{ color: "red" }}>
            Your username and password do not seem to be correct.
            Please try again.
          </p>
          : ""
      }
      {
        serverDisclaimer === "SERVER_ERROR"
          ? <p style={{ color: "red" }}>
            Something is wrong with the server. How about creating a
            local database instead?
          </p>
          : ""
      }
      <p>
        <label htmlFor="login_input_username">Username</label>
        <br />
        <input id="login_input_username" type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              startLoginAttempt();
            }
          }}
        />
      </p>
      <p>
        <label htmlFor="login_input_password">Password</label>
        <br />
        <input id="login_input_password" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              startLoginAttempt();
            }
          }}
        />
      </p>
      <p>
        {
          isBusy
            ? "Trying to log in ..."
            : <button
              type="button"
              className="default-button default-action"
              onClick={startLoginAttempt}
            >Login</button>
        }
      </p>

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
                  setActiveView("EDITOR");
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
            setActiveView("EDITOR");
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
