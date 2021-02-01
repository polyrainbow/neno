import React, { useState } from "react";
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
      <button
        type="button"
        className="default-button default-action"
        onClick={async () => {
          // get folder handle
          const folderHandle = await window.showDirectoryPicker();
          await localDatabaseProvider.initDatabase(folderHandle);
          setDatabaseMode("LOCAL");
        }}
      >Select database folder</button>
    </section>
  </>;
};

export default LoginView;
