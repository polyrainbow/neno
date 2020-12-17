import React, { useState } from "react";
import HeaderContainer from "./HeaderContainer.js";
import * as API from "./lib/api.js";


const LoginView = ({
  setActiveView,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  return <>
    <HeaderContainer
      leftContent={
        <>
          <h1 id="heading">NeNo</h1>
        </>
      }
      rightContent={null}
    />
    <section id="section_login">
      <h1>Login</h1>
      <p>
        <label htmlFor="login_input_username">Username</label>
        <br />
        <input id="login_input_username" type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </p>
      <p>
        <label htmlFor="login_input_password">Password</label>
        <br />
        <input id="login_input_password" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </p>
      <p>
        <button
          type="button"
          className="dialog-box-button"
          onClick={() => {
            API.login(username, password)
              .then(() => {
                setActiveView("EDITOR");
              });
          }}
        >Login</button>
      </p>
    </section>
  </>;
};

export default LoginView;
