import { useEffect, useState } from "react";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import {
  getExistingFolderName,
  initializeNotesProvider,
  initializeNotesProviderWithLastFolder,
} from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";
import { navigateTo } from "../lib/navigation";
import { getBridge } from "../lib/electron/bridge";

const StartViewLocal = () => {
  const [localDisclaimer, setLocalDisclaimer]
    = useState<string | null>(null);
  const [
    existingFolderName,
    setExistingFolderName,
  ] = useState<string | null>(null);

  useEffect(() => {
    const retrieveExistingFolderName = async () => {
      setExistingFolderName(await getExistingFolderName());
    };

    retrieveExistingFolderName();
  }, []);

  const goToGraph = () => {
    const urlSearchParams
      = new URLSearchParams(window.location.search);
    if (urlSearchParams.has("redirect")) {
      navigateTo(urlSearchParams.get("redirect") ?? "/");
    } else {
      navigateTo(getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
      ));
    }
  };

  return <section id="start-view-local">
    {
      localDisclaimer === "INVALID_FOLDER_HANDLE"
        ? <p className="error-text">
          {l("start.local.error-accessing-folder")}
        </p>
        : ""
    }
    {
      typeof existingFolderName === "string"
        ? <>
          <p>
            {l("start.local.already-created-folder")}
          </p>
          <button
            type="button"
            className="default-button default-action"
            onClick={async () => {
              try {
                await initializeNotesProviderWithLastFolder();
                goToGraph();
              } catch (_e) {
                // it could be that the folder is not there anymore but we
                // still have its path
                setExistingFolderName(null);
                setLocalDisclaimer("INVALID_FOLDER_HANDLE");
              }
            }}
          >
            {l(
              "start.local.open-folder-x",
              { dbName: existingFolderName },
            )}
          </button>
        </>
        : ""
    }
    <p>
      {l("start.local.select-folder.explainer")}
    </p>
    <button
      type="button"
      className="default-button default-action"
      id="select-folder-button"
      onClick={async () => {
        try {
          const folderPath = await getBridge().pickFolder();
          // It is fine if the user aborts the directory selection.
          if (folderPath === null) return;
          await initializeNotesProvider(folderPath);
          goToGraph();
        } catch (_e) {
          setLocalDisclaimer("INVALID_FOLDER_HANDLE");
        }
      }}
    >
      {l("start.local.select-folder")}
    </button>
  </section>;
};

export default StartViewLocal;
