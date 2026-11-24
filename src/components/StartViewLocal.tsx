import { useEffect, useState } from "react";
import { l } from "../lib/intl";
import {
  getExistingFolderName,
  initializeNotesProvider,
  initializeNotesProviderWithLastFolder,
} from "../lib/LocalDataStorage";
import { getBridge } from "../lib/electron/bridge";
import { goToGraphFromStart } from "../lib/startNavigation";

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
                goToGraphFromStart();
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
          goToGraphFromStart();
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
