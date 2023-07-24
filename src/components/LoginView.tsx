import LoginViewLocal from "./LoginViewLocal";
import { ASSETS_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";

const LoginView = () => {
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
      <LoginViewLocal />
      <footer>
        <div className="links">
          <a
            href={
              "https://github.com/SebastianZimmer/neno/blob/main/docs/index.md"
            }
          >
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
