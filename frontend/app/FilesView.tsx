import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import FilesViewImageBox from "./FilesViewImageBox";
import { getFileTypeFromFilename } from "./lib/utils";


const FilesView = ({
  databaseProvider,
  toggleAppMenu,
}) => {
  const [files, setFiles] = useState<any>([]);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

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
          </>
          : <p>Fetching files...</p>
      }
    </section>
  </>;
};

export default FilesView;
