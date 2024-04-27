import { useEffect, useState } from "react";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import BusyIndicator from "./BusyIndicator";
import noteWorkerUrl from "../lib/note-worker/index.js?worker&url";
import {
  getFolderHandle,
  invalidateNotesProvider,
} from "../lib/LocalDataStorage";
import useRunOnce from "../hooks/useRunOnce";
import useNotesProvider from "../hooks/useNotesProvider";
import { FileInfo } from "../lib/notes/types/FileInfo";

interface CustomScript {
  slug: string;
  value: string;
}


const ScriptsView = () => {
  const [scriptList, setScriptList] = useState<FileInfo[] | null>(null);
  const [activeScript, setActiveScript] = useState<CustomScript | null>(null);
  const [scriptInput, setScriptInput] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  const notesProvider = useNotesProvider();

  useRunOnce(async () => {
    const notesWorker = new Worker(noteWorkerUrl, { type: "module" });
    notesWorker.postMessage({
      action: "initialize",
      folderHandle: getFolderHandle(),
    });
    notesWorker.onmessage = (e) => {
      if (e.data.type === "EVALUATION_COMPLETED") {
        setIsBusy(false);
        setOutput(e.data.output);
      }
    };
    setWorker(notesWorker);


    const scripts = (await notesProvider.getFiles())
      .filter((file: FileInfo) => {
        return file.slug.endsWith(".neno.js");
      });

    setScriptList(scripts);
  });

  useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);

  return <>
    <HeaderContainerLeftRight
      leftContent={
        activeScript
          ? <div className="header-controls">
            <button
              className="header-button"
              onClick={() => {
                setScriptInput("");
                setActiveScript(null);
                setOutput("");
              }}
            >Back to list</button>
            <button
              className="header-button"
              disabled={!activeScript}
              onClick={async () => {
                setIsBusy(true);
                worker?.postMessage({
                  action: "evaluate",
                  script: scriptInput,
                });
              }}
            >Run</button>
          </div>
          : ""
      }
    />
    {
      activeScript
        ? <div className="script-view-main active-script">
          <div className="editor-section">
            <h2>{activeScript.slug}</h2>
            <textarea
              className="active-script-input"
              onChange={(e) => setScriptInput(e.target.value)}
              value={scriptInput || ""}
            ></textarea>
          </div>
          {
            isBusy
              ? <BusyIndicator
                alt="Busy"
                height={200}
              />
              : <p className="script-output">{output ?? ""}</p>
          }
        </div>
        : <div className="script-view-main script-selection">
          <p className="warning">
            Warning: The scripting feature is very powerful and with it,
            you can easily mess up your whole knowledge garden.
            Make sure you have backups in place or versioning set up and
            proceed with caution.
          </p>
          <h2>Scripts</h2>
          {
            scriptList?.map((s: FileInfo) => {
              return <button
                key={"button-" + s.slug}
                className="script-selection-button"
                onClick={async () => {
                  const readable = await notesProvider.getReadableFileStream(
                    s.slug,
                  );
                  const value = await new Response(readable).text();
                  setActiveScript({
                    slug: s.slug,
                    value,
                  });
                  setScriptInput(value);
                }}
              >{s.slug}</button>;
            })
          }
        </div>
    }
  </>;
};

export default ScriptsView;
