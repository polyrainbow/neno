import React from "react";
import HeaderContainer from "./HeaderContainer";
import LoginViewServer from "./LoginViewServer";
import LoginViewLocal from "./LoginViewLocal";

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
