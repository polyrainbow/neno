import React, { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { DatabaseMode } from "../enum/DatabaseMode";
import { PathTemplate } from "../enum/PathTemplate";
import { l, lf } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import { SERVER_DATABASE_ENABLED } from "../config";
import DatabaseProvider from "../types/DatabaseProvider";

interface LoginViewServerProps {
  serverDatabaseProvider: DatabaseProvider,
  setDatabaseMode: (databaseMode: DatabaseMode) => void,
}

const LoginViewServer = ({
  serverDatabaseProvider,
  setDatabaseMode,
}: LoginViewServerProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [disclaimer, setDisclaimer]
    = useState<string | null>(null);

  const [isBusy, setIsBusy] = useState(false);

  const navigate = useNavigate();

  const startLoginAttempt = () => {
    setIsBusy(true);
    serverDatabaseProvider.login?.(username, password, mfaToken)
      .then((response) => {
        if (response.graphIds.length === 0) {
          throw new Error("No graphs available on server database");
        }
        setDatabaseMode(DatabaseMode.SERVER);
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([["GRAPH_ID", response.graphIds[0]]]),
        ));
      })
      .catch((e) => {
        const disclaimer = e.message;
        setDisclaimer(disclaimer);
        setIsBusy(false);
      });
  };

  if (!SERVER_DATABASE_ENABLED) {
    return <>
      <h1>{l("login.server.heading")}</h1>
      <p>{lf("login.server.no-support")}</p>
    </>;
  }


  return <>
    <h1>{l("login.server.heading")}</h1>
    {
      disclaimer === "INVALID_CREDENTIALS"
        ? <p className="error-text">
          {l("login.server.invalid-credentials")}
        </p>
        : ""
    }
    {
      disclaimer === "TOO_EARLY"
        ? <p className="error-text">
          {l("login.server.too-many-attempts")}
        </p>
        : ""
    }
    {
      disclaimer === "SERVER_ERROR"
        ? <p className="error-text">
          {l("login.server.server-error")}
        </p>
        : ""
    }
    <p>
      <label htmlFor="login_input_username">{l("login.server.username")}</label>
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
      <label htmlFor="login_input_password">{l("login.server.password")}</label>
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
      <label htmlFor="login_input_mfa-token">{
        l("login.server.mfa-token")
      }</label>
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
          ? l("login.server.trying-to-login")
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
