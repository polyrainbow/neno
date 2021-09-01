import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import LoginViewServer from "./LoginViewServer.js";
import LoginViewLocal from "./LoginViewLocal.js";

const LoginView = ({
  serverDatabaseProvider,
  localDatabaseProvider,
  setDatabaseMode,
}) => {
  return <>
    <HeaderContainer />
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
