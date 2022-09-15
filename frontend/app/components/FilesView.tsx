import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import FilesViewPreviewBox from "./FilesViewPreviewBox";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { FileId } from "../../../lib/notes/interfaces/FileId";

interface FilesViewProps {
  databaseProvider: DatabaseProvider,
  toggleAppMenu,
}

const FilesView = ({
  databaseProvider,
  toggleAppMenu,
}: FilesViewProps) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [danglingFileIds, setDanglingFileIds] = useState<FileId[]>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFiles: FileInfo[]
      = await databaseProvider.getDanglingFiles();

    setDanglingFileIds(danglingFiles.map((file) => file.fileId));
  };


  useEffect(() => {
    if (!databaseProvider) return;

    const updateFiles = async () => {
      const files: FileInfo[] = await databaseProvider.getFiles();
      files.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      setFiles(files);
      await updateDanglingFiles();
      setStatus("READY");
    };

    updateFiles();
  }, [databaseProvider]);

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section-wide">
      {
        status === "READY"
          ? <>
            <h2>{l(
              "files.files-heading",
              { numberOfFiles: files.length.toString() },
            )}</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {files.map((file) => {
                return <FilesViewPreviewBox
                  file={file}
                  key={"img_" + file.fileId}
                  databaseProvider={databaseProvider}
                  isDangling={danglingFileIds.includes(file.fileId)}
                />;
              })}
            </div>
          </>
          : <p>{l("files.fetching")}</p>
      }
    </section>
  </>;
};

export default FilesView;
