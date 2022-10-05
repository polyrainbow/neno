import React, { useEffect } from "react";
import LoginViewServer from "./LoginViewServer";
import LoginViewLocal from "./LoginViewLocal";
import { DatabaseMode } from "../enum/DatabaseMode";
import { ASSETS_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";

const LoginView = ({
  serverDatabaseProvider,
  localDatabaseProvider,
  setDatabaseMode,
  toggleAppMenu,
}) => {
  // reset database mode when opening login view
  useEffect(() => {
    setDatabaseMode(DatabaseMode.NONE);
  }, []);

  return <>
    <HeaderContainerLeftRight
      toggleAppMenu={toggleAppMenu}
    />
    <section className="section-login">
      <div
        className="login-welcome"
      >
        <img
          src={ASSETS_PATH + "app-icon/logo-circle.svg"}
          alt={l("login.logo.alt")}
          id="login-logo"
        />
        <div id="login-welcome-app-title">{l("app.title")}</div>
        <div>{l("login.introduction")}</div>
      </div>
      <div>
        <LoginViewServer
          serverDatabaseProvider={serverDatabaseProvider}
          setDatabaseMode={setDatabaseMode}
        />
      </div>
      <div>
        <LoginViewLocal
          localDatabaseProvider={localDatabaseProvider}
          setDatabaseMode={setDatabaseMode}
        />
      </div>
      <footer>
        <a href="https://github.com/SebastianZimmer/neno/blob/main/docs/index.md">
          {l("login.read-the-manual")}
        </a>
        <p className="version">{VERSION}</p>
      </footer>
    </section>
  </>;
};

export default LoginView;
