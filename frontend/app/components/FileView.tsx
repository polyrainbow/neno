import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import {
  useParams, Link,
} from "react-router-dom";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import { getAppPath, getFileTypeFromFilename } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";


const FileView = ({
  databaseProvider,
  toggleAppMenu,
}: {
  databaseProvider: DatabaseProvider,
  toggleAppMenu: () => void,
}) => {
  const [src, setSrc] = useState<string>("");
  // status can be READY, BUSY
  const [notes, setNotes] = useState<MainNoteListItem[]>([]);

  const { fileId } = useParams();

  useEffect(() => {
    if (typeof fileId !== "string") return;

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

    updateSrc();
    getNotes();
  }, [databaseProvider, fileId]);

  const type = fileId && getFileTypeFromFilename(fileId);

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section-wide">
      <p><Link to="/files">{l("files.show-all-files")}</Link></p>
      <h1>{fileId}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {
          type === "image"
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
          type === "audio"
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
          type === "video"
            ? <video
              style={{
                marginRight: "15px auto",
                height: "80vh",
              }}
              src={src}
              controls
            />
            : ""
        }
        {
          type === "document"
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
