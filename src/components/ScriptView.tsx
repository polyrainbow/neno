import { useContext, useEffect, useRef, useState } from "react";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import BusyIndicator from "./BusyIndicator";
import noteWorkerUrl from "../lib/note-worker/index.js?worker&url";
import {
  getActiveFolderHandle,
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
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import StatusIndicator from "./StatusIndicator";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";

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
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const [saveInProgress, setSaveInProgress] = useState(false);

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
    } catch (_e) {
      setError("SCRIPT_NOT_FOUND");
    }
  });

  useRunOnce(() => {
    const notesWorker = new Worker(noteWorkerUrl, { type: "module" });
    notesWorker.postMessage({
      action: "initialize",
      folderHandle: getActiveFolderHandle(),
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
          setUnsavedChanges(true);
        });
      });
  }, [activeScript]);


  useEffect(() => {
    return () => {
      invalidateNotesProvider();
    };
  }, []);

  const handleSaveRequest = async () => {
    if (!slug || !scriptInput) return;

    setSaveInProgress(true);

    const readable = new Blob(
      [scriptInput],
      { type: "text/plain" },
    ).stream();

    await notesProvider.updateFile(
      readable,
      slug,
    );
    setUnsavedChanges(false);
    setSaveInProgress(false);
  };

  useKeyboardShortcuts({
    onSave: () => {
      handleSaveRequest();
    },
  });

  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  return <>
    <HeaderContainerLeftRight
      leftContent={
        <div className="header-controls">
          <HeaderButton
            icon="list"
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(
                getAppPath(
                  PathTemplate.FILES,
                  new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
                ),
              );
            }}
          >{l("files.all-files")}</HeaderButton>
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
          >{l("scripts.run")}</HeaderButton>
          <HeaderButton
            icon="save"
            disabled={!activeScript}
            onClick={() => {
              handleSaveRequest();
            }}
          >{l("scripts.save")}</HeaderButton>
          <HeaderButton
            icon="description"
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(
                getAppPath(
                  PathTemplate.FILE,
                  new Map([
                    ["GRAPH_ID", LOCAL_GRAPH_ID],
                    ["FILE_SLUG", slug || ""],
                  ]),
                ),
              );
            }}
          >{l("scripts.show-file-properties")}</HeaderButton>
        </div>
      }
    />
    {
      activeScript
        ? <div className="script-view-main active-script">
          <div className="editor-section">
            <div className="title-bar">
              <h2>{activeScript.slug}</h2>
              <StatusIndicator
                isNew={false}
                hasUnsavedChanges={unsavedChanges}
                isEverythingSaved={!unsavedChanges}
                isUploading={saveInProgress}
              />
            </div>
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
