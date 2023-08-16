import StartViewLocal from "./StartViewLocal";
import { ASSETS_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";

const StartView = () => {
  return <>
    <HeaderContainerLeftRight />
    <section className="section-start">
      <div
        className="start-welcome"
      >
        <img
          src={ASSETS_PATH + "app-icon/logo-circle.svg"}
          alt={l("start.logo.alt")}
          id="start-logo"
        />
        <div className="start-welcome-app-title">{l("app.title")}</div>
        <div>{l("start.introduction")}</div>
      </div>
      <StartViewLocal />
      <footer>
        <div className="links">
          <a
            href={
              "https://github.com/SebastianZimmer/neno/blob/main/docs/index.md"
            }
          >
            {l("start.links.user-manual")}
          </a>
          <a href="https://github.com/SebastianZimmer/neno/">
            {l("start.links.source-code")}
          </a>
        </div>
        <p className="version">{VERSION}</p>
      </footer>
    </section>
  </>;
};

export default StartView;
