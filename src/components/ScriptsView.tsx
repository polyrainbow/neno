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

const ScriptsView = () => {
  const [scriptList, setScriptList] = useState<FileInfo[] | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const navigate = useNavigate();
  const notesProvider = useNotesProvider();

  useRunOnce(async () => {
    const scripts = (await notesProvider.getFiles())
      .filter((file: FileInfo) => {
        return file.slug.endsWith(".neno.js");
      });

    setScriptList(scripts);
    setIsBusy(false);
  });

  useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);

  return <>
    <HeaderContainerLeftRight />
    <div className="script-view-main script-selection">
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
            return <button
              key={"button-" + s.slug}
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
            >{s.slug}</button>;
          })
      }
    </div>
  </>;
};

export default ScriptsView;
