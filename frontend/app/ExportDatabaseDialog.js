import React, { useState, useRef, useEffect } from "react";
import Dialog from "./Dialog.js";
import RadioGroup from "./RadioGroup.js";
import { humanFileSize } from "./lib/utils.js";


const ExportDatabaseDialog = ({
  databaseProvider,
  onCancel,
}) => {
  const [withUploads, setWithUploads] = useState(false);
  // status can be READY, BUSY, DONE
  const [status, setStatus] = useState("READY");
  const bytesWrittenContainer = useRef(0);
  const [bytesWrittenDisplayed, setBytesWrittenDisplayed] = useState(0);
  const animationFrameRequestContainer = useRef();


  const exportDatabase = async (writableStream, withUploads) => {
    const readableStream
      = await databaseProvider.getReadableDatabaseStream(withUploads);

    const reader = readableStream.getReader();
    const writer = writableStream.getWriter();

    console.log(reader);

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
            id="radioGroup_withUploads"
            options={[
              {
                value: "false",
                label: "Export main database file only (JSON)",
              },
              {
                value: "true",
                label:
                  "Export main database file and include attached files (ZIP)",
              },
            ]}
            selectedValue={withUploads.toString()}
            onChange={(newValue) => setWithUploads(newValue === "true")}
          />
          <button
            onClick={async () => {
              const opts = withUploads
                ? {
                  types: [{
                    description: "ZIP database file",
                    accept: { "application/zip": [".zip"] },
                  }],
                }
                : {
                  types: [{
                    description: "JSON database file",
                    accept: { "application/json": [".json"] },
                  }],
                };

              const writableStream = await getWritableStream(opts);

              setStatus("BUSY");
              await exportDatabase(writableStream, withUploads);
              setStatus("DONE");
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
