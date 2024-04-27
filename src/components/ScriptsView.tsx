import { useEffect, useState } from "react";
import HeaderContainerLeftRight from "./HeaderContainerLeftRight";
import BusyIndicator from "./BusyIndicator";
import noteWorkerUrl from "../lib/note-worker/index.js?worker&url";
import {
  getFolderHandle,
  invalidateNotesProvider,
} from "../lib/LocalDataStorage";
import useRunOnce from "../hooks/useRunOnce";

interface CustomScript {
  name: string;
  id: string;
  value: string;
}

const EXAMPLE_SCRIPTS: CustomScript[] = [
  {
    id: "0",
    name: "Remove neno-id param",
    value: `let i = 0;

for (const [slug, note] of graph.notes.entries()) {
  if (!note.meta.custom["neno-id"]) {
    continue;
  }

  const newCustom = note.meta.custom;
  delete newCustom["neno-id"];
  note.meta.custom = newCustom;

  notesProvider.put({
    note,
    disableTimestampUpdate: true,
  })

  println(slug);
  i++;
  if (i >= 10) break;
}
println("Done");
`,
  },
  {
    id: "1",
    name: "Show notes with neno-id param",
    value: `let i = 0;
for (const [slug, note] of graph.notes.entries()) {
  if (!note.meta.custom["neno-id"]) {
    continue;
  }
  println(slug);
  i++;
}

println(i);
`,
  },
  {
    id: "2",
    name: "Show events",
    value: `function getEventsOfNote(slug, note) {
  const events = [];

  if (slug.match(/\\d{4}-\\d{2}-\\d{2}/)) {
    events.push({
      title: getNoteTitle(note),
      start: slug.match(/\\d{4}-\\d{2}-\\d{2}/)[0],
    });
  }
  const dateMatches = note.content.matchAll(
    /\\[\\[(\\d{4}-\\d{2}-\\d{2})\\]\\]/g,
  );
  for (const match of dateMatches) {
    events.push({
      title: getNoteTitle(note),
      start: match[1],
    });
  }

  return events;
}

let events = [];
for (const [slug, note] of graph.notes.entries()) {
  events.push(...getEventsOfNote(slug, note));
}
println("Done");

events.sort((a,b) => {
  if (a.start > b.start) return 1;
  if (a.start < b.start) return -1;
  return 0;
});

println(JSON.stringify(events, null, "  "));`,
  },
  {
    id: "3",
    name: "Show stats",
    value: `const stats = await notesProvider.getStats({
  includeMetadata: true,
});

println(JSON.stringify(stats, null, "  "));`,
  },
];

const ScriptsView = () => {
  const [activeScript, setActiveScript] = useState<CustomScript | null>(null);
  const [scriptInput, setScriptInput] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  useRunOnce(() => {
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
            <h2>{activeScript.name}</h2>
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
            EXAMPLE_SCRIPTS.map((s: CustomScript) => {
              return <button
                key={"button-" + s.id}
                className="script-selection-button"
                onClick={() => {
                  setActiveScript(s);
                  setScriptInput(s.value);
                }}
              >{s.name}</button>;
            })
          }
        </div>
    }
  </>;
};

export default ScriptsView;
