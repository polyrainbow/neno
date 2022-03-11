import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import FilesViewImageBox from "./FilesViewImageBox";
import { getFileTypeFromFilename } from "../lib/utils";
import ConfirmationServiceContext from "./ConfirmationServiceContext";


const FilesView = ({
  databaseProvider,
  toggleAppMenu,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  const [files, setFiles] = useState<any>([]);
  const [danglingFiles, setDanglingFiles] = useState<any>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  const updateDanglingFiles = async () => {
    const danglingFileIds = await databaseProvider.getDanglingFiles();
    const danglingFileSrcs
      = await Promise.all(
        danglingFileIds.map(
          (fileId) => databaseProvider.getUrlForFileId(fileId),
        ),
      );

    const danglingFiles = danglingFileIds.map((fileId, i) => {
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
      const fileIds = await databaseProvider.getFiles();
      const fileSrcs
        = await Promise.all(
          fileIds.map((fileId) => databaseProvider.getUrlForFileId(fileId)),
        );

      const files = fileIds.map((fileId, i) => {
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

  const imageFiles = files.filter(
    (file) => getFileTypeFromFilename(file.id) === "image",
  );

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section-wide">
      {
        status === "READY"
          ? <>
            <h2>Images</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {imageFiles.map((imageFile) => {
                return <FilesViewImageBox
                  imageFile={imageFile}
                  key={"img_" + imageFile.id}
                />;
              })}
            </div>
            <h2>Dangling Files ({danglingFiles.length})</h2>
            <p>Dangling files are files that are not used in any note.</p>
            <div
              style={{
              }}
            >
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
                      await confirm({
                        text: "Do you really want to delete this file? "
                          + "This action cannot be undone.",
                        confirmText: "Delete file",
                        cancelText: "Cancel",
                        encourageConfirmation: false,
                      });

                      await databaseProvider.deleteFile(danglingFile.id);
                      await updateDanglingFiles();
                    }}
                    className="small-button"
                  >Delete</button></p>;
              })}
            </div>
          </>
          : <p>Fetching files...</p>
      }
    </section>
  </>;
};

export default FilesView;
