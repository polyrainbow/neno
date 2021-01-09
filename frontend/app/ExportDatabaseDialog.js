import React, { useState } from "react";
import Dialog from "./Dialog.js";
import RadioGroup from "./RadioGroup.js";


const ExportDatabaseDialog = ({
  databaseProvider,
  onCancel,
}) => {
  const [withUploads, setWithUploads] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [bytesWritten, setBytesWritten] = useState(0);


  const exportDatabase = async (writableStream, withUploads) => {
    const readableStream
      = await databaseProvider.getReadableDatabaseStream(withUploads);

    const reader = readableStream.getReader();
    const writer = writableStream.getWriter();

    console.log(reader);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const newBytesWritten = bytesWritten + value.length;
      setBytesWritten(newBytesWritten);
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


  return <Dialog
    onClickOnOverlay={() => {
      if (!isBusy) onCancel();
    }}
    className="import-link-dialog"
  >
    <h1>Export database</h1>
    {
      isBusy
        ? <p>
            Please wait while the database is being exported ...
          <br />
          {bytesWritten} bytes written.
        </p>
        : <>
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

              setIsBusy(true);
              await exportDatabase(writableStream, withUploads);
              setIsBusy(false);
              onCancel();
            }}
            className="default-button dialog-box-button default-action"
          >Export</button>
          <button
            onClick={onCancel}
            className="default-button dialog-box-button"
          >Cancel</button>
        </>
    }
  </Dialog>;
};

export default ExportDatabaseDialog;
