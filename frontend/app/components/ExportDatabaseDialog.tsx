import React, { useState, useRef, useEffect } from "react";
import Dialog from "./Dialog";
import RadioGroup from "./RadioGroup";
import { humanFileSize, yyyymmdd } from "../lib/utils";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";


interface ExportDatabaseDialogProps {
  databaseProvider: DatabaseProvider,
  onClose,
}


const ExportDatabaseDialog = ({
  databaseProvider,
  onClose,
}: ExportDatabaseDialogProps) => {
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
      if (status !== "BUSY") onClose();
    }}
    className="export-database-dialog"
  >
    <h1>{l("export-database.heading")}</h1>
    {
      status === "DONE"
        ? <>
          <p>{l("export-database.finished")}
            <br/>
            {l("export-database.file-size-written", { fileSizeWritten })}
          </p>
          <button
            onClick={onClose}
            className="default-button dialog-box-button default-action"
          >{l("dialog.close")}</button>
        </>
        : ""
    }
    {
      status === "BUSY"
        ? <>
          <p>
            {l("export-database.please-wait")}
            <br />
            {l("export-database.file-size-written", { fileSizeWritten })}
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
                label: l("export-database.graph-file-only"),
              },
              {
                value: "true",
                label: l("export-database.with-files"),
              },
            ]}
            selectedValue={withFiles.toString()}
            onChange={(newValue) => setWithFiles(newValue === "true")}
          />
          <button
            onClick={async () => {
              const dbId = databaseProvider.getActiveGraphId();

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
                  !(
                    e instanceof Error
                    && e.message.includes("The user aborted a request.")
                  )
                ) {
                  throw e;
                }
              }
            }}
            className="default-button dialog-box-button default-action"
          >{l("export-database.export")}</button>
          <button
            onClick={onClose}
            className="default-button dialog-box-button"
          >{l("dialog.cancel")}</button>
        </>
        : ""
    }
  </Dialog>;
};

export default ExportDatabaseDialog;
