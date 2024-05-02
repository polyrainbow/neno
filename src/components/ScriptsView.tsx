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
import { l } from "../lib/intl";
import { isValidFileSlug } from "../lib/notes/slugUtils";

const ScriptsView = () => {
  const [scriptList, setScriptList] = useState<FileInfo[] | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const [newScriptName, setNewScriptName] = useState("");
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
      <h1>{l("menu.scripts")}</h1>
      <p className="warning">
        {l("scripting.warning")}
      </p>
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
      <h2>Create new script</h2>
      /scripts/<input
        type="text"
        value={newScriptName}
        onChange={(e) => setNewScriptName(e.target.value)}
      />.neno.js
      <br/>
      {
        scriptList?.map(s => s.slug).includes(
          `scripts/${newScriptName}.neno.js`,
        )
          ? <p className="error">
            Script already exists. Please choose another name.
          </p>
          : ""
      }
      <button
        className="default-button default-action"
        disabled={
          scriptList?.map(s => s.slug).includes(
            `scripts/${newScriptName}.neno.js`,
          )
            || !isValidFileSlug(`scripts/${newScriptName}.neno.js`)
            || newScriptName.length === 0
        }
        onClick={async () => {
          const filename = `${newScriptName}.neno.js`;
          const readable = new Blob(
            [],
            { type: "text/plain" },
          ).stream();
          await notesProvider.addFile(readable, "scripts", filename);
          await refreshScriptsList();
        }}
      >Create</button>
    </div>
  </>;
};

export default ScriptsView;
