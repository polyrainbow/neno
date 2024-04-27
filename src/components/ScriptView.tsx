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
import { useNavigate, useParams } from "react-router-dom";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import HeaderButton from "./HeaderButton";

interface CustomScript {
  slug: string;
  value: string;
}


const ScriptView = () => {
  const [activeScript, setActiveScript] = useState<CustomScript | null>(null);
  const [scriptInput, setScriptInput] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [isBusyComputingOutput, setIsBusyComputingOutput] = useState<boolean>(
    false,
  );
  const [worker, setWorker] = useState<Worker | null>(null);

  const notesProvider = useNotesProvider();
  const { slug } = useParams();
  const navigate = useNavigate();

  useRunOnce(async () => {
    if (typeof slug !== "string") return;

    const notesWorker = new Worker(noteWorkerUrl, { type: "module" });
    notesWorker.postMessage({
      action: "initialize",
      folderHandle: getFolderHandle(),
    });
    notesWorker.onmessage = (e) => {
      if (e.data.type === "EVALUATION_COMPLETED") {
        setIsBusyComputingOutput(false);
        setOutput(e.data.output);
      }
    };
    setWorker(notesWorker);


    const readable = await notesProvider.getReadableFileStream(
      slug,
    );
    const value = await new Response(readable).text();
    setActiveScript({
      slug: slug,
      value,
    });
    setScriptInput(value);
  });

  useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);

  return <>
    <HeaderContainerLeftRight
      leftContent={
        <div className="header-controls">
          <HeaderButton
            icon="list"
            onClick={() => {
              navigate(
                getAppPath(
                  PathTemplate.SCRIPTS,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ),
              );
            }}
          >Back to list</HeaderButton>
          <HeaderButton
            icon="play_arrow"
            disabled={!activeScript}
            onClick={async () => {
              setIsBusyComputingOutput(true);
              worker?.postMessage({
                action: "evaluate",
                script: scriptInput,
              });
            }}
          >Run</HeaderButton>
          <HeaderButton
            icon="save"
            disabled={!activeScript}
            onClick={async () => {
              if (!slug || !scriptInput) return;

              const readable = new Blob(
                [scriptInput],
                { type: "text/plain" },
              ).stream();

              await notesProvider.updateFile(
                readable,
                slug,
              );
            }}
          >Save</HeaderButton>
        </div>
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
          <div className="output-section">
            {
              isBusyComputingOutput
                ? <BusyIndicator
                  alt="Busy"
                  height={100}
                />
                : <p className="script-output">{output ?? ""}</p>
            }
          </div>
        </div>
        : <div className="script-view-main-busy">
          <BusyIndicator height={100} alt="Loading script" />
        </div>
    }
  </>;
};

export default ScriptView;
