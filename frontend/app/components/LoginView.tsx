import React, { useEffect } from "react";
import LoginViewServer from "./LoginViewServer";
import LoginViewLocal from "./LoginViewLocal";
import { DatabaseMode } from "../enum/DatabaseMode";
import { ASSETS_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useDatabaseControl from "../hooks/useDatabaseControl";

const LoginView = () => {
  const {
    databaseModeRef,
  } = useDatabaseControl();

  // reset database mode when opening login view
  useEffect(() => {
    databaseModeRef.current = DatabaseMode.NONE;
  }, []);

  return <>
    <HeaderContainerLeftRight />
    <section className="section-login">
      <div
        className="login-welcome"
      >
        <img
          src={ASSETS_PATH + "app-icon/logo-circle.svg"}
          alt={l("login.logo.alt")}
          id="login-logo"
        />
        <div className="login-welcome-app-title">{l("app.title")}</div>
        <div>{l("login.introduction")}</div>
      </div>
      <div>
        <LoginViewServer />
      </div>
      <div>
        <LoginViewLocal />
      </div>
      <footer>
        <div className="links">
          <a href="https://github.com/SebastianZimmer/neno/blob/main/docs/index.md">
            {l("login.links.user-manual")}
          </a>
          <a href="https://github.com/SebastianZimmer/neno/">
            {l("login.links.source-code")}
          </a>
        </div>
        <p className="version">{VERSION}</p>
      </footer>
    </section>
  </>;
};

export default LoginView;
