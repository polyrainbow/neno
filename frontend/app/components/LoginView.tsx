import React, { useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import LoginViewServer from "./LoginViewServer";
import LoginViewLocal from "./LoginViewLocal";
import { DatabaseMode } from "../enum/DatabaseMode";
import { ASSETS_PATH } from "../config";
import { l } from "../lib/intl";

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
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section id="section_login">
      <div
        id="login_welcome"
      >
        <img
          src={ASSETS_PATH + "app-icon/logo-circle.svg"}
          alt={l("login.logo.alt")}
          id="login_logo"
        />
        <div id="login_welcome_app_title">{l("app.title")}</div>
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
      </footer>
    </section>
  </>;
};

export default LoginView;
