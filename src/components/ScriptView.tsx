import { useEffect, useRef, useState } from "react";
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
import jsWorker
  from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

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
  const [error, setError] = useState<string | null>(null);

  const notesProvider = useNotesProvider();
  const { slug } = useParams();
  const navigate = useNavigate();
  const editorContainerRef = useRef(null);

  useRunOnce(async () => {
    if (typeof slug !== "string") return;

    try {
      const readable = await notesProvider.getReadableFileStream(
        slug,
      );
      const value = await new Response(readable).text();
      setActiveScript({
        slug: slug,
        value,
      });
      setScriptInput(value);
    } catch (e) {
      setError("SCRIPT_NOT_FOUND");
    }
  });

  useRunOnce(() => {
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
  });

  useEffect(() => {
    if (!activeScript) return;

    // @ts-ignore
    globalThis.MonacoEnvironment = {
      getWorker: function () {
        return new jsWorker();
      },
    };

    const containerElement = editorContainerRef.current;

    if (!containerElement) {
      throw new Error("Code editor container not ready!");
    }

    import("monaco-editor")
      .then((module) => {
        const monacoEditor = module.editor;

        const editor = monacoEditor.create(containerElement, {
          value: scriptInput || "",
          language: "javascript",
          minimap: {
            enabled: false,
          },
          fontSize: 16,
          fontFamily: "IBM Plex Mono",
          theme: "vs-dark",
        });

        editor.onDidChangeModelContent(() => {
          const newValue = editor.getValue();
          setScriptInput(newValue);
        });
      });
  }, [activeScript]);


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
            <div
              id="editor-container"
              ref={editorContainerRef}
            />
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
        : error === "SCRIPT_NOT_FOUND"
          ? <p>Script not found.</p>
          : <div className="script-view-main-busy">
            <BusyIndicator height={100} alt="Loading script" />
          </div>
    }
  </>;
};

export default ScriptView;
