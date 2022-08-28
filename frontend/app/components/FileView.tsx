import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import {
  useParams, Link,
} from "react-router-dom";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import { getAppPath, getMediaTypeFromFilename } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";


const FileView = ({
  databaseProvider,
  toggleAppMenu,
}: {
  databaseProvider: DatabaseProvider,
  toggleAppMenu: () => void,
}) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<MainNoteListItem[]>([]);

  const { fileId } = useParams();

  useEffect(() => {
    if (typeof fileId !== "string") return;

    const getFileInfo = async () => {
      const fileInfo = await databaseProvider.getFileInfo(fileId);
      setFileInfo(fileInfo);
    };

    const updateSrc = async () => {
      const src = await databaseProvider.getUrlForFileId(fileId);
      setSrc(src);
    };

    const getNotes = async () => {
      const response = await databaseProvider.getNotes({
        searchString: "has-file:" + fileId,
      });
      setNotes(response.results);
    };

    getFileInfo();
    updateSrc();
    getNotes();
  }, [databaseProvider, fileId]);

  const type = fileId && getMediaTypeFromFilename(fileId);

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section-wide">
      <p><Link to="/files">{l("files.show-all-files")}</Link></p>
      <h1>{fileInfo?.name}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {
          type === MediaType.IMAGE
            ? <img
              style={{
                marginRight: "15px auto",
                maxWidth: "95vw",
              }}
              src={src}
              loading="lazy"
            />
            : ""
        }
        {
          type === MediaType.AUDIO
            ? <audio
              style={{
                marginRight: "15px auto",
                width: "95vw",
              }}
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.VIDEO
            ? <video
              style={{
                marginRight: "15px auto",
                maxHeight: "80vh",
              }}
              src={src}
              controls
            />
            : ""
        }
        {
          type === MediaType.PDF
            ? <iframe
              style={{
                marginRight: "15px auto",
                height: "80vh",
                width: "60vw",
              }}
              src={src}
            />
            : ""
        }
        {
          type === MediaType.OTHER
            ? <a
              download
              href={src}
            >Download</a>
            : ""
        }
      </div>
      <h2>{l("files.used-in")}</h2>
      {
        notes.map((note) => {
          return <p key={"notelink-" + note.id}>
            <Link
              to={
                getAppPath(
                  PathTemplate.EDITOR_WITH_NOTE,
                  new Map([["NOTE_ID", note.id.toString()]]),
                )
              }
            >{note.title}</Link>
          </p>;
        })
      }
      {
        notes.length === 0
          ? <p>{l("files.used-in.none")}</p>
          : ""
      }
    </section>
  </>;
};

export default FileView;
