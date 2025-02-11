import StartViewLocal from "./StartViewLocal";
import { ASSETS_PATH, ROOT_PATH, VERSION } from "../config";
import { l } from "../lib/intl";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { initializeNotesProvider } from "../lib/LocalDataStorage";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import { useState } from "react";

const StartView = () => {
  const [
    memoryStorageProviderVisbility,
    setMemoryStorageProviderVisbility,
  ] = useState<boolean>(false);

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
          src={ASSETS_PATH + "app-icon/logo.svg"}
          alt={l("start.logo.alt")}
          id="start-logo"
        />
        <div className="text">
          <div className="title">{l("app.title")}</div>
          <div className="slogan">{l("start.introduction")}</div>
        </div>
      </div>
      <StartViewLocal />
      {
        memoryStorageProviderVisbility
          ? <div
            className="browser-storage-providers"
          >
            <button
              type="button"
              className="default-button default-action"
              id="browser-storage-load-button"
              onClick={async () => {
                await initializeNotesProvider(undefined, false);
                const urlSearchParams
                  = new URLSearchParams(window.location.search);
                if (urlSearchParams.has("redirect")) {
                  // @ts-ignore
                  navigation.navigate(urlSearchParams.get("redirect") ?? "/");
                } else {
                  // @ts-ignore
                  navigation.navigate(getAppPath(
                    PathTemplate.NEW_NOTE,
                    new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                  ));
                }
              }}
            >
              Browser Storage
            </button>
            <button
              type="button"
              className="default-button browser-storage"
              id="browser-storage-dummy-notes-load-button"
              onClick={async () => {
                await initializeNotesProvider(undefined, true);
                const urlSearchParams
                  = new URLSearchParams(window.location.search);
                if (urlSearchParams.has("redirect")) {
                  // @ts-ignore
                  navigation.navigate(urlSearchParams.get("redirect") ?? "/");
                } else {
                  // @ts-ignore
                  navigation.navigate(getAppPath(
                    PathTemplate.NEW_NOTE,
                    new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                  ));
                }
              }}
            >
              Browser storage with dummy notes
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
          <a href="https://github.com/polyrainbow/neno/">
            {l("start.links.source-code")}
          </a>
        </div>
        <p className="version">{VERSION}</p>
      </footer>
    </section>
  </>;
};

export default StartView;
