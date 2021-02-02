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
  const [wrongPasswordDisclaimer, setWrongPasswordDisclaimer]
    = useState(false);
  const [
    localDatabaseFolderHandleExists,
    setLocalDatabaseFolderHandleExists,
  ] = useState(false);

  const [isBusy, setIsBusy] = useState(false);


  const startLoginAttempt = () => {
    setIsBusy(true);
    serverDatabaseProvider.login(username, password)
      .then((success) => {
        if (success) {
          setDatabaseMode("SERVER");
          setActiveView("EDITOR");
        } else {
          setWrongPasswordDisclaimer(true);
          setIsBusy(false);
        }
      });
  };

  useEffect(async () => {
    if (await localDatabaseProvider.hasFolderHandle()) {
      setLocalDatabaseFolderHandleExists(true);
    }
  }, []);


  return <>
    <HeaderContainer />
    <section id="section_login">
      <h1>Login</h1>
      {
        wrongPasswordDisclaimer
          ? <p style={{ color: "red" }}>
            Your username and password do not seem to be correct.
            Please try again.
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
      <p>
        {
          localDatabaseFolderHandleExists
            ? "You have already created a local "
            + "database that you can just open."
            : ""
        }
      </p>
      <button
        type="button"
        className="default-button default-action"
        onClick={async () => {
          if (!localDatabaseFolderHandleExists) {
            // get folder handle
            try {
              const folderHandle = await window.showDirectoryPicker();
              await localDatabaseProvider.login(folderHandle);
              setDatabaseMode("LOCAL");
              setActiveView("EDITOR");
            } catch (e) {
              console.error(e);
            }
          } else {
            try {
              await localDatabaseProvider.initializeDatabase();
              setDatabaseMode("LOCAL");
              setActiveView("EDITOR");
            } catch (e) {
              console.error(e);
            }
          }
        }}
      >
        {
          localDatabaseFolderHandleExists
            ? "Open database"
            : "Select database folder"
        }
      </button>
    </section>
  </>;
};

export default LoginView;
