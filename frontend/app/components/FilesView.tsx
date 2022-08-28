import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import FilesViewPreviewBox from "./FilesViewPreviewBox";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import FileInfoAndSrc from "../interfaces/FileInfoAndSrc";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";

interface FilesViewProps {
  databaseProvider: DatabaseProvider,
  toggleAppMenu,
  createNewNote,
}

const FilesView = ({
  databaseProvider,
  toggleAppMenu,
  createNewNote,
}: FilesViewProps) => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;
  const [files, setFiles] = useState<FileInfoAndSrc[]>([]);
  const [danglingFiles, setDanglingFiles] = useState<FileInfoAndSrc[]>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFiles: FileInfo[]
      = await databaseProvider.getDanglingFiles();
    const danglingFileSrcs: string[]
      = await Promise.all(
        danglingFiles.map(
          (file) => databaseProvider.getUrlForFileId(file.fileId),
        ),
      );

    const danglingFilesIdSrc: FileInfoAndSrc[]
      = danglingFiles.map((file, i) => {
        return {
          ...file,
          src: danglingFileSrcs[i],
        };
      });
    setDanglingFiles(danglingFilesIdSrc);
  };


  useEffect(() => {
    if (!databaseProvider) return;

    const updateFiles = async () => {
      const files: FileInfo[] = await databaseProvider.getFiles();
      const fileSrcs: string[]
        = await Promise.all(
          files.map((file) => databaseProvider.getUrlForFileId(file.fileId)),
        );

      const filesSrc: FileInfoAndSrc[] = files.map((file, i) => {
        return {
          ...file,
          src: fileSrcs[i],
        };
      });
      setFiles(filesSrc);

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
                />;
              })}
            </div>
            <h2>{l(
              "files.dangling-files.heading",
              { danglingFiles: danglingFiles.length.toString() },
            )}</h2>
            <p>{l("files.dangling-files.explainer")}</p>
            <div>
              {danglingFiles.map((danglingFile) => {
                return <div
                  key={"danglingFile_" + danglingFile.fileId}
                >
                  <p>
                    <a
                      href={danglingFile.src}
                    >{danglingFile.name}</a>
                  </p>
                  <button
                    onClick={async () => {
                      createNewNote([], [danglingFile]);
                    }}
                    className="small-button default-action"
                  >{l("files.create-note-with-file")}</button>
                  <button
                    onClick={async () => {
                      await confirm({
                        text: l("files.confirm-delete"),
                        confirmText: l("files.confirm-delete.confirm"),
                        cancelText: l("dialog.cancel"),
                        encourageConfirmation: false,
                      });

                      await databaseProvider.deleteFile(danglingFile.fileId);
                      await updateDanglingFiles();
                    }}
                    className="small-button dangerous-action"
                  >{l("files.delete")}</button>
                </div>;
              })}
            </div>
          </>
          : <p>{l("files.fetching")}</p>
      }
    </section>
  </>;
};

export default FilesView;
