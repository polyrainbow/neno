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

enum FileSortMode {
  CREATED_AT_DESCENDING = "CREATED_AT_DESCENDING",
  CREATED_AT_ASCENDING = "CREATED_AT_ASCENDING",
  NAME_ASCENDING = "NAME_ASCENDING",
  NAME_DESCENDING = "NAME_DESCENDING",
}

const FilesView = ({
  databaseProvider,
  toggleAppMenu,
}: FilesViewProps) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [danglingFileIds, setDanglingFileIds] = useState<FileId[]>([]);
  const [sortMode, setSortMode] = useState<FileSortMode>(
    FileSortMode.CREATED_AT_DESCENDING,
  );
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFiles: FileInfo[]
      = await databaseProvider.getDanglingFiles();

    setDanglingFileIds(danglingFiles.map((file) => file.fileId));
  };

  const displayedFiles = [...files].sort((a, b): number => {
    if (sortMode === FileSortMode.CREATED_AT_DESCENDING) {
      return b.createdAt - a.createdAt;
    } else if (sortMode === FileSortMode.CREATED_AT_ASCENDING) {
      return a.createdAt - b.createdAt;
    } else if (sortMode === FileSortMode.NAME_ASCENDING) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    } else if (sortMode === FileSortMode.NAME_DESCENDING) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
      return 0;
    } else {
      return 0;
    }
  });


  useEffect(() => {
    if (!databaseProvider) return;

    const updateFiles = async () => {
      const files: FileInfo[] = await databaseProvider.getFiles();
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
            <select
              onChange={(e) => setSortMode(e.target.value as FileSortMode)}
            >
              <option
                value={FileSortMode.CREATED_AT_DESCENDING}
              >{l("files.sort-mode.created-at.descending")}</option>
              <option
                value={FileSortMode.CREATED_AT_ASCENDING}
              >{l("files.sort-mode.created-at.ascending")}</option>
              <option
                value={FileSortMode.NAME_ASCENDING}
              >{l("files.sort-mode.name.ascending")}</option>
              <option
                value={FileSortMode.NAME_DESCENDING}
              >{l("files.sort-mode.name.descending")}</option>
            </select>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {displayedFiles.map((file) => {
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
