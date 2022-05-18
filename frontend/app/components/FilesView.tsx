import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import FilesViewPreviewBox from "./FilesViewPreviewBox";
import { getAppPath } from "../lib/utils";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import {
  useNavigate,
} from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import { FileId } from "../../../lib/notes/interfaces/FileId";
import FileIdAndSrc from "../interfaces/FileIdAndSrc";
import { l } from "../lib/intl";


const FilesView = ({
  databaseProvider,
  toggleAppMenu,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileIdAndSrc[]>([]);
  const [danglingFiles, setDanglingFiles] = useState<FileIdAndSrc[]>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFileIds:FileId[] = await databaseProvider.getDanglingFiles();
    const danglingFileSrcs:string[]
      = await Promise.all(
        danglingFileIds.map(
          (fileId) => databaseProvider.getUrlForFileId(fileId),
        ),
      );

    const danglingFiles:FileIdAndSrc[] = danglingFileIds.map((fileId, i) => {
      return {
        id: fileId,
        src: danglingFileSrcs[i],
      };
    });
    setDanglingFiles(danglingFiles);
  };


  useEffect(() => {
    if (!databaseProvider) return;

    const updateFiles = async () => {
      const fileIds:FileId[] = await databaseProvider.getFiles();
      const fileSrcs:string[]
        = await Promise.all(
          fileIds.map((fileId) => databaseProvider.getUrlForFileId(fileId)),
        );

      const files:FileIdAndSrc[] = fileIds.map((fileId, i) => {
        return {
          id: fileId,
          src: fileSrcs[i],
        };
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
            <h2>{l("files.files-heading", { numberOfFiles: files.length })}</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {files.map((file) => {
                return <FilesViewPreviewBox
                  file={file}
                  key={"img_" + file.id}
                />;
              })}
            </div>
            <h2>{l(
              "files.dangling-files.heading",
              { danglingFiles: danglingFiles.length },
            )}</h2>
            <p>{l("files.dangling-files.explainer")}</p>
            <div>
              {danglingFiles.map((danglingFile) => {
                return <p
                  key={"danglingFile_" + danglingFile.id}
                >
                  <a
                    href={danglingFile.src}
                  >{danglingFile.id}</a>
                  <span> </span>
                  <button
                    onClick={async () => {
                      navigate(getAppPath(
                        PathTemplate.EDITOR_WITH_NEW_NOTE,
                        undefined,
                        new URLSearchParams([["attach-file", danglingFile.id]]),
                      ));
                    }}
                    className="small-button"
                  >{l("files.create-note-with-file")}</button>
                  <button
                    onClick={async () => {
                      await confirm({
                        text: l("files.confirm-delete"),
                        confirmText: l("files.confirm-delete.confirm"),
                        cancelText: l("dialog.cancel"),
                        encourageConfirmation: false,
                      });

                      await databaseProvider.deleteFile(danglingFile.id);
                      await updateDanglingFiles();
                    }}
                    className="small-button"
                  >{l("files.delete")}</button></p>;
              })}
            </div>
          </>
          : <p>{l("files.fetching")}</p>
      }
    </section>
  </>;
};

export default FilesView;
