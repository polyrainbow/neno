import React, { useState } from "react";
import { NoteSaveRequest } from "../../../lib/notes/interfaces/NoteSaveRequest";
import { DEFAULT_CONTENT_TYPE } from "../config";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import useGraphId from "../hooks/useGraphId";
import { l } from "../lib/intl";
import { getNoteTitleFromContent } from "../lib/utils";

const CreateOneNotePerLineTool = () => {
  const [text, setText] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const databaseProvider = useDatabaseProvider();
  const graphId = useGraphId();


  const createOneNotePerLine = async (
    lines: string[],
  ): Promise<void> => {
    const promises = lines.map((line) => {
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          meta: {
            title: getNoteTitleFromContent(line),
            contentType: DEFAULT_CONTENT_TYPE,
            flags: ["CREATED_VIA_ONE_NOTE_PER_LINE"],
            custom: {},
          },
          content: line,
        },
        ignoreDuplicateTitles: true,
      };
      return databaseProvider?.putNote(graphId, noteSaveRequest);
    });
    await Promise.all(promises);
  };


  return <div
    className="create-one-note-per-line-dialog"
  >
    <h1>{l("dialog.create-one-note-per-line.heading")}</h1>
    <p>{l("dialog.create-one-note-per-line.explainer")}</p>
    <textarea
      onChange={(e) => setText(e.target.value)}
    ></textarea>
    {
      isBusy
        ? <p>{l("dialog.create-one-note-per-line.please-wait")}</p>
        : <>
          <button
            onClick={() => {
              setIsBusy(true);
              createOneNotePerLine(text.split("\n"));
              setIsBusy(false);
            }}
            className="default-button dialog-box-button default-action"
          >{l("dialog.create-one-note-per-line.confirm")}</button>
        </>
    }
  </div>;
};

export default CreateOneNotePerLineTool;
