import { useEffect, useState } from "react";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import {
  invalidateNotesProvider,
} from "../lib/LocalDataStorage";
import useRunOnce from "../hooks/useRunOnce";
import useNotesProvider from "../hooks/useNotesProvider";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { useNavigate } from "react-router-dom";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import BusyIndicator from "./BusyIndicator";
import { LOCAL_GRAPH_ID } from "../config";
import IconButton from "./IconButton";

const ScriptsView = () => {
  const [scriptList, setScriptList] = useState<FileInfo[] | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const navigate = useNavigate();
  const notesProvider = useNotesProvider();

  const refreshScriptsList = async () => {
    const scripts = (await notesProvider.getFiles())
      .filter((file: FileInfo) => {
        return file.slug.endsWith(".neno.js");
      });

    setScriptList(scripts);
  };

  useRunOnce(async () => {
    await refreshScriptsList();
    setIsBusy(false);
  });

  useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);

  return <>
    <HeaderContainerLeftRight />
    <div className="script-selection-main">
      <p className="warning">
        Warning: The scripting feature is very powerful and with it,
        you can easily mess up your whole knowledge garden.
        Make sure you have backups in place or versioning set up and
        proceed with caution.
      </p>
      <h2>Scripts</h2>
      {
        isBusy
          ? <BusyIndicator height={120} alt="Loading" />
          : scriptList?.map((s: FileInfo) => {
            return <div
              className="script-list-item"
              key={"sli-" + s.slug}
            >
              <button
                className="script-selection-button"
                onClick={() => {
                  navigate(
                    getAppPath(
                      PathTemplate.SCRIPT,
                      new Map([
                        ["GRAPH_ID", LOCAL_GRAPH_ID],
                        ["SCRIPT_SLUG", s.slug],
                      ]),
                    ),
                  );
                }}
              >{s.slug}</button>
              <IconButton
                icon="delete"
                title="Delete"
                onClick={async() => {
                  await notesProvider.deleteFile(s.slug);
                  await refreshScriptsList();
                }}
              />
            </div>;
          })
      }
    </div>
  </>;
};

export default ScriptsView;
