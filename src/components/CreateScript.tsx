import { useState } from "react";
import useNotesProvider from "../hooks/useNotesProvider";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { isValidFileSlug } from "../lib/notes/slugUtils";

interface CreateScriptProps {
  existingFiles: FileInfo[],
  onCreated: () => void,
}

const CreateScript = ({
  existingFiles,
  onCreated,
}: CreateScriptProps) => {
  const [newScriptName, setNewScriptName] = useState("");
  const notesProvider = useNotesProvider();

  return <div className="create-script">
    <h2>Create script</h2>
    <div className="controls">
      <span>
      /scripts/<input
          type="text"
          value={newScriptName}
          onChange={(e) => setNewScriptName(e.target.value)}
        />.neno.js
      </span>
      <button
        className="default-button-small default-action"
        disabled={
          existingFiles.map(s => s.slug).includes(
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
          onCreated();
        }}
      >Create</button>
    </div>
    {
      existingFiles.map(s => s.slug).includes(
        `scripts/${newScriptName}.neno.js`,
      )
        ? <p className="error">
          Script already exists. Please choose another name.
        </p>
        : ""
    }
  </div>;
};

export default CreateScript;
