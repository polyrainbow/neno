import React, { useState, useRef, useEffect } from "react";
import Dialog from "./Dialog";
import RadioGroup from "./RadioGroup";
import { humanFileSize, yyyymmdd } from "../lib/utils";


const ExportDatabaseDialog = ({
  databaseProvider,
  onCancel,
}) => {
  const [withFiles, setWithFiles] = useState(false);
  // status can be READY, BUSY, DONE
  const [status, setStatus] = useState("READY");
  const bytesWrittenContainer = useRef(0);
  const [bytesWrittenDisplayed, setBytesWrittenDisplayed] = useState(0);
  const animationFrameRequestContainer = useRef<number>(NaN);


  const exportDatabase = async (writableStream, withFiles) => {
    const readableStream
      = await databaseProvider.getReadableGraphStream(withFiles);

    const reader = readableStream.getReader();
    const writer = writableStream.getWriter();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const newBytesWritten = bytesWrittenContainer.current + value.length;
      bytesWrittenContainer.current = newBytesWritten;
      await writer.write(value);
    }

    writer.close();
  };


  const getWritableStream = async (opts) => {
    // @ts-ignore method is not yet in types
    const newHandle = await window.showSaveFilePicker(opts);
    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();
    return writableStream;
  };


  const animate = () => {
    setBytesWrittenDisplayed(bytesWrittenContainer.current);
    requestAnimationFrame(animate);
  };


  useEffect(() => {
    animationFrameRequestContainer.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRequestContainer.current);
  });


  const fileSizeWritten = humanFileSize(bytesWrittenDisplayed, false, 1);


  return <Dialog
    onClickOnOverlay={() => {
      if (status !== "BUSY") onCancel();
    }}
    className="import-link-dialog"
  >
    <h1>Export database</h1>
    {
      status === "DONE"
        ? <>
          <p>Finished exporting database.
            <br/>
            {fileSizeWritten} written.
          </p>
          <button
            onClick={onCancel}
            className="default-button dialog-box-button default-action"
          >Close</button>
        </>
        : ""
    }
    {
      status === "BUSY"
        ? <>
          <p>
              Please wait while the database is being exported ...
            <br />
            {fileSizeWritten} written.
          </p>
        </>
        : ""
    }
    {
      status === "READY"
        ? <>
          <RadioGroup
            id="radioGroup_withFiles"
            options={[
              {
                value: "false",
                label: "Export graph file only (JSON)",
              },
              {
                value: "true",
                label:
                  "Export graph file and include uploaded files (ZIP)",
              },
            ]}
            selectedValue={withFiles.toString()}
            onChange={(newValue) => setWithFiles(newValue === "true")}
          />
          <button
            onClick={async () => {
              const dbId = await databaseProvider.getGraphId();

              const opts = withFiles
                ? {
                  suggestedName: dbId + "-" + yyyymmdd() + ".neno-db.zip",
                  types: [{
                    description: "ZIP database file",
                    accept: { "application/zip": [".zip"] },
                  }],
                }
                : {
                  suggestedName: dbId + "-" + yyyymmdd() + ".neno-db.json",
                  types: [{
                    description: "JSON database file",
                    accept: { "application/json": [".json"] },
                  }],
                };

              try {
                const writableStream = await getWritableStream(opts);
                setStatus("BUSY");
                await exportDatabase(writableStream, withFiles);
                setStatus("DONE");
              } catch (e) {
                if (
                  // if user aborted the request, it's fine
                  !e.message.includes("The user aborted a request.")
                ) {
                  throw new Error(e);
                }
              }
            }}
            className="default-button dialog-box-button default-action"
          >Export</button>
          <button
            onClick={onCancel}
            className="default-button dialog-box-button"
          >Cancel</button>
        </>
        : ""
    }
  </Dialog>;
};

export default ExportDatabaseDialog;
