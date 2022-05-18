import React, { useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import LoginViewServer from "./LoginViewServer";
import LoginViewLocal from "./LoginViewLocal";
import { DatabaseMode } from "../enum/DatabaseMode";

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
      <LoginViewServer
        serverDatabaseProvider={serverDatabaseProvider}
        setDatabaseMode={setDatabaseMode}
      />
      <LoginViewLocal
        localDatabaseProvider={localDatabaseProvider}
        setDatabaseMode={setDatabaseMode}
      />
    </section>
  </>;
};

export default LoginView;
