import React, { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { paths } from "../lib/config.js";
import { DatabaseMode } from "../enum/DatabaseMode.js";

const LoginViewServer = ({
  serverDatabaseProvider,
  setDatabaseMode,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [disclaimer, setDisclaimer]
    = useState<string | null>(null);

  const [isBusy, setIsBusy] = useState(false);

  const navigate = useNavigate();

  const startLoginAttempt = () => {
    setIsBusy(true);
    serverDatabaseProvider.login(username, password, mfaToken)
      .then(() => {
        setDatabaseMode(DatabaseMode.SERVER);
        navigate(paths.editorWithNewNote);
      })
      .catch((e) => {
        const disclaimer = e.message;
        setDisclaimer(disclaimer);
        setIsBusy(false);
      });
  };

  if (!serverDatabaseProvider) {
    return <>
      <h1>Server database</h1>
      <p>
        This NENO instance does not support connecting to server databases.
        However, you can <a
          href="https://github.com/SebastianZimmer/neno"
          target="_blank"
          rel="noreferrer noopener"
        >set up your own NENO server</a>.
      </p>
    </>;
  }


  return <>
    <h1>Server database</h1>
    {
      disclaimer === "INVALID_CREDENTIALS"
        ? <p style={{ color: "red" }}>
          Your combination of username, password, and 2FA token does not
          seem to be correct. Please try again.
        </p>
        : ""
    }
    {
      disclaimer === "TOO_EARLY"
        ? <p style={{ color: "red" }}>
          Too many failed login attempts. Please wait a bit and try again.
        </p>
        : ""
    }
    {
      disclaimer === "SERVER_ERROR"
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
      <label htmlFor="login_input_mfa-token">2FA Token</label>
      <br />
      <input id="login_input_mfa-token"
        type="number"
        value={mfaToken}
        onChange={(e) => setMfaToken(e.target.value)}
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
  </>;
};

export default LoginViewServer;