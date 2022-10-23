import React, { useState, useRef, useEffect } from "react";
import RadioGroup from "./RadioGroup";
import { getWritableStream, humanFileSize, yyyymmdd } from "../lib/utils";
import { l } from "../lib/intl";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import useGraphId from "../hooks/useGraphId";


const ExportDatabaseSetting = () => {
  const [withFiles, setWithFiles] = useState(false);
  const databaseProvider = useDatabaseProvider();
  const graphId = useGraphId();
  // status can be READY, BUSY, DONE
  const [status, setStatus] = useState("READY");
  const bytesWrittenContainer = useRef(0);
  const [bytesWrittenDisplayed, setBytesWrittenDisplayed] = useState(0);
  const animationFrameRequestContainer = useRef<number>(NaN);


  const exportDatabase = async (writableStream, withFiles) => {
    const readableStream
      = await databaseProvider.getReadableGraphStream(graphId, withFiles);

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


  const animate = () => {
    setBytesWrittenDisplayed(bytesWrittenContainer.current);
    requestAnimationFrame(animate);
  };


  useEffect(() => {
    animationFrameRequestContainer.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRequestContainer.current);
  });


  const fileSizeWritten = humanFileSize(bytesWrittenDisplayed, false, 1);

  // @ts-ignore calling static property via class instance
  if (!databaseProvider?.constructor.features.includes("EXPORT_DATABASE")) {
    return null;
  }


  return <div
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
              const opts = withFiles
                ? {
                  suggestedName: graphId + "-" + yyyymmdd() + ".neno-db.zip",
                  types: [{
                    description: "ZIP database file",
                    accept: { "application/zip": [".zip"] },
                  }],
                }
                : {
                  suggestedName: graphId + "-" + yyyymmdd() + ".neno-db.json",
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
        </>
        : ""
    }
  </div>;
};

export default ExportDatabaseSetting;
