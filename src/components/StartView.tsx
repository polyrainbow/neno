import StartViewLocal from "./StartViewLocal";
import { ASSETS_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { initializeNotesProvider } from "../lib/LocalDataStorage";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StartView = () => {
  const [
    memoryStorageProviderVisbility,
    setMemoryStorageProviderVisbility,
  ] = useState<boolean>(false);

  const navigate = useNavigate();

  useKeyboardShortcuts({
    onCmdDot: () => {
      setMemoryStorageProviderVisbility(true);
    },
  });

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
      {
        memoryStorageProviderVisbility
          ? <p><button
            type="button"
            className="default-button default-action memory-storage"
            onClick={async () => {
              await initializeNotesProvider();
              const urlSearchParams
                = new URLSearchParams(window.location.search);
              if (urlSearchParams.has("redirect")) {
                navigate(urlSearchParams.get("redirect") ?? "/");
              } else {
                navigate(getAppPath(
                  PathTemplate.NEW_NOTE,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ));
              }
            }}
          >Memory Storage</button></p>
          : ""
      }
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
