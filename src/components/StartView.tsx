import StartViewLocal from "./StartViewLocal";
import { ASSETS_PATH, ROOT_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { initializeNotesProvider } from "../lib/LocalDataStorage";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
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
    <HeaderContainerLeftRight noBackground />
    <section className="section-start">
      <div
        className="start-welcome"
      >
        <img
          src={ASSETS_PATH + "app-icon/logo.svg"}
          alt={l("start.logo.alt")}
          id="start-logo"
        />
        <div className="start-welcome-app-title">{l("app.title")}</div>
        <div>{l("start.introduction")}</div>
      </div>
      <StartViewLocal />
      {
        memoryStorageProviderVisbility
          ? <div
            className="memory-storage-providers"
          >
            <button
              type="button"
              className="default-button default-action"
              id="memory-storage-load-button"
              onClick={async () => {
                await initializeNotesProvider(undefined, false);
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
            >
              Memory Storage
            </button>
            <button
              type="button"
              className="default-button memory-storage"
              id="memory-storage-dummy-notes-load-button"
              onClick={async () => {
                await initializeNotesProvider(undefined, true);
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
            >
              Memory Storage with dummy notes
            </button>
          </div>
          : ""
      }
      <footer>
        <div className="links">
          <a
            href={
              ROOT_PATH + "docs/index.html"
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
